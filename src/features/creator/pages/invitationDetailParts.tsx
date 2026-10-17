/**
 * Building blocks for the invitation detail screen (prefix: ivd), shared by the desktop
 * and phone layouts. Behaviour (accept, counter, decline, share) stays in
 * useInvitationDetail; these pieces only present the invitation.
 */
import type { ReactNode } from 'react';
import {
  BadgeCheck, BadgeIndianRupee, Calendar, CalendarCheck, CalendarDays, CalendarRange, Camera,
  ChartColumnIncreasing, Check, Copy, FileText, FolderOpen, Languages, Layers, ListChecks, Lock, MapPin,
  RefreshCw, ShieldCheck, Sparkles, Star, Tag, Target, Wallet, type LucideIcon,
} from 'lucide-react';
import PlatformMark from '../../../components/mobile/PlatformMark';
import { dateRange, inr, shortDate } from '../format';
import type { Invitation } from '../types';
import { DosDonts, FIT, latestDue, pieceCount, platformId, rateOf, type DetailTab } from './invitationBits';

// ── Small pieces ──────────────────────────────────────────────────────────

export function BrandDot({ name, size = 26 }: { name: string; size?: number }) {
  return (
    <span className="ivd-branddot" style={{ width: size, height: size, fontSize: size * 0.46 }} aria-hidden="true">
      {name.trim()[0]?.toUpperCase() ?? '?'}
    </span>
  );
}

export function Chips({ inv, light, interested }: { inv: Invitation; light?: boolean; interested?: boolean }) {
  const label = !inv.invited ? (interested ? 'Interest sent' : 'Open campaign')
    : inv.status === 'new' ? 'New' : inv.status === 'in_negotiation' ? 'Countering'
      : inv.status === 'declined' ? 'Declined' : inv.status === 'expired' ? 'Expired' : 'Accepted';
  const closed = inv.status === 'declined' || inv.status === 'expired';
  return (
    <div className={`ivd-chips${light ? ' is-light' : ''}`}>
      <span className={`ivd-chip ivd-chip--status${closed ? ' is-closed' : ''}${!inv.invited && interested ? ' is-sent' : ''}`}>{label}</span>
      <span className="ivd-chip"><Target size={13} strokeWidth={2.2} aria-hidden="true" />{inv.matchPct}% fit</span>
      <span className="ivd-chip"><Tag size={13} strokeWidth={2.2} aria-hidden="true" />{inv.category}</span>
    </div>
  );
}

export function MetaLine({ inv }: { inv: Invitation }) {
  const platform = inv.brief.platforms[0] || 'Any platform';
  const pid = platformId(platform);
  return (
    <>
      <p className="ivd-meta">
        <span className="ivd-meta__brand">
          <BrandDot name={inv.brand} size={24} />
          {inv.brand}
          {inv.brandVerified && <BadgeCheck size={15} aria-label="Verified brand" />}
        </span>
        <span><MapPin size={15} strokeWidth={2} aria-hidden="true" />{inv.location}</span>
        <span>{pid ? <PlatformMark id={pid} size={16} /> : <Camera size={15} aria-hidden="true" />}{platform}</span>
      </p>
      <p className="ivd-meta ivd-meta--dates">
        <span><CalendarDays size={15} strokeWidth={2} aria-hidden="true" />{dateRange(inv.brief.startDate, inv.brief.endDate)}</span>
      </p>
    </>
  );
}

/** Pieces, dates and payout in three quick tiles (phone). */
export function QuickFacts({ inv }: { inv: Invitation }) {
  const pieces = pieceCount(inv);
  return (
    <ul className="ivd-facts">
      <li><Layers size={20} strokeWidth={1.8} aria-hidden="true" /><b>{pieces} piece{pieces === 1 ? '' : 's'}</b></li>
      <li><Calendar size={20} strokeWidth={1.8} aria-hidden="true" /><b>{dateRange(inv.brief.startDate, inv.brief.endDate)}</b></li>
      <li><BadgeIndianRupee size={20} strokeWidth={1.8} aria-hidden="true" /><b>{inr(rateOf(inv))}</b></li>
    </ul>
  );
}

function SecHead({ icon: Icon, title, lead }: { icon: LucideIcon; title: string; lead?: boolean }) {
  return (
    <div className="ivd-sechead">
      <span className="ivd-sechead__icon" aria-hidden="true"><Icon size={18} strokeWidth={1.9} /></span>
      <h2 className={lead ? 'is-lead' : undefined}>{title}</h2>
    </div>
  );
}

