import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from './schemas';
import { authService } from '../../lib/auth/authService';
import { useAuth } from '../../app/AuthContext';
import { extractAuthError } from './authErrors';
import AuthPanel from './AuthPanel';
import { EyeIcon, GoogleIcon, Spinner, Field } from './AuthFormParts';
import Logo from '../../components/Logo';

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const redirectTo = searchParams.get('redirect') ?? '/dashboard';

  const [showPwd, setShowPwd]     = useState(false);
  const [apiErr, setApiErr]       = useState('');
  const [googleLoad, setGoogleLoad] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { identifier: '', password: '', remember: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiErr('');
    try {
      const res = await authService.login({ identifier: data.identifier, password: data.password, remember: data.remember ?? false });
      setUser(res.user);
      navigate(decodeURIComponent(redirectTo), { replace: true });
    } catch (err) { setApiErr(extractAuthError(err)); }
  };

  const handleGoogle = async () => {
    setApiErr(''); setGoogleLoad(true);
    try {
      const res = await authService.googleSignIn();
      setUser(res.user);
      navigate(decodeURIComponent(redirectTo), { replace: true });
    } catch (err) { setApiErr(extractAuthError(err)); }
    finally { setGoogleLoad(false); }
  };

  const busy = isSubmitting || googleLoad;

  return (
    <main id="main-content" className="in-auth-page" aria-label="Log in">
      {/* Subtle bg blobs (mobile) */}
      <div className="in-auth-blob in-auth-blob--tl" aria-hidden="true"/>
      <div className="in-auth-blob in-auth-blob--br" aria-hidden="true"/>

      <div className="in-auth-container">
        {/* Brand panel — desktop */}
        <AuthPanel mode="login" onSwitch={() => navigate('/signup')}/>

        {/* Form side */}
        <div className="in-auth-form-side">

          {/* Mobile logo */}
          <div className="in-auth-mobile-logo">
            <Logo size="lg"/>
          </div>

          {/* Mobile tab switcher */}
          <div style={{ width: '100%', maxWidth: 400, marginBottom: 24 }}>
            <div className="in-auth-tabs" role="tablist" aria-label="Auth mode">
              <button role="tab" aria-selected={true}  className="in-auth-tabs__btn in-auth-tabs__btn--active">Log In</button>
              <button role="tab" aria-selected={false} className="in-auth-tabs__btn" onClick={() => navigate('/get-started')}>Sign Up</button>
            </div>
          </div>

          {/* Form card */}
          <div className="in-auth-form-card">

            {/* Header */}
            <div className="in-auth-form-header">
              <h1 className="in-auth-form-title">Welcome back! 👋</h1>
              <p className="in-auth-form-sub">Sign in to manage your campaigns and creators.</p>
            </div>

            {/* Google */}
            <button type="button" className="in-google-btn" onClick={handleGoogle} disabled={busy} aria-label="Continue with Google">
              <GoogleIcon/> Continue with Google
            </button>

            <div className="in-divider"><span>or continue with email</span></div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="in-form" aria-label="Login form">

              <Field label="Email or phone" error={errors.identifier?.message} htmlFor="login-id">
                <div className={`in-input-wrap${errors.identifier ? ' in-input-wrap--err' : ''}`}>
                  <span className="in-icon"><MailIcon/></span>
                  <input id="login-id" type="text" placeholder="Email or +91 phone"
                    autoComplete="username email" inputMode="email" disabled={busy}
                    className="in-input" {...register('identifier')}/>
                </div>
              </Field>

              <Field label="Password" error={errors.password?.message} htmlFor="login-pwd">
                <div className={`in-input-wrap${errors.password ? ' in-input-wrap--err' : ''}`}>
                  <span className="in-icon"><LockIcon/></span>
                  <input id="login-pwd" type={showPwd ? 'text' : 'password'} placeholder="Enter your password"
                    autoComplete="current-password" disabled={busy}
                    className="in-input in-input--suf" {...register('password')}/>
                  <button type="button" className="in-eye" onClick={() => setShowPwd(v => !v)} tabIndex={-1} aria-label={showPwd ? 'Hide' : 'Show'}>
                    <EyeIcon closed={showPwd}/>
                  </button>
                </div>
              </Field>

              {/* Remember + forgot */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <label className="in-remember" htmlFor="login-rem">
                  <input id="login-rem" type="checkbox" disabled={busy} {...register('remember')}/>
                  Remember me
                </label>
                <Link to="/forgot-password" className="in-forgot">Forgot password?</Link>
              </div>

              {/* API error */}
              {apiErr && (
                <div className="in-api-err" role="alert">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {apiErr}
                </div>
              )}

              <button type="submit" className="in-submit" disabled={busy}>
                {isSubmitting ? <><Spinner/> Signing in…</> : <>Log in <span aria-hidden="true">→</span></>}
              </button>
            </form>

            {/* Switch */}
            <p className="in-switch">
              Don't have an account? <Link to="/get-started" className="in-link">Create one free →</Link>
            </p>

            {/* Security */}
            <p className="in-auth-footer">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1L2 3v3c0 2.5 1.8 4.8 4 5.5C8.2 10.8 10 8.5 10 6V3L6 1z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              </svg>
              Your data is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
