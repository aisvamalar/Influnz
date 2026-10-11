import { TrendingUp, Star, CircleCheck, Circle, Users, Activity, Zap, Award } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, StatCard, ProgressBar, Button } from '../ui';
import { compact } from '../format';

const SCORE = 72;
const NEXT_TIER = 'Established Creator';

const FACTORS = [
  { label: 'Audience quality', value: 82, icon: Users },
  { label: 'Engagement rate', value: 78, icon: Activity },
  { label: 'Delivery reliability', value: 94, icon: Zap },
  { label: 'Brand ratings', value: 88, icon: Star },
];

const TIPS = [
  { text: 'Post 2 more reels this week to boost engagement', done: false },
  { text: 'Complete identity verification', done: false },
  { text: 'Connect your YouTube channel', done: true },
  { text: 'Maintain on-time delivery streak', done: true },
];

export default function GrowthPage() {
  const { profile } = useCreator();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title">Creator Growth</h1>
        <p className="cr-page-sub">Build your reputation and unlock better campaigns.</p>
      </div>

      {/* Score hero */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(242,132,107,0.08), rgba(248,208,196,0.14))', border: '1px solid var(--in-coral)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--in-charcoal)', lineHeight: 1 }}>{SCORE}</span>
              <span style={{ color: 'var(--in-gray)', fontWeight: 600 }}>/100</span>
            </div>
            <span className="cr-chip cr-chip--static" style={{ background: 'rgba(242,132,107,0.12)', borderColor: 'var(--in-coral)', color: 'var(--in-coral-text)' }}>
              <TrendingUp size={13} /> Rising Creator
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--in-gray)' }}>Progress to {NEXT_TIER}</span>
              <span style={{ fontWeight: 700, color: 'var(--in-charcoal)' }}>{100 - SCORE} pts to go</span>
            </div>
            <ProgressBar value={SCORE} />
            <p style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', marginTop: 10, lineHeight: 1.5 }}>
              Established Creators get priority matching, higher-value campaigns, and a verified badge upgrade.
            </p>
          </div>
        </div>
      </Card>

      <div className="cr-grid cr-grid--3">
        <StatCard icon={Users} value={compact(profile.followers)} label="Followers" />
        <StatCard icon={Activity} value={`${profile.engagement}%`} label="Engagement" />
        <StatCard icon={Award} value={`${profile.reliability}/100`} label="Reliability" />
      </div>

      <div className="cr-grid cr-grid--2">
        {/* Score factors */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 14 }}>What drives your score</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FACTORS.map(f => (
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

        {/* Growth tips */}
        <Card>
          <div className="cr-card__title" style={{ marginBottom: 14 }}>Ways to grow</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TIPS.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px' }}>
                {t.done
                  ? <CircleCheck size={18} style={{ color: 'var(--in-success)', flexShrink: 0 }} />
                  : <Circle size={18} style={{ color: 'var(--in-gray-light)', flexShrink: 0 }} />}
                <span style={{ fontSize: '0.875rem', color: t.done ? 'var(--in-gray)' : 'var(--in-charcoal)', textDecoration: t.done ? 'line-through' : 'none' }}>
                  {t.text}
                </span>
              </div>
            ))}
          </div>
          <Button variant="ghost" style={{ width: '100%', marginTop: 12 }}>View growth playbook</Button>
        </Card>
      </div>
    </div>
  );
}
