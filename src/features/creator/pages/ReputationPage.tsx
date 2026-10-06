import { useMemo } from 'react';
import { Star, ShieldCheck, CircleCheck, TrendingUp, Clock } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, StatCard, ProgressBar } from '../ui';

export default function ReputationPage() {
  const { profile, invitations } = useCreator();

  const completed = useMemo(() => invitations.filter(i => i.status === 'completed'), [invitations]);
  const onTime = completed.length; // mock: all completed treated as on-time

  const factors = [
    { label: 'On-time delivery', value: profile.reliability, icon: Clock },
    { label: 'Brand ratings', value: Math.round(profile.rating * 20), icon: Star },
    { label: 'Content quality', value: 88, icon: TrendingUp },
    { label: 'Communication', value: 91, icon: ShieldCheck },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Star size={22} style={{ color: 'var(--in-coral-text)' }} /> Campaign Reputation
        </h1>
        <p className="cr-page-sub">Your standing with brands, built from completed campaigns.</p>
      </div>

      <div className="cr-grid cr-grid--3">
        <StatCard icon={Star} value={`${profile.rating}/5`} label="Average rating" />
        <StatCard icon={ShieldCheck} value={`${profile.reliability}/100`} label="Reliability" />
        <StatCard icon={CircleCheck} value={completed.length} label="Completed campaigns" />
      </div>

      <div className="cr-grid cr-grid--2">
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 14 }}>What builds your reputation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {factors.map(f => (
              <div key={f.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.8125rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--in-gray)' }}>
                    <f.icon size={14} /> {f.label}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--in-charcoal)' }}>{f.value}%</span>
                </div>
                <ProgressBar value={f.value} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="cr-card__title" style={{ marginBottom: 4 }}>Completed campaign history</div>
          <div className="cr-card__sub" style={{ marginBottom: 14 }}>{onTime} delivered on time</div>
          {completed.length === 0 ? (
            <div style={{ fontSize: '0.875rem', color: 'var(--in-gray)' }}>
              No completed campaigns yet. Finish a campaign to start building reputation.
            </div>
          ) : (
            <div>
              {completed.map(c => (
                <div key={c.id} className="cr-row" style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <CircleCheck size={16} style={{ color: 'var(--in-success)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>{c.brand}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>{c.category} · {c.timeline}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-warn)' }}>
                    <Star size={13} /> {profile.rating}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
