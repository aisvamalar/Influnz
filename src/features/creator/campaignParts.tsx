/**
 * Building blocks for the creator campaign screens.
 *
 * Each piece mirrors something the business side shows for the same campaign, read from
 * the other direction: the campaign list item, the workspace header, the lifecycle
 * stage tiles, the content-deliverable rows, the deal terms and the compliance checklist.
 */
import type { ReactNode } from 'react';
import {
  ArrowRight, AtSign, BadgeCheck, BadgeIndianRupee, Calendar, CalendarClock, CalendarRange, Check, CircleAlert,
  CircleCheck, CircleCheckBig, Clapperboard, Clock, Eye, FileCheck, Film, Hash, Images, Languages, Lock, MapPin,
  Megaphone, Package, RefreshCw, Ruler, ShieldCheck, Sparkles, Tag, Wallet, MonitorPlay, type LucideIcon,
} from 'lucide-react';
import PlatformMark, { type PlatformId } from '../../components/mobile/PlatformMark';
import { useCreator } from './CreatorContext';
import { DosDonts } from './pages/invitationBits';
import { tierOf } from './campaignMatch';
import { compact, dateRange, daysUntil, dueLabel, inr, shortDate } from './format';
import type { CampaignBrief, Deliverable, DeliverableSpec, DeliverableStatus, Invitation, InvitationStatus, MatchBreakdown } from './types';

// ── Small atoms ───────────────────────────────────────────────────────────────

const PILLS: Record<InvitationStatus, { cls: string; label: string }> = {
  new: { cls: 'new', label: 'New invite' },
  in_negotiation: { cls: 'neg', label: 'Negotiating' },
  accepted: { cls: 'sign', label: 'Accepted' },
  contract_pending: { cls: 'sign', label: 'Contract pending' },
  active: { cls: 'active', label: 'In progress' },
  completed: { cls: 'end', label: 'Completed' },
  declined: { cls: 'off', label: 'Declined' },
  expired: { cls: 'off', label: 'Expired' },
};

export function Pill({ status }: { status: InvitationStatus }) {
  const p = PILLS[status];
  return <span className={`cx-pill cx-pill--${p.cls}`}>{p.label}</span>;
}

const DELIV_PILLS: Record<DeliverableStatus, { cls: string; label: string }> = {
  not_started: { cls: 'off', label: 'Not started' },
  uploaded: { cls: 'neg', label: 'Uploaded' },
  pending_approval: { cls: 'review', label: 'In review' },
  changes_requested: { cls: 'fix', label: 'Changes requested' },
  approved: { cls: 'done', label: 'Approved' },
};

export function DelivPill({ status }: { status: DeliverableStatus }) {
  const p = DELIV_PILLS[status];
  return <span className={`cx-pill cx-pill--${p.cls}`}>{p.label}</span>;
}

const MARKS: Record<string, PlatformId> = {
  instagram: 'instagram', youtube: 'youtube', tiktok: 'tiktok', facebook: 'facebook', 'x (twitter)': 'x', x: 'x',
};

