import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import Logo from '../../components/Logo';
import { Spinner } from './AuthFormParts';

const OTP_LENGTH     = 6;
const RESEND_SECONDS = 30;

interface LocationState {
  identifier: string;
  type: 'email' | 'phone';
  context: 'signup' | 'login';
}

export default function OtpPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { setUser } = useAuth();
  const state      = (location.state ?? {}) as LocationState;
  const identifier = state.identifier ?? '';
  const otpType    = state.type ?? 'email';

  const [digits, setDigits]     = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [timer, setTimer]       = useState(RESEND_SECONDS);
  const [canResend, setResend]  = useState(false);
  const [resending, setResending] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (timer <= 0) { setResend(true); return; }
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const otp = digits.join('');

  const handleChange = (i: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...digits]; next[i] = d; setDigits(next); setError('');
    if (d && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft'  && i > 0)              refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    text.split('').forEach((c, i) => { next[i] = c; });
    setDigits(next);
    refs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  };

  const verify = useCallback(async () => {
    if (otp.length < OTP_LENGTH) { setError('Enter the complete 6-digit code'); return; }
    setError(''); setLoading(true);
    // DEMO MODE: skip backend
    setTimeout(() => {
      setUser({ id: 'demo-001', businessName: 'Demo Business', email: 'demo@influnz.in', role: 'business' } as any);
      navigate('/business', { replace: true });
      setLoading(false);
    }, 800);
  }, [otp, navigate, setUser]);

  // Auto-submit
  useEffect(() => {
    if (digits.every(Boolean) && !loading) verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true); setError('');
    // DEMO MODE: simulate resend
    setTimeout(() => {
      setTimer(RESEND_SECONDS); setResend(false);
      setDigits(Array(OTP_LENGTH).fill(''));
      refs.current[0]?.focus();
      setResending(false);
    }, 500);
  };

  const masked = otpType === 'email'
    ? identifier.replace(/(.{2})(.*)(@.*)/, (_, a, _b, c) => `${a}***${c}`)
    : `+91 ******${identifier.slice(-4)}`;

  return (
    <main id="main-content" className="in-auth-page" style={{ background: 'linear-gradient(145deg,#fef3ed,#fce4d6,#f8d0c4)' }}>
      <div className="in-auth-blob in-auth-blob--tl" aria-hidden="true"/>
      <div className="in-auth-blob in-auth-blob--br" aria-hidden="true"/>

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 460, margin: 'auto',
        background: 'white', borderRadius: 28,
        padding: 'clamp(32px, 5vw, 52px) clamp(24px, 5vw, 44px)',
        boxShadow: '0 16px 48px rgba(242,132,107,0.15), 0 0 0 1px rgba(255,255,255,0.8)',
        display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center',
        animation: 'fadeIn 0.4s ease both',
      }}>
        <Logo size="md"/>

        {/* Icon badge */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg,var(--in-coral),var(--in-coral-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(242,132,107,0.35)',
          fontSize: '1.75rem',
        }}>
          {otpType === 'email' ? '✉️' : '📱'}
        </div>

        {/* Copy */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--in-charcoal)', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Verify your account
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--in-gray)', lineHeight: 1.6 }}>
            We sent a 6-digit code to<br/>
            <strong style={{ color: 'var(--in-charcoal)' }}>{masked}</strong>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', marginTop: 8,
            background: 'rgba(242,132,107,0.07)', padding: '6px 14px', borderRadius: 8, display: 'inline-block' }}>
            Mock mode: use <strong>123456</strong>
          </p>
        </div>

        {/* OTP inputs */}
        <div className="in-otp-group" role="group" aria-label="One-time password" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              type="text" inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={1} value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              disabled={loading}
              className={`in-otp-input${error ? ' in-otp-input--err' : ''}`}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {error && (
          <div className="in-api-err" role="alert" style={{ width: '100%' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        <button type="button" className="in-submit" onClick={verify} disabled={loading || otp.length < OTP_LENGTH}>
          {loading ? <><Spinner/> Verifying…</> : <>Verify &amp; continue <span aria-hidden="true">→</span></>}
        </button>

        {/* Resend */}
        <p className="in-resend">
          Didn't receive the code?{' '}
          {canResend
            ? <button type="button" className="in-link" onClick={handleResend} disabled={resending}>{resending ? 'Sending…' : 'Resend code'}</button>
            : <span style={{ color: 'var(--in-gray-light)' }}>Resend in {timer}s</span>
          }
        </p>

        <button type="button" className="in-link" style={{ fontSize: '0.8125rem' }} onClick={() => navigate(-1)}>
          ← Wrong address? Go back
        </button>
      </div>
    </main>
  );
}