// ── Why this fits you ─────────────────────────────────────────────────────

function reasonIcon(text: string): LucideIcon {
  const t = text.toLowerCase();
  if (t.includes('topic')) return Star;
  if (t.includes('based in') || t.includes('where this')) return MapPin;
  if (t.includes('post on')) return Camera;
  if (t.includes('create in') || t.includes('language')) return Languages;
  if (t.includes('engagement')) return ChartColumnIncreasing;
  if (t.includes('payout') || t.includes('rate')) return BadgeIndianRupee;
  return Sparkles;
}

export function WhyFits({ inv }: { inv: Invitation }) {
  if (inv.whySelected.length === 0) return null;
  return (
    <section className="ivd-why" aria-labelledby="ivd-why-title">
      <div className="ivd-sechead">
        <span className="ivd-sechead__icon" aria-hidden="true"><Sparkles size={18} strokeWidth={1.9} /></span>
        <h2 id="ivd-why-title">Why this fits you</h2>
      </div>
      <ul className="ivd-why__list">
        {inv.whySelected.map(reason => {
          const Icon = reasonIcon(reason);
          return (
            <li key={reason}>
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              <span>{reason}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ── Right column ──────────────────────────────────────────────────────────

export function DealTerms({ inv }: { inv: Invitation }) {
  const pieces = pieceCount(inv);
  const rows: Array<[LucideIcon, string, ReactNode]> = [
    [Wallet, inv.invited ? 'Payout' : 'Expected payout', inr(rateOf(inv))],
    [Layers, 'Deliverables', `${pieces} piece${pieces === 1 ? '' : 's'}`],
    [CalendarRange, 'Window', dateRange(inv.brief.startDate, inv.brief.endDate)],
    [CalendarCheck, 'Final delivery', shortDate(latestDue(inv))],
    [ShieldCheck, 'Usage rights', inv.usageRights],
    [Lock, 'Exclusivity', `${inv.exclusivityDays} days`],
    [RefreshCw, 'Revisions', `${inv.revisions} included`],
  ];
  return (
    <section className="ivd-box ivd-terms" aria-labelledby="ivd-terms-title">
      <h2 id="ivd-terms-title">{inv.invited ? 'Deal terms' : 'Campaign terms'}</h2>
      <dl>
        {rows.map(([Icon, label, value]) => (
          <div key={label}>
            <dt><Icon size={17} strokeWidth={1.8} aria-hidden="true" />{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function FitDial({ value }: { value: number }) {
  const size = 84;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ivd-dial" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Campaign fit ${value} out of 100`}>
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="ivd-dial__track" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        className="ivd-dial__value"
        strokeDasharray={`${(Math.min(100, value) / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" className="ivd-dial__num">{value}</text>
      <text x="50%" y="68%" textAnchor="middle" dominantBaseline="central" className="ivd-dial__of">/100</text>
    </svg>
  );
}

export function CampaignFit({ inv }: { inv: Invitation }) {
  return (
    <section className="ivd-box ivd-fit" aria-labelledby="ivd-fit-title">
      <h2 id="ivd-fit-title">Campaign fit</h2>
      <div className="ivd-fit__top">
        <FitDial value={inv.matchPct} />
        <p>Scored against your profile and preferences.</p>
      </div>
      <ul className="ivd-fit__bars">
        {FIT.map(([key, label]) => (
          <li key={key}>
            <span>{label}</span>
            <i aria-hidden="true"><b style={{ width: `${inv.matchBreakdown[key]}%` }} /></i>
            <em>{inv.matchBreakdown[key]}</em>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Tab contents ──────────────────────────────────────────────────────────

export function DetailContent({ inv, tab, onCopy, compact }: {
  inv: Invitation;
  tab: DetailTab;
  onCopy: (text: string) => void;
  compact?: boolean;
}) {
  if (tab === 'overview') return <Overview inv={inv} onCopy={onCopy} compact={compact} />;
  if (tab === 'deliverables') return <Deliverables inv={inv} />;
  if (tab === 'guidelines') return <Guidelines inv={inv} />;
  if (tab === 'brand') return <Brand inv={inv} />;
  return (
    <section className="ivd-box ivd-empty">
      <FolderOpen size={22} aria-hidden="true" />
      <strong>No files yet</strong>
      <p>The brand has not shared files. The brief, hashtags and deliverables are on the other tabs.</p>
    </section>
  );
}

function Overview({ inv, onCopy, compact }: { inv: Invitation; onCopy: (text: string) => void; compact?: boolean }) {
  const { brief } = inv;
  const marks = [
    ...(brief.mentions ?? []).map(m => `@${m.replace(/^@/, '')}`),
    ...(brief.hashtags ?? []).map(t => `#${t.replace(/^#/, '')}`),
  ];
  return (
    <div className="ivd-overview">
      <section className={`ivd-brief${inv.image && !compact ? ' has-image' : ''}`} aria-labelledby="ivd-brief-title">
        <div className="ivd-brief__text">
          <div className="ivd-sechead">
            <span className="ivd-sechead__icon" aria-hidden="true"><FileText size={18} strokeWidth={1.9} /></span>
            <h2 id="ivd-brief-title" className="is-lead">The brief</h2>
          </div>
          <h3>{brief.objective || inv.objective}</h3>
          <p>{brief.summary}</p>
          {brief.guidelines && (
            <>
              <h4>Direction</h4>
              <p>{brief.guidelines}</p>
            </>
          )}
          {marks.length > 0 && (
            <>
              <h4>On the post</h4>
              <div className="ivd-marks">
                <span className="ivd-marks__list">{marks.map(m => <span key={m}>{m}</span>)}</span>
                <button type="button" onClick={() => onCopy(marks.join(' '))} aria-label="Copy tags and mentions" title="Copy">
                  <Copy size={16} />
                </button>
              </div>
            </>
          )}
        </div>
        {inv.image && !compact && (
          <figure className="ivd-brief__img"><img src={inv.image} alt="" loading="lazy" /></figure>
        )}
      </section>
      <DosDonts dos={brief.dos} donts={brief.donts} />
      <WhyFits inv={inv} />
    </div>
  );
}

function Deliverables({ inv }: { inv: Invitation }) {
  const specs = inv.brief.deliverableSpecs;
  const pieces = pieceCount(inv);
  return (
    <section className="ivd-box ivd-tabbox">
      <SecHead icon={Layers} title="What you will deliver" />
      <p className="ivd-lead">{pieces} piece{pieces === 1 ? '' : 's'} for {inv.brief.title}.</p>
      {specs.length === 0 ? (
        <p className="ivd-quiet">The brand has not listed deliverables yet.</p>
      ) : (
        <ol className="ivd-work">
          {specs.map((spec, index) => (
            <li key={spec.id}>
              <b>{String(index + 1).padStart(2, '0')}</b>
              <div>
                <strong>{spec.title}</strong>
                {spec.notes && <p>{spec.notes}</p>}
                <span className="ivd-work__tags">
                  <span>{spec.count} × {spec.format}</span>
                  {spec.spec && <span>{spec.spec}</span>}
                  <span>Due {shortDate(spec.due)}</span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Guidelines({ inv }: { inv: Invitation }) {
  return (
    <section className="ivd-box ivd-tabbox">
      <SecHead icon={ListChecks} title="Before you submit" />
      <p className="ivd-lead">The check looks for these. A failed check is shown exactly, before you send the work.</p>
      {inv.brief.checklist.length === 0 ? (
        <p className="ivd-quiet">No checklist on this brief yet.</p>
      ) : (
        <ul className="ivd-checklist">
          {inv.brief.checklist.map(item => (
            <li key={item}><span aria-hidden="true"><Check size={12} strokeWidth={3} /></span>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Brand({ inv }: { inv: Invitation }) {
  const { brief } = inv;
  const rows: Array<[string, string]> = [
    ['Category', inv.category],
    ['Based in', brief.brandCity || inv.location],
    ['Languages', brief.languages.join(', ') || '—'],
    ['Window', dateRange(brief.startDate, brief.endDate)],
    ...(brief.paymentTerms ? [['Payment', brief.paymentTerms] as [string, string]] : []),
  ];
  return (
    <section className="ivd-box ivd-tabbox">
      <div className="ivd-brandhead">
        <BrandDot name={inv.brand} size={44} />
        <div>
          <strong>{inv.brand}{inv.brandVerified && <BadgeCheck size={16} aria-label="Verified brand" />}</strong>
          <span>{inv.brandVerified ? 'Verified business on Influnz' : 'Business on Influnz'}</span>
        </div>
      </div>
      <dl className="ivd-facts-list">
        {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </section>
  );
}
