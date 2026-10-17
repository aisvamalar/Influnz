/**
 * Everything the creator dashboard shows, derived once from the creator context:
 * open invitations, running campaigns with their progress, money by payment state,
 * the short list of things the creator has to do next, and recent activity.
 *
 * Nothing here is invented: every number comes from an invitation, deliverable,
 * negotiation, contract or payment the creator already has.
 */
import { useEffect, useMemo } from 'react';
import { useCreator } from '../CreatorContext';
import { inr, shortDate } from '../format';
import type { Deliverable, Invitation, InvitationStatus, PaymentStatus } from '../types';

const OPEN: InvitationStatus[] = ['new', 'in_negotiation'];
const RUNNING: InvitationStatus[] = ['accepted', 'contract_pending', 'active'];
const SIGNING: InvitationStatus[] = ['accepted', 'contract_pending'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 86400000;

export type ActionKind = 'revise' | 'payment' | 'sign' | 'submit' | 'negotiate' | 'passport';

export interface DashboardAction {
  key: string;
  kind: ActionKind;
  title: string;
  detail: string;
  to: string;
  /** ISO date the action is due, when it has one. */
  due?: string;
}

export interface RunningCampaign {
  inv: Invitation;
  approved: number;
  total: number;
  /** Earliest piece that is not approved yet. */
  next?: Deliverable;
}

export interface MoneySplit {
  paid: number;
  processing: number;
  pending: number;
  expected: number;
  problem: number;
}

export type ActivityKind = 'invite' | 'offer' | 'counter' | 'signed' | 'paid' | 'live';

export interface ActivityItem {
  key: string;
  kind: ActivityKind;
  brand: string;
  /** Short event name for compact lists ("New invitation"). */
  label: string;
  title: string;
  detail: string;
  to: string;
  at: number;
  when: string;
}

const RANK: Record<ActionKind, number> = { revise: 0, payment: 1, sign: 2, submit: 3, negotiate: 4, passport: 5 };

export function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

/** ISO dates and "18 Aug 2026" style dates → epoch ms, or null when the text is not a date. */
export function parseWhen(text: string | undefined): number | null {
  if (!text) return null;
  const dmy = /^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/.exec(text.trim());
  if (dmy) {
    const m = MONTHS.indexOf(dmy[2].slice(0, 1).toUpperCase() + dmy[2].slice(1, 3).toLowerCase());
    return m < 0 ? null : new Date(Number(dmy[3]), m, Number(dmy[1])).getTime();
  }
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return null;
  const ms = Date.parse(text.length === 10 ? `${text}T00:00:00` : text);
  return Number.isNaN(ms) ? null : ms;
}

function whenLabel(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.round(diff / 60000)} min ago`;
  if (diff < DAY) return `${Math.round(diff / 3600000)} h ago`;
  if (diff < 2 * DAY) return 'Yesterday';
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)} days ago`;
  const d = new Date(ms);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function earliest(items: Deliverable[]): string | undefined {
  return items.map(d => d.dueDate).filter(Boolean).sort()[0];
}

function naturalJoin(parts: string[]): string {
  if (parts.length < 2) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

export function useDashboardData() {
  const {
    profile, preferences, invitations, payments, deliverables, ensureDeliverables,
    referrals, negotiations, contracts,
  } = useCreator();

  // New invitations first, then the best fit.
  const open = useMemo(
    () => invitations
      .filter(i => OPEN.includes(i.status))
      .sort((a, b) => Number(b.status === 'new') - Number(a.status === 'new') || b.matchPct - a.matchPct),
    [invitations],
  );
  const fresh = open.filter(i => i.status === 'new');

  const runningInvites = useMemo(() => invitations.filter(i => RUNNING.includes(i.status)), [invitations]);

  useEffect(() => {
    runningInvites.forEach(ensureDeliverables);
  }, [runningInvites, ensureDeliverables]);

  const running: RunningCampaign[] = runningInvites
    .map(inv => {
      const items = deliverables[inv.id] ?? [];
      const total = items.length || inv.brief.deliverableSpecs.reduce((n, s) => n + s.count, 0);
      const next = items
        .filter(d => d.status !== 'approved')
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
      return { inv, approved: items.filter(d => d.status === 'approved').length, total, next };
    })
    .sort((a, b) => (a.next?.dueDate ?? '9999').localeCompare(b.next?.dueDate ?? '9999'));

  const sum = (statuses: PaymentStatus[]) =>
    payments.filter(p => statuses.includes(p.status)).reduce((s, p) => s + p.amount, 0);
  const money: MoneySplit = {
    paid: sum(['paid']),
    processing: sum(['processing']),
    pending: sum(['pending']),
    expected: sum(['upcoming']),
    problem: sum(['failed', 'disputed']),
  };

  // Received per month for the last six months. Expected money has no date yet, so it is never placed in a month.
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const value = payments
      .filter(p => p.status === 'paid')
      .filter(p => {
        const at = parseWhen(p.date);
        if (at === null) return false;
        const pd = new Date(at);
        return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
      })
      .reduce((s, p) => s + p.amount, 0);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: MONTHS[d.getMonth()],
      long: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      value,
      current: i === 5,
    };
  });

  // ── What the creator has to do next ──
  const actions: DashboardAction[] = [];
  let piecesToSend = 0;
  runningInvites.forEach(inv => {
    if (SIGNING.includes(inv.status)) {
      actions.push({
        key: `sign-${inv.id}`,
        kind: 'sign',
        title: 'Review and sign the contract',
        detail: `${inv.brand} · ${inv.brief.title}`,
        to: `/creator/contract/${inv.id}`,
      });
      return;
    }
    const items = deliverables[inv.id] ?? [];
    const revise = items.filter(d => d.status === 'changes_requested');
    const todo = items.filter(d => d.status === 'not_started');
    piecesToSend += revise.length + todo.length;
    if (revise.length) {
      actions.push({
        key: `revise-${inv.id}`,
        kind: 'revise',
        title: revise.length === 1 ? `Revise ${revise[0].label}` : `Revise ${revise.length} pieces`,
        detail: revise[0].revisionNote ?? `${inv.brand} asked for changes`,
        to: `/creator/campaigns/${inv.id}`,
        due: earliest(revise),
      });
    }
    if (todo.length) {
      actions.push({
        key: `submit-${inv.id}`,
        kind: 'submit',
        title: `Submit ${plural(todo.length, 'piece')}`,
        detail: `${inv.brand} · ${inv.brief.title}`,
        to: `/creator/campaigns/${inv.id}`,
        due: earliest(todo),
      });
    }
  });
  open.filter(i => i.status === 'in_negotiation').forEach(inv => {
    actions.push({
      key: `neg-${inv.id}`,
      kind: 'negotiate',
      title: 'Negotiation in progress',
      detail: `${inv.brand} · ${inv.brief.title}`,
      to: `/creator/negotiation/${inv.id}`,
    });
  });
  if (money.problem > 0) {
    actions.push({
      key: 'payment',
      kind: 'payment',
      title: 'A payment needs your attention',
      detail: 'Failed or disputed. Open earnings for details.',
      to: '/creator/earnings',
    });
  }
  if (profile.completionPct < 100) {
    actions.push({
      key: 'passport',
      kind: 'passport',
      title: 'Finish your Creator Passport',
      detail: `${profile.completionPct}% complete · brands see your full profile`,
      to: '/creator/profile',
    });
  }
  actions.sort((a, b) => RANK[a.kind] - RANK[b.kind] || (a.due ?? '9999').localeCompare(b.due ?? '9999'));

  // ── Recent activity, newest first ──
  const activity: ActivityItem[] = [];
  const push = (item: Omit<ActivityItem, 'when'> & { when?: string }) =>
    activity.push({ ...item, when: item.when ?? whenLabel(item.at) });

  open.forEach(inv => {
    const at = parseWhen(inv.brief.publishedAt);
    if (at === null) return;
    push({
      key: `inv-${inv.id}`,
      kind: 'invite',
      brand: inv.brand,
      label: 'New invitation',
      title: `New invitation from ${inv.brand}`,
      detail: `${inv.brief.title} · ${inv.matchPct}% match`,
      to: `/creator/invitations/${inv.id}`,
      at,
    });
  });
  Object.entries(negotiations).forEach(([id, messages]) => {
    const inv = invitations.find(i => i.id === id);
    const last = [...messages].reverse().find(m => m.offer !== undefined && m.sender !== 'system');
    if (!inv || !last || last.offer === undefined) return;
    const at = parseWhen(last.timestamp);
    const fromBrand = last.sender === 'brand';
    push({
      key: `neg-${id}`,
      kind: fromBrand ? 'offer' : 'counter',
      brand: inv.brand,
      label: fromBrand ? 'Offer received' : 'Counter sent',
      title: fromBrand ? `${inv.brand} sent an offer` : last.sender === 'creator_ai' ? 'Your AI agent countered' : 'You sent a counter',
      detail: `${inr(last.offer)} · ${inv.brief.title}`,
      to: `/creator/negotiation/${id}`,
      at: at ?? Date.now(),
      when: at === null ? last.timestamp : undefined,
    });
  });
  Object.values(contracts).forEach(c => {
    const at = parseWhen(c.signedAt);
    if (c.status !== 'signed' || at === null) return;
    push({ key: `sig-${c.id}`, kind: 'signed', brand: c.brand, label: 'Contract signed', title: `Contract signed with ${c.brand}`, detail: 'This version is now locked', to: `/creator/contract/${c.id}`, at });
  });
  runningInvites.forEach(inv => {
    const at = parseWhen(inv.brief.startDate);
    if (inv.status !== 'active' || at === null || at > Date.now()) return;
    push({ key: `live-${inv.id}`, kind: 'live', brand: inv.brand, label: 'Campaign live', title: `${inv.brief.title} is live`, detail: `${inv.brand} · from ${shortDate(inv.brief.startDate)}`, to: `/creator/campaigns/${inv.id}`, at });
  });
  payments.forEach(p => {
    const at = parseWhen(p.date);
    if (p.status !== 'paid' || at === null) return;
    push({ key: `pay-${p.id}`, kind: 'paid', brand: p.brand, label: 'Payment received', title: 'Payment received', detail: `${inr(p.amount)} · ${p.brand}`, to: '/creator/earnings', at });
  });
  activity.sort((a, b) => b.at - a.at);

  // ── One-line summary under the greeting ──
  const toSign = runningInvites.filter(i => SIGNING.includes(i.status)).length;
  const summaryParts = [
    fresh.length ? plural(fresh.length, 'new invitation') : '',
    piecesToSend ? `${plural(piecesToSend, 'piece')} to deliver` : '',
    toSign ? `${plural(toSign, 'contract')} to sign` : '',
  ].filter(Boolean);
  const summary = summaryParts.length
    ? `You have ${naturalJoin(summaryParts)}.`
    : 'You are all caught up. New invitations will show up here.';

  const audience = [
    { label: profile.audience.topCity, kind: 'Top city', pct: profile.audience.topCityPct },
    { label: profile.audience.topLanguage, kind: 'Language', pct: profile.audience.topLanguagePct },
    { label: profile.audience.topAgeRange, kind: 'Age group', pct: profile.audience.topAgePct },
    { label: profile.audience.topCountry, kind: 'Country', pct: profile.audience.topCountryPct },
  ];

  const referralsJoined = referrals.filter(r => r.status === 'joined' || r.status === 'rewarded').length;

  return {
    profile,
    preferences,
    open,
    fresh,
    running,
    piecesToSend,
    money,
    months,
    actions,
    activity,
    recentCount: activity.filter(a => Date.now() - a.at < 7 * DAY).length,
    summary,
    audience,
    referrals: { sent: referrals.length, joined: referralsJoined },
  };
}
