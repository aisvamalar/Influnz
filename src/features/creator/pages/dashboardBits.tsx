/** Small pieces shared by the creator dashboard panels (prefix: chd). */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { daysUntil } from '../format';

export type Tone = 'coral' | 'green' | 'amber' | 'blue' | 'violet' | 'teal' | 'pink' | 'red' | 'grey';

export function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`chd-chip tone-${tone}`}>{children}</span>;
}

/** Overdue is red, three days or less is amber, anything later is green. */
export function dueTone(iso: string | undefined): Tone {
  if (!iso) return 'grey';
  const n = daysUntil(iso);
  if (n < 0) return 'red';
  if (n <= 3) return 'amber';
  return 'green';
}

/** Tile heading: a tinted icon badge, the title, and an optional link or control on the right. */
export function TileHead({ icon: Icon, tone = 'coral', title, id, link, children }: {
  icon: LucideIcon;
  tone?: Tone;
  title: ReactNode;
  id?: string;
  link?: { label: string; to: string };
  children?: ReactNode;
}) {
  return (
    <div className="chd-tile__head">
      <span className={`chd-tile__icon tone-${tone}`} aria-hidden="true"><Icon size={18} strokeWidth={2} /></span>
      <h2 id={id}>{title}</h2>
      {children}
      {link && (
        <Link to={link.to} className="chd-link">
          {link.label} <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/** Circular score out of 100. */
export function ScoreRing({ value, size = 64, stroke = 6, label }: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <svg className="chd-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? `${pct} out of 100`}>
      <circle className="chd-ring__track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
      <circle
        className="chd-ring__value"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" style={{ fontSize: size * 0.34 }}>{pct}</text>
    </svg>
  );
}

export function EmptyNote({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="chd-empty">
      <span className="chd-empty__icon" aria-hidden="true"><Icon size={20} /></span>
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  );
}

/** Square initial tile for a brand without a logo; the colour is stable per name. */
export function BrandMark({ name, size = 28 }: { name: string; size?: number }) {
  const hues = ['#f0714c', '#7c5cf0', '#1f9d68', '#e14d8b', '#2f7fe0', '#d48a1c'];
  const hue = hues[[...name].reduce((s, ch) => s + ch.charCodeAt(0), 0) % hues.length];
  const letters = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  return (
    <span className="chd-brandmark" style={{ width: size, height: size, background: `${hue}1a`, color: hue }} aria-hidden="true">
      {letters || '?'}
    </span>
  );
}
