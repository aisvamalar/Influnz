import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Phone, IdCard, Camera, Video, ShieldCheck, Check, ArrowRight,
  ArrowLeft, RefreshCw, AlertCircle, Link as LinkIcon,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Card, Button } from '../ui';
import type { VerificationStatus, PlatformConnection } from '../types';

// ── Phone OTP inline ──────────────────────────────────────────────────
const OTP_LEN = 6;

function PhoneOtpInline({ onVerified }: { onVerified: () => void }) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(''));
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (i: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...digits]; next[i] = d; setDigits(next); setError('');
    if (d && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const sendOtp = () => {
    setSent(true);
    setTimeout(() => refs.current[0]?.focus(), 100);
  };

  const confirm = () => {
    const otp = digits.join('');
    if (otp.length < OTP_LEN) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    setTimeout(() => {
      if (otp === '123456') { onVerified(); }
      else { setError('Invalid code — try 123456'); setDigits(Array(OTP_LEN).fill('')); refs.current[0]?.focus(); }
      setLoading(false);
    }, 600);
  };

  if (!sent) {
    return (
      <div style={{ marginTop: 8 }}>
        <Button variant="ghost" small onClick={sendOtp}>Send OTP</Button>
        <span style={{ fontSize: '0.75rem', color: 'var(--in-gray)', marginLeft: 10 }}>
          Mock mode: code will be 123456
        </span>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={loading}
            style={{
              width: 36, height: 40, borderRadius: 8, border: `1.5px solid ${error ? 'var(--in-danger)' : 'var(--in-gray-light)'}`,
              textAlign: 'center', fontSize: '1rem', fontWeight: 700, outline: 'none',
              color: 'var(--in-charcoal)', background: 'white',
            }}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
        <Button small onClick={confirm} disabled={loading || digits.join('').length < OTP_LEN} style={{ marginLeft: 4 }}>
          {loading ? 'Verifying…' : 'Confirm'}
        </Button>
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--in-danger)' }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}

// ── Social URL input row ──────────────────────────────────────────────
const PLATFORM_PLACEHOLDER: Record<string, string> = {
  instagram: 'instagram.com/yourhandle',
  youtube: 'youtube.com/@yourchannel',
  tiktok: 'tiktok.com/@yourhandle',
};

function SocialUrlRow({
  platform, state, onVerified,
}: {
  platform: PlatformConnection['platform'];
  state: PlatformConnection['state'];
  onVerified: (handle: string) => void;
}) {
  const [url, setUrl] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const Icon = platform === 'youtube' ? Video : Camera;
  const connected = state === 'connected';

  const verify = () => {
    if (!url.trim()) { setError('Paste your profile URL'); return; }
    setError(''); setVerifying(true);
    setTimeout(() => {
      // extract handle from URL or use the raw input
      const match = url.trim().match(/(?:@|\/)([\w.]+)\/?$/);
      const handle = match ? `@${match[1]}` : url.trim();
      onVerified(handle);
      setVerifying(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, paddingBottom: 12, borderBottom: '1px solid var(--in-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)', textTransform: 'capitalize' }}>{platform}</div>
        </div>
        {connected && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-success)', flexShrink: 0 }}>
            <Check size={15} /> Connected
          </span>
        )}
      </div>
      {!connected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 48 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, border: `1.5px solid ${error ? 'var(--in-danger)' : 'var(--in-gray-light)'}`, borderRadius: 10, padding: '6px 10px', background: 'white' }}>
              <LinkIcon size={14} style={{ color: 'var(--in-gray)', flexShrink: 0 }} />
              <input
                type="url"
                value={url}
                onChange={e => { setUrl(e.target.value); setError(''); }}
                placeholder={PLATFORM_PLACEHOLDER[platform]}
                disabled={verifying}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.8125rem', color: 'var(--in-charcoal)', background: 'transparent', minWidth: 0 }}
              />
            </div>
            <Button small onClick={verify} disabled={verifying || !url.trim()}>
              {verifying ? <><RefreshCw size={13} style={{ animation: 'spin 0.65s linear infinite' }} /> Verifying…</> : 'Verify'}
            </Button>
          </div>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--in-danger)' }}>
              <AlertCircle size={12} /> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main VerifyStep ───────────────────────────────────────────────────
const STATUS_LABEL: Record<VerificationStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  verified: 'Verified',
  failed: 'Failed',
};

export default function VerifyStep() {
  const navigate = useNavigate();
  const { profile, verification, setVerification, completeOnboardingStep, updateProfile } = useCreator();
  const [platforms, setPlatforms] = useState<PlatformConnection[]>(profile.platforms);
  const [busy, setBusy] = useState<string | null>(null);

  const connectedSocial = platforms.some(p => p.state === 'connected');

  const handlePhoneVerified = () => setVerification('phone', 'verified');

  const handleSocialVerified = (platform: PlatformConnection['platform'], handle: string) => {
    setPlatforms(list => list.map(p =>
      p.platform === platform ? { ...p, state: 'connected', handle, followers: p.followers || 5200 } : p
    ));
    setVerification('social', 'verified');
  };

  // identity verify (mock button — KYC would be a real flow)
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

          {/* Email — always verified from signup */}
          <div className="cr-row" style={{ paddingTop: 12, paddingBottom: 12 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={18} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>Email</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>Confirmed via OTP during signup</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-success)', flexShrink: 0 }}>
              <Check size={15} /> Verified
            </span>
          </div>

          {/* Phone — inline OTP */}
          <div style={{ paddingTop: 12, paddingBottom: 12, borderTop: '1px solid var(--in-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={18} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--in-charcoal)' }}>Phone</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--in-gray)' }}>
                  {verification.phone === 'verified' ? STATUS_LABEL.verified : 'Verify your mobile number'}
                </div>
              </div>
              {verification.phone === 'verified' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-success)', flexShrink: 0 }}>
                  <Check size={15} /> Verified
                </span>
              )}
            </div>
            {verification.phone !== 'verified' && (
              <div style={{ paddingLeft: 48 }}>
                <PhoneOtpInline onVerified={handlePhoneVerified} />
              </div>
            )}
          </div>

          {/* Identity */}
          <div style={{ paddingTop: 12, paddingBottom: 0, borderTop: '1px solid var(--in-border)' }}>
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

      {/* Social accounts */}
      <Card>
        <div className="cr-card__title" style={{ marginBottom: 4 }}>Connect social accounts</div>
        <div className="cr-card__sub" style={{ marginBottom: 12 }}>
          Paste your profile URL for each platform and hit Verify. Connect at least one.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {platforms.map(p => (
            <SocialUrlRow
              key={p.platform}
              platform={p.platform}
              state={p.state}
              onVerified={handle => handleSocialVerified(p.platform, handle)}
            />
          ))}
        </div>
      </Card>

      <div className="cr-onboarding__actions">
        <Button variant="ghost" onClick={handleSkip}>
          <ArrowLeft size={16} /> Skip for now
        </Button>
        <Button onClick={handleContinue} disabled={!canContinue}>
          Continue <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