export function PlatformBadge({ label, size = 16 }: { label: string; size?: number }) {
  const id = MARKS[label.toLowerCase()];
  if (id) return <PlatformMark id={id} size={size} />;
  return (
    <span style={{ width: size, height: size, borderRadius: 5, background: '#52525b', color: '#fff', fontSize: size * 0.6, fontWeight: 700, display: 'grid', placeItems: 'center' }}>
      {label[0]}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="cx-eyebrow">{children}</span>;
}

export function pieceCount(specs: DeliverableSpec[]): number {
  return specs.reduce((n, s) => n + s.count, 0);
}

/** Next date the creator has to deliver by, across all deliverables of a campaign. */
export function nextDue(inv: Invitation, items?: Deliverable[]): string | null {
  const open = items?.length
    ? items.filter(d => d.status !== 'approved').map(d => d.dueDate)
    : inv.brief.deliverableSpecs.map(d => d.due);
  return open.length ? [...open].sort()[0] : null;
}

export type DueTone = 'late' | 'soon' | 'ok';

/** Red once overdue, amber inside three days, green while there is time. */
export function dueTone(iso: string): DueTone {
  const n = daysUntil(iso);
  return n < 0 ? 'late' : n <= 3 ? 'soon' : 'ok';
}

export function DueText({ iso }: { iso: string }) {
  return (
    <span className={`cx-due is-${dueTone(iso)}`}>
      <Clock size={13} aria-hidden="true" /> {dueLabel(iso)} · {shortDate(iso)}
    </span>
  );
}

/** Platforms, dates, place and category — the business list item's meta row. */
export function CampaignMeta({ brief }: { brief: CampaignBrief }) {
  return (
    <div className="cx-meta">
      <span>
        {brief.platforms.map(p => <PlatformBadge key={p} label={p} />)}
        {brief.platforms.join(', ')}
      </span>
      <span><Calendar size={15} /> {dateRange(brief.startDate, brief.endDate)}</span>
      <span><MapPin size={15} /> {brief.location}</span>
      <span><Tag size={15} /> {brief.category}</span>
    </div>
  );
}

function progressOf(inv: Invitation, items?: Deliverable[]): { done: number; total: number } {
  if (items?.length) return { done: items.filter(d => d.status === 'approved').length, total: items.length };
  return { done: 0, total: pieceCount(inv.brief.deliverableSpecs) };
}

// ── Campaign list item (business "campaigns" row) ─────────────────────────────

export function CampaignItem({
  inv, items, mode, onOpen,
}: { inv: Invitation; items?: Deliverable[]; mode: 'invite' | 'campaign'; onOpen: () => void }) {
  const { brief } = inv;
  const payout = inv.agreedRate ?? inv.proposedRate;
  const { done, total } = progressOf(inv, items);
  const due = nextDue(inv, items);
  const showProgress = mode === 'campaign';

  return (
    <div
      className="cx-item" role="link" tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      aria-label={`${brief.title} from ${inv.brand}`}
    >
      <div className="cx-item__thumb">
        {inv.image && <img src={inv.image} alt="" loading="lazy" />}
        {inv.selectedForYou && inv.status === 'new' && <span className="cx-ribbon"><Sparkles size={11} /> Top match</span>}
      </div>

      <div className="cx-item__main">
        <div className="cx-item__brand">
          {inv.brand}
          {inv.brandVerified && <BadgeCheck size={14} style={{ color: 'var(--cr-coral-ink)' }} />}
        </div>
        <div className="cx-item__top">
          <h3 className="cx-item__name">{brief.title}</h3>
          <Pill status={inv.status} />
        </div>
        <p className="cx-item__desc">{brief.summary}</p>
        <CampaignMeta brief={brief} />
        <div className="cx-chips">
          {brief.deliverableSpecs.map(s => (
            <span key={s.id} className="cx-chip">{s.count} × {s.format}</span>
          ))}
        </div>
      </div>

      <div className="cx-item__side">
        <div>
          <Eyebrow>{inv.agreedRate ? 'Agreed payout' : 'Your payout'}</Eyebrow>
          <div className="cx-amount">{inr(payout)}</div>
        </div>
        <div className="cx-bar-block" style={{ minWidth: 0 }}>
          {showProgress ? (
            <>
              <div className="cx-bar-row"><span>Delivered</span><span>{done}/{total}</span></div>
              <div className="cx-bar"><i style={{ width: `${total ? (done / total) * 100 : 0}%`, background: done === total && total ? '#2fb463' : '#f0735a' }} /></div>
            </>
          ) : (
            <>
              <div className="cx-bar-row"><span>Match for you</span><span>{inv.matchPct}%</span></div>
              <div className="cx-bar"><i style={{ width: `${inv.matchPct}%`, background: inv.matchPct >= 85 ? '#2fb463' : inv.matchPct >= 65 ? '#f7b733' : '#f43f5e' }} /></div>
            </>
          )}
        </div>
        {due && inv.status !== 'completed' && inv.status !== 'declined' && <DueText iso={due} />}
      </div>
    </div>
  );
}

// ── Header (business workspace header) ───────────────────────────────────────

export function CampaignHero({ inv, items }: { inv: Invitation; items?: Deliverable[] }) {
  const { brief } = inv;
  const payout = inv.agreedRate ?? inv.proposedRate;
  const { done, total } = progressOf(inv, items);
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="cx-hero" aria-labelledby="cx-hero-title">
      <figure className="cx-hero__photo">
        {inv.image ? <img src={inv.image} alt="" /> : <span aria-hidden="true">{inv.brand[0]}</span>}
      </figure>

      <div className="cx-hero__copy">
        <div className="cx-hero__tags">
          <Pill status={inv.status} />
          {brief.platforms.map(p => (
            <span key={p} className="cx-chip"><PlatformBadge label={p} size={14} />{p}</span>
          ))}
          <span className="cx-chip"><Tag size={12} aria-hidden="true" />{brief.category}</span>
        </div>
        <h1 className="cx-hero__title" id="cx-hero-title">{brief.title}</h1>
        <p className="cx-hero__by">
          <span className="cx-hero__brand">
            {inv.brand}
            {inv.brandVerified && <BadgeCheck size={15} aria-label="Verified brand" />}
          </span>
          <span><CalendarRange size={14} aria-hidden="true" />{dateRange(brief.startDate, brief.endDate)}</span>
          <span><MapPin size={14} aria-hidden="true" />{brief.location}</span>
        </p>
        <div className="cx-hero__progress" aria-label={`${done} of ${total} pieces approved`}>
          <div><span>Content approved</span><b>{done}/{total}</b></div>
          <i><em style={{ width: `${pct}%` }} /></i>
        </div>
      </div>

      <div className="cx-hero__pay">
        <span>{inv.agreedRate ? 'Agreed payout' : 'Your payout'}</span>
        <b>{inr(payout)}</b>
        <small>{inv.status === 'completed' ? 'Processing' : 'Expected on approval'}</small>
        {inv.paymentProtected && <em><ShieldCheck size={14} aria-hidden="true" /> Payment protected</em>}
      </div>
    </section>
  );
}

