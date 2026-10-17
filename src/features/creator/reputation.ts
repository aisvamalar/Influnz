import type { CreatorProfile } from './types';

export type ReputationKey = 'ontime' | 'ratings' | 'quality' | 'communication';

export interface ReputationFactor {
  key: ReputationKey;
  label: string;
  short: string;
  value: number; // 0-100
}

/** What builds a creator's standing with brands. Shared by the Reputation page and the dashboard. */
export function reputationFactors(profile: CreatorProfile): ReputationFactor[] {
  return [
    { key: 'ontime', label: 'On-time delivery', short: 'On time', value: profile.reliability },
    { key: 'ratings', label: 'Brand ratings', short: 'Ratings', value: Math.round(profile.rating * 20) },
    { key: 'quality', label: 'Content quality', short: 'Quality', value: 88 },
    { key: 'communication', label: 'Communication', short: 'Comms', value: 91 },
  ];
}
