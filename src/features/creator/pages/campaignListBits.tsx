/**
 * Campaign board data.
 * - My campaigns: work the creator has accepted (signing, live, completed).
 * - Browse: open campaigns the brand did not send to this creator (further away, or open
 *   across India), nearest first. The creator can express interest; invitations from
 *   brands nearby are answered on the Invitations screen instead.
 */
import { useEffect, useMemo, useState } from 'react';
import { useCreator } from '../CreatorContext';
import { nextDue } from '../campaignParts';
import { distanceKm, isAnywhere } from '../geo';
import type { Deliverable, Invitation, InvitationStatus } from '../types';

export type CampaignFilter = 'all' | 'active' | 'sign' | 'completed';
export type Region = 'region' | 'all';

const TAKEN: InvitationStatus[] = ['accepted', 'contract_pending', 'active', 'completed'];

/** "Region" is a long drive or a short flight away. */
const REGION_KM = 600;

export const CAMPAIGN_TABS: Array<{ key: CampaignFilter; label: string; short: string }> = [
  { key: 'all', label: 'All', short: 'All' },
  { key: 'active', label: 'In progress', short: 'Live' },
  { key: 'sign', label: 'Awaiting contract', short: 'Contract' },
  { key: 'completed', label: 'Completed', short: 'Done' },
];

export const REGION_TABS: Array<{ key: Region; label: string }> = [
  { key: 'region', label: `Within ${REGION_KM} km` },
  { key: 'all', label: 'All India' },
];

export type CampaignTone = 'coral' | 'amber' | 'violet' | 'green' | 'blue';

export const CAMPAIGN_STATUS: Partial<Record<InvitationStatus, { label: string; tone: CampaignTone }>> = {
  new: { label: 'Open for you', tone: 'coral' },
  in_negotiation: { label: 'Negotiating', tone: 'amber' },
  accepted: { label: 'Accepted · sign next', tone: 'violet' },
  contract_pending: { label: 'Contract pending', tone: 'violet' },
  active: { label: 'In progress', tone: 'green' },
  completed: { label: 'Completed', tone: 'blue' },
};

export interface BrowseItem {
  inv: Invitation;
  km: number | null;
  anywhere: boolean;
}

function inFilter(inv: Invitation, filter: CampaignFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'active') return inv.status === 'active';
  if (filter === 'sign') return inv.status === 'accepted' || inv.status === 'contract_pending';
  return inv.status === 'completed';
}

function inRegion(item: BrowseItem, region: Region): boolean {
  if (region === 'all') return true;
  if (item.anywhere) return true;
  if (item.km === null) return false;
  return item.km <= REGION_KM;
}

export function progressOf(inv: Invitation, items?: Deliverable[]): { done: number; total: number } {
  if (items?.length) return { done: items.filter(item => item.status === 'approved').length, total: items.length };
  const total = inv.brief.deliverableSpecs.reduce((n, spec) => n + spec.count, 0);
  return { done: 0, total };
}

export function useCampaignBoard() {
  const { profile, invitations, discover, interests, expressInterest, deliverables, ensureDeliverables, payments } = useCreator();
  const [filter, setFilter] = useState<CampaignFilter>('all');
  const [query, setQuery] = useState('');
  const [regionPick, setRegion] = useState<Region | null>(null);

  const campaigns = useMemo(() => invitations.filter(inv => TAKEN.includes(inv.status)), [invitations]);
  useEffect(() => { campaigns.forEach(ensureDeliverables); }, [campaigns, ensureDeliverables]);

  const matches = (inv: Invitation) => {
    const q = query.trim().toLowerCase();
    return !q || `${inv.brief.title} ${inv.brand} ${inv.category} ${inv.location}`.toLowerCase().includes(q);
  };

  const counts = Object.fromEntries(
    CAMPAIGN_TABS.map(tab => [tab.key, campaigns.filter(inv => inFilter(inv, tab.key)).length]),
  ) as Record<CampaignFilter, number>;

  const shown = campaigns
    .filter(inv => inFilter(inv, filter) && matches(inv))
    .sort((a, b) => (nextDue(a, deliverables[a.id]) ?? '9999').localeCompare(nextDue(b, deliverables[b.id]) ?? '9999'));

  // ── Browse: open campaigns, nearest first ──
  const browseAll = useMemo<BrowseItem[]>(
    () => discover
      .map(inv => ({ inv, km: distanceKm(profile.location, inv.location), anywhere: isAnywhere(inv.location) }))
      .sort((a, b) => (a.km ?? (a.anywhere ? 1e5 : 1e6)) - (b.km ?? (b.anywhere ? 1e5 : 1e6)) || b.inv.matchPct - a.inv.matchPct),
    [discover, profile.location],
  );
  const regionCounts = Object.fromEntries(
    REGION_TABS.map(tab => [tab.key, browseAll.filter(item => inRegion(item, tab.key)).length]),
  ) as Record<Region, number>;
  // Start on the region when there is something in it, otherwise show all of India.
  const region: Region = regionPick ?? (regionCounts.region > 0 ? 'region' : 'all');
  const browse = browseAll.filter(item => inRegion(item, region) && matches(item.inv));

  const upNext = useMemo(() => {
    // Plain loops so TypeScript sees the assignments (it does not track them inside callbacks).
    let best: { inv: Invitation; item: Deliverable } | null = null;
    for (const inv of campaigns) {
      if (inv.status !== 'active') continue;
      for (const item of deliverables[inv.id] ?? []) {
        if (item.status !== 'approved' && (!best || item.dueDate < best.item.dueDate)) best = { inv, item };
      }
    }
    return best;
  }, [campaigns, deliverables]);

  const allItems = campaigns.flatMap(inv => deliverables[inv.id] ?? []);
  const delivered = allItems.filter(item => item.status === 'approved').length;
  const upcoming = payments
    .filter(payment => payment.status === 'upcoming' || payment.status === 'processing' || payment.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    city: profile.location.split(',')[0].trim() || 'your city',
    place: profile.location,
    filter,
    setFilter,
    query,
    setQuery,
    counts,
    campaigns,
    shown,
    upNext,
    deliverables,
    region,
    setRegion,
    regionCounts,
    browse,
    browseTotal: browseAll.length,
    interests,
    expressInterest,
    invitesOpen: invitations.filter(inv => inv.status === 'new' || inv.status === 'in_negotiation').length,
    stats: {
      live: campaigns.filter(inv => inv.status === 'active').length,
      signing: campaigns.filter(inv => inv.status === 'accepted' || inv.status === 'contract_pending').length,
      delivered,
      pieces: allItems.length,
      upcoming,
    },
  };
}