/** "In 7 days", "Today", "2 days overdue" — the due label without its leading "Due". */
function shortDue(iso: string): string {
  const text = dueLabel(iso).replace(/^Due /, '');
  return text[0].toUpperCase() + text.slice(1);
}

/** Four coloured figures under the header: approved, next due, with the brand, revisions. */
export function CampaignKpis({ inv, items }: { inv: Invitation; items?: Deliverable[] }) {
  const list = items ?? [];
  const { done, total } = progressOf(inv, items);
  const due = inv.status === 'completed' ? null : nextDue(inv, items);
  const review = list.filter(d => d.status === 'pending_approval').length;
  const changes = list.filter(d => d.status === 'changes_requested').length;
  const tone = due ? dueTone(due) : 'ok';

  const tiles: Array<{ key: string; icon: LucideIcon; tone: string; label: string; value: string; sub: string }> = [
    { key: 'done', icon: CircleCheckBig, tone: 'green', label: 'Approved', value: `${done}/${total}`, sub: done === total && total ? 'All approved' : `${total - done} to go` },
    {
      key: 'due', icon: CalendarClock, tone: tone === 'late' ? 'red' : tone === 'soon' ? 'amber' : 'teal', label: 'Next due',
      value: due ? shortDate(due) : '—', sub: due ? shortDue(due) : inv.status === 'completed' ? 'Nothing left' : 'Not set yet',
    },
    { key: 'review', icon: Eye, tone: 'blue', label: 'In review', value: String(review), sub: 'With the brand' },
    {
      key: 'rev', icon: RefreshCw, tone: changes ? 'red' : 'violet', label: 'Revisions',
      value: changes ? String(changes) : String(inv.revisions), sub: changes ? 'To fix' : 'Included',
    },
  ];

  return (
    <ul className="cx-figs" aria-label="Campaign at a glance">
      {tiles.map(t => (
        <li key={t.key} className={`cx-fig cx-tone-${t.tone}`}>
          <span className="cx-fig__icon" aria-hidden="true"><t.icon size={18} strokeWidth={2} /></span>
          <span className="cx-fig__txt">
            <small>{t.label}</small>
            <b>{t.value}</b>
            <em>{t.sub}</em>
          </span>
        </li>
      ))}
    </ul>
  );
}

// ── Lifecycle (business "Campaign Operations Overview") ──────────────────────

type StageState = 'done' | 'now' | 'todo';
interface Stage { key: string; label: string; value: string; sub: string; state: StageState }

