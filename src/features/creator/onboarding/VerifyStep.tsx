import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Phone, IdCard, ShieldCheck, Check, ArrowRight,
  RefreshCw, AlertCircle, Link as LinkIcon,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button } from '../ui';
import type { PlatformConnection } from '../types';
import { OtpPanel } from '../../auth/VerifyControls';
import { DEMO_OTP, useOtpVerification } from '../../auth/useOtpVerification';
import { PATTERNS } from '../../business/businessProfile';
import { updateCreatorAccount } from '../creatorAccount';
import '../../auth/auth-web.css';

// ── Email input + OTP (same controls as sign-up) ─────────────────────
function EmailVerifyBlock({ onVerified }: { onVerified: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const otp = useOtpVerification();
  const isValid = PATTERNS.email.test(email.trim());

  useEffect(() => {
    if (otp.status === 'verified') onVerified(email.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp.status]);

  const send = () => {
    if (!isValid) { setEmailErr('Enter a valid email address'); return; }
    setEmailErr('');
    otp.send();
  };

  const locked = otp.status !== 'idle';

  return (
    <div className="aw-scope" style={{ paddingLeft: 48, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className={`aw-control${emailErr ? ' is-invalid' : ''}`}>
        <Mail className="aw-control__icon" size={17} />
        <input
          type="email" inputMode="email" autoComplete="email" placeholder="you@email.com"
          aria-label="Email address" value={email} readOnly={locked}
          aria-invalid={Boolean(emailErr)}
          onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
          onKeyDown={e => { if (e.key === 'Enter' && !locked) { e.preventDefault(); send(); } }}
        />
        {!locked ? (
          <button type="button" className="aw-inline-btn" onClick={send} disabled={!isValid}>Send code</button>
        ) : (
          <button type="button" className="aw-inline-btn" onClick={otp.reset}>Change</button>
        )}
      </div>
      {emailErr && (
        <p className="aw-error" role="alert"><AlertCircle size={13} /> {emailErr}</p>
      )}
      <OtpPanel otp={otp} target={email.trim()} onResend={send} />
      {otp.status === 'code' && <p className="aw-demo" style={{ margin: 0 }}>Demo mode: the code is {DEMO_OTP}.</p>}
    </div>
  );
}

// ── Social platform picker + URL verify ──────────────────────────────
type SocialPlatform = {
  id: string;
  label: string;
  placeholder: string;
  icon: string; // emoji fallback — keeps it simple and avoids missing icon issues
};

const ALL_SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'instagram', label: 'Instagram',  placeholder: 'instagram.com/yourhandle',    icon: '📸' },
  { id: 'youtube',   label: 'YouTube',    placeholder: 'youtube.com/@yourchannel',    icon: '▶️' },
  { id: 'linkedin',  label: 'LinkedIn',   placeholder: 'linkedin.com/in/yourprofile', icon: '💼' },
  { id: 'twitter',   label: 'X (Twitter)',placeholder: 'x.com/yourhandle',            icon: '🐦' },
  { id: 'tiktok',    label: 'TikTok',     placeholder: 'tiktok.com/@yourhandle',      icon: '🎵' },
  { id: 'facebook',  label: 'Facebook',   placeholder: 'facebook.com/yourpage',       icon: '👤' },
];

type UrlVerifyState = { url: string; status: 'idle' | 'verifying' | 'done'; handle: string; error: string };

function SocialConnectSection({
  onVerified,
}: {
  onVerified: (platforms: { id: string; handle: string }[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [urlStates, setUrlStates] = useState<Record<string, UrlVerifyState>>({});

  const togglePlatform = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const setUrl = (id: string, url: string) => {
    setUrlStates(prev => ({ ...prev, [id]: { ...prev[id] ?? { status: 'idle', handle: '', error: '' }, url } }));
  };

  const verifyUrl = (id: string) => {
    const s = urlStates[id];
    if (!s?.url?.trim()) {
      setUrlStates(prev => ({ ...prev, [id]: { ...prev[id], error: 'Paste your profile URL' } }));
      return;
    }
    setUrlStates(prev => ({ ...prev, [id]: { ...prev[id], status: 'verifying', error: '' } }));
    setTimeout(() => {
      const match = s.url.trim().match(/(?:@|\/)([\w.]+)\/?$/);
      const handle = match ? `@${match[1]}` : s.url.trim();
      const next = { ...urlStates[id], status: 'done' as const, handle };
      setUrlStates(prev => ({ ...prev, [id]: next }));
      // notify parent
      const verified = Object.entries({ ...urlStates, [id]: next })
        .filter(([, v]) => v.status === 'done')
        .map(([pid, v]) => ({ id: pid, handle: v.handle }));
      onVerified(verified);
    }, 800);
  };

  const verifiedCount = Object.values(urlStates).filter(v => v.status === 'done').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Step 1: pick platforms */}
      <div>
        <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--in-charcoal)', margin: '0 0 6px' }}>
          Which platforms are you active on?
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', margin: '0 0 12px' }}>
          Select all that apply — you'll paste your profile URL for each.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_SOCIAL_PLATFORMS.map(p => {
            const active = selected.has(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '8px 14px', borderRadius: 20,
                  border: `2px solid ${active ? 'var(--in-coral)' : 'var(--in-gray-light)'}`,
                  background: active ? 'rgba(242,132,107,0.09)' : 'white',
                  color: active ? 'var(--in-coral-text)' : 'var(--in-charcoal)',
                  fontWeight: active ? 700 : 500, fontSize: '0.875rem',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <span>{p.icon}</span> {p.label}
                {active && <Check size={13} style={{ marginLeft: 2 }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: URL inputs for selected */}
      {selected.size > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--in-charcoal)', margin: 0 }}>
            Paste your profile URL for each selected platform:
          </p>
          {Array.from(selected).map(id => {
            const plat = ALL_SOCIAL_PLATFORMS.find(p => p.id === id)!;
            const s = urlStates[id] ?? { url: '', status: 'idle', handle: '', error: '' };
            const done = s.status === 'done';
            const verifying = s.status === 'verifying';
            return (
              <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: '0.875rem' }}>{plat.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--in-charcoal)' }}>{plat.label}</span>
                  {done && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-success)', marginLeft: 4 }}>
                      <Check size={12} /> Connected as {s.handle}
                    </span>
                  )}
                </div>
                {!done && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                      border: `1.5px solid ${s.error ? 'var(--in-danger)' : 'var(--in-gray-light)'}`,
                      borderRadius: 10, padding: '6px 10px', background: 'white',
                    }}>
                      <LinkIcon size={13} style={{ color: 'var(--in-gray)', flexShrink: 0 }} />
                      <input
                        type="url" value={s.url}
                        onChange={e => setUrl(id, e.target.value)}
                        placeholder={plat.placeholder} disabled={verifying}
                        style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.8125rem', color: 'var(--in-charcoal)', background: 'transparent', minWidth: 0 }}
                      />
                    </div>
                    <Button small onClick={() => verifyUrl(id)} disabled={verifying || !s.url?.trim()}>
                      {verifying ? <><RefreshCw size={13} style={{ animation: 'spin 0.65s linear infinite' }} /> Verifying…</> : 'Verify'}
                    </Button>
                  </div>
                )}
                {s.error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--in-danger)' }}>
                    <AlertCircle size={12} /> {s.error}
                  </div>
                )}
              </div>
            );
          })}
          {verifiedCount > 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--in-success)', fontWeight: 600, margin: 0 }}>
              ✓ {verifiedCount} platform{verifiedCount > 1 ? 's' : ''} connected
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────
export default function VerifyStep() {
  const navigate = useNavigate();
  const { profile, verification, setVerification, completeOnboardingStep, updateProfile } = useCreator();
  const [platforms, setPlatforms] = useState<PlatformConnection[]>(
    profile.platforms.map(p => ({ ...p, state: 'disconnected' as const, handle: '', followers: 0 }))
  );
  const [busy, setBusy] = useState<string | null>(null);

  const connectedSocial = platforms.some(p => p.state === 'connected');

  const handleEmailVerified = (email: string) => {
    updateProfile({ username: profile.username || email.split('@')[0] });
    updateCreatorAccount({ email, emailVerified: true });
    setVerification('email', 'verified');
  };

  const handleSocialsVerified = (verified: { id: string; handle: string }[]) => {
    setPlatforms(prev => {
      const next = [...prev];
      verified.forEach(v => {
        const idx = next.findIndex(p => p.platform === v.id);
        if (idx >= 0) {
          next[idx] = { ...next[idx], state: 'connected', handle: v.handle, followers: next[idx].followers || 5200 };
        } else {
          next.push({ platform: v.id as PlatformConnection['platform'], handle: v.handle, followers: 5200, state: 'connected' });
        }
      });
      return next;
    });
    setVerification('social', 'verified');
  };

  const verifyIdentity = () => {
    setBusy('identity');
    setVerification('identity', 'in_progress');
    setTimeout(() => { setVerification('identity', 'verified'); setBusy(null); }, 800);
  };

  const canContinue = useMemo(
    () => connectedSocial && verification.identity !== 'pending',
    [connectedSocial, verification.identity],
  );

  const handleContinue = () => {
    updateProfile({ platforms });
    completeOnboardingStep('verify');
    navigate('/creator/onboarding/passport');
  };

  const handleSkip = () => {
    completeOnboardingStep('verify');
    navigate('/creator/onboarding/passport');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="cr-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={22} style={{ color: 'var(--in-coral-text)' }} /> Verify your identity
        </h1>
        <p className="cr-page-sub">Build trust with brands. Verify your details and connect your social accounts.</p>
      </div>

      {/* Account verification */}
      <Card>
        <div className="cr-card__title" style={{ marginBottom: 12 }}>Account verification</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Email — input + OTP */}
          <div style={{ paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={18} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>Email</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>
                  {verification.email === 'verified' ? 'Verified' : 'Enter your email and confirm with OTP'}
                </div>
              </div>
              {verification.email === 'verified' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-success)', flexShrink: 0 }}>
                  <Check size={15} /> Verified
                </span>
              )}
            </div>
            {verification.email !== 'verified' && (
              <EmailVerifyBlock onVerified={handleEmailVerified} />
            )}
          </div>

          {/* Phone — verified during signup */}
          <div className="cr-row" style={{ paddingTop: 12, paddingBottom: 12, borderTop: '1px solid var(--in-border)' }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={18} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>Phone</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>Verified during signup</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-success)', flexShrink: 0 }}>
              <Check size={15} /> Verified
            </span>
          </div>

          {/* Identity */}
          <div style={{ paddingTop: 12, borderTop: '1px solid var(--in-border)' }}>
            <div className="cr-row">
              <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IdCard size={18} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>Identity</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>
                  {verification.identity === 'verified' ? 'Verified' : 'Verify your identity (KYC)'}
                </div>
              </div>
              {verification.identity === 'verified' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-success)', flexShrink: 0 }}>
                  <Check size={15} /> Verified
                </span>
              ) : (
                <Button variant="ghost" small disabled={busy === 'identity'} onClick={verifyIdentity}>
                  {busy === 'identity' ? 'Verifying…' : 'Verify'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Social platforms */}
      <Card>
        <SocialConnectSection onVerified={handleSocialsVerified} />
      </Card>

      <div className="cr-onboarding__actions">
        <Button variant="ghost" onClick={handleSkip}>Skip</Button>
        <Button onClick={handleContinue} disabled={!canContinue}>
          Continue <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
