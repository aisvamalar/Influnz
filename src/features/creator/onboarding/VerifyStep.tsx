/**
 * Onboarding step 1 — Verification.
 * Confirm email (OTP), show the phone verified at sign-up, run the mock identity
 * check and connect at least one platform by pasting a profile URL.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, IdCard, Check, ArrowRight, Link as LinkIcon, RefreshCw, CircleAlert } from 'lucide-react';
import PlatformMark, { type PlatformId } from '../../../components/mobile/PlatformMark';
import { useCreator } from '../CreatorContext';
import type { PlatformConnection } from '../types';
import { OtpPanel } from '../../auth/VerifyControls';
import { DEMO_OTP, useOtpVerification } from '../../auth/useOtpVerification';
import { PATTERNS } from '../../business/businessProfile';
import { updateCreatorAccount } from '../creatorAccount';
import { Actions, Btn, ProgressRail, Section, StateChip, StepHead } from './parts';

// ── Email: input + OTP (same controls as sign-up) ────────────────────
function EmailVerify({ onVerified }: { onVerified: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const otp = useOtpVerification();
  const isValid = PATTERNS.email.test(email.trim());
  const locked = otp.status !== 'idle';

  useEffect(() => {
    if (otp.status === 'verified') onVerified(email.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp.status]);

  const send = () => {
    if (!isValid) { setEmailErr('Enter a valid email address'); return; }
    setEmailErr('');
    otp.send();
  };

  return (
    <div className="cro-row__extra">
      <div className={`aw-control${emailErr ? ' is-invalid' : ''}`}>
        <Mail className="aw-control__icon" size={17} />
        <input
          type="email" inputMode="email" autoComplete="email" placeholder="you@email.com"
          aria-label="Email address" value={email} readOnly={locked}
          aria-invalid={Boolean(emailErr)}
          onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
          onKeyDown={e => { if (e.key === 'Enter' && !locked) { e.preventDefault(); send(); } }}
        />
        {!locked
          ? <button type="button" className="aw-inline-btn" onClick={send} disabled={!isValid}>Send code</button>
          : <button type="button" className="aw-inline-btn" onClick={otp.reset}>Change</button>}
      </div>
      {emailErr && <p className="aw-error" role="alert"><CircleAlert size={13} /> {emailErr}</p>}
      <OtpPanel otp={otp} target={email.trim()} onResend={send} />
      {otp.status === 'code' && <p className="aw-demo" style={{ margin: 0 }}>Demo mode: the code is {DEMO_OTP}.</p>}
    </div>
  );
}

// ── Platforms ────────────────────────────────────────────────────────
interface SocialPlatform { id: string; label: string; placeholder: string; mark: PlatformId | 'linkedin' }

const PLATFORMS: SocialPlatform[] = [
  { id: 'instagram', label: 'Instagram',   placeholder: 'instagram.com/yourhandle',    mark: 'instagram' },
  { id: 'youtube',   label: 'YouTube',     placeholder: 'youtube.com/@yourchannel',    mark: 'youtube' },
  { id: 'tiktok',    label: 'TikTok',      placeholder: 'tiktok.com/@yourhandle',      mark: 'tiktok' },
  { id: 'linkedin',  label: 'LinkedIn',    placeholder: 'linkedin.com/in/yourprofile', mark: 'linkedin' },
  { id: 'twitter',   label: 'X (Twitter)', placeholder: 'x.com/yourhandle',            mark: 'x' },
  { id: 'facebook',  label: 'Facebook',    placeholder: 'facebook.com/yourpage',       mark: 'facebook' },
];

/** LinkedIn is not in PlatformMark; a matching rounded mark keeps the tiles consistent. */
function Mark({ id, size = 18 }: { id: PlatformId | 'linkedin'; size?: number }) {
  if (id !== 'linkedin') return <PlatformMark id={id} size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#0a66c2" />
      <path d="M7.1 9.5h2.3V17H7.1zM8.25 6.3a1.33 1.33 0 1 1 0 2.66 1.33 1.33 0 0 1 0-2.66zM10.9 9.5h2.2v1.03h.03c.31-.58 1.06-1.2 2.18-1.2 2.33 0 2.76 1.53 2.76 3.53V17h-2.3v-3.66c0-.87-.02-2-1.22-2s-1.4.95-1.4 1.93V17h-2.3z" fill="#fff" />
    </svg>
  );
}

