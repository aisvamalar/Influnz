/**
 * Campaign draft shared by the campaign setup steps (strategy → creators → …).
 * Persisted in localStorage so a refresh or back-navigation never loses progress.
 * Swap the storage calls for API calls when the backend exists.
 */
import { useCallback, useRef, useState } from 'react';
import avatar1 from '../../assets/campaigns/creator-1.jpg';
import avatar2 from '../../assets/campaigns/creator-2.jpg';
import avatar3 from '../../assets/campaigns/creator-3.jpg';

export type StrategyKey = 'reach' | 'performance' | 'community' | 'hybrid';
export type Tier = 'MEGA' | 'MACRO' | 'NANO';

export const BUDGET_CAP = 150000;

export interface StrategyMeta {
  key: StrategyKey;
  name: string;
  mix: string;
  tagline: string;
  audienceFit: number;
  audienceNote: string;
  creatorIds: string[];
}

export const STRATEGY_META: Record<StrategyKey, StrategyMeta> = {
  reach: {
    key: 'reach', name: 'Maximum Reach', mix: '1 Mega + 1 Macro',
    tagline: 'Broad Awareness & Top-of-Funnel Visibility',
    audienceFit: 88, audienceNote: 'Wide regional spread',
    creatorIds: ['tamil-trends', 'chennai-food-guide'],
  },
  performance: {
    key: 'performance', name: 'Performance & Conversion', mix: '3 Macro + 2 Nano',
    tagline: 'High-Engagement Micro-Creators & ROI Efficiency',
    audienceFit: 94, audienceNote: 'High local concentration',
    creatorIds: ['chennai-food-guide', 'madras-street-eats', 'marina-lifestyle', 'vignesh-tech', 'kavitha-herbal'],
  },
  community: {
    key: 'community', name: 'Community & Hyperlocal', mix: '2 Macro + 2 Nano',
    tagline: 'Local Trust & Regional Authenticity',
    audienceFit: 96, audienceNote: 'Very high local concentration',
    creatorIds: ['madras-street-eats', 'marina-lifestyle', 'anna-nagar-eats', 'kavitha-herbal'],
  },
  hybrid: {
    key: 'hybrid', name: 'Hybrid Balanced', mix: '1 Mega + 1 Macro + 1 Nano',
    tagline: 'Balanced Reach, Engagement & ROI',
    audienceFit: 91, audienceNote: 'Balanced local and regional',
    creatorIds: ['tamil-trends', 'chennai-food-guide', 'vignesh-tech'],
  },
};

export interface Creator {
  id: string;
  name: string;
  handle: string;
  tier: Tier;
  avatar?: string;
  audience: string;
  avgViews: string;
  engagement: string;
  city: string;
  fit: number;
  reliability: 'High' | 'Medium';
  insight: string;
  rate: number;
}

