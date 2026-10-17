import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PlatformId } from '../../../components/mobile/PlatformMark';
import { useCreator } from '../CreatorContext';
import type { Invitation, InvitationStatus, MatchBreakdown } from '../types';

/** Accepted invitations move to Campaigns, so this list only has open and closed ones. */
export type Filter = 'all' | 'new' | 'in_negotiation' | 'closed';
export type Sort = 'match' | 'payout' | 'deadline';
export type DetailTab = 'overview' | 'deliverables' | 'guidelines' | 'brand' | 'files';

export const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'in_negotiation', label: 'Countering' },
  { key: 'closed', label: 'Closed' },
];

export const SORTS: Array<{ key: Sort; label: string }> = [
  { key: 'match', label: 'Best match' },
  { key: 'payout', label: 'Highest payout' },
  { key: 'deadline', label: 'Closest deadline' },
];

export const DETAIL_TABS: Array<{ key: DetailTab; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'deliverables', label: 'Deliverables' },
  { key: 'guidelines', label: 'Guidelines' },
  { key: 'brand', label: 'Brand' },
  { key: 'files', label: 'Files' },
];

export const STATUS: Record<InvitationStatus, { label: string; tone: string }> = {
  new: { label: 'New', tone: 'new' },
  in_negotiation: { label: 'Countering', tone: 'neg' },
  accepted: { label: 'Accepted', tone: 'ok' },
  contract_pending: { label: 'Contract pending', tone: 'ok' },
  active: { label: 'Confirmed', tone: 'ok' },
  completed: { label: 'Completed', tone: 'end' },
  declined: { label: 'Declined', tone: 'no' },
  expired: { label: 'Expired', tone: 'no' },
};

const TAKEN: InvitationStatus[] = ['accepted', 'contract_pending', 'active', 'completed'];

export const STEP_NAMES = ['Brief', 'Offer', 'Contract', 'Content', 'Payout'];

export const FIT: Array<[keyof MatchBreakdown, string]> = [
  ['audience', 'Audience'],
  ['location', 'Location'],
  ['category', 'Topic'],
  ['performance', 'Performance'],
  ['rate', 'Rate'],
];

export function matchesFilter(inv: Invitation, filter: Filter): boolean {
  if (TAKEN.includes(inv.status)) return false;
  if (filter === 'all') return true;
  if (filter === 'closed') return inv.status === 'declined' || inv.status === 'expired';
  return inv.status === filter;
}

export function platformId(name: string): PlatformId | null {
  const n = name.toLowerCase();
  if (n.includes('instagram')) return 'instagram';
  if (n.includes('youtube')) return 'youtube';
  if (n.includes('tiktok')) return 'tiktok';
  if (n.includes('facebook')) return 'facebook';
  return null;
}

export function rateOf(inv: Invitation): number {
  return inv.agreedRate ?? inv.proposedRate;
}

export function pieceCount(inv: Invitation): number {
  return inv.brief.deliverableSpecs.reduce((sum, spec) => sum + spec.count, 0);
}

export function earliestDue(inv: Invitation): string {
  return [...inv.brief.deliverableSpecs].map(spec => spec.due).sort()[0] ?? inv.brief.endDate;
}

export function latestDue(inv: Invitation): string {
  const dues = inv.brief.deliverableSpecs.map(spec => spec.due).sort();
  return dues[dues.length - 1] ?? inv.brief.endDate;
}

export function progress(status: InvitationStatus): { index: number; bad: boolean; note: string } {
  switch (status) {
    case 'new': return { index: 0, bad: false, note: 'Review the brief' };
    case 'in_negotiation': return { index: 1, bad: false, note: 'Countering' };
    case 'declined': return { index: 1, bad: true, note: 'Declined' };
    case 'expired': return { index: 1, bad: true, note: 'Expired' };
    case 'accepted': return { index: 1, bad: false, note: 'Offer accepted' };
    case 'contract_pending': return { index: 2, bad: false, note: 'Contract pending' };
    case 'active': return { index: 3, bad: false, note: 'Confirmed' };
    case 'completed': return { index: 4, bad: false, note: 'Completed' };
  }
}

export type StepPlace = 'invitation' | 'deal' | 'contract';

/** Where a step goes. `here` stays on this screen. null is still ahead. */
export function stepHref(inv: Invitation, index: number, place: StepPlace = 'invitation'): string | 'here' | null {
  const here = progress(inv.status).index;
  const contractOpen = inv.status === 'accepted' || inv.status === 'contract_pending' || here >= 2;
  if (index === 0) return place === 'invitation' ? 'here' : `/creator/invitations/${inv.id}#inv-brief`;
  if (index === 1) {
    if (inv.status === 'in_negotiation') return `/creator/negotiation/${inv.id}`;
    return place === 'invitation' ? 'here' : `/creator/invitations/${inv.id}#inv-offer`;
  }
  if (index === 2) {
    if (!contractOpen) return null;
    if (place === 'deal') return `/creator/contract/${inv.id}`;
    if (place === 'contract') return 'here';
    return `/creator/deal/${inv.id}`;
  }
  if (index > here) return null;
  if (index === 3) return `/creator/campaigns/${inv.id}`;
  return inv.status === 'completed' ? '/creator/earnings' : `/creator/campaigns/${inv.id}`;
}

