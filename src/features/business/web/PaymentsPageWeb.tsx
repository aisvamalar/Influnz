/**
 * Screen 19 — Payments
 * Payment lifecycle: committed → pending release → processing → paid
 */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Check, CreditCard } from 'lucide-react';
import BusinessLayout from '../BusinessLayout';
import { PAYMENTS, STATE_LABEL, type PayState } from '../paymentsData';
import { maskTail, useBusinessProfile } from '../businessProfile';
import PaymentSetupModal from '../profile/PaymentSetupModal';
import '../profile/business-profile.css';
import UiIcon from '../../../components/UiIcon';

const STATE_PILL: Record<PayState, string> = {
  committed: 'biz-pill--draft',
  pending_release: 'biz-pill--pending',
  processing: 'biz-pill--draft',
  paid: 'biz-pill--done',
  failed: 'biz-pill--danger',
  disputed: 'biz-pill--danger',
};

export default function PaymentsPageWeb() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const { payments } = useBusinessProfile();
  const paymentsReady = Boolean(payments.completedAt);
  const [setup, setSetup] = useState<{ open: boolean; reason?: string }>({ open: false });
  const [toast, setToast] = useState('');

  const closeSetup = useCallback(() => setSetup({ open: false }), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const release = (creator: string, amount: string) => {
    if (!paymentsReady) {
      setSetup({
        open: true,
        reason: `Add your payment details once to release ${amount} to ${creator}. They appear on your invoices.`,
      });
      return;
    }
    setToast(`${amount} released to ${creator}`);
  };

  const visible = filter === 'All'
    ? PAYMENTS
    : PAYMENTS.filter(p => STATE_LABEL[p.state] === filter);

  const totalPaid = PAYMENTS.filter(p => p.state === 'paid')
    .reduce((s, p) => s + parseInt(p.amount.replace(/[^0-9]/g, '')), 0);
  const totalPending = PAYMENTS.filter(p => ['committed', 'pending_release', 'processing'].includes(p.state))
    .reduce((s, p) => s + parseInt(p.amount.replace(/[^0-9]/g, '')), 0);

  return (
    <BusinessLayout breadcrumb="Payments">
      <div className="biz-page-head">
        <div>
          <h1 className="biz-page-head__title">Payments</h1>
          <p className="biz-page-head__sub">Creator payment lifecycle across all campaigns.</p>
        </div>
        <div className="biz-page-head__actions">
          <button className="biz-btn biz-btn--ghost">Download invoices</button>
        </div>
      </div>

      {paymentsReady ? (
        <div className="bp-banner bp-banner--ok" style={{ marginBottom: 20 }}>
          <span className="bp-banner__icon"><BadgeCheck size={20} /></span>
          <div className="bp-banner__body">
            <p className="bp-banner__title">Paying from {payments.legalName}</p>
            <p className="bp-banner__text">
              Bank account {maskTail(payments.bank.account, 4)} · PAN {maskTail(payments.pan, 4)}
              {payments.gstApplicable ? ` · GSTIN ${maskTail(payments.gstin, 5)}` : ''}
            </p>
          </div>
          <button type="button" className="bp-btn bp-btn--ghost" onClick={() => navigate('/business/settings?tab=payments')}>
            Manage
          </button>
        </div>
      ) : (
        <div className="bp-banner" style={{ marginBottom: 20 }}>
          <span className="bp-banner__icon"><CreditCard size={20} /></span>
          <div className="bp-banner__body">
            <p className="bp-banner__title">Set up payments before you pay creators</p>
            <p className="bp-banner__text">
              One-time step: legal entity, PAN, GST details, billing address and bank account. Takes about 3 minutes.
            </p>
          </div>
          <button type="button" className="bp-btn bp-btn--primary" onClick={() => setSetup({ open: true })}>
            Set up payments
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="biz-kpi-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total paid', value: `₹${totalPaid.toLocaleString('en-IN')}`, sub: 'Settled to creators' },
          { label: 'Pending / committed', value: `₹${totalPending.toLocaleString('en-IN')}`, sub: 'Protected funds' },
          { label: 'Pending release', value: '₹10,000', sub: '1 item awaiting approval' },
          { label: 'Disputes', value: '0', sub: 'No active disputes' },
        ].map(k => (
          <div key={k.label} className="biz-kpi">
            <span className="biz-kpi__label">{k.label}</span>
            <span className="biz-kpi__value">{k.value}</span>
            <span className="biz-kpi__sub">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="biz-chips" style={{ marginBottom: 18 }}>
        {['All', 'Committed', 'Pending Release', 'Processing', 'Paid'].map(f => (
          <button key={f} className={`biz-chip${filter === f ? ' biz-chip--active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="biz-card" style={{ padding: 0 }}>
        <div className="biz-table-wrap" style={{ borderRadius: 18 }}>
          <table className="biz-table">
            <thead>
              <tr>
                <th>Creator</th>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Milestone</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="biz-creator-chip">
                      <div className="biz-creator-chip__avatar">{p.creator[0]}</div>
                      <span className="biz-creator-chip__name">{p.creator}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--in-gray)', fontSize: '0.8125rem' }}>{p.campaign}</td>
                  <td style={{ fontWeight: 800, fontSize: '1rem' }}>{p.amount}</td>
                  <td>
                    <span className={`biz-pill ${STATE_PILL[p.state]}`}>{STATE_LABEL[p.state]}</span>
                  </td>
                  <td style={{ color: 'var(--in-gray)', fontSize: '0.8125rem' }}>{p.milestone}</td>
                  <td style={{ color: 'var(--in-gray-light)', fontSize: '0.8125rem' }}>{p.date}</td>
                  <td>
                    {p.state === 'pending_release' && (
                      <button
                        className="biz-btn biz-btn--primary"
                        style={{ height: 30, fontSize: '0.75rem', background: 'var(--in-success)' }}
                        onClick={() => release(p.creator, p.amount)}
                      >
                        Release payment
                      </button>
                    )}
                    {p.state === 'paid' && (
                      <button className="biz-btn biz-btn--ghost" style={{ height: 30, fontSize: '0.75rem' }}>
                        View invoice
                      </button>
                    )}
                    {p.state === 'processing' && (
                      <span style={{ fontSize: '0.8125rem', color: 'var(--in-info)' }}>Processing…</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', marginTop: 16 }}>
        <UiIcon name="lock" /> Payments are protected and released only when the agreed milestone is met. Campaign status and payment status are always tracked independently.
      </p>

      <PaymentSetupModal
        open={setup.open}
        reason={setup.reason}
        onClose={closeSetup}
        onSaved={() => { closeSetup(); setToast('Payment details saved. You can now pay creators.'); }}
      />

      {toast && (
        <div className="bp-toast" role="status"><Check size={16} strokeWidth={2.5} /> {toast}</div>
      )}
    </BusinessLayout>
  );
}