type LinkState = { url: string; status: 'idle' | 'verifying' | 'done'; handle: string; error: string };
const EMPTY_LINK: LinkState = { url: '', status: 'idle', handle: '', error: '' };

function PlatformConnect({ onVerified }: { onVerified: (platforms: { id: string; handle: string }[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [links, setLinks] = useState<Record<string, LinkState>>({});

  const toggle = (id: string) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]));

  const setUrl = (id: string, url: string) =>
    setLinks(prev => ({ ...prev, [id]: { ...(prev[id] ?? EMPTY_LINK), url, error: '' } }));

  const verify = (id: string) => {
    const s = links[id] ?? EMPTY_LINK;
    if (!s.url.trim()) {
      setLinks(prev => ({ ...prev, [id]: { ...s, error: 'Paste your profile URL' } }));
      return;
    }
    setLinks(prev => ({ ...prev, [id]: { ...s, status: 'verifying', error: '' } }));
    setTimeout(() => {
      const match = s.url.trim().match(/(?:@|\/)([\w.]+)\/?$/);
      const handle = match ? `@${match[1]}` : s.url.trim();
      const next: Record<string, LinkState> = { ...links, [id]: { ...s, status: 'done', handle } };
      setLinks(next);
      onVerified(Object.entries(next).filter(([, v]) => v.status === 'done').map(([pid, v]) => ({ id: pid, handle: v.handle })));
    }, 800);
  };

  const connected = Object.values(links).filter(l => l.status === 'done').length;

  return (
    <>
      <div className="cro-tiles" role="group" aria-label="Platforms">
        {PLATFORMS.map(p => {
          const on = selected.includes(p.id);
          const done = links[p.id]?.status === 'done';
          return (
            <button
              key={p.id}
              type="button"
              className={`cro-tile${on ? ' is-on' : ''}${done ? ' is-done' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(p.id)}
            >
              <span className="cro-tile__icon"><Mark id={p.mark} /></span>
              {p.label}
              {(on || done) && <span className="cro-tile__mark"><Check size={11} strokeWidth={3} /></span>}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="cro-links">
          {selected.map(id => {
            const plat = PLATFORMS.find(p => p.id === id)!;
            const s = links[id] ?? EMPTY_LINK;
            return (
              <div key={id} className="cro-link">
                <div className="cro-link__head">
                  <Mark id={plat.mark} size={15} /> {plat.label}
                  {s.status === 'done' && <StateChip state="ok">Connected as {s.handle}</StateChip>}
                </div>
                {s.status !== 'done' && (
                  <>
                    <div className="cro-link__row">
                      <div className={`aw-control${s.error ? ' is-invalid' : ''}`}>
                        <LinkIcon className="aw-control__icon" size={16} />
                        <input
                          type="url" value={s.url} placeholder={plat.placeholder}
                          aria-label={`${plat.label} profile URL`} disabled={s.status === 'verifying'}
                          onChange={e => setUrl(id, e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); verify(id); } }}
                        />
                      </div>
                      <Btn variant="soft" onClick={() => verify(id)} disabled={s.status === 'verifying' || !s.url.trim()}>
                        {s.status === 'verifying'
                          ? <><RefreshCw size={14} style={{ animation: 'spin 0.65s linear infinite' }} /> Checking…</>
                          : 'Verify'}
                      </Btn>
                    </div>
                    {s.error && <p className="aw-error" role="alert"><CircleAlert size={13} /> {s.error}</p>}
                  </>
                )}
              </div>
            );
          })}
          {connected > 0 && (
            <p className="aw-help" style={{ color: 'var(--cr-up)' }}>
              <Check size={14} /> {connected} platform{connected > 1 ? 's' : ''} connected
            </p>
          )}
        </div>
      )}
    </>
  );
}

// ── Step ─────────────────────────────────────────────────────────────
export default function VerifyStep() {
  const navigate = useNavigate();
  const { profile, verification, setVerification, completeOnboardingStep, updateProfile } = useCreator();
  const [platforms, setPlatforms] = useState<PlatformConnection[]>(
    profile.platforms.map(p => ({ ...p, state: 'disconnected' as const, handle: '', followers: 0 })),
  );
  const [busy, setBusy] = useState<string | null>(null);

  const connectedSocial = platforms.some(p => p.state === 'connected');
  const emailDone = verification.email === 'verified';
  const identityDone = verification.identity === 'verified';

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
        if (idx >= 0) next[idx] = { ...next[idx], state: 'connected', handle: v.handle, followers: next[idx].followers || 5200 };
        else next.push({ platform: v.id as PlatformConnection['platform'], handle: v.handle, followers: 5200, state: 'connected' });
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

  const canContinue = useMemo(() => connectedSocial && verification.identity !== 'pending', [connectedSocial, verification.identity]);

  const finish = (save: boolean) => {
    if (save) updateProfile({ platforms });
    completeOnboardingStep('verify');
    navigate('/creator/onboarding/passport');
  };

  return (
    <>
      <div className="cro-main">
        <StepHead
          eyebrow="Step 1 · Verification"
          title={<>Build trust with <em>brands.</em></>}
          sub="Verified creators get more invitations and better rates. Confirm your contact details and connect the platforms you post on."
        />

        <Section title="Contact & identity" sub="Phone was confirmed at sign-up. Add an email for contracts and payout receipts." list>
          <div className="cro-row">
            <span className={`cro-row__icon${emailDone ? ' cro-row__icon--ok' : ''}`}><Mail size={18} /></span>
            <div>
              <p className="cro-row__title">Email</p>
              <p className="cro-row__sub">{emailDone ? 'Confirmed with a one-time code' : 'We send contracts and receipts here'}</p>
            </div>
            <span className="cro-row__state">
              {emailDone ? <StateChip state="ok">Verified</StateChip> : <StateChip state="todo">Needs verifying</StateChip>}
            </span>
            {!emailDone && <EmailVerify onVerified={handleEmailVerified} />}
          </div>

          <div className="cro-row">
            <span className="cro-row__icon cro-row__icon--ok"><Phone size={18} /></span>
            <div>
              <p className="cro-row__title">Phone</p>
              <p className="cro-row__sub">Verified during sign-up. You use it to sign in.</p>
            </div>
            <span className="cro-row__state"><StateChip state="ok">Verified</StateChip></span>
          </div>

          <div className="cro-row">
            <span className={`cro-row__icon${identityDone ? ' cro-row__icon--ok' : ''}`}><IdCard size={18} /></span>
            <div>
              <p className="cro-row__title">Identity (KYC)</p>
              <p className="cro-row__sub">{identityDone ? 'Identity confirmed' : 'A quick check so brands know you are a real person'}</p>
            </div>
            <span className="cro-row__state">
              {identityDone
                ? <StateChip state="ok">Verified</StateChip>
                : (
                  <Btn variant="soft" small disabled={busy === 'identity'} onClick={verifyIdentity}>
                    {busy === 'identity' ? <><RefreshCw size={14} style={{ animation: 'spin 0.65s linear infinite' }} /> Verifying…</> : 'Verify now'}
                  </Btn>
                )}
            </span>
          </div>
        </Section>

        <Section
          title="Connect your platforms"
          sub="Pick the platforms you are active on, then paste your profile link for each. At least one is required."
          kicker={connectedSocial ? <><Check size={12} /> {platforms.filter(p => p.state === 'connected').length} connected</> : 'Required'}
        >
          <PlatformConnect onVerified={handleSocialsVerified} />
        </Section>
      </div>

      <div className="cro-aside">
        <ProgressRail
          title="Verification checklist"
          items={[
            { label: 'Phone verified', done: true },
            { label: 'Email verified', done: emailDone },
            { label: 'Identity check', done: identityDone },
            { label: 'One platform connected', done: connectedSocial },
          ]}
          note={<>Fully verified creators are shown first in brand searches and receive <strong>up to 3x more invitations</strong>.</>}
        />
      </div>

      <Actions
        left={<Btn variant="link" onClick={() => finish(false)}>Skip for now</Btn>}
        hint={canContinue ? undefined : 'Connect a platform and complete the identity check to continue'}
      >
        <Btn onClick={() => finish(true)} disabled={!canContinue}>
          Continue to passport <ArrowRight size={16} />
        </Btn>
      </Actions>
    </>
  );
}
