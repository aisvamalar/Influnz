// ── Creator domain types ──────────────────────────────────────────────

export type Platform = 'instagram' | 'youtube' | 'tiktok';
export type ConnectionState = 'connected' | 'connecting' | 'failed' | 'disconnected';

export interface PlatformConnection {
  platform: Platform;
  handle: string;
  followers: number;
  state: ConnectionState;
}

export type VerificationStep = 'email' | 'phone' | 'identity' | 'social';
export type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'failed';

export interface CreatorProfile {
  displayName: string;
  username: string;
  avatarUrl?: string;
  verified: boolean;
  bio: string;
  categories: string[];
  location: string;
  languages: string[];
  contentTypes: string[];
  followers: number;
  engagement: number;   // percentage
  avgViews: number;
  audience: {
    topCity: string; topCityPct: number;
    topLanguage: string; topLanguagePct: number;
    topAgeRange: string; topAgePct: number;
    topCountry: string; topCountryPct: number;
  };
  platforms: PlatformConnection[];
  rating: number;        // 0-5
  reliability: number;   // 0-100
  completionPct: number;
}

export interface CreatorPreferences {
  categories: string[];
  blockedCategories: string[];
  locations: string[];
  languages: string[];
  minRate: number;
  platforms: Platform[];
  contentFormats: string[];
  availableForCampaigns: boolean;
  openToLongTerm: boolean;
  allowDiscovery: boolean;
  aiNegotiationEnabled: boolean;
  aiMinAcceptableRate: number;
  aiFlexibilityPct: number;
  aiMaxExclusivityDays: number;
}

export type InvitationStatus =
  | 'new' | 'in_negotiation' | 'accepted' | 'contract_pending'
  | 'active' | 'completed' | 'declined' | 'expired';

export interface MatchBreakdown {
  audience: number;
  location: number;
  category: number;
  performance: number;
  rate: number;
}

export interface Invitation {
  id: string;
  brand: string;
  brandVerified: boolean;
  category: string;
  location: string;
  proposedRate: number;
  agreedRate?: number;
  deliverables: string[];
  matchPct: number;
  matchBreakdown: MatchBreakdown;
  deadline: string;       // display range
  timeline: string;
  status: InvitationStatus;
  objective: string;
  whySelected: string[];
  usageRights: string;
  exclusivityDays: number;
  revisions: number;
  paymentProtected: boolean;
  image?: string;
  selectedForYou?: boolean;
}

export type NegotiationSender = 'brand' | 'creator_ai' | 'creator' | 'system';

export interface NegotiationMessage {
  id: string;
  sender: NegotiationSender;
  text: string;
  offer?: number;
  timestamp: string;
  reason?: string;
  permissionUsed?: string;
  limitReached?: boolean;
}

export type DeliverableStatus = 'not_started' | 'uploaded' | 'pending_approval' | 'approved' | 'changes_requested';

export interface Deliverable {
  id: string;
  label: string;
  platform: Platform;
  status: DeliverableStatus;
  dueDate: string;
  revisionNote?: string;
}

export interface ComplianceCheck {
  label: string;
  passed: boolean;
  detail?: string;
}

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'disputed' | 'upcoming';

export interface Payment {
  id: string;
  campaignId: string;
  brand: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  milestone: string;
  txnRef?: string;
  invoiceNo?: string;
}

// ── Onboarding ────────────────────────────────────────────────────────

export type OnboardingStep = 'verify' | 'passport' | 'preferences';

export const ONBOARDING_STEPS: OnboardingStep[] = ['verify', 'passport', 'preferences'];

export interface OnboardingState {
  completedSteps: OnboardingStep[];
  currentStep: OnboardingStep;   // first incomplete step
  complete: boolean;             // all required steps done
}

// ── Contract ──────────────────────────────────────────────────────────

export type ContractStatus = 'draft' | 'awaiting_signature' | 'signed' | 'amended';

export interface ContractTerms {
  rate: number;
  deliverables: string[];
  timeline: string;
  usageRights: string;
  exclusivityDays: number;
  revisions: number;
}

export interface Contract {
  id: string;              // maps to invitation/campaign id
  invitationId: string;
  brand: string;
  terms: ContractTerms;
  status: ContractStatus;
  signedName?: string;
  signedAt?: string;
}

// ── Referrals & Rewards ───────────────────────────────────────────────

export interface Referral {
  id: string;
  code: string;
  invitedName?: string;
  status: 'sent' | 'joined' | 'rewarded';
  reward?: number;
}

export interface RewardTier {
  key: string;
  label: string;
  minScore: number;
  benefits: string[];
}