export function useInvitationList() {
  const { invitations: everything } = useCreator();
  // Once accepted, an invitation is worked on from Campaigns.
  const invitations = useMemo(() => everything.filter(inv => !TAKEN.includes(inv.status)), [everything]);
  const moved = everything.length - invitations.length;
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('match');

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map(tab => [tab.key, invitations.filter(inv => matchesFilter(inv, tab.key)).length])) as Record<Filter, number>,
    [invitations],
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = invitations.filter(inv => matchesFilter(inv, filter) && (
      !q || `${inv.brief.title} ${inv.brand} ${inv.category} ${inv.location} ${inv.brief.summary}`.toLowerCase().includes(q)
    ));
    return [...list].sort((a, b) => {
      if (sort === 'payout') return rateOf(b) - rateOf(a);
      if (sort === 'deadline') return earliestDue(a).localeCompare(earliestDue(b));
      return b.matchPct - a.matchPct;
    });
  }, [invitations, filter, query, sort]);

  return { invitations, moved, filter, setFilter, query, setQuery, sort, setSort, counts, shown };
}

export function useInvitationDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { getInvitation, updateInvitation, interests, expressInterest, withdrawInterest } = useCreator();
  const inv = getInvitation(id);
  // An open campaign the brand did not send: the creator can only express interest.
  const browsing = Boolean(inv && !inv.invited);
  const interestAt = inv ? interests[inv.id] : undefined;
  const [toast, setToast] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const accept = () => {
    if (!inv) return;
    updateInvitation(inv.id, { status: 'accepted', agreedRate: rateOf(inv) });
    flash('Offer accepted');
    window.setTimeout(() => {
      document.getElementById('inv-offer')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 40);
  };

  const decline = () => {
    if (!inv) return;
    updateInvitation(inv.id, { status: 'declined' });
    setConfirming(false);
    flash('Invitation declined');
    window.setTimeout(() => navigate('/creator/invitations'), 500);
  };

  const sendInterest = () => {
    if (!inv) return;
    expressInterest(inv.id);
    flash(`Interest sent to ${inv.brand}`);
  };

  const withdraw = () => {
    if (!inv) return;
    withdrawInterest(inv.id);
    flash('Interest withdrawn');
  };

  const share = async () => {
    if (!inv) return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: inv.brief.title, url }); return; } catch { /* dismissed */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash('Link copied');
    } catch {
      flash('Could not copy the link');
    }
  };

  const open = !browsing && (inv?.status === 'new' || inv?.status === 'in_negotiation');
  const next = !inv ? null
    : inv.status === 'accepted' || inv.status === 'contract_pending'
      ? { label: 'Continue', to: `/creator/deal/${inv.id}` }
      : inv.status === 'active' || inv.status === 'completed'
        ? { label: 'Open campaign', to: `/creator/campaigns/${inv.id}` }
        : null;

  return {
    inv,
    toast,
    confirming,
    askDecline: () => setConfirming(true),
    cancelDecline: () => setConfirming(false),
    accept,
    decline,
    share,
    notify: flash,
    open,
    next,
    browsing,
    interestAt,
    sendInterest,
    withdraw,
    go: (to: string) => navigate(to),
    backLabel: browsing ? 'Browse campaigns' : 'All invitations',
    back: () => navigate(browsing ? '/creator/campaigns?view=browse' : '/creator/invitations'),
  };
}

const STEP_HINTS = ['Read the brief', 'See offer', 'Sign contract', 'Submit content', 'Get paid'];

/**
 * The five-step rail (Brief, Offer, Contract, Content, Payout) shared by the invitation,
 * deal room and contract screens. The current step carries a short note instead of its hint.
 */
