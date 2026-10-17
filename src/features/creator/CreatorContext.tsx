import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../../app/AuthContext';
import { getCreatorAccount, updateCreatorAccount, usernameFrom } from './creatorAccount';
import { usePublishedCampaigns } from './campaignFeed';
import { invitationFromCampaign } from './campaignMatch';
import { inr } from './format';
import { distanceKm, isAnywhere } from './geo';
import type {
  CreatorProfile, CreatorPreferences, Invitation,
  NegotiationMessage, Deliverable, Payment, VerificationStep, VerificationStatus,
  OnboardingStep, OnboardingState, Contract, Referral,
} from './types';
import { ONBOARDING_STEPS } from './types';

// ── Seed data (realistic mock) ────────────────────────────────────────

const seedProfile: CreatorProfile = {
  displayName: 'Foodie Tamilian',
  username: 'foodie_tamilian',
  verified: true,
  bio: 'Chennai-based food storyteller. Discovering the best local eats, hidden gems and authentic Tamil flavours — one reel at a time.',
  categories: ['Food', 'Lifestyle', 'Travel'],
  location: 'Chennai, Tamil Nadu',
  pinCode: '600001',
  languages: ['Tamil', 'English'],
  contentTypes: ['Instagram Reel', 'Instagram Story', 'YouTube Short'],
  followers: 28000,
  engagement: 12.5,
  avgViews: 21500,
  audience: {
    topCity: 'Chennai', topCityPct: 72,
    topLanguage: 'Tamil', topLanguagePct: 68,
    topAgeRange: '18–24', topAgePct: 62,
    topCountry: 'India', topCountryPct: 82,
  },
  platforms: [
    { platform: 'instagram', handle: '@foodie_tamilian', followers: 28000, state: 'connected' },
    { platform: 'youtube', handle: 'Foodie Tamilian', followers: 6400, state: 'connected' },
    { platform: 'tiktok', handle: '', followers: 0, state: 'disconnected' },
  ],
  rating: 4.8,
  reliability: 94,
  completionPct: 86,
};

const seedPreferences: CreatorPreferences = {
  categories: ['Food', 'Lifestyle', 'Travel'],
  blockedCategories: ['Alcohol', 'Gambling'],
  locations: ['Chennai', 'Puducherry', 'Tamil Nadu'],
  languages: ['Tamil', 'English'],
  minRate: 5000,
  platforms: ['instagram', 'youtube'],
  availableForCampaigns: true,
  openToLongTerm: true,
  allowDiscovery: true,
  aiNegotiationEnabled: true,
  aiMinAcceptableRate: 9000,
  aiFlexibilityPct: 15,
  aiMaxExclusivityDays: 30,
};

const seedPayments: Payment[] = [
  { id: 'pay_2', campaignId: 'c_fit', brand: 'FitLife Gym', amount: 12000, date: '18 Aug 2026', status: 'paid', milestone: 'Completed', txnRef: 'TXN-8842219', invoiceNo: 'INV-2026-009' },
  { id: 'pay_3', campaignId: 'c_style', brand: 'StyleHub', amount: 6000, date: '02 Aug 2026', status: 'paid', milestone: 'Completed', txnRef: 'TXN-8710055', invoiceNo: 'INV-2026-006' },
];

const seedReferrals: Referral[] = [
  { id: 'ref_1', code: 'FOODIE-INV', invitedName: 'Anitha K.', status: 'joined', reward: 500 },
  { id: 'ref_2', code: 'FOODIE-INV', invitedName: 'Rahul M.', status: 'sent' },
];

/** Summer Drinks is already live, and its rate was negotiated before it started. */
const NEGOTIATED_DEAL = 'cat-6';

/**
 * That negotiation: the brand's offer, one proposal from the creator's AI agent and the
 * brand meeting it most of the way. Built from the creator's own priced offer so the
 * amounts line up with the invitation.
 */
