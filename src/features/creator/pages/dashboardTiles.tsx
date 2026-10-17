/** The insight row under the workflow: earnings, Creator Score, next deadline and recent updates. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDownRight, ArrowUpRight, CalendarCheck, CalendarClock, CalendarDays, ChartColumnIncreasing, ChevronDown, Crown, Inbox } from 'lucide-react';
import { compact, dueLabel, inr } from '../format';
import { CREATOR_SCORE, scoreFactors, tierFor, type ScoreFactor } from '../creatorScore';
import type { CreatorProfile } from '../types';
import { BrandMark, Chip, EmptyNote, ScoreRing, TileHead, dueTone } from './dashboardBits';
import type { ActivityItem, MoneySplit, RunningCampaign } from './dashboardData';

const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

type Month = { key: string; label: string; long: string; value: number; current: boolean };

/** Round the chart top up to a value that splits into four even steps. */
function niceTop(max: number): number {
  if (max <= 0) return 10000;
  const mag = 10 ** Math.floor(Math.log10(max));
  const step = mag / 2;
  return Math.ceil(max / step) * step;
}

function axisLabel(n: number): string {
  return n === 0 ? '0' : compact(n);
}

// ── Earnings ─────────────────────────────────────────────────────────────

export function EarningsTile({ money, months }: { money: MoneySplit; months: Month[] }) {
  const [sel, setSel] = useState<number | 'all'>('all');
  const total = months.reduce((s, m) => s + m.value, 0);
  const value = sel === 'all' ? total : months[sel].value;
  const prev = sel === 'all' || sel === 0 ? 0 : months[sel - 1].value;
  const change = prev > 0 && sel !== 'all' ? Math.round(((value - prev) / prev) * 100) : null;
  const top = niceTop(Math.max(...months.map(m => m.value)));
  const ticks = [1, 0.75, 0.5, 0.25, 0].map(f => Math.round(top * f));
  const focus = sel === 'all' ? months.length - 1 : sel;

  return (
    <section className="chd-tile chd-earn" aria-labelledby="chd-earn-title">
      <TileHead icon={ChartColumnIncreasing} tone="coral" id="chd-earn-title" title="Earnings">
        <label className="chd-select chd-select--sm">
          <select value={String(sel)} onChange={e => setSel(e.target.value === 'all' ? 'all' : Number(e.target.value))} aria-label="Earnings period">
            <option value="all">Last 6 months</option>
            {[...months].reverse().map(m => (
              <option key={m.key} value={months.indexOf(m)}>{m.long}</option>
            ))}
          </select>
          <ChevronDown size={15} aria-hidden="true" />
        </label>
      </TileHead>

      <div className="chd-earn__figure">
        <strong>{inr(value)}</strong>
        {change !== null ? (
          <span className={`chd-trend ${change >= 0 ? 'is-up' : 'is-down'}`}>
            {change >= 0 ? <ArrowUpRight size={14} strokeWidth={2.4} /> : <ArrowDownRight size={14} strokeWidth={2.4} />}
            {Math.abs(change)}% vs {months[(sel as number) - 1].label}
          </span>
        ) : money.expected > 0 ? (
          <span className="chd-trend is-expected">+{inr(money.expected)} expected</span>
        ) : null}
      </div>

      <div className="chd-chart" role="img" aria-label={`Received per month: ${months.map(m => `${m.long} ${inr(m.value)}`).join(', ')}`}>
        <div className="chd-chart__axis" aria-hidden="true">
          {ticks.map(t => <span key={t}>{axisLabel(t)}</span>)}
        </div>
        <div className="chd-chart__plot">
          {months.map((m, i) => (
            <div key={m.key} className={`chd-chart__col${i === focus ? ' is-focus' : ''}`} style={{ ['--i' as string]: i }}>
              <span className="chd-chart__track">
                <i style={{ height: m.value > 0 ? `${Math.max(4, (m.value / top) * 100)}%` : '3px' }} title={`${m.long}: ${inr(m.value)}`} />
              </span>
              <span className="chd-chart__label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="chd-fine">Received only. Expected money is not earned until it is paid.</p>
    </section>
  );
}

// ── Creator Score ────────────────────────────────────────────────────────

function Radar({ factors }: { factors: ScoreFactor[] }) {
  const w = 200;
  const h = 170;
  const cx = w / 2;
  const cy = h / 2 + 4;
  const r = 52;
  const n = factors.length;
  const point = (i: number, pct: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r * (pct / 100), cy + Math.sin(a) * r * (pct / 100)];
  };
  const ring = (pct: number) => factors.map((_, i) => point(i, pct).join(',')).join(' ');

  return (
    <svg className="chd-radar" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={factors.map(f => `${f.label} ${f.value}`).join(', ')}>
      <defs>
        <linearGradient id="chdRadarFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9b49d" stopOpacity="0.75" />
          <stop offset="1" stopColor="#f2846b" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {[33, 66, 100].map(p => <polygon key={p} className="chd-radar__grid" points={ring(p)} />)}
      {factors.map((f, i) => {
        const [x, y] = point(i, 100);
        return <line key={f.key} className="chd-radar__axis" x1={cx} y1={cy} x2={x} y2={y} />;
      })}
      <polygon className="chd-radar__shape" points={factors.map((f, i) => point(i, f.value).join(',')).join(' ')} />
      {factors.map((f, i) => {
        const [x, y] = point(i, f.value);
        return <circle key={f.key} className="chd-radar__dot" cx={x} cy={y} r={2.6} />;
      })}
      {factors.map((f, i) => {
        const [x, y] = point(i, 128);
        const side = Math.abs(x - cx) > 6;
        const anchor = !side ? 'middle' : x > cx ? 'start' : 'end';
        const words = side && f.label.includes(' ') ? f.label.split(' ') : [f.label];
        return (
          <text key={f.key} className="chd-radar__label" x={x} y={y - (words.length - 1) * 5.5} textAnchor={anchor} dominantBaseline="central">
            {words.map((wd, j) => <tspan key={wd} x={x} dy={j ? 11 : 0}>{wd}</tspan>)}
          </text>
        );
      })}
    </svg>
  );
}

export function ScoreTile({ profile }: { profile: CreatorProfile }) {
  const { current, next } = tierFor(CREATOR_SCORE);
  return (
    <section className="chd-tile chd-score" aria-labelledby="chd-score-title">
      <TileHead icon={Crown} tone="amber" id="chd-score-title" title="Creator Score" />
      <div className="chd-score__body">
        <div className="chd-score__main">
          <div className="chd-score__figure">
            <ScoreRing value={CREATOR_SCORE} size={74} stroke={6} label={`Creator Score ${CREATOR_SCORE} out of 100`} />
            <span>/ 100</span>
          </div>
          <p className="chd-score__tier">
            {current.label}
            {next && <span> · {next.minScore - CREATOR_SCORE} pts to {next.label.split(' ')[0]}</span>}
          </p>
          <Link to="/creator/growth" className="chd-pill chd-pill--outline">
            View details <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
        <Radar factors={scoreFactors(profile)} />
      </div>
    </section>
  );
}

// ── Next deadline ────────────────────────────────────────────────────────

export function DeadlineTile({ next }: { next?: RunningCampaign }) {
  const piece = next?.next;
  if (!next || !piece) {
    return (
      <section className="chd-tile chd-due" aria-labelledby="chd-due-title">
        <TileHead icon={CalendarDays} tone="coral" id="chd-due-title" title="Next deadline" />
        <EmptyNote icon={CalendarCheck} title="Nothing due">Deadlines appear once a campaign is live.</EmptyNote>
      </section>
    );
  }
  const [y, m, d] = piece.dueDate.split('-').map(Number);
  return (
    <section className="chd-tile chd-due" aria-labelledby="chd-due-title">
      <TileHead icon={CalendarDays} tone="coral" id="chd-due-title" title="Next deadline" />
      <div className="chd-due__when">
        <CalendarClock className="chd-due__glyph" size={26} strokeWidth={1.7} aria-hidden="true" />
        <div>
          <strong>{d} {MONTHS_LONG[m - 1]?.slice(0, 3)} {y}</strong>
          <span>{piece.label} · {next.inv.brand}</span>
        </div>
      </div>
      <Chip tone={dueTone(piece.dueDate)}>{dueLabel(piece.dueDate)}</Chip>
      {next.inv.image && (
        <div className="chd-due__media">
          <img src={next.inv.image} alt="" loading="lazy" />
        </div>
      )}
      <Link to={`/creator/campaigns/${next.inv.id}`} className="chd-pill chd-pill--outline chd-pill--block">
        View campaign <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
      </Link>
    </section>
  );
}

// ── Recent updates (latest event per brand) ──────────────────────────────

export function UpdatesTile({ activity }: { activity: ActivityItem[] }) {
  const seen = new Set<string>();
  const rows = activity.filter(a => (seen.has(a.brand) ? false : (seen.add(a.brand), true))).slice(0, 4);
  return (
    <section className="chd-tile chd-updates" aria-labelledby="chd-upd-title">
      <TileHead icon={Inbox} tone="violet" id="chd-upd-title" title="Recent updates" />
      {rows.length === 0 ? (
        <EmptyNote icon={Inbox} title="No updates yet">Brand updates will appear here.</EmptyNote>
      ) : (
        <ul className="chd-updates__list">
          {rows.map(a => (
            <li key={a.key}>
              <Link to={a.to} className="chd-updates__row">
                <BrandMark name={a.brand} size={30} />
                <span className="chd-updates__text">
                  <strong>{a.brand}</strong>
                  <span>{a.label}</span>
                </span>
                <time>{a.when}</time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