export const CREATORS: Record<string, Creator> = {
  'chennai-food-guide': {
    id: 'chennai-food-guide', name: 'Chennai Food Guide (Vidyasagar)', handle: '@ChennaiFoodGuide', tier: 'MACRO', avatar: avatar1,
    audience: '7.2 Lakh', avgViews: '1.1 Lakh', engagement: '11.7%', city: 'Chennai', fit: 99, reliability: 'High', rate: 38000,
    insight: 'Strong audience affinity in Chennai (Tamil) with consistent 11.7% ER in food, dining.',
  },
  'madras-street-eats': {
    id: 'madras-street-eats', name: 'Madras Street Eats', handle: '@MadrasStreetEats', tier: 'MACRO',
    audience: '4.8 Lakh', avgViews: '82k', engagement: '9.4%', city: 'Chennai', fit: 96, reliability: 'High', rate: 32000,
    insight: 'Strong audience affinity in Chennai (Tamil) with consistent 9.4% ER in street food, cafés.',
  },
  'marina-lifestyle': {
    id: 'marina-lifestyle', name: 'Marina Lifestyle Diaries', handle: '@MarinaDiaries', tier: 'MACRO',
    audience: '3.9 Lakh', avgViews: '64k', engagement: '8.8%', city: 'Chennai', fit: 94, reliability: 'High', rate: 28000,
    insight: 'Strong audience affinity in Chennai (Tamil) with consistent 8.8% ER in lifestyle, weekend outings.',
  },
  'vignesh-tech': {
    id: 'vignesh-tech', name: 'Vignesh Tech Bytes', handle: '@ChennaiCodeCraft', tier: 'NANO', avatar: avatar2,
    audience: '8.5k', avgViews: '5.5k', engagement: '7.92%', city: 'Chennai', fit: 99, reliability: 'High', rate: 10000,
    insight: 'Strong audience affinity in Chennai (Tamil) with consistent 7.92% ER in tech, gadgets.',
  },
  'kavitha-herbal': {
    id: 'kavitha-herbal', name: 'Kavitha Herbal & Haircare', handle: '@ChennaiGlowKavitha', tier: 'NANO', avatar: avatar3,
    audience: '9.8k', avgViews: '6.8k', engagement: '8.31%', city: 'Chennai', fit: 99, reliability: 'High', rate: 9000,
    insight: 'Strong audience affinity in Chennai (Tamil) with consistent 8.31% ER in beauty, haircare.',
  },
  'anna-nagar-eats': {
    id: 'anna-nagar-eats', name: 'Anna Nagar Eats', handle: '@AnnaNagarEats', tier: 'NANO',
    audience: '11.2k', avgViews: '7.4k', engagement: '9.1%', city: 'Chennai', fit: 97, reliability: 'High', rate: 11000,
    insight: 'Strong audience affinity in Chennai (Tamil) with consistent 9.1% ER in neighbourhood food, cafés.',
  },
  'tamil-trends': {
    id: 'tamil-trends', name: 'Tamil Trends Official', handle: '@TamilTrends', tier: 'MEGA',
    audience: '18 Lakh', avgViews: '3.4 Lakh', engagement: '5.6%', city: 'Chennai', fit: 90, reliability: 'Medium', rate: 85000,
    insight: 'Wide Tamil-speaking reach across Tamil Nadu with steady 5.6% ER in entertainment, trends.',
  },
};

export type Stance = 'firm' | 'balanced' | 'flexible';

export interface NegotiationParams {
  totalBudget: number;
  maxPerCreator: number;
  approvalThreshold: number;
  targetDiscount: number;
  stance: Stance;
  deliverables: number;
  turnaroundDays: number;
  usageRights: boolean;
  enabled: boolean;
}

export type DealReviewStatus = 'pending' | 'accepted' | 'intervened';

export interface DealReview {
  status: DealReviewStatus;
  offer: number;
  interventionNote?: string;
}

export const DEFAULT_NEGOTIATION: NegotiationParams = {
  totalBudget: BUDGET_CAP,
  maxPerCreator: 40000,
  approvalThreshold: 30000,
  targetDiscount: 12,
  stance: 'balanced',
  deliverables: 3,
  turnaroundDays: 7,
  usageRights: true,
  enabled: true,
};

export interface CampaignDraft {
  strategy: StrategyKey;
  /** Creator ids the business removed from the strategy's portfolio. */
  removed: Partial<Record<StrategyKey, string[]>>;
  negotiation: NegotiationParams;
  dealReviews: Partial<Record<StrategyKey, Record<string, DealReview>>>;
}

const KEY = 'influnz.campaignDraft.v1';
const DEFAULT_DRAFT: CampaignDraft = { strategy: 'reach', removed: {}, negotiation: DEFAULT_NEGOTIATION, dealReviews: {} };

export function saveCampaignDraft(draft: CampaignDraft) {
  try {
    localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // The in-memory draft remains usable if browser storage is unavailable.
  }
}

function read(): CampaignDraft {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_DRAFT;
    const parsed = JSON.parse(raw) as Partial<CampaignDraft>;
    const strategy = parsed.strategy && parsed.strategy in STRATEGY_META ? parsed.strategy : DEFAULT_DRAFT.strategy;
    return {
      strategy,
      removed: parsed.removed ?? {},
      negotiation: { ...DEFAULT_NEGOTIATION, ...parsed.negotiation },
      dealReviews: parsed.dealReviews ?? {},
    };
  } catch {
    return DEFAULT_DRAFT;
  }
}