function seedNegotiation(inv: Invitation): { messages: NegotiationMessage[]; agreed: number } {
  const to500 = (n: number) => Math.max(500, Math.round(n / 500) * 500);
  const asked = to500(inv.proposedRate * 1.2);
  const agreed = to500(inv.proposedRate * 1.12);
  const start = Date.parse(`${inv.brief.startDate}T10:00:00`);
  const at = (daysBefore: number, hours = 0) =>
    new Date((Number.isNaN(start) ? Date.now() : start) - daysBefore * 86400000 + hours * 3600000).toISOString();
  return {
    agreed,
    messages: [
      {
        id: `${inv.id}_neg_1`, sender: 'brand', offer: inv.proposedRate, timestamp: at(4),
        text: `Hi! We'd love to have you on ${inv.brief.title}. We're offering ${inr(inv.proposedRate)} for ${inv.deliverables.join(', ')}.`,
      },
      { id: `${inv.id}_neg_2`, sender: 'system', timestamp: at(4), text: 'Your AI agent is negotiating on your behalf within the limits you set in Preferences.' },
      {
        id: `${inv.id}_neg_3`, sender: 'creator_ai', offer: asked, timestamp: at(3),
        text: `Thanks for the offer. For ${inv.deliverables.length} deliverables and this audience fit, I'd propose ${inr(asked)}.`,
        reason: 'Negotiating toward your target rate',
      },
      { id: `${inv.id}_neg_4`, sender: 'brand', offer: agreed, timestamp: at(3, 5), text: `We can meet you at ${inr(agreed)}.` },
      {
        id: `${inv.id}_neg_5`, sender: 'creator_ai', offer: agreed, timestamp: at(2),
        text: `${inr(agreed)} works for you. I accepted it on your behalf.`, reason: 'Within your flexibility',
      },
    ],
  };
}

// Derive onboarding state from the set of completed steps
function deriveOnboarding(completedSteps: OnboardingStep[]): OnboardingState {
  const currentStep = ONBOARDING_STEPS.find(s => !completedSteps.includes(s)) ?? ONBOARDING_STEPS[ONBOARDING_STEPS.length - 1];
  const complete = ONBOARDING_STEPS.every(s => completedSteps.includes(s));
  return { completedSteps, currentStep, complete };
}

function contractTermsFor(inv: Invitation) {
  return {
    rate: inv.agreedRate ?? inv.proposedRate,
    deliverables: inv.deliverables,
    timeline: inv.timeline,
    usageRights: inv.usageRights,
    exclusivityDays: inv.exclusivityDays,
    revisions: inv.revisions,
  };
}

// ── Context shape ─────────────────────────────────────────────────────

interface CreatorContextValue {
  profile: CreatorProfile;
  updateProfile: (patch: Partial<CreatorProfile>) => void;

  preferences: CreatorPreferences;
  updatePreferences: (patch: Partial<CreatorPreferences>) => void;

  /** Campaigns the brand sent to this creator. */
  invitations: Invitation[];
  /** Open campaigns further away, which the creator can browse and express interest in. */
  discover: Invitation[];
  updateInvitation: (id: string, patch: Partial<Invitation>) => void;
  /** Finds a campaign in either list. */
  getInvitation: (id: string) => Invitation | undefined;

  /** Open campaigns this creator has expressed interest in, with when. */
  interests: Record<string, string>;
  expressInterest: (id: string) => void;
  withdrawInterest: (id: string) => void;

  negotiations: Record<string, NegotiationMessage[]>;
  setNegotiation: (id: string, messages: NegotiationMessage[]) => void;

  deliverables: Record<string, Deliverable[]>;
  updateDeliverable: (invId: string, delId: string, patch: Partial<Deliverable>) => void;
  ensureDeliverables: (inv: Invitation) => void;

  payments: Payment[];
  addPayment: (p: Payment) => void;
  updatePayment: (id: string, patch: Partial<Payment>) => void;

  verification: Record<VerificationStep, VerificationStatus>;
  setVerification: (step: VerificationStep, status: VerificationStatus) => void;

  onboarding: OnboardingState;
  completeOnboardingStep: (step: OnboardingStep) => void;
  resetOnboarding: () => void;

  contracts: Record<string, Contract>;
  getContract: (id: string) => Contract | undefined;
  ensureContract: (inv: Invitation) => void;
  signContract: (id: string, name: string) => void;

  referrals: Referral[];
}

const CreatorContext = createContext<CreatorContextValue | null>(null);

/** Brands invite creators within about this distance of the campaign. */
const INVITE_KM = 60;

function deliverablesFor(inv: Invitation): Deliverable[] {
  // One item per piece of content the brief asks for ("2 Instagram Stories" → two items).
  const items: Deliverable[] = [];
  inv.brief.deliverableSpecs.forEach(spec => {
    const platform = /youtube/i.test(spec.format) ? 'youtube' : /tiktok/i.test(spec.format) ? 'tiktok' : 'instagram';
    for (let i = 0; i < spec.count; i++) {
      const needsDisclosure = inv.id === 'cat-6' && spec.id.endsWith('-d0') && i === 0;
      items.push({
        id: `${inv.id}_${spec.id}_${i}`,
        label: spec.count > 1 ? `${spec.title} ${i + 1}` : spec.title,
        platform,
        status: needsDisclosure ? 'changes_requested' : 'not_started',
        dueDate: spec.due,
        format: spec.format,
        spec: spec.spec,
        notes: spec.notes,
        revisionNote: needsDisclosure ? 'Add a clear #ad or Paid partnership label.' : undefined,
      });
    }
  });
  return items;
}

