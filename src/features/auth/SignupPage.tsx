import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from './schemas';
import { authService } from '../../lib/auth/authService';
import { extractAuthError } from './authErrors';
import AuthPanel from './AuthPanel';
import { EyeIcon, PasswordStrengthBar, GoogleIcon, Spinner, Field } from './AuthFormParts';
import Logo from '../../components/Logo';

/* ── Inline icons ── */
function BuildingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 14V9h4v5M2 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
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

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd]       = useState(false);
  const [apiErr, setApiErr]         = useState('');
  const [googleLoad, setGoogleLoad] = useState(false);

  const {
    register, handleSubmit, watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const passwordValue = watch('password', '');
  const emailErr      = errors.email?.message ?? '';
  const isEmailWarn   = emailErr.startsWith('Tip:');

  const onSubmit = async (data: SignupFormValues) => {
    setApiErr('');
    try {
      const res = await authService.signup({
        businessName: data.businessName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      if (res.requiresOtp) {
        navigate('/verify', { state: { identifier: res.otpTarget, type: res.otpType, context: 'signup' } });
      } else {
        navigate('/onboarding');
      }
    } catch (err) { setApiErr(extractAuthError(err)); }
  };

  const handleGoogle = async () => {
    setApiErr(''); setGoogleLoad(true);
    try {
      await authService.googleSignIn();
      navigate('/onboarding');
    } catch (err) { setApiErr(extractAuthError(err)); }
    finally { setGoogleLoad(false); }
  };

  const busy = isSubmitting || googleLoad;

  return (
    <main id="main-content" className="in-auth-page" aria-label="Sign up">
      <div className="in-auth-blob in-auth-blob--tl" aria-hidden="true"/>
      <div className="in-auth-blob in-auth-blob--br" aria-hidden="true"/>

      <div className="in-auth-container">
        <AuthPanel mode="signup" onSwitch={() => navigate('/login')}/>

        <div className="in-auth-form-side">

          {/* Mobile logo */}
          <div className="in-auth-mobile-logo">
            <Logo size="lg"/>
          </div>

          {/* Mobile tab switcher */}
          <div style={{ width: '100%', maxWidth: 400, marginBottom: 24 }}>
            <div className="in-auth-tabs" role="tablist" aria-label="Auth mode">
              <button role="tab" aria-selected={false} className="in-auth-tabs__btn" onClick={() => navigate('/login')}>Log In</button>
              <button role="tab" aria-selected={true}  className="in-auth-tabs__btn in-auth-tabs__btn--active">Sign Up</button>
            </div>
          </div>

          <div className="in-auth-form-card">

            {/* Header */}
            <div className="in-auth-form-header">
              <h1 className="in-auth-form-title">Create your account</h1>
              <p className="in-auth-form-sub">Start growing with creator marketing in minutes.</p>
            </div>

            {/* Google */}
            <button type="button" className="in-google-btn" onClick={handleGoogle} disabled={busy} aria-label="Continue with Google">
              <GoogleIcon/> Continue with Google
            </button>

            <div className="in-divider"><span>or fill in your details</span></div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="in-form" aria-label="Sign up form">

              {/* Business name */}
              <Field label="Business name" error={errors.businessName?.message} htmlFor="su-biz">
                <div className={`in-input-wrap${errors.businessName ? ' in-input-wrap--err' : ''}`}>
                  <span className="in-icon"><BuildingIcon/></span>
                  <input id="su-biz" type="text" placeholder="e.g. Brew & Bite Café"
                    autoComplete="organization" disabled={busy}
                    className="in-input" {...register('businessName')}/>
                </div>
              </Field>

              {/* Email */}
              <Field
                label="Work email"
                error={isEmailWarn ? undefined : emailErr}
                hint={isEmailWarn ? emailErr : undefined}
                htmlFor="su-email"
              >
                <div className={`in-input-wrap${emailErr && !isEmailWarn ? ' in-input-wrap--err' : ''}`}>
                  <span className="in-icon"><MailIcon/></span>
                  <input id="su-email" type="email" placeholder="you@company.com"
                    autoComplete="email" inputMode="email" disabled={busy}
                    className="in-input" {...register('email')}/>
                </div>
              </Field>

              {/* Phone */}
              <Field label="Phone number" error={errors.phone?.message} htmlFor="su-phone">
                <div className={`in-input-wrap${errors.phone ? ' in-input-wrap--err' : ''}`}>
                  <span className="in-phone-prefix" aria-label="India +91">🇮🇳 +91</span>
                  <input id="su-phone" type="tel" placeholder="9XXXXXXXXX"
                    autoComplete="tel-national" inputMode="tel" enterKeyHint="next"
                    disabled={busy}
                    className="in-input in-input--phone"
                    style={{ paddingLeft: 12 }}
                    {...register('phone')}/>
                </div>
              </Field>

              {/* Password */}
              <Field label="Password" error={errors.password?.message} htmlFor="su-pwd">
                <div className={`in-input-wrap${errors.password ? ' in-input-wrap--err' : ''}`}>
                  <span className="in-icon"><LockIcon/></span>
                  <input id="su-pwd" type={showPwd ? 'text' : 'password'} placeholder="Min 8 chars, mixed case + number"
                    autoComplete="new-password" disabled={busy}
                    className="in-input in-input--suf" {...register('password')}/>
                  <button type="button" className="in-eye" onClick={() => setShowPwd(v => !v)} tabIndex={-1} aria-label={showPwd ? 'Hide' : 'Show'}>
                    <EyeIcon closed={showPwd}/>
                  </button>
                </div>
                <PasswordStrengthBar password={passwordValue}/>
              </Field>

              {/* Consent */}
              <div>
                <label className="in-consent" htmlFor="su-consent">
                  <input id="su-consent" type="checkbox" disabled={busy} {...register('consent')}/>
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" className="in-link">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="in-link">Privacy Policy</Link>
                  </span>
                </label>
                {errors.consent && (
                  <span className="in-err" role="alert" style={{ marginTop: 6, display: 'flex' }}>
                    {errors.consent.message}
                  </span>
                )}
              </div>

              {/* API error */}
              {apiErr && (
                <div className="in-api-err" role="alert">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {apiErr}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="in-submit" disabled={busy}>
                {isSubmitting ? <><Spinner/> Creating account…</> : <>Create account <span aria-hidden="true">→</span></>}
              </button>
            </form>

            <p className="in-switch">
              Already have an account? <Link to="/login" className="in-link">Sign in →</Link>
            </p>

            <p className="in-auth-footer">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1L2 3v3c0 2.5 1.8 4.8 4 5.5C8.2 10.8 10 8.5 10 6V3L6 1z" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              Your data is encrypted and secure
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}