export function stagesFor(inv: Invitation, items?: Deliverable[]): Stage[] {
  const s = inv.status;
  const payout = inv.agreedRate ?? inv.proposedRate;
  const { done, total } = progressOf(inv, items);
  const closed = s === 'declined' || s === 'expired';
  const past = (...list: InvitationStatus[]) => list.includes(s);

  return [
    {
      key: 'brief', label: '1. Brief', value: 'Campaign brief',
      state: s === 'new' ? 'now' : 'done', sub: s === 'new' ? 'Review it' : 'Reviewed',
    },
    {
      key: 'offer', label: '2. Offer', value: inr(payout),
      state: closed ? 'todo' : past('new') ? 'todo' : past('in_negotiation') ? 'now' : 'done',
      sub: closed ? (s === 'declined' ? 'Declined' : 'Expired') : past('new') ? 'Accept or negotiate' : past('in_negotiation') ? 'AI negotiating' : 'Agreed',
    },
    {
      key: 'contract', label: '3. Contract', value: past('active', 'completed') ? 'Signed' : 'E-sign',
      state: past('accepted', 'contract_pending') ? 'now' : past('active', 'completed') ? 'done' : 'todo',
      sub: past('accepted', 'contract_pending') ? 'Sign to start' : past('active', 'completed') ? 'Signed' : 'After the offer',
    },
    {
      key: 'content', label: '4. Content', value: `${done}/${total} approved`,
      state: past('completed') ? 'done' : past('active') ? 'now' : 'todo',
      sub: past('completed') ? 'All approved' : past('active') ? 'In progress' : `${total} to make`,
    },
    {
      key: 'payout', label: '5. Payout', value: inr(payout),
      state: past('completed') ? 'now' : 'todo',
      sub: past('completed') ? 'Releasing' : 'Payment protected',
    },
  ];
}

export function StageTiles({ inv, items }: { inv: Invitation; items?: Deliverable[] }) {
  return (
    <ol className="cx-steps" aria-label="Campaign progress">
      {stagesFor(inv, items).map((st, i) => (
        <li key={st.key} className={st.state === 'done' ? 'is-done' : st.state === 'now' ? 'is-now' : ''}>
          <b>{String(i + 1).padStart(2, '0')}</b>
          <span>{st.label.replace(/^\d+\.\s*/, '')}</span>
          <em>{st.sub}</em>
        </li>
      ))}
    </ol>
  );
}

// ── Panel ────────────────────────────────────────────────────────────────────

export type PanelTone = 'coral' | 'violet' | 'green' | 'amber' | 'blue' | 'teal' | 'pink' | 'red' | 'grey';

export function Panel({
  icon, title, sub, tail, children, id, tone = 'coral', focus,
}: {
  icon?: ReactNode; title: string; sub?: string; tail?: ReactNode; children: ReactNode; id?: string;
  /** Colour of the icon tile, so panels can be told apart at a glance. */
  tone?: PanelTone;
  /** The one panel that says what to do now. */
  focus?: boolean;
}) {
  return (
    <section className={`cx-panel cx-tone-${tone}${focus ? ' cx-panel--focus' : ''}`} id={id}>
      <div className="cx-panel__head">
        {icon && <span className="cx-panel__icon" aria-hidden="true">{icon}</span>}
        <div className="cx-panel__txt">
          <h2 className="cx-panel__title">{title}</h2>
          {sub && <p className="cx-panel__sub">{sub}</p>}
        </div>
        {tail && <div className="cx-panel__tail">{tail}</div>}
      </div>
      {children}
    </section>
  );
}

// ── Deliverables (business "Content Deliverables") ───────────────────────────

interface RowProps {
  title: string;
  format: string;
  platform: string;
  spec: string;
  due: string;
  count?: number;
  note?: string;
  open?: boolean;
  /** Drives the colour of the row's rail and icon. */
  state?: DeliverableStatus;
  status?: ReactNode;
  flag?: ReactNode;
  children?: ReactNode;
  extra?: ReactNode;
  id?: string;
}

/** Reel, story, video or post, from the brief's format name. */
export function formatIcon(format: string): LucideIcon {
  if (/youtube|video/i.test(format)) return MonitorPlay;
  if (/reel|short|tiktok/i.test(format)) return Clapperboard;
  if (/story|stories|carousel/i.test(format)) return Images;
  return Film;
}

