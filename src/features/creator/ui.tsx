import React from 'react';
import type { LucideIcon } from 'lucide-react';

// ── Card ──
export function Card({ children, className = '', ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`cr-card ${className}`} {...rest}>{children}</div>;
}

// ── Stat card ──
export function StatCard({ icon: Icon, value, label }: { icon: LucideIcon; value: React.ReactNode; label: string }) {
  return (
    <Card className="cr-stat">
      <span className="cr-stat__icon"><Icon size={20} /></span>
      <span className="cr-stat__value">{value}</span>
      <span className="cr-stat__label">{label}</span>
    </Card>
  );
}

// ── Progress bar ──
export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="cr-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="cr-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Toggle ──
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`cr-toggle ${on ? 'cr-toggle--on' : ''}`}
      onClick={() => onChange(!on)}
    >
      <span className="cr-toggle__knob" />
    </button>
  );
}

// ── Chip (selectable) ──
export function Chip({ active, onClick, children, staticChip }: { active?: boolean; onClick?: () => void; children: React.ReactNode; staticChip?: boolean }) {
  return (
    <button
      type="button"
      className={`cr-chip ${active ? 'cr-chip--active' : ''} ${staticChip ? 'cr-chip--static' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

// ── Button ──
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  small?: boolean;
}
export function Button({ variant = 'primary', small, className = '', children, ...rest }: BtnProps) {
  return (
    <button className={`cr-btn cr-btn--${variant} ${small ? 'cr-btn--sm' : ''} ${className}`} {...rest}>
      {children}
    </button>
  );
}

// ── Status pill ──
const statusMap: Record<string, { cls: string; label: string }> = {
  new: { cls: 'cr-status--new', label: 'New' },
  in_negotiation: { cls: 'cr-status--neg', label: 'In Negotiation' },
  accepted: { cls: 'cr-status--done', label: 'Accepted' },
  contract_pending: { cls: 'cr-status--pending', label: 'Contract Pending' },
  active: { cls: 'cr-status--active', label: 'Active' },
  completed: { cls: 'cr-status--done', label: 'Completed' },
  declined: { cls: 'cr-status--declined', label: 'Declined' },
  expired: { cls: 'cr-status--declined', label: 'Expired' },
  pending: { cls: 'cr-status--pending', label: 'Pending' },
  processing: { cls: 'cr-status--processing', label: 'Processing' },
  paid: { cls: 'cr-status--paid', label: 'Paid' },
  failed: { cls: 'cr-status--failed', label: 'Failed' },
  disputed: { cls: 'cr-status--failed', label: 'Disputed' },
  upcoming: { cls: 'cr-status--upcoming', label: 'Upcoming' },
  // Contract statuses
  draft: { cls: 'cr-status--pending', label: 'Draft' },
  awaiting_signature: { cls: 'cr-status--pending', label: 'Awaiting Signature' },
  signed: { cls: 'cr-status--done', label: 'Signed' },
  amended: { cls: 'cr-status--neg', label: 'Amended' },
  // Deliverable extra
  not_started: { cls: 'cr-status--declined', label: 'Not Started' },
  uploaded: { cls: 'cr-status--processing', label: 'Uploaded' },
  pending_approval: { cls: 'cr-status--pending', label: 'In Review' },
  changes_requested: { cls: 'cr-status--neg', label: 'Changes Requested' },
};
export function StatusPill({ status }: { status: string }) {
  const s = statusMap[status] ?? { cls: 'cr-status--declined', label: status };
  return <span className={`cr-status ${s.cls}`}>{s.label}</span>;
}

// ── Empty state ──
export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="cr-empty">
      <span className="cr-empty__icon"><Icon size={24} /></span>
      <span className="cr-empty__title">{title}</span>
      <span className="cr-empty__text">{text}</span>
      {action}
    </div>
  );
}

// ── Avatar ──
export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="cr-avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </span>
  );
}

// ── Tabs ──
export function Tabs<T extends string>({ tabs, active, onChange }: { tabs: { key: T; label: string; count?: number }[]; active: T; onChange: (k: T) => void }) {
  return (
    <div className="cr-tabs" role="tablist">
      {tabs.map(t => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          className={`cr-tab ${active === t.key ? 'cr-tab--active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}{typeof t.count === 'number' ? ` (${t.count})` : ''}
        </button>
      ))}
    </div>
  );
}

// ── Toast ──
export function Toast({ message, icon: Icon }: { message: string; icon?: LucideIcon }) {
  return (
    <div className="cr-toast" role="status">
      {Icon && <Icon size={16} />}
      {message}
    </div>
  );
}

// ── Simple spinner ──
export function Loader({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 48 }}>
      <div className="in-spinner" style={{ width: 28, height: 28, borderWidth: 3, borderColor: 'rgba(242,132,107,0.2)', borderTopColor: 'var(--in-coral)' }} />
      {label && <span style={{ fontSize: '0.875rem', color: 'var(--in-gray)' }}>{label}</span>}
    </div>
  );
}
