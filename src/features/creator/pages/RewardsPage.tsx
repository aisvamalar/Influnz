import { useMemo } from 'react';
import { Check, Lock, TrendingUp } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, ProgressBar } from '../ui';
import { CREATOR_SCORE, REWARD_TIERS as TIERS } from '../creatorScore';

export default function RewardsPage() {
  const { profile } = useCreator();

  const currentTier = useMemo(() => {
    return [...TIERS].reverse().find(t => CREATOR_SCORE >= t.minScore) ?? TIERS[0];
  }, []);
  const nextTier = useMemo(() => TIERS.find(t => t.minScore > CREATOR_SCORE), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p className="cr-kicker">Standing</p>
        <h1 className="cr-page-title">Creator Partner & Rewards</h1>
        <p className="cr-page-sub">Unlock benefits as your reputation and performance grow.</p>
      </div>

      {/* Current standing */}
      <Card className="cr-card--hero">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="cr-kicker">Current tier</div>
            <div style={{ fontFamily: 'var(--cr-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--cr-ink)', lineHeight: 1.15 }}>{currentTier.label}</div>
            {nextTier ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', margin: '10px 0 6px' }}>
                  <span style={{ color: 'var(--in-gray)' }}>Progress to {nextTier.label}</span>
                  <span style={{ fontWeight: 700, color: 'var(--in-charcoal)' }}>{Math.max(0, nextTier.minScore - CREATOR_SCORE)} pts to go</span>
                </div>
                <ProgressBar value={(CREATOR_SCORE / nextTier.minScore) * 100} />
              </>
            ) : (
              <div style={{ fontSize: '0.8125rem', color: 'var(--in-success)', fontWeight: 600, marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={14} /> Top tier reached
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tiers */}
      <div className="cr-grid cr-grid--3">
        {TIERS.map(t => {
          const unlocked = CREATOR_SCORE >= t.minScore;
          const isCurrent = t.key === currentTier.key;
          return (
            <Card key={t.key} style={isCurrent ? { border: '1px solid var(--in-coral)' } : undefined}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div className="cr-card__title">{t.label}</div>
                {unlocked
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', fontWeight: 700, color: 'var(--in-success)' }}><Check size={13} /> Unlocked</span>
                  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', fontWeight: 700, color: 'var(--in-gray-light)' }}><Lock size={13} /> {t.minScore}+ score</span>}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {t.benefits.map(b => (
                  <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8125rem', color: unlocked ? 'var(--in-charcoal)' : 'var(--in-gray)' }}>
                    <Check size={15} style={{ color: unlocked ? 'var(--in-success)' : 'var(--in-gray-light)', flexShrink: 0, marginTop: 1 }} /> {b}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card>
        <div style={{ fontSize: '0.8125rem', color: 'var(--in-gray)' }}>
          Tier eligibility is derived from your Creator Score ({CREATOR_SCORE}/100), which reflects reputation, reliability ({profile.reliability}/100), and performance.
        </div>
      </Card>
    </div>
  );
}