export function DeliverableRow({ title, format, spec, due, note, open, state = 'not_started', status, flag, children, extra, id }: RowProps) {
  const Icon = formatIcon(format);
  const done = state === 'approved';
  return (
    <div className={`cx-deliv is-${state}${open ? ' is-open' : ''}`} id={id}>
      <span className="cx-deliv__icon" aria-hidden="true">{done ? <Check size={18} strokeWidth={2.6} /> : <Icon size={18} strokeWidth={1.9} />}</span>
      <div className="cx-deliv__main">
        <div className="cx-deliv__top">
          <div className="cx-deliv__title">{title}</div>
          {status}
        </div>
        <div className="cx-deliv__sub">{[format, spec].filter(Boolean).join(' · ')}</div>
        {!done && <DueText iso={due} />}
        {note && <div className="cx-deliv__note">{note}</div>}
        {flag && <div className="cx-flag"><CircleAlert size={15} aria-hidden="true" /><span>{flag}</span></div>}
        {children && <div className="cx-deliv__actions">{children}</div>}
      </div>
      {extra}
    </div>
  );
}

/** The brief's deliverables as a read-only list, before the creator has taken the campaign on. */
export function SpecList({ specs }: { specs: DeliverableSpec[] }) {
  return (
    <div className="cx-delivs">
      {specs.map(s => (
        <DeliverableRow
          key={s.id} title={s.title} format={s.format} platform={s.platform} spec={s.spec}
          due={s.due} count={s.count} note={s.notes}
          status={<span className="cx-chip cx-chip--tint">{s.count} {s.count === 1 ? 'piece' : 'pieces'}</span>}
        />
      ))}
    </div>
  );
}

// ── Deal terms ───────────────────────────────────────────────────────────────

