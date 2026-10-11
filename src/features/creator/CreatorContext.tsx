import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
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
  contentFormats: ['Instagram Reel', 'Instagram Story', 'YouTube Short', 'UGC'],
  availableForCampaigns: true,
  openToLongTerm: true,
  allowDiscovery: true,
  aiNegotiationEnabled: true,
  aiMinAcceptableRate: 9000,
  aiFlexibilityPct: 15,
  aiMaxExclusivityDays: 30,
};

const seedInvitations: Invitation[] = [
  {
    id: 'inv_1',
    brand: 'Brew & Bites Café',
    brandVerified: true,
    category: 'Food & Beverage',
    location: 'Chennai',
    proposedRate: 8000,
    deliverables: ['1 Instagram Reel', '2 Instagram Stories'],
    matchPct: 94,
    matchBreakdown: { audience: 92, location: 98, category: 96, performance: 89, rate: 91 },
    deadline: '12–18 Sep 2026',
    timeline: '12–18 Sep 2026',
    status: 'new',
    objective: 'Increase café visits in Chennai and create awareness among local food lovers.',
    whySelected: [
      '72% Chennai audience',
      'Strong Tamil-speaking audience',
      'Food category match',
      'Strong local engagement',
    ],
    usageRights: 'Organic social · 30 days',
    exclusivityDays: 15,
    revisions: 1,
    paymentProtected: true,
    selectedForYou: true,
  },
  {
    id: 'inv_2',
    brand: 'FreshLeaf Salads',
    brandVerified: true,
    category: 'Food & Beverage',
    location: 'Chennai',
    proposedRate: 12000,
    deliverables: ['2 Instagram Reels'],
    matchPct: 88,
    matchBreakdown: { audience: 90, location: 94, category: 92, performance: 84, rate: 80 },
    deadline: '20–28 Sep 2026',
    timeline: '20–28 Sep 2026',
    status: 'new',
    objective: 'Promote a new healthy salad range to young urban food lovers.',
    whySelected: ['High food-category affinity', '68% audience aged 18–24', 'Consistent reel performance'],
    usageRights: 'Organic social · 45 days',
    exclusivityDays: 20,
    revisions: 2,
    paymentProtected: true,
    selectedForYou: true,
  },
  {
    id: 'inv_3',
    brand: 'WanderStay Homestays',
    brandVerified: false,
    category: 'Travel',
    location: 'Puducherry',
    proposedRate: 15000,
    deliverables: ['1 Instagram Reel', '1 YouTube Short', '3 Stories'],
    matchPct: 82,
    matchBreakdown: { audience: 85, location: 88, category: 90, performance: 78, rate: 72 },
    deadline: '01–10 Oct 2026',
    timeline: '01–10 Oct 2026',
    status: 'new',
    objective: 'Showcase a coastal homestay experience to travel enthusiasts in Tamil Nadu.',
    whySelected: ['Travel category match', 'Regional audience overlap', 'Multi-platform reach'],
    usageRights: 'Organic social + paid amplification · 60 days',
    exclusivityDays: 30,
    revisions: 1,
    paymentProtected: true,
  },
];

const seedPayments: Payment[] = [
  { id: 'pay_1', campaignId: 'inv_1', brand: 'Brew & Bites Café', amount: 9000, date: '—', status: 'upcoming', milestone: 'On approval', invoiceNo: 'INV-2026-014' },
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
  // Break "1 Instagram Reel", "2 Instagram Stories" into individual items
  const items: Deliverable[] = [];
  const dueDates = ['14 Sep', '16 Sep', '18 Sep', '20 Sep', '22 Sep'];
  let idx = 0;
  inv.deliverables.forEach((d) => {
    const match = d.match(/^(\d+)\s+(.*)$/);
    const count = match ? parseInt(match[1], 10) : 1;
    const label = match ? match[2] : d;
    const platform = /youtube/i.test(label) ? 'youtube' : /tiktok/i.test(label) ? 'tiktok' : 'instagram';
    for (let i = 0; i < count; i++) {
      items.push({
        id: `${inv.id}_d${idx}`,
        label: count > 1 ? `${label} ${i + 1}` : label,
        platform,
        status: 'not_started',
        dueDate: dueDates[Math.min(idx, dueDates.length - 1)],
      });
      idx++;
    }
  });
  return items;
}

export function CreatorProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CreatorProfile>(seedProfile);
  const [preferences, setPreferences] = useState<CreatorPreferences>(seedPreferences);
  const [invitations, setInvitations] = useState<Invitation[]>(seedInvitations);
  const [negotiations, setNegotiations] = useState<Record<string, NegotiationMessage[]>>({});
  const [deliverables, setDeliverables] = useState<Record<string, Deliverable[]>>({});
  const [payments, setPayments] = useState<Payment[]>(seedPayments);
  const [verification, setVerificationState] = useState<Record<VerificationStep, VerificationStatus>>({
    email: 'verified', phone: 'pending', identity: 'pending', social: 'in_progress',
  });
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);
  const [contracts, setContracts] = useState<Record<string, Contract>>({});
  const [referrals] = useState<Referral[]>(seedReferrals);

  const updateProfile = useCallback((patch: Partial<CreatorProfile>) => {
    setProfile(p => ({ ...p, ...patch }));
  }, []);

  const updatePreferences = useCallback((patch: Partial<CreatorPreferences>) => {
    setPreferences(p => ({ ...p, ...patch }));
  }, []);

  const updateInvitation = useCallback((id: string, patch: Partial<Invitation>) => {
    setInvitations(list => list.map(i => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

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

  const resetOnboarding = useCallback(() => setCompletedSteps([]), []);

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
