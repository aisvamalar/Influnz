import { useMemo, useState } from 'react';
import { Share2, Copy, Check, Gift, UserPlus } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, StatCard, Button, StatusPill, EmptyState } from '../ui';
import { inr } from '../format';

const REFERRAL_STATUS_LABEL: Record<string, string> = {
  sent: 'Invite sent',
  joined: 'Joined',
  rewarded: 'Rewarded',
};

export default function ReferralsPage() {
  const { profile, referrals } = useCreator();
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => `${profile.username.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-INV`, [profile.username]);
  const link = `https://influnz.in/join?ref=${code}`;

  const earned = referrals.filter(r => r.status === 'rewarded').reduce((s, r) => s + (r.reward ?? 0), 0);
  const joined = referrals.filter(r => r.status === 'joined' || r.status === 'rewarded').length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Share2 size={22} style={{ color: 'var(--in-coral-text)' }} /> Referrals
        </h1>
        <p className="cr-page-sub">Invite other creators and earn rewards when they join.</p>
      </div>

      <div className="cr-grid cr-grid--3">
        <StatCard icon={UserPlus} value={referrals.length} label="Invites sent" />
        <StatCard icon={Check} value={joined} label="Joined" />
        <StatCard icon={Gift} value={inr(earned)} label="Rewards earned" />
      </div>

      <Card>
        <div className="cr-card__title" style={{ marginBottom: 6 }}>Your referral link</div>
        <div className="cr-card__sub" style={{ marginBottom: 14 }}>Share this link. Earn {inr(500)} when a creator joins and completes their first campaign.</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input className="cr-input" readOnly value={link} style={{ flex: 1, minWidth: 220 }} aria-label="Referral link" />
          <Button onClick={copy}>
            {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
          </Button>
        </div>
        <div style={{ marginTop: 10, fontSize: '0.8125rem', color: 'var(--in-gray)' }}>
          Code: <strong style={{ color: 'var(--in-coral-text)' }}>{code}</strong>
        </div>
      </Card>

      <Card>
        <div className="cr-card__title" style={{ marginBottom: 12 }}>Referral activity</div>
        {referrals.length === 0 ? (
          <EmptyState icon={Share2} title="No referrals yet" text="Share your link to start earning." />
        ) : (
          <div>
            {referrals.map(r => (
              <div key={r.id} className="cr-row" style={{ paddingTop: 12, paddingBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>{r.invitedName ?? 'Pending invite'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>{REFERRAL_STATUS_LABEL[r.status]}</div>
                </div>
                {r.reward ? <span style={{ fontWeight: 800, color: 'var(--in-success)', fontSize: '0.875rem' }}>{inr(r.reward)}</span> : null}
                <StatusPill status={r.status === 'rewarded' ? 'paid' : r.status === 'joined' ? 'active' : 'pending'} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
