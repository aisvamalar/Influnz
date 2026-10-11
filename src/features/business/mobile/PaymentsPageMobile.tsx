/**
 * Mobile Payments: creator payment lifecycle across all campaigns
 * (committed → pending release → processing → paid).
 */
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { CircleCheck, Download, FileText, Loader, Lock, ShieldCheck, Wallet, X } from 'lucide-react';
import MobileAppHeader from '../../../components/mobile/MobileAppHeader';
import MobileBottomNav from '../../../components/mobile/MobileBottomNav';
import { PAYMENTS, STATE_LABEL, amountValue, type PayState, type Payment } from '../paymentsData';
import { NAMED_CREATOR_PHOTOS, creatorInitials, unsplashPhoto } from './creatorPhotos';
import './payments-mobile.css';

const FILTERS: ('all' | PayState)[] = ['all', 'committed', 'pending_release', 'processing', 'paid'];

const PROTECTED_STATES: PayState[] = ['committed', 'pending_release', 'processing'];

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

type SheetState = { kind: 'release' | 'invoice'; payment: Payment } | null;

function Avatar({ name }: { name: string }) {
  const photo = NAMED_CREATOR_PHOTOS[name];
  const [failed, setFailed] = useState(false);
  if (!photo || failed) {
    return (
      <span className="mpy-avatar mpy-avatar--initials" aria-hidden="true">
        {creatorInitials(name)}
      </span>
    );
  }
  return (
    <img
      className="mpy-avatar"
      src={unsplashPhoto(photo, 96, 96)}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

interface PaySheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

/** Bottom sheet. The dialog role sits on the full-screen layer because mobile-responsive.css stretches [role="dialog"]. */
function PaySheet({ title, onClose, children, footer }: PaySheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="mpy-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="mpy-sheet__scrim" aria-label="Close" tabIndex={-1} onClick={onClose} />
      <div className="mpy-sheet__panel" ref={panelRef} tabIndex={-1}>
        <span className="mpy-sheet__grip" aria-hidden="true" />
        <div className="mpy-sheet__head">
          <h2 id={titleId} className="mpy-sheet__title">
            {title}
          </h2>
          <button type="button" className="mpy-sheet__close" aria-label="Close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        {children}
        {footer && <div className="mpy-sheet__foot">{footer}</div>}
      </div>
    </div>
  );
}

function downloadCsv(rows: Payment[]) {
  const header = ['Creator', 'Campaign', 'Amount (INR)', 'Status', 'Milestone', 'Date'];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [header, ...rows.map((p) => [p.creator, p.campaign, String(amountValue(p.amount)), STATE_LABEL[p.state], p.milestone, p.date])]
    .map((cols) => cols.map(escape).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([lines], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'influnz-payments.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function PaymentsPageMobile() {
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [filter, setFilter] = useState<'all' | PayState>('all');
  const [sheet, setSheet] = useState<SheetState>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const totals = useMemo(() => {
    const sum = (states: PayState[]) =>
      payments.filter((p) => states.includes(p.state)).reduce((s, p) => s + amountValue(p.amount), 0);
    return {
      paid: sum(['paid']),
      protectedFunds: sum(PROTECTED_STATES),
      pendingRelease: sum(['pending_release']),
      pendingCount: payments.filter((p) => p.state === 'pending_release').length,
      disputes: payments.filter((p) => p.state === 'disputed' || p.state === 'failed').length,
    };
  }, [payments]);

  const counts = useMemo(() => {
    const c = { all: payments.length } as Record<'all' | PayState, number>;
    FILTERS.slice(1).forEach((f) => (c[f] = payments.filter((p) => p.state === f).length));
    return c;
  }, [payments]);

  const visible = filter === 'all' ? payments : payments.filter((p) => p.state === filter);
  const closeSheet = () => setSheet(null);

  const release = (payment: Payment) => {
    setPayments((list) =>
      list.map((p) => (p.id === payment.id ? { ...p, state: 'processing', milestone: 'Processing payment' } : p)),
    );
    closeSheet();
    setToast(`${payment.amount} release started for ${payment.creator}`);
  };

  return (
    <div className="mpy">
      <MobileAppHeader showChevron />

      <main id="main-content" aria-label="Payments">
        <div className="mpy-head">
          <div>
            <h1 className="mpy-head__title">Payments</h1>
            <p className="mpy-head__sub">Creator payment lifecycle across all campaigns.</p>
          </div>
          <button
            type="button"
            className="mpy-icon-btn"
            aria-label="Download invoices"
            onClick={() => {
              downloadCsv(payments);
              setToast('Payments exported as CSV');
            }}
          >
            <Download size={19} strokeWidth={2} />
          </button>
        </div>

        <section className="mpy-summary" aria-label="Payment summary">
          <div className="mpy-summary__top">
            <span className="mpy-summary__icon">
              <Wallet size={20} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="mpy-summary__label">Total paid</span>
            <span className="mpy-summary__badge">
              <ShieldCheck size={13} strokeWidth={2.2} aria-hidden="true" />
              Escrow protected
            </span>
          </div>
          <strong className="mpy-summary__value">{inr(totals.paid)}</strong>
          <span className="mpy-summary__sub">Settled to creators</span>

          <dl className="mpy-summary__grid">
            <div className="mpy-summary__stat">
              <dt>Protected funds</dt>
              <dd>{inr(totals.protectedFunds)}</dd>
            </div>
            <div className="mpy-summary__stat">
              <dt>Pending release</dt>
              <dd>{inr(totals.pendingRelease)}</dd>
              <span className="mpy-summary__hint">
                {totals.pendingCount} {totals.pendingCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="mpy-summary__stat">
              <dt>Disputes</dt>
              <dd>{totals.disputes}</dd>
              <span className="mpy-summary__hint">{totals.disputes ? 'Needs attention' : 'None active'}</span>
            </div>
          </dl>
        </section>

        <div className="mpy-chips" role="radiogroup" aria-label="Filter payments by status">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={filter === f}
              className={`mpy-chip${filter === f ? ' is-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : STATE_LABEL[f]}
              <span className="mpy-chip__count">{counts[f]}</span>
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mpy-empty">No payments in this status.</p>
        ) : (
          <ul className="mpy-list">
            {visible.map((p) => (
              <li key={p.id} className="mpy-item">
                <div className="mpy-item__top">
                  <Avatar name={p.creator} />
                  <span className="mpy-item__who">
                    <span className="mpy-item__name">{p.creator}</span>
                    <span className="mpy-item__campaign">{p.campaign}</span>
                  </span>
                  <strong className="mpy-item__amount">{p.amount}</strong>
                </div>
                <div className="mpy-item__meta">
                  <span className={`mpy-pill mpy-pill--${p.state}`}>{STATE_LABEL[p.state]}</span>
                  <span className="mpy-item__milestone">
                    {p.milestone} • {p.date}
                  </span>
                </div>
                {p.state === 'pending_release' && (
                  <button
                    type="button"
                    className="mpy-btn mpy-btn--release"
                    onClick={() => setSheet({ kind: 'release', payment: p })}
                  >
                    <CircleCheck size={16} strokeWidth={2.2} aria-hidden="true" />
                    Release payment
                  </button>
                )}
                {p.state === 'paid' && (
                  <button
                    type="button"
                    className="mpy-btn mpy-btn--ghost"
                    onClick={() => setSheet({ kind: 'invoice', payment: p })}
                  >
                    <FileText size={16} strokeWidth={2} aria-hidden="true" />
                    View invoice
                  </button>
                )}
                {p.state === 'processing' && (
                  <span className="mpy-item__processing">
                    <Loader className="mpy-spin" size={14} strokeWidth={2.2} aria-hidden="true" />
                    Processing…
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="mpy-note">
          <Lock size={14} strokeWidth={2.2} aria-hidden="true" />
          <span>
            Payments are protected and released only when the agreed milestone is met. Campaign status and payment status
            are always tracked independently.
          </span>
        </p>
      </main>

      <MobileBottomNav activeItem="payments" />

      {sheet?.kind === 'release' && (
        <PaySheet
          title="Release payment"
          onClose={closeSheet}
          footer={
            <button type="button" className="mpy-btn mpy-btn--release mpy-btn--block" onClick={() => release(sheet.payment)}>
              Release {sheet.payment.amount}
            </button>
          }
        >
          <p className="mpy-sheet__note">
            The milestone is met. Funds move from escrow to {sheet.payment.creator}&apos;s account.
          </p>
          <PaymentFacts payment={sheet.payment} />
        </PaySheet>
      )}

      {sheet?.kind === 'invoice' && (
        <PaySheet title="Invoice" onClose={closeSheet}>
          <PaymentFacts payment={sheet.payment} />
        </PaySheet>
      )}

      <div className="mpy-toast-region" role="status" aria-live="polite">
        {toast && <div className="mpy-toast">{toast}</div>}
      </div>
    </div>
  );
}

function PaymentFacts({ payment }: { payment: Payment }) {
  const rows = [
    { label: 'Creator', value: payment.creator },
    { label: 'Campaign', value: payment.campaign },
    { label: 'Amount', value: payment.amount },
    { label: 'Milestone', value: payment.milestone },
    { label: 'Date', value: payment.date },
    { label: 'Status', value: STATE_LABEL[payment.state] },
  ];
  return (
    <dl className="mpy-facts">
      {rows.map((r) => (
        <div key={r.label} className="mpy-facts__row">
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
