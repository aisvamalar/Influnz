/**
 * Creator Score: the one number the Growth, Rewards and Dashboard screens share.
 * The value is still a mock until the scoring service exists; keep it here so the
 * screens can never disagree.
 */
import { reputationFactors } from './reputation';
import type { CreatorProfile, RewardTier } from './types';

export const CREATOR_SCORE = 72;

export const REWARD_TIERS: RewardTier[] = [
  { key: 'rising', label: 'Rising Creator', minScore: 0, benefits: ['Access to campaign invitations', 'AI negotiation agent', 'Protected payments'] },
  { key: 'established', label: 'Established Creator', minScore: 75, benefits: ['Priority matching', 'Higher-value campaigns', 'Verified badge upgrade'] },
  { key: 'partner', label: 'Influnz Partner', minScore: 90, benefits: ['Dedicated success manager', 'Early access to premium brands', 'Faster payouts', 'Referral bonus boost'] },
];

export function tierFor(score: number): { current: RewardTier; next?: RewardTier } {
  const current = [...REWARD_TIERS].reverse().find(t => score >= t.minScore) ?? REWARD_TIERS[0];
  return { current, next: REWARD_TIERS.find(t => t.minScore > score) };
}

export interface ScoreFactor {
  key: string;
  label: string;
  value: number; // 0-100
}

/** The parts of the score, using the same figures the Growth and Reputation screens show. */
export function scoreFactors(profile: CreatorProfile): ScoreFactor[] {
  const quality = reputationFactors(profile).find(f => f.key === 'quality')?.value ?? 0;
  return [
    { key: 'quality', label: 'Content quality', value: quality },
    { key: 'audience', label: 'Audience fit', value: 82 },
    { key: 'engagement', label: 'Engagement', value: 78 },
    { key: 'ratings', label: 'Brand ratings', value: Math.round(profile.rating * 20) },
    { key: 'reliability', label: 'Reliability', value: profile.reliability },
  ];
}
