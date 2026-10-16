import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../../app/AuthContext';
import { getCreatorAccount, updateCreatorAccount, usernameFrom } from './creatorAccount';
import { usePublishedCampaigns } from './campaignFeed';
import { invitationFromCampaign } from './campaignMatch';
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

  invitations: Invitation[];
  updateInvitation: (id: string, patch: Partial<Invitation>) => void;
  getInvitation: (id: string) => Invitation | undefined;

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

function deliverablesFor(inv: Invitation): Deliverable[] {
  // One item per piece of content the brief asks for ("2 Instagram Stories" → two items).
  const items: Deliverable[] = [];
  inv.brief.deliverableSpecs.forEach(spec => {
    const platform = /youtube/i.test(spec.format) ? 'youtube' : /tiktok/i.test(spec.format) ? 'tiktok' : 'instagram';
    for (let i = 0; i < spec.count; i++) {
      const needsDisclosure = inv.id === 'cat-1' && spec.id.endsWith('-d0') && i === 0;
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
  // Chennai Café and Summer Drinks are already live on the business side, so this
  // creator's campaigns screen starts with that active work. The rest stay invitations.
  const [patches, setPatches] = useState<Record<string, Partial<Invitation>>>({
    'cat-1': { status: 'active' },
    'cat-6': { status: 'active' },
  });
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

  // Every published campaign becomes an invitation, scored and priced for this creator.
  const invitations = useMemo<Invitation[]>(
    () => published
      .map(c => ({ ...invitationFromCampaign(c, profile, preferences), ...patches[c.campaignId] }))
      .sort((a, b) => Number(b.status === 'new') - Number(a.status === 'new') || b.matchPct - a.matchPct),
    [published, profile, preferences, patches],
  );

  const updateInvitation = useCallback((id: string, patch: Partial<Invitation>) => {
    setPatches(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
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

  const getInvitation = useCallback((id: string) => invitations.find(i => i.id === id), [invitations]);

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
    invitations, updateInvitation, getInvitation,
    negotiations, setNegotiation,
    deliverables, updateDeliverable, ensureDeliverables,
    payments, addPayment, updatePayment,
    verification, setVerification,
    onboarding, completeOnboardingStep, resetOnboarding,
    contracts, getContract, ensureContract, signContract,
    referrals,
  }), [profile, updateProfile, preferences, updatePreferences, invitations, updateInvitation,
    getInvitation, negotiations, setNegotiation, deliverables, updateDeliverable, ensureDeliverables,
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
