import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotSchema, type ForgotFormValues } from './schemas';
import { authService } from '../../lib/auth/authService';
import { extractAuthError } from './authErrors';
import Logo from '../../components/Logo';
import { Spinner, Field } from './AuthFormParts';

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

const cardStyle: React.CSSProperties = {
  position: 'relative', zIndex: 1,
  width: '100%', maxWidth: 460, margin: 'auto',
  background: 'white', borderRadius: 28,
  padding: 'clamp(32px,5vw,52px) clamp(24px,5vw,44px)',
  boxShadow: '0 16px 48px rgba(242,132,107,0.15), 0 0 0 1px rgba(255,255,255,0.8)',
  display: 'flex', flexDirection: 'column', gap: 24,
  animation: 'fadeIn 0.4s ease both',
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [sent, setSent]     = useState(false);
  const [apiErr, setApiErr] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<ForgotFormValues>({ resolver: zodResolver(forgotSchema), mode: 'onBlur' });

  const identifier = watch('identifier', '');

  const onSubmit = async (data: ForgotFormValues) => {
    setApiErr('');
    try { await authService.forgotPassword(data.identifier); setSent(true); }
    catch (err) { setApiErr(extractAuthError(err)); }
  };

  return (
    <main id="main-content" className="in-auth-page" style={{ background: 'linear-gradient(145deg,#fef3ed,#fce4d6,#f8d0c4)' }}>
      <div className="in-auth-blob in-auth-blob--tl" aria-hidden="true"/>
      <div className="in-auth-blob in-auth-blob--br" aria-hidden="true"/>

      <div style={cardStyle}>
        <Logo size="md"/>

        {sent ? (
          /* ── Success state ── */
          <div className="in-success-wrap">
            <div className="in-success-icon" aria-hidden="true">✓</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--in-charcoal)', letterSpacing: '-0.02em' }}>
              Check your inbox
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--in-gray)', lineHeight: 1.6, maxWidth: 340 }}>
              We sent a reset link to{' '}
              <strong style={{ color: 'var(--in-charcoal)' }}>{identifier}</strong>.
              Check your spam folder if you don't see it.
            </p>
            <button className="in-submit" onClick={() => navigate('/login')}>
              Back to log in
            </button>
            <button type="button" className="in-link" style={{ fontSize: '0.875rem' }} onClick={() => setSent(false)}>
              Try a different address
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--in-charcoal)', letterSpacing: '-0.03em', marginBottom: 8 }}>
                Forgot your password?
              </h1>
              <p style={{ fontSize: '0.9375rem', color: 'var(--in-gray)', lineHeight: 1.55 }}>
                Enter your email or phone and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="in-form">
              <Field label="Email or phone" error={errors.identifier?.message} htmlFor="fp-id">
                <div className={`in-input-wrap${errors.identifier ? ' in-input-wrap--err' : ''}`}>
                  <span className="in-icon"><MailIcon/></span>
                  <input id="fp-id" type="text" placeholder="Email or +91 phone"
                    autoComplete="username email" inputMode="email"
                    disabled={isSubmitting} className="in-input" {...register('identifier')}/>
                </div>
              </Field>

              {apiErr && (
                <div className="in-api-err" role="alert">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {apiErr}
                </div>
              )}

              <button type="submit" className="in-submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner/> Sending…</> : 'Send reset link'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.875rem' }}>
              <Link to="/login" className="in-link">← Back to log in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
