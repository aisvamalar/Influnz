import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PlatformId } from '../../../components/mobile/PlatformMark';
import { useCreator } from '../CreatorContext';
import { dateRange, inr, shortDate } from '../format';
import type { Invitation, InvitationStatus, MatchBreakdown } from '../types';

export type Filter = 'all' | 'new' | 'in_negotiation' | 'accepted' | 'closed';
export type Sort = 'match' | 'payout' | 'deadline';
export type DetailTab = 'overview' | 'deliverables' | 'guidelines' | 'brand' | 'files';

export const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'in_negotiation', label: 'Countering' },
  { key: 'accepted', label: 'Accepted' },
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
  if (filter === 'all') return true;
  if (filter === 'accepted') return TAKEN.includes(inv.status);
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
  return [...inv.brief.deliverableSpecs].map(spec => spec.due).sort().at(-1) ?? inv.brief.endDate;
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
  const { invitations } = useCreator();
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

  return { invitations, filter, setFilter, query, setQuery, sort, setSort, counts, shown };
}

export function useInvitationDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { getInvitation, updateInvitation } = useCreator();
  const inv = getInvitation(id);
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

  const open = inv?.status === 'new' || inv?.status === 'in_negotiation';
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
    open,
    next,
    go: (to: string) => navigate(to),
    back: () => navigate('/creator/invitations'),
  };
}

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
    <ol className={className} aria-label="Invitation progress">
      {STEP_NAMES.map((name, index) => {
        const href = stepHref(inv, index, place);
        const state = index < current ? 'is-done' : index === current ? (step.bad ? 'is-bad' : 'is-now') : href ? 'is-open' : '';
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
              <b>{String(index + 1).padStart(2, '0')}</b>
              <span>{name}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** A proof sheet: Do is marked, Don't is struck. Same block on the invitation and the campaign brief. */
export function DosDonts({ dos, donts }: { dos: string[]; donts: string[] }) {
  if (dos.length === 0 && donts.length === 0) return null;
  return (
    <div className={`proof${dos.length === 0 || donts.length === 0 ? ' proof--one' : ''}`}>
      {dos.length > 0 && (
        <section className="proof__do">
          <h2><span>Do</span></h2>
          <ol>
            {dos.map((item, index) => (
              <li key={item}><b>{String(index + 1).padStart(2, '0')}</b><span>{item}</span></li>
            ))}
          </ol>
        </section>
      )}
      {donts.length > 0 && (
        <section className="proof__dont">
          <h2><span>Don&apos;t</span></h2>
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

export function WhyBlock({ inv }: { inv: Invitation }) {
  if (inv.whySelected.length === 0) return null;
  return (
    <section className="idp-why">
      <h2>Why this fits you</h2>
      <ol>
        {inv.whySelected.map((reason, index) => (
          <li key={reason}><span>{String(index + 1).padStart(2, '0')}</span>{reason}</li>
        ))}
      </ol>
    </section>
  );
}

export function FitBlock({ inv }: { inv: Invitation }) {
  return (
    <section className="idp-fit">
      <div className="idp-fithead">
        <h2>Campaign fit</h2>
        <strong>{inv.matchPct}</strong>
      </div>
      <p>Scored against your profile and preferences.</p>
      {FIT.map(([key, label]) => (
        <div key={key} className="idp-bar">
          <span>{label}</span>
          <i><b style={{ width: `${inv.matchBreakdown[key]}%` }} /></i>
          <em>{inv.matchBreakdown[key]}</em>
        </div>
      ))}
    </section>
  );
}

export function TermsList({ inv }: { inv: Invitation }) {
  const { brief } = inv;
  const pieces = pieceCount(inv);
  return (
    <dl className="idp-terms">
      <div><dt>Payout</dt><dd>{inr(rateOf(inv))}</dd></div>
      <div><dt>Deliverables</dt><dd>{pieces} piece{pieces === 1 ? '' : 's'}</dd></div>
      <div><dt>Window</dt><dd>{dateRange(brief.startDate, brief.endDate)}</dd></div>
      <div><dt>Final delivery</dt><dd>{shortDate(latestDue(inv))}</dd></div>
      <div><dt>Usage rights</dt><dd>{inv.usageRights}</dd></div>
      <div><dt>Exclusivity</dt><dd>{inv.exclusivityDays} days</dd></div>
      <div><dt>Revisions</dt><dd>{inv.revisions} included</dd></div>
    </dl>
  );
}

export function DetailPanels({ inv, tab }: { inv: Invitation; tab: DetailTab }) {
  if (tab === 'overview') return <Overview inv={inv} />;
  if (tab === 'deliverables') return <Deliverables inv={inv} />;
  if (tab === 'guidelines') return <Guidelines inv={inv} />;
  if (tab === 'brand') return <Brand inv={inv} />;
  return (
    <section className="idp">
      <div className="idp-sec">
        <h2>Files</h2>
        <p>No files from the brand yet. The brief, hashtags and deliverables are on the other tabs.</p>
      </div>
    </section>
  );
}

function Overview({ inv }: { inv: Invitation }) {
  const { brief } = inv;
  const mentions = brief.mentions ?? [];
  const tags = brief.hashtags ?? [];
  const marks = [
    ...mentions.map(mention => `@${mention.replace(/^@/, '')}`),
    ...tags.map(tag => `#${tag.replace(/^#/, '')}`),
  ];
  return (
    <div className="idp">
      <section className="idp-sec">
        <h2>The brief</h2>
        <p className="idp-quote">{brief.objective || inv.objective}</p>
        <p>{brief.summary}</p>
      </section>
      {brief.guidelines && (
        <section className="idp-sec">
          <h2>Direction</h2>
          <p>{brief.guidelines}</p>
        </section>
      )}
      {marks.length > 0 && (
        <section className="idp-sec">
          <h2>On the post</h2>
          <p className="idp-marks">{marks.join('  ·  ')}</p>
        </section>
      )}
      <DosDonts dos={brief.dos} donts={brief.donts} />
    </div>
  );
}

function Deliverables({ inv }: { inv: Invitation }) {
  const specs = inv.brief.deliverableSpecs;
  return (
    <div className="idp">
      <section className="idp-sec">
        <h2>What you will deliver</h2>
        <p>{pieceCount(inv)} piece{pieceCount(inv) === 1 ? '' : 's'} for {inv.brief.title}.</p>
      </section>
      {specs.length === 0 ? (
        <p className="idp-quiet">The brand has not listed deliverables yet.</p>
      ) : (
        <ol className="idp-work">
          {specs.map((spec, index) => (
            <li key={spec.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong>{spec.title}</strong>
                {spec.notes && <p>{spec.notes}</p>}
                <small>
                  {spec.count}× {spec.format}
                  {spec.spec ? ` · ${spec.spec}` : ''}
                  {` · Due ${shortDate(spec.due)}`}
                </small>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Guidelines({ inv }: { inv: Invitation }) {
  return (
    <section className="idp">
      <div className="idp-sec">
        <h2>Before you submit</h2>
        <p>The check looks for these. A failed check is shown exactly, before you send the work.</p>
      </div>
      {inv.brief.checklist.length === 0 ? (
        <p className="idp-quiet">No checklist on this brief yet.</p>
      ) : (
        <ol className="idp-check">
          {inv.brief.checklist.map((item, index) => (
            <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function pieceBlurb(inv: Invitation): string {
  const counts = new Map<string, number>();
  for (const spec of inv.brief.deliverableSpecs) {
    const kind = spec.format.split(' ').at(-1) || 'Piece';
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

function Brand({ inv }: { inv: Invitation }) {
  const { brief } = inv;
  return (
    <section className="idp">
      <header className="idp-sec">
        <h2>{inv.category}</h2>
        <p className="idp-name">{inv.brand}</p>
      </header>
      <dl className="idp-facts">
        <div><dt>Place</dt><dd>{brief.brandCity || inv.location}</dd></div>
        <div><dt>Languages</dt><dd>{brief.languages.join(', ') || '—'}</dd></div>
        {brief.paymentTerms && <div><dt>Payment</dt><dd>{brief.paymentTerms}</dd></div>}
        <div><dt>Window</dt><dd>{dateRange(brief.startDate, brief.endDate)}</dd></div>
      </dl>
    </section>
  );
}
