import { useMemo } from 'react';
import { Wallet, Clock, CircleCheck, Download, ShieldCheck } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, StatCard, Button, StatusPill, EmptyState } from '../ui';
import { inr } from '../format';

export default function EarningsPage() {
  const { payments } = useCreator();

  const totals = useMemo(() => {
    const paid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const processing = payments.filter(p => p.status === 'processing').reduce((s, p) => s + p.amount, 0);
    const pending = payments
      .filter(p => p.status === 'pending' || p.status === 'upcoming')
      .reduce((s, p) => s + p.amount, 0);
    return { paid, processing, pending, lifetime: paid + processing };
  }, [payments]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title">Earnings & Payouts</h1>
        <p className="cr-page-sub">Every payment is protected in escrow and released on approval.</p>
      </div>

      <div className="cr-grid cr-grid--3">
        <StatCard icon={CircleCheck} value={inr(totals.paid)} label="Paid out" />
        <StatCard icon={Clock} value={inr(totals.pending)} label="Pending" />
        <StatCard icon={Wallet} value={inr(totals.lifetime)} label="Lifetime earnings" />
      </div>

      <Card style={{ background: 'linear-gradient(135deg, rgba(124,196,164,0.12), rgba(90,155,212,0.08))', border: '1px solid rgba(124,196,164,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>
          <ShieldCheck size={18} style={{ color: 'var(--in-success)' }} />
          <span><strong>Payment protection is on.</strong> Funds are held securely and released once your deliverables are approved.</span>
        </div>
      </Card>

      <Card>
        <div className="cr-card__title" style={{ marginBottom: 12 }}>Transaction History</div>
        {payments.length === 0 ? (
          <EmptyState icon={Wallet} title="No transactions yet" text="Your payouts will appear here once campaigns are completed." />
        ) : (
          <div>
            {payments.map(p => (
              <div key={p.id} className="cr-row" style={{ paddingTop: 12, paddingBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--in-charcoal)' }}>{p.brand}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>
                    {p.milestone} · {p.date}{p.invoiceNo ? ` · ${p.invoiceNo}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--in-charcoal)' }}>{inr(p.amount)}</div>
                  <StatusPill status={p.status} />
                </div>
                {p.status === 'paid' && (
                  <Button variant="ghost" small aria-label="Download invoice"><Download size={14} /></Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
