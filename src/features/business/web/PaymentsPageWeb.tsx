/**
 * Screen 19 — Payments
 * Payment lifecycle: committed → pending release → processing → paid
 */
import { useState } from 'react';
import BusinessLayout from './BusinessLayout';

type PayState = 'committed' | 'pending_release' | 'processing' | 'paid' | 'failed' | 'disputed';

const PAYMENTS = [
  { id: 1, creator: 'Foodie Tamilan',  campaign: 'Chennai Café Launch',    amount: '₹10,000', state: 'pending_release' as PayState, milestone: 'Content approved', date: '25 Sep 2026' },
  { id: 2, creator: 'Chennai Bites',   campaign: 'Chennai Café Launch',    amount: '₹11,500', state: 'committed' as PayState,       milestone: 'Awaiting content',   date: '28 Sep 2026' },
  { id: 3, creator: 'Madras Food Trail', campaign: 'Chennai Café Launch',  amount: '₹6,200',  state: 'committed' as PayState,       milestone: 'Awaiting content',   date: '30 Sep 2026' },
  { id: 4, creator: 'TechVoice India', campaign: 'Bangalore Tech Event',   amount: '₹22,000', state: 'paid' as PayState,            milestone: 'Completed',          date: '10 Sep 2026' },
  { id: 5, creator: 'MumbaiStyle',     campaign: 'Mumbai Fashion Drop',    amount: '₹18,000', state: 'processing' as PayState,      milestone: 'Processing payment', date: '20 Sep 2026' },
];

const STATE_LABEL: Record<PayState, string> = {
  committed: 'Committed',
  pending_release: 'Pending Release',
  processing: 'Processing',
  paid: 'Paid',
  failed: 'Failed',
  disputed: 'Disputed',
};
const STATE_PILL: Record<PayState, string> = {
  committed: 'biz-pill--draft',
  pending_release: 'biz-pill--pending',
  processing: 'biz-pill--draft',
  paid: 'biz-pill--done',
  failed: 'biz-pill--danger',
  disputed: 'biz-pill--danger',
};

export default function PaymentsPage() {
  const [filter, setFilter] = useState('All');

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
                      <button className="biz-btn biz-btn--primary" style={{ height: 30, fontSize: '0.75rem', background: 'linear-gradient(135deg, var(--in-success), #1b5e20)' }}>
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
        🔒 Payments are protected and released only when the agreed milestone is met. Campaign status and payment status are always tracked independently.
      </p>
    </BusinessLayout>
  );
}
