/**
 * Shared building blocks for the creator onboarding steps.
 * Visual language: business wizard panels + auth form controls.
 */
import type { ReactNode } from 'react';
import { Check, Sparkles } from 'lucide-react';

export function StepHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub: ReactNode }) {
  return (
    <div className="cro-head">
      <p className="cro-eyebrow">{eyebrow}</p>
      <h1 className="cro-title">{title}</h1>
      <p className="cro-sub">{sub}</p>
    </div>
  );
}

export function Section({
  title, sub, kicker, list, children,
}: {
  title: string;
  sub?: string;
  kicker?: ReactNode;
  list?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="cro-panel">
      <div className="cro-panel__head">
        <div>
          <h2 className="cro-panel__title">{title}</h2>
          {sub && <p className="cro-panel__sub">{sub}</p>}
        </div>
        {kicker && <span className="cro-panel__kicker">{kicker}</span>}
      </div>
      <div className={`cro-panel__body${list ? ' cro-panel__body--list' : ''}`}>{children}</div>
    </section>
  );
}

export function StateChip({ state, children }: { state: 'ok' | 'todo' | 'idle'; children: ReactNode }) {
  return <span className={`cro-state cro-state--${state}`}>{children}</span>;
}

export function Btn({
  variant = 'primary', small, className = '', children, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'soft' | 'link'; small?: boolean }) {
  return (
    <button type="button" className={`cro-btn cro-btn--${variant}${small ? ' cro-btn--sm' : ''} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Actions({ left, hint, children }: { left?: ReactNode; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="cro-actions">
      <div className="cro-actions__inner">
        {left}
        <span className="cro-actions__spacer" />
        {hint && <span className="cro-actions__hint">{hint}</span>}
        {children}
      </div>
    </div>
  );
}

export function SelectChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={`cro-chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={onClick}>
      {on && <span className="cro-chip__check"><Check size={11} strokeWidth={3} /></span>}
      {children}
    </button>
  );
}

export interface RailItem {
  label: string;
  done: boolean;
  meta?: string;
}

/** Sticky right-hand rail: overall progress + the checklist for the current step. */
export function ProgressRail({
  title, items, note,
}: {
  title: string;
  items: RailItem[];
  note?: ReactNode;
}) {
  const done = items.filter(i => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  return (
    <aside className="cro-panel cro-rail" aria-label="Progress">
      <h3 className="cro-rail__title">{title}</h3>
      <div className="cro-rail__pct">
        <strong>{pct}%</strong>
        <span>{done} of {items.length} complete</span>
      </div>
      <div className="cro-rail__bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="cro-rail__fill" style={{ width: `${pct}%` }} />
      </div>
      <ul className="cro-rail__list">
        {items.map(i => (
          <li key={i.label} className={`cro-rail__item${i.done ? ' is-done' : ''}`}>
            <span className="cro-rail__dot"><Check size={12} strokeWidth={3} /></span>
            {i.label}
            {i.meta && <small>{i.meta}</small>}
          </li>
        ))}
      </ul>
      {note && (
        <div className="cro-rail__note">
          <Sparkles size={15} />
          <span>{note}</span>
        </div>
      )}
    </aside>
  );
}
