import { useEffect, useMemo, useState } from 'react';
import { useCreator } from '../CreatorContext';
import { nextDue } from '../campaignParts';
import type { Deliverable, Invitation, InvitationStatus } from '../types';

export type CampaignFilter = 'all' | 'active' | 'sign' | 'completed';

const TAKEN: InvitationStatus[] = ['accepted', 'contract_pending', 'active', 'completed'];

export const CAMPAIGN_TABS: Array<{ key: CampaignFilter; label: string; short: string }> = [
  { key: 'all', label: 'All', short: 'All' },
  { key: 'active', label: 'In progress', short: 'Live' },
  { key: 'sign', label: 'Awaiting contract', short: 'Contract' },
  { key: 'completed', label: 'Completed', short: 'Done' },
];

export const CAMPAIGN_STATUS: Partial<Record<InvitationStatus, { label: string; tone: string }>> = {
  accepted: { label: 'Accepted', tone: 'sign' },
  contract_pending: { label: 'Contract pending', tone: 'sign' },
  active: { label: 'In progress', tone: 'live' },
  completed: { label: 'Completed', tone: 'done' },
};

function inFilter(inv: Invitation, filter: CampaignFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'active') return inv.status === 'active';
  if (filter === 'sign') return inv.status === 'accepted' || inv.status === 'contract_pending';
  return inv.status === 'completed';
}

export function progressOf(inv: Invitation, items?: Deliverable[]): { done: number; total: number } {
  if (items?.length) return { done: items.filter(item => item.status === 'approved').length, total: items.length };
  const total = inv.brief.deliverableSpecs.reduce((n, spec) => n + spec.count, 0);
  return { done: 0, total };
}

export function useCampaignBoard() {
  const { invitations, deliverables, ensureDeliverables, payments } = useCreator();
  const [filter, setFilter] = useState<CampaignFilter>('all');
  const [query, setQuery] = useState('');

  const campaigns = useMemo(
    () => invitations.filter(inv => TAKEN.includes(inv.status)),
    [invitations],
  );

  useEffect(() => { campaigns.forEach(ensureDeliverables); }, [campaigns, ensureDeliverables]);

  const counts = Object.fromEntries(
    CAMPAIGN_TABS.map(tab => [tab.key, campaigns.filter(inv => inFilter(inv, tab.key)).length]),
  ) as Record<CampaignFilter, number>;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campaigns
      .filter(inv => inFilter(inv, filter) && (!q || `${inv.brief.title} ${inv.brand}`.toLowerCase().includes(q)))
      .sort((a, b) => (nextDue(a, deliverables[a.id]) ?? '9999').localeCompare(nextDue(b, deliverables[b.id]) ?? '9999'));
  }, [campaigns, filter, query, deliverables]);

  const upNext = useMemo(() => {
    let best: { inv: Invitation; item: Deliverable } | null = null;
    campaigns.filter(inv => inv.status === 'active').forEach(inv => {
      (deliverables[inv.id] ?? []).filter(item => item.status !== 'approved').forEach(item => {
        if (!best || item.dueDate < best.item.dueDate) best = { inv, item };
      });
    });
    return best;
  }, [campaigns, deliverables]);

  const allItems = campaigns.flatMap(inv => deliverables[inv.id] ?? []);
  const delivered = allItems.filter(item => item.status === 'approved').length;
  const upcoming = payments
    .filter(payment => payment.status === 'upcoming' || payment.status === 'processing' || payment.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    campaigns,
    filter,
    setFilter,
    query,
    setQuery,
    counts,
    shown,
    upNext,
    deliverables,
    stats: {
      live: campaigns.filter(inv => inv.status === 'active').length,
      delivered,
      pieces: allItems.length,
      upcoming,
    },
  };
}