/**
 * Profile a creator starts with. A creator who just signed up gets a blank passport
 * under their own name; the demo creator (or anyone else) gets the seeded profile.
 */
function initialProfile(displayName: string | undefined, fresh: boolean): CreatorProfile {
  if (!displayName) return seedProfile;
  const identity = { displayName, username: usernameFrom(displayName) };
  if (!fresh) return { ...seedProfile, ...identity };
  return {
    ...seedProfile,
    ...identity,
    verified: false,
    bio: '',
    location: '',
    pinCode: '',
    avatarUrl: undefined,
    platforms: seedProfile.platforms.map(p => ({ ...p, state: 'disconnected' as const, handle: '', followers: 0 })),
  };
}

export function CreatorProvider({ children }: { children: React.ReactNode }) {
  const { state: auth } = useAuth();
  const account = getCreatorAccount();
  const isCreatorUser = auth.user?.accountType === 'creator';
  const [profile, setProfile] = useState<CreatorProfile>(() =>
    initialProfile(isCreatorUser ? (account?.displayName || auth.user?.businessName) : undefined, Boolean(account) && !account?.onboardingComplete),
  );
  const [preferences, setPreferences] = useState<CreatorPreferences>(seedPreferences);
  const published = usePublishedCampaigns();
  // What this creator did with each campaign (status, agreed rate). The campaigns themselves come from the feed.
  // Summer Drinks is already live on the business side, so this creator's campaigns
  // screen starts with that active work. The rest start as fresh invitations.
  const [patches, setPatches] = useState<Record<string, Partial<Invitation>>>({
    'cat-6': { status: 'active' },
  });
  const [interests, setInterests] = useState<Record<string, string>>({});
  const [negotiations, setNegotiations] = useState<Record<string, NegotiationMessage[]>>({});
  const [deliverables, setDeliverables] = useState<Record<string, Deliverable[]>>({});
  const [paymentRecords, setPayments] = useState<Payment[]>(seedPayments);
  const [verification, setVerificationState] = useState<Record<VerificationStep, VerificationStatus>>({
    email: 'pending', phone: 'pending', identity: 'pending', social: 'in_progress',
  });
  // A creator who already finished onboarding in this browser goes straight to the dashboard.
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>(() =>
    account?.onboardingComplete ? [...ONBOARDING_STEPS] : [],
  );
  const [contracts, setContracts] = useState<Record<string, Contract>>({});
  const [referrals] = useState<Referral[]>(seedReferrals);

  const updateProfile = useCallback((patch: Partial<CreatorProfile>) => {
    setProfile(p => ({ ...p, ...patch }));
  }, []);

  const updatePreferences = useCallback((patch: Partial<CreatorPreferences>) => {
    setPreferences(p => ({ ...p, ...patch }));
  }, []);

  // Every published campaign is scored and priced for this creator. Brands invite the
  // creators around their campaign; campaigns further away (or open across India) are
  // listed under Browse instead. Anything the creator has already acted on stays theirs.
  const all = useMemo<Invitation[]>(
    () => published
      .map(c => {
        const patch = patches[c.campaignId];
        const km = distanceKm(profile.location, c.location);
        const near = !isAnywhere(c.location) && (km === null || km <= INVITE_KM);
        return { ...invitationFromCampaign(c, profile, preferences), ...patch, invited: near || Boolean(patch?.status && patch.status !== 'new') };
      })
      .sort((a, b) => Number(b.status === 'new') - Number(a.status === 'new') || b.matchPct - a.matchPct),
    [published, profile, preferences, patches],
  );
  const invitations = useMemo(() => all.filter(i => i.invited), [all]);
  const discover = useMemo(() => all.filter(i => !i.invited), [all]);

  const updateInvitation = useCallback((id: string, patch: Partial<Invitation>) => {
    setPatches(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  // Seed the live campaign's negotiation once the feed has priced it for this creator.
  useEffect(() => {
    const inv = all.find(i => i.id === NEGOTIATED_DEAL);
    if (!inv || negotiations[NEGOTIATED_DEAL]) return;
    const { messages, agreed } = seedNegotiation(inv);
    setNegotiations(n => (n[NEGOTIATED_DEAL] ? n : { ...n, [NEGOTIATED_DEAL]: messages }));
    setPatches(p => (p[NEGOTIATED_DEAL]?.agreedRate ? p : { ...p, [NEGOTIATED_DEAL]: { ...p[NEGOTIATED_DEAL], agreedRate: agreed } }));
  }, [all, negotiations]);

  const expressInterest = useCallback((id: string) => {
    setInterests(prev => (prev[id] ? prev : { ...prev, [id]: new Date().toISOString() }));
  }, []);

  const withdrawInterest = useCallback((id: string) => {
    setInterests(({ [id]: _gone, ...rest }) => rest);
  }, []);

  // Money this creator is owed follows the campaigns they have taken on.
  const payments = useMemo<Payment[]>(() => {
    const owed: Payment[] = invitations
      .filter(i => ['accepted', 'contract_pending', 'active', 'completed'].includes(i.status))
      .map(i => ({
        id: `pay_${i.id}`,
        campaignId: i.id,
        brand: i.brand,
        amount: i.agreedRate ?? i.proposedRate,
        date: '—',
        status: i.status === 'completed' ? 'processing' as const : 'upcoming' as const,
        milestone: i.status === 'completed' ? 'Completed' : 'On approval',
        invoiceNo: `INV-${i.id.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase()}`,
      }));
    return [...owed, ...paymentRecords];
  }, [invitations, paymentRecords]);

  const getInvitation = useCallback((id: string) => all.find(i => i.id === id), [all]);

  const setNegotiation = useCallback((id: string, messages: NegotiationMessage[]) => {
    setNegotiations(n => ({ ...n, [id]: messages }));
  }, []);

  const ensureDeliverables = useCallback((inv: Invitation) => {
    setDeliverables(prev => (prev[inv.id] ? prev : { ...prev, [inv.id]: deliverablesFor(inv) }));
  }, []);

  const updateDeliverable = useCallback((invId: string, delId: string, patch: Partial<Deliverable>) => {
    setDeliverables(prev => ({
      ...prev,
      [invId]: (prev[invId] ?? []).map(d => (d.id === delId ? { ...d, ...patch } : d)),
    }));
  }, []);

  const addPayment = useCallback((p: Payment) => {
    setPayments(list => (list.some(x => x.id === p.id) ? list : [p, ...list]));
  }, []);

  const updatePayment = useCallback((id: string, patch: Partial<Payment>) => {
    setPayments(list => list.map(p => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const setVerification = useCallback((step: VerificationStep, status: VerificationStatus) => {
    setVerificationState(v => ({ ...v, [step]: status }));
  }, []);

  const onboarding = useMemo(() => deriveOnboarding(completedSteps), [completedSteps]);

  const completeOnboardingStep = useCallback((step: OnboardingStep) => {
    setCompletedSteps(prev => (prev.includes(step) ? prev : [...prev, step]));
  }, []);

  const resetOnboarding = useCallback(() => {
    setCompletedSteps([]);
    updateCreatorAccount({ onboardingComplete: false });
  }, []);

  // Remember completion so sign-in skips the stepper next time.
  useEffect(() => {
    if (onboarding.complete && !getCreatorAccount()?.onboardingComplete) {
      updateCreatorAccount({ onboardingComplete: true, displayName: profile.displayName });
    }
  }, [onboarding.complete, profile.displayName]);

  const getContract = useCallback((id: string) => contracts[id], [contracts]);

  const ensureContract = useCallback((inv: Invitation) => {
    setContracts(prev => (prev[inv.id]
      ? prev
      : {
          ...prev,
          [inv.id]: {
            id: inv.id,
            invitationId: inv.id,
            brand: inv.brand,
            terms: contractTermsFor(inv),
            status: 'awaiting_signature',
          },
        }));
  }, []);

  const signContract = useCallback((id: string, name: string) => {
    setContracts(prev => (prev[id]
      ? { ...prev, [id]: { ...prev[id], status: 'signed', signedName: name, signedAt: new Date().toISOString() } }
      : prev));
  }, []);

  const value = useMemo<CreatorContextValue>(() => ({
    profile, updateProfile,
    preferences, updatePreferences,
    invitations, discover, updateInvitation, getInvitation,
    interests, expressInterest, withdrawInterest,
    negotiations, setNegotiation,
    deliverables, updateDeliverable, ensureDeliverables,
    payments, addPayment, updatePayment,
    verification, setVerification,
    onboarding, completeOnboardingStep, resetOnboarding,
    contracts, getContract, ensureContract, signContract,
    referrals,
  }), [profile, updateProfile, preferences, updatePreferences, invitations, discover, updateInvitation,
    getInvitation, interests, expressInterest, withdrawInterest, negotiations, setNegotiation, deliverables, updateDeliverable, ensureDeliverables,
    payments, addPayment, updatePayment, verification, setVerification,
    onboarding, completeOnboardingStep, resetOnboarding,
    contracts, getContract, ensureContract, signContract, referrals]);

  return <CreatorContext.Provider value={value}>{children}</CreatorContext.Provider>;
}

export function useCreator() {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error('useCreator must be used within CreatorProvider');
  return ctx;
}