export function TermsGrid({ inv }: { inv: Invitation }) {
  const { brief } = inv;
  const pieces = pieceCount(brief.deliverableSpecs);
  const lastDue = brief.deliverableSpecs.map(d => d.due).sort().pop();
  const items: Array<{ k: string; v: string; icon: LucideIcon; wide?: boolean }> = [
    { k: inv.agreedRate ? 'Agreed payout' : 'Your payout', v: inr(inv.agreedRate ?? inv.proposedRate), icon: BadgeIndianRupee },
    { k: 'Deliverables', v: `${pieces} ${pieces === 1 ? 'piece' : 'pieces'}`, icon: Clapperboard },
    { k: 'Final delivery', v: lastDue ? shortDate(lastDue) : 'On agreement', icon: Calendar },
    { k: 'Campaign window', v: dateRange(brief.startDate, brief.endDate), icon: CalendarRange },
    { k: 'Exclusivity', v: `${inv.exclusivityDays} days`, icon: Lock },
    { k: 'Revisions', v: `${inv.revisions} included`, icon: RefreshCw },
    { k: 'Usage rights', v: inv.usageRights, icon: ShieldCheck, wide: true },
    { k: 'Payment terms', v: brief.paymentTerms, icon: Wallet, wide: true },
  ];
  return (
    <div className="cx-terms">
      {items.map(t => (
        <div key={t.k} className={`cx-term${t.wide ? ' cx-term--wide' : ''}`}>
          <span className="cx-term__icon" aria-hidden="true"><t.icon size={15} strokeWidth={2} /></span>
          <div>
            <div className="cx-term__k">{t.k}</div>
            <div className="cx-term__v">{t.v}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── How you get paid ─────────────────────────────────────────────────────────

export function PayoutSchedule({ inv }: { inv: Invitation }) {
  const payout = inv.agreedRate ?? inv.proposedRate;
  const done = inv.status === 'completed';
  const rows = inv.brief.milestones.length
    ? inv.brief.milestones
    : [{ name: 'On approval of all content', date: '', pct: 100 }];
  return (
    <>
      <div className="cx-paybar" aria-hidden="true">
        {rows.map((m, i) => <i key={m.name} style={{ flexGrow: m.pct }} className={`is-${i % 2 ? 'b' : 'a'}`} />)}
      </div>
      <ul className="cx-pay">
        {rows.map((m, i) => (
          <li key={m.name}>
            <span className={`cx-pay__dot is-${i % 2 ? 'b' : 'a'}`} />
            <div>
              <div className="cx-pay__name">{m.name}</div>
              <div className="cx-pay__date">{m.date ? shortDate(m.date) : 'After the brand approves'} · {m.pct}%</div>
            </div>
            <div className="cx-pay__amt">
              {inr(Math.round((payout * m.pct) / 100))}
              <small className={done ? 'is-processing' : 'is-expected'}>{done ? 'Processing' : 'Expected'}</small>
            </div>
          </li>
        ))}
      </ul>
      <p className="cx-pay__total"><span>Total</span><b>{inr(payout)}</b></p>
    </>
  );
}

// ── Match (what the business sees as "fit", now explained to the creator) ────

const FIT_LABEL: Record<keyof MatchBreakdown, string> = {
  audience: 'Audience fit', location: 'Location', category: 'Topic match', performance: 'Performance', rate: 'Rate vs yours',
};

export function MatchPanel({ inv }: { inv: Invitation }) {
  return (
    <>
      <div className="cx-match">
        <div className="cx-ring" style={{ ['--pct' as string]: inv.matchPct }}>
          <span>{inv.matchPct}<small>%</small></span>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#18181b' }}>
            {inv.matchPct >= 85 ? 'Strong match' : inv.matchPct >= 65 ? 'Good match' : 'Partial match'}
          </div>
          <div className="cx-muted" style={{ fontSize: '0.8125rem', marginTop: 2 }}>Scored against your profile and preferences.</div>
        </div>
      </div>
      <div className="cx-fit">
        {(Object.keys(FIT_LABEL) as Array<keyof MatchBreakdown>).map(k => (
          <div key={k} className="cx-fit__row">
            <span>{FIT_LABEL[k]}</span>
            <div className="cx-bar"><i style={{ width: `${inv.matchBreakdown[k]}%`, background: inv.matchBreakdown[k] >= 80 ? '#2fb463' : inv.matchBreakdown[k] >= 60 ? '#f7b733' : '#f43f5e' }} /></div>
            <b>{inv.matchBreakdown[k]}%</b>
          </div>
        ))}
      </div>
      <p className="cx-sub">Why this was sent to you</p>
      <ul className="cx-checks">
        {inv.whySelected.map(w => <li key={w} className="is-ok"><CircleCheck size={16} />{w}</li>)}
      </ul>
    </>
  );
}

// ── Brief ────────────────────────────────────────────────────────────────────

export function BriefPanel({ brief }: { brief: CampaignBrief }) {
  const hasGuide = brief.guidelines || brief.hashtags.length || brief.mentions.length;
  return (
    <>
      <p className="cx-sub">Campaign goal</p>
      <p className="cx-text">{brief.summary}</p>
      <div className="cx-chips" style={{ marginTop: 10 }}>
        <span className="cx-chip cx-chip--tint">{brief.objective}</span>
        {brief.languages.map(l => <span key={l} className="cx-chip"><Languages size={12} /> {l}</span>)}
      </div>

      {hasGuide && (
        <>
          {brief.guidelines && <><p className="cx-sub">Creative direction</p><p className="cx-text">{brief.guidelines}</p></>}
          {brief.mentions.length > 0 && (
            <>
              <p className="cx-sub">Tag these accounts</p>
              <div className="cx-chips">{brief.mentions.map(m => <span key={m} className="cx-chip"><AtSign size={12} />{m.replace(/^@/, '')}</span>)}</div>
            </>
          )}
          {brief.hashtags.length > 0 && (
            <>
              <p className="cx-sub">Use these hashtags</p>
              <div className="cx-chips">{brief.hashtags.map(h => <span key={h} className="cx-chip"><Hash size={12} />{h.replace(/^#/, '')}</span>)}</div>
            </>
          )}
        </>
      )}

      <DosDonts dos={brief.dos} donts={brief.donts} />
    </>
  );
}

/** An icon for each kind of compliance check, so the list reads at a glance. */
function checkIcon(label: string): LucideIcon {
  if (/tag|@/i.test(label)) return AtSign;
  if (/disclosure|#ad|paid/i.test(label)) return Megaphone;
  if (/product/i.test(label)) return Package;
  if (/claim|mislead/i.test(label)) return ShieldCheck;
  if (/format|duration|length/i.test(label)) return Ruler;
  return FileCheck;
}

/** What the business' AI compliance check looks for — the creator's pre-flight list. */
export function ChecklistPanel({ brief }: { brief: CampaignBrief }) {
  return (
    <ul className="cx-checkgrid">
      {brief.checklist.map(c => {
        const Icon = checkIcon(c);
        return <li key={c}><span aria-hidden="true"><Icon size={15} strokeWidth={2} /></span>{c}</li>;
      })}
    </ul>
  );
}

/** What to hand in: each format from the brief with its spec. */
export function SpecRequirements({ specs }: { specs: DeliverableSpec[] }) {
  return (
    <ul className="cx-reqs">
      {specs.map(s => {
        const Icon = formatIcon(s.format);
        return (
          <li key={s.id}>
            <span className="cx-reqs__icon" aria-hidden="true"><Icon size={17} strokeWidth={1.9} /></span>
            <span className="cx-reqs__txt">
              <b>{s.count} × {s.format}</b>
              {s.spec && <small>{s.spec}</small>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Deliverables and payment milestones on one dated line, each coloured by where it stands. */
export function TimelineList({ inv, items }: { inv: Invitation; items: Deliverable[] }) {
  const firstOpen = items.filter(d => d.status !== 'approved').sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const rows: Array<{ key: string; date: string; label: string; sub: string; state: string; icon: LucideIcon }> = [
    ...items.map(d => {
      const done = d.status === 'approved';
      const tone = dueTone(d.dueDate);
      return {
        key: d.id, date: d.dueDate, label: d.label,
        sub: done ? 'Approved' : d.status === 'pending_approval' ? `With ${inv.brand}` : dueLabel(d.dueDate),
        state: done ? 'done' : tone === 'late' ? 'late' : d === firstOpen ? 'next' : 'todo',
        icon: done ? Check : formatIcon(d.format ?? ''),
      };
    }),
    ...inv.brief.milestones.filter(m => m.date).map(m => ({
      key: `pay-${m.name}`, date: m.date, label: m.name, sub: `${m.pct}% of payout`, state: 'pay', icon: Wallet,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  if (!rows.length) return <p className="cx-text cx-muted">Dates appear once the contract is signed.</p>;
  return (
    <ol className="cx-tl">
      {rows.map(r => {
        const [, m, d] = r.date.split('-').map(Number);
        return (
          <li key={r.key} className={`is-${r.state}`}>
            <span className="cx-tl__date"><b>{d}</b>{MONTHS[m - 1]}</span>
            <span className="cx-tl__dot" aria-hidden="true"><r.icon size={13} strokeWidth={2.4} /></span>
            <span className="cx-tl__txt"><b>{r.label}</b><small>{r.sub}</small></span>
          </li>
        );
      })}
    </ol>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── Who the brand is looking for, checked against this creator ───────────────

export function EligibilityPanel({ brief }: { brief: CampaignBrief }) {
  const { profile, preferences } = useCreator();
  const e = brief.eligibility;
  const tier = tierOf(profile.followers);
  const rows: Array<{ ok: boolean; label: string; value: string }> = [];

  if (e.tiers.length) {
    rows.push({ ok: e.tiers.map(t => t.toLowerCase()).includes(tier), label: 'Creator size', value: `${e.tiers.join(' / ')}` });
  }
  if (e.minFollowers || e.maxFollowers) {
    const ok = profile.followers >= e.minFollowers && (!e.maxFollowers || profile.followers <= e.maxFollowers);
    rows.push({ ok, label: 'Followers', value: `${compact(e.minFollowers)} – ${e.maxFollowers ? compact(e.maxFollowers) : 'any'}` });
  }
  if (e.minEngagement) rows.push({ ok: profile.engagement >= e.minEngagement, label: 'Engagement', value: `${e.minEngagement}%+` });
  if (e.languages.length) {
    const mine = preferences.languages.map(l => l.toLowerCase());
    rows.push({ ok: e.languages.some(l => mine.includes(l.toLowerCase())), label: 'Language', value: e.languages.join(', ') });
  }
  if (!rows.length) return <p className="cx-text cx-muted">The brand has not set any requirements. Every creator can apply.</p>;

  return (
    <ul className="cx-elig">
      {rows.map(r => (
        <li key={r.label} className={r.ok ? 'is-ok' : 'is-no'}>
          {r.ok ? <CircleCheck size={16} /> : <CircleAlert size={16} />}
          <span>{r.label}</span>
          <b>{r.value}</b>
        </li>
      ))}
    </ul>
  );
}

export function SeeAll({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="cr-btn cr-btn--ghost cr-btn--sm" onClick={onClick}>
      {children} <ArrowRight size={14} />
    </button>
  );
}

