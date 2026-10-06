import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetSchema, type ResetFormValues } from './schemas';
import Logo from '../../components/Logo';
import { EyeIcon, PasswordStrengthBar, Spinner, Field } from './AuthFormParts';

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
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

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const _token   = params.get('token') ?? ''; void _token;
  const [showPwd, setShowPwd] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [done, setDone]       = useState(false);
  const [apiErr, setApiErr]   = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<ResetFormValues>({ resolver: zodResolver(resetSchema), mode: 'onBlur' });

  const pwdVal = watch('password', '');

  const onSubmit = async (_data: ResetFormValues) => {
    setApiErr('');
    // DEMO MODE: skip backend
    setDone(true);
    setTimeout(() => navigate('/business', { replace: true }), 1500);
  };

  return (
    <main id="main-content" className="in-auth-page" style={{ background: 'linear-gradient(145deg,#fef3ed,#fce4d6,#f8d0c4)' }}>
      <div className="in-auth-blob in-auth-blob--tl" aria-hidden="true"/>
      <div className="in-auth-blob in-auth-blob--br" aria-hidden="true"/>

      <div style={cardStyle}>
        <Logo size="md"/>

        {done ? (
          <div className="in-success-wrap">
            <div className="in-success-icon" aria-hidden="true">🔒</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--in-charcoal)', letterSpacing: '-0.02em' }}>
              Password updated!
            </h1>
            <p style={{ color: 'var(--in-gray)', textAlign: 'center', lineHeight: 1.6, maxWidth: 320 }}>
              Your password has been reset. Sign in with your new password.
            </p>
            <button className="in-submit" onClick={() => navigate('/login')}>
              Go to log in →
            </button>
          </div>
        ) : (
          <>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--in-charcoal)', letterSpacing: '-0.03em', marginBottom: 8 }}>
                Set new password
              </h1>
              <p style={{ fontSize: '0.9375rem', color: 'var(--in-gray)', lineHeight: 1.55 }}>
                Choose a strong password for your Influnz account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="in-form">

              <Field label="New password" error={errors.password?.message} htmlFor="rp-pwd">
                <div className={`in-input-wrap${errors.password ? ' in-input-wrap--err' : ''}`}>
                  <span className="in-icon"><LockIcon/></span>
                  <input id="rp-pwd" type={showPwd ? 'text' : 'password'} placeholder="Min 8 chars"
                    autoComplete="new-password" disabled={isSubmitting}
                    className="in-input in-input--suf" {...register('password')}/>
                  <button type="button" className="in-eye" onClick={() => setShowPwd(v => !v)} tabIndex={-1} aria-label={showPwd ? 'Hide' : 'Show'}>
                    <EyeIcon closed={showPwd}/>
                  </button>
                </div>
                <PasswordStrengthBar password={pwdVal}/>
              </Field>

              <Field label="Confirm password" error={errors.confirm?.message} htmlFor="rp-con">
                <div className={`in-input-wrap${errors.confirm ? ' in-input-wrap--err' : ''}`}>
                  <span className="in-icon"><LockIcon/></span>
                  <input id="rp-con" type={showCon ? 'text' : 'password'} placeholder="Repeat password"
                    autoComplete="new-password" disabled={isSubmitting}
                    className="in-input in-input--suf" {...register('confirm')}/>
                  <button type="button" className="in-eye" onClick={() => setShowCon(v => !v)} tabIndex={-1} aria-label={showCon ? 'Hide' : 'Show'}>
                    <EyeIcon closed={showCon}/>
                  </button>
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
                {isSubmitting ? <><Spinner/> Updating…</> : 'Reset password'}
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
