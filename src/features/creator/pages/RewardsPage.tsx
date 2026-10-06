import { useMemo } from 'react';
import { Gift, Crown, Check, Lock, TrendingUp } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, ProgressBar } from '../ui';
import type { RewardTier } from '../types';

const TIERS: RewardTier[] = [
  { key: 'rising', label: 'Rising Creator', minScore: 0, benefits: ['Access to campaign invitations', 'AI negotiation agent', 'Protected payments'] },
  { key: 'established', label: 'Established Creator', minScore: 75, benefits: ['Priority matching', 'Higher-value campaigns', 'Verified badge upgrade'] },
  { key: 'partner', label: 'Influnz Partner', minScore: 90, benefits: ['Dedicated success manager', 'Early access to premium brands', 'Faster payouts', 'Referral bonus boost'] },
];

// Creator score mirrors the growth score used elsewhere (mock)
const CREATOR_SCORE = 72;

export default function RewardsPage() {
  const { profile } = useCreator();

  const currentTier = useMemo(() => {
    return [...TIERS].reverse().find(t => CREATOR_SCORE >= t.minScore) ?? TIERS[0];
  }, []);
  const nextTier = useMemo(() => TIERS.find(t => t.minScore > CREATOR_SCORE), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Gift size={22} style={{ color: 'var(--in-coral-text)' }} /> Creator Partner & Rewards
        </h1>
        <p className="cr-page-sub">Unlock benefits as your reputation and performance grow.</p>
      </div>

      {/* Current standing */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(242,132,107,0.08), rgba(248,208,196,0.14))', border: '1px solid var(--in-coral)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          <span style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg, var(--in-coral), var(--in-coral-dark))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Crown size={26} />
          </span>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--in-gray)', fontWeight: 700 }}>Current tier</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--in-charcoal)' }}>{currentTier.label}</div>
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