export function useCampaignDraft() {
  const [draft, setDraft] = useState<CampaignDraft>(read);
  const draftRef = useRef(draft);
  const updateDraft = useCallback((update: (current: CampaignDraft) => CampaignDraft) => {
    const next = update(draftRef.current);
    draftRef.current = next;
    saveCampaignDraft(next);
    setDraft(next);
  }, []);

  const setStrategy = useCallback((strategy: StrategyKey) => {
    updateDraft(current => ({ ...current, strategy }));
  }, [updateDraft]);

  const setCreatorSelected = useCallback((creatorIds: string[], selected: boolean) => {
    updateDraft(draft => {
      const current = new Set(draft.removed[draft.strategy] ?? []);
      creatorIds.forEach(id => (selected ? current.delete(id) : current.add(id)));
      return { ...draft, removed: { ...draft.removed, [draft.strategy]: [...current] } };
    });
  }, [updateDraft]);

  const setNegotiation = useCallback((patch: Partial<NegotiationParams>) => {
    updateDraft(draft => ({ ...draft, negotiation: { ...draft.negotiation, ...patch } }));
  }, [updateDraft]);

  const setDealReview = useCallback((creatorId: string, review: DealReview) => {
    updateDraft(draft => ({
      ...draft,
      dealReviews: {
        ...draft.dealReviews,
        [draft.strategy]: {
          ...draft.dealReviews[draft.strategy],
          [creatorId]: review,
        },
      },
    }));
  }, [updateDraft]);

  return { draft, setStrategy, setCreatorSelected, setNegotiation, setDealReview };
}

export function formatMoney(n: number): string {
  return n >= 100000 ? `₹${(n / 100000).toFixed(1)} Lakh` : `₹${(n / 1000).toFixed(1)}k`;
}

export function getSelectedCreators(draft: CampaignDraft): Creator[] {
  const removed = new Set(draft.removed[draft.strategy] ?? []);
  return STRATEGY_META[draft.strategy].creatorIds.filter(id => !removed.has(id)).map(id => CREATORS[id]).filter(Boolean);
}

export type DealStatus = 'within-guardrails' | 'approval-required' | 'over-cap';

export interface Deal {
  creator: Creator;
  ask: number;
  agreed: number;
  saved: number;
  rounds: number;
  status: DealStatus;
  note: string;
}

const STANCE_FACTOR: Record<Stance, number> = { firm: 0.6, balanced: 1, flexible: 1.3 };

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic local preview until a server-side negotiation API is available. */
export function simulateNegotiation(creators: Creator[], p: NegotiationParams): Deal[] {
  let remainingBudget = Math.max(p.totalBudget, 0);
  return creators.map(creator => {
    const h = hash(creator.id);
    const rounds = 1 + (h % 3);
    const achieved = Math.min(0.3, (p.targetDiscount / 100) * STANCE_FACTOR[p.stance] * (0.55 + (h % 50) / 100));
    const ask = creator.rate;
    const targetOffer = Math.round((ask * (1 - achieved)) / 500) * 500;
    const agreed = Math.max(0, Math.min(targetOffer, p.maxPerCreator, remainingBudget));
    let status: DealStatus = 'within-guardrails';
    let note = 'Draft offer prepared after ' + rounds + (rounds > 1 ? ' rounds.' : ' round.');
    if (remainingBudget === 0) {
      status = 'over-cap';
      note = 'No campaign budget remains for this draft offer.';
    } else if (targetOffer > p.maxPerCreator || targetOffer > remainingBudget) {
      status = 'over-cap';
      note = 'Draft offer is capped at your remaining approved budget.';
    } else if (agreed > p.approvalThreshold) {
      status = 'approval-required';
      note = 'Draft offer is above the manual approval threshold.';
    }
    remainingBudget -= agreed;
    return { creator, ask, agreed, saved: ask - agreed, rounds, status, note };
  });
}
