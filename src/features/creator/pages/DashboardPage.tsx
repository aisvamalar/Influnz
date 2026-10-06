import { useNavigate } from 'react-router-dom';
import {
  Wallet, Briefcase, Eye, Star, Mail, ArrowRight, Sparkles,
  Clock, TrendingUp, CircleCheck,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, StatCard, ProgressBar, Button, StatusPill, EmptyState } from '../ui';
import { inr, compact } from '../format';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profile, invitations, payments } = useCreator();

  const newInvites = invitations.filter(i => i.status === 'new');
  const active = invitations.filter(i => i.status === 'active' || i.status === 'accepted' || i.status === 'contract_pending');
  const inNegotiation = invitations.filter(i => i.status === 'in_negotiation');

  const pending = payments.filter(p => p.status === 'pending' || p.status === 'processing' || p.status === 'upcoming')
    .reduce((s, p) => s + p.amount, 0);
  const paid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalEarnings = paid + payments.filter(p => p.status === 'processing').reduce((s, p) => s + p.amount, 0);

  const pendingActions = [
    ...newInvites.slice(0, 1).map(i => ({ text: `Review invitation from ${i.brand}`, to: `/creator/invitations/${i.id}` })),
    ...active.slice(0, 1).map(i => ({ text: `Submit content for ${i.brand}`, to: `/creator/campaigns/${i.id}` })),
    ...inNegotiation.slice(0, 1).map(i => ({ text: `AI negotiation needs review · ${i.brand}`, to: `/creator/negotiation/${i.id}` })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="cr-page-title">Good morning, {profile.displayName} 👋</h1>
          <p className="cr-page-sub">Here's what's happening across your creator journey.</p>
        </div>
        <span className="cr-chip cr-chip--static" style={{ background: 'rgba(242,132,107,0.1)', borderColor: 'var(--in-coral)', color: 'var(--in-coral-text)' }}>
          <TrendingUp size={15} /> Rising Creator · {profile.reliability}/100
        </span>
      </div>

      {/* Stats */}
      <div className="cr-grid cr-grid--4">
        <StatCard icon={Wallet} value={inr(totalEarnings + pending - (pending))} label="Total Earnings" />
        <StatCard icon={Briefcase} value={12} label="Campaigns" />
        <StatCard icon={Eye} value={compact(9200)} label="Profile Views" />
        <StatCard icon={Star} value="72/100" label="Creator Score" />
      </div>

      <div className="cr-grid cr-grid--2">
        {/* Campaign Invitations */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div className="cr-card__title">Campaign Invitations</div>
              <div className="cr-card__sub">{newInvites.length} new invitation{newInvites.length !== 1 ? 's' : ''} matched to you</div>
            </div>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} />
            </span>
          </div>
          {newInvites.length === 0 ? (
            <EmptyState icon={Mail} title="No new campaigns right now" text="We're continuously looking for opportunities that match your profile." />
          ) : (
            <div>
              {newInvites.slice(0, 2).map(i => (
                <div key={i.id} className="cr-row" style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--in-charcoal)' }}>{i.brand}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--in-gray)' }}>{inr(i.proposedRate)} · {i.matchPct}% match</div>
                  </div>
                  <Button variant="ghost" small onClick={() => navigate(`/creator/invitations/${i.id}`)}>View</Button>
                </div>
              ))}
              <Button style={{ width: '100%', marginTop: 12 }} onClick={() => navigate('/creator/invitations')}>
                View Invitations <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </Card>

        {/* Active Campaigns */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 4 }}>Active Campaigns</div>
          <div className="cr-card__sub" style={{ marginBottom: 14 }}>Campaigns currently in progress</div>
          {active.length === 0 ? (
            <EmptyState icon={Briefcase} title="No active campaigns yet" text="Your next campaign will appear here once you accept an invitation." />
          ) : (
            <div>
              {active.map(i => (
                <div key={i.id} className="cr-row" style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--in-charcoal)' }}>{i.brand}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--in-gray)' }}>{inr(i.agreedRate ?? i.proposedRate)} · {i.timeline}</div>
                  </div>
                  <StatusPill status={i.status} />
                  <Button variant="ghost" small onClick={() => navigate(`/creator/campaigns/${i.id}`)}>Open</Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="cr-grid cr-grid--3">
        {/* Earnings */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Earnings & Payouts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--in-gray)', fontSize: '0.875rem' }}>Pending</span>
              <span style={{ fontWeight: 800, color: 'var(--in-warn)' }}>{inr(pending)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--in-gray)', fontSize: '0.875rem' }}>Paid</span>
              <span style={{ fontWeight: 800, color: 'var(--in-success)' }}>{inr(paid)}</span>
            </div>
          </div>
          <Button variant="ghost" small style={{ width: '100%', marginTop: 14 }} onClick={() => navigate('/creator/earnings')}>
            View Earnings <ArrowRight size={15} />
          </Button>
        </Card>

        {/* Creator Growth */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Creator Growth</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--in-charcoal)' }}>72</span>
            <span style={{ color: 'var(--in-gray)' }}>/100 Creator Score</span>
          </div>
          <ProgressBar value={72} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', marginTop: 10, lineHeight: 1.5 }}>
            28 points to <strong style={{ color: 'var(--in-coral-text)' }}>Established Creator</strong>.
          </p>
          <Button variant="ghost" small style={{ width: '100%', marginTop: 10 }} onClick={() => navigate('/creator/growth')}>
            View Growth <ArrowRight size={15} />
          </Button>
        </Card>

        {/* Pending Actions */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 12 }}>Pending Actions</div>
          {pendingActions.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--in-success)', fontSize: '0.875rem', fontWeight: 600 }}>
              <CircleCheck size={18} /> You're all caught up!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {pendingActions.map((a, idx) => (
                <button key={idx} className="cr-nav-link" style={{ padding: '10px 8px' }} onClick={() => navigate(a.to)}>
                  <Clock size={16} style={{ color: 'var(--in-warn)' }} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--in-charcoal)', fontWeight: 600 }}>{a.text}</span>
                  <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--in-gray-light)' }} />
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* AI Assistant */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(242,132,107,0.08), rgba(248,208,196,0.14))', border: '1px solid var(--in-coral)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, var(--in-coral), var(--in-coral-dark))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={22} />
          </span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 800, color: 'var(--in-charcoal)' }}>AI Assistant</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--in-gray)' }}>
              You have {newInvites.length} new campaign opportunit{newInvites.length !== 1 ? 'ies' : 'y'} that match your profile.
            </div>
          </div>
          <Button onClick={() => navigate('/creator/invitations')}>Ask AI <Sparkles size={15} /></Button>
        </div>
      </Card>
    </div>
  );
}