export function StepRail({
  inv, className, onHere, place = 'invitation',
}: {
  inv: Invitation;
  className: string;
  onHere: (index: number) => void;
  place?: StepPlace;
}) {
  const navigate = useNavigate();
  const step = progress(inv.status);
  const contractOpen = inv.status === 'accepted' || inv.status === 'contract_pending' || step.index >= 2;
  const current = place === 'invitation' ? step.index : Math.max(step.index, contractOpen ? 2 : step.index);
  return (
    <ol className={`cr-steps ${className}`} aria-label="Invitation progress">
      {STEP_NAMES.map((name, index) => {
        const href = stepHref(inv, index, place);
        const state = index < current ? 'is-done' : index === current ? (step.bad ? 'is-bad' : 'is-now') : href ? 'is-open' : 'is-locked';
        return (
          <li key={name} className={state}>
            <button
              type="button"
              disabled={href === null}
              aria-current={index === current ? 'step' : undefined}
              onClick={() => {
                if (href === 'here') onHere(index);
                else if (href) navigate(href);
              }}
            >
              <b aria-hidden="true">{index < current ? <Check size={15} strokeWidth={2.6} /> : String(index + 1).padStart(2, '0')}</b>
              <span className="cr-steps__name">{name}</span>
              {index === current
                ? <span className="cr-steps__note">{step.note}</span>
                : <small className="cr-steps__hint">{STEP_HINTS[index]}</small>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

const INTEREST_STEPS: Array<[string, string]> = [
  ['Interest', 'Tell the brand'],
  ['Brand review', 'Passport and fit'],
  ['Invitation', 'Offer to accept'],
  ['Campaign', 'Make and get paid'],
];

/**
 * The path for an open campaign the creator found under Browse: interest first, then
 * the brand decides whether to send an invitation with the offer.
 */
export function InterestRail({ sent, className }: { sent: boolean; className: string }) {
  const current = sent ? 1 : 0;
  return (
    <ol className={`cr-steps ${className}`} aria-label="How an open campaign works">
      {INTEREST_STEPS.map(([name, hint], index) => (
        <li key={name} className={index < current ? 'is-done' : index === current ? 'is-now' : 'is-locked'}>
          <button type="button" disabled aria-current={index === current ? 'step' : undefined}>
            <b aria-hidden="true">{index < current ? <Check size={15} strokeWidth={2.6} /> : String(index + 1).padStart(2, '0')}</b>
            <span className="cr-steps__name">{name}</span>
            {index === current
              ? <span className="cr-steps__note">{sent ? 'Waiting for the brand' : 'Not sent yet'}</span>
              : <small className="cr-steps__hint">{hint}</small>}
          </button>
        </li>
      ))}
    </ol>
  );
}

/** Do and Don't, as two tinted cards with numbered points. Same block on the invitation and the campaign brief. */
export function DosDonts({ dos, donts }: { dos: string[]; donts: string[] }) {
  if (dos.length === 0 && donts.length === 0) return null;
  return (
    <div className={`proof${dos.length === 0 || donts.length === 0 ? ' proof--one' : ''}`}>
      {dos.length > 0 && (
        <section className="proof__do">
          <h2><span className="proof__mark" aria-hidden="true"><Check size={16} strokeWidth={3} /></span>Do</h2>
          <ol>
            {dos.map((item, index) => (
              <li key={item}><b>{String(index + 1).padStart(2, '0')}</b><span>{item}</span></li>
            ))}
          </ol>
        </section>
      )}
      {donts.length > 0 && (
        <section className="proof__dont">
          <h2><span className="proof__mark" aria-hidden="true"><X size={16} strokeWidth={3} /></span>Don&apos;t</h2>
          <ol>
            {donts.map((item, index) => (
              <li key={item}><b>{String(index + 1).padStart(2, '0')}</b><span>{item}</span></li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

export function pieceBlurb(inv: Invitation): string {
  const counts = new Map<string, number>();
  for (const spec of inv.brief.deliverableSpecs) {
    const words = spec.format.split(' ');
    const kind = words[words.length - 1] || 'Piece';
    counts.set(kind, (counts.get(kind) ?? 0) + spec.count);
  }
  if (counts.size === 0) {
    const n = pieceCount(inv);
    return `${n} piece${n === 1 ? '' : 's'}`;
  }
  return [...counts].map(([kind, n]) => {
    const word = n === 1 ? kind : kind.endsWith('y') ? `${kind.slice(0, -1)}ies` : `${kind}s`;
    return `${n} ${word}`;
  }).join(' · ');
}

export function usageSplit(text: string): { value: string; note: string } {
  const hit = text.match(/(\d+\s*days)/i);
  if (!hit) return { value: text, note: 'Usage' };
  const note = text.replace(hit[1], '').replace(/^[\s·+-]+|[\s·+-]+$/g, '').trim();
  return { value: hit[1].toLowerCase(), note: note || 'Usage rights' };
}

export function FitRing({ value, size = 52 }: { value: number; size?: number }) {
  const radius = 20;
  const turn = 2 * Math.PI * radius;
  const drawn = (Math.max(0, Math.min(100, value)) / 100) * turn;
  return (
    <span className="fit-ring" style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} />
        <circle cx="24" cy="24" r={radius} strokeDasharray={`${drawn} ${turn}`} />
      </svg>
      <b>{value}</b>
    </span>
  );
}
