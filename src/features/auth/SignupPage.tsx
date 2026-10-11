import { useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Megaphone, Building2, Check, AlertCircle } from 'lucide-react';
import { makeSignupSchema, type SignupFormValues } from './schemas';
import { authService } from '../../lib/auth/authService';
import { extractAuthError } from './authErrors';
import AuthPanel from './AuthPanel';
import { EyeIcon, PasswordStrengthBar, GoogleIcon, Spinner, Field } from './AuthFormParts';
import Logo from '../../components/Logo';
import type { AccountType } from '../../lib/auth/types';

/* ── Inline icons ── */
function BuildingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 14V9h4v5M2 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2.5 14c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
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
const OTP_LEN = 6;

/* ── Inline phone OTP widget (creator signup only) ── */
function PhoneOtpWidget({
  phone,
  onVerified,
  disabled,
}: {
  phone: string;
  onVerified: () => void;
  disabled: boolean;
}) {
  const [stage, setStage] = useState<'idle' | 'sending' | 'otp' | 'confirming' | 'done'>('idle');
  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(''));
  const [otpErr, setOtpErr] = useState('');
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const phoneClean = phone.replace(/\D/g, '');
  const canSend = phoneClean.length === 10;

  const sendOtp = () => {
    if (!canSend) return;
    setStage('sending');
    setTimeout(() => {
      setStage('otp');
      setTimeout(() => refs.current[0]?.focus(), 80);
    }, 600);
  };

  const handleChange = (i: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...digits]; next[i] = d; setDigits(next); setOtpErr('');
    if (d && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft'  && i > 0)              refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < OTP_LEN - 1)   refs.current[i + 1]?.focus();
  };

  const confirm = () => {
    const otp = digits.join('');
    if (otp.length < OTP_LEN) { setOtpErr('Enter the 6-digit code'); return; }
    setStage('confirming');
    setTimeout(() => {
      if (otp === '123456') {
        setStage('done');
        onVerified();
      } else {
        setOtpErr('Invalid code — use 123456 in mock mode');
        setDigits(Array(OTP_LEN).fill(''));
        setStage('otp');
        setTimeout(() => refs.current[0]?.focus(), 80);
      }
    }, 700);
  };

  if (stage === 'done') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: '0.8125rem', color: 'var(--in-success)', fontWeight: 700 }}>
        <Check size={15} /> Phone verified
      </div>
    );
  }

  if (stage === 'idle' || stage === 'sending') {
    return (
      <button
        type="button"
        onClick={sendOtp}
        disabled={disabled || !canSend || stage === 'sending'}
        style={{
          marginTop: 8,
          padding: '7px 16px',
          borderRadius: 10,
          border: '1.5px solid var(--in-coral)',
          background: canSend ? 'rgba(242,132,107,0.08)' : 'transparent',
          color: canSend ? 'var(--in-coral-text)' : 'var(--in-gray-light)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          cursor: canSend ? 'pointer' : 'not-allowed',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {stage === 'sending' ? 'Sending…' : 'Verify phone →'}
      </button>
    );
  }

  // otp | confirming
  return (
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--in-gray)', margin: 0 }}>
        Enter the 6-digit code sent to <strong>+91 {phoneClean}</strong>
        <span style={{ marginLeft: 8, fontSize: '0.7rem', background: 'rgba(242,132,107,0.08)', padding: '2px 8px', borderRadius: 6, color: 'var(--in-coral-text)' }}>
          Mock: 123456
        </span>
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={stage === 'confirming'}
            style={{
              width: 38, height: 44, borderRadius: 10,
              border: `1.5px solid ${otpErr ? 'var(--in-danger)' : 'var(--in-gray-light)'}`,
              textAlign: 'center', fontSize: '1.0625rem', fontWeight: 700, outline: 'none',
              color: 'var(--in-charcoal)', background: 'white',
              transition: 'border-color 0.15s',
            }}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
        <button
          type="button"
          onClick={confirm}
          disabled={stage === 'confirming' || digits.join('').length < OTP_LEN}
          style={{
            marginLeft: 4, padding: '10px 18px', borderRadius: 10,
            background: 'linear-gradient(135deg, var(--in-coral), var(--in-coral-dark))',
            color: '#fff', fontWeight: 700, fontSize: '0.875rem',
            border: 'none', cursor: 'pointer', opacity: digits.join('').length < OTP_LEN ? 0.5 : 1,
          }}
        >
          {stage === 'confirming' ? 'Verifying…' : 'Confirm'}
        </button>
      </div>
      {otpErr && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--in-danger)' }}>
          <AlertCircle size={12} /> {otpErr}
        </div>
      )}
    </div>
  );
}

/* ── Role options ── */
const ROLE_OPTIONS: { type: AccountType; icon: typeof Megaphone; title: string; desc: string }[] = [
  { type: 'creator',  icon: Megaphone,  title: "I'm a Creator",  desc: 'Get discovered by brands and get paid for your content.' },
  { type: 'business', icon: Building2,  title: "I'm a Business", desc: 'Run creator campaigns that drive real results.' },
];

/* ── Page ── */
export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const [accountType, setAccountType] = useState<AccountType | null>(
    roleParam === 'creator' ? 'creator' : roleParam === 'business' ? 'business' : null
  );
  const isCreator = accountType === 'creator';

  const [showPwd, setShowPwd]         = useState(false);
  const [apiErr, setApiErr]           = useState('');
  const [googleLoad, setGoogleLoad]   = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const {
    register, handleSubmit, watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(makeSignupSchema(accountType ?? 'business')),
    mode: 'onBlur',
  });

  const passwordValue = watch('password', '');
  const phoneValue    = watch('phone', '');
  const emailErr      = errors.email?.message ?? '';
  const isEmailWarn   = emailErr.startsWith('Tip:');
  const postAuthPath  = isCreator ? '/creator/onboarding' : '/onboarding';
  const onSubmit = async (data: SignupFormValues) => {
    setApiErr('');
    try {
      const res = await authService.signup({
        businessName: data.businessName,
        email:        data.email ?? '',
        phone:        data.phone,
        password:     data.password,
        accountType:  accountType!,
      });
      // Creators skip the standalone OTP page — phone was already verified inline,
      // email is verified inside the onboarding verify step.
      if (isCreator) {
        navigate(postAuthPath);
      } else if (res.requiresOtp) {
        navigate('/verify', { state: { identifier: res.otpTarget, type: res.otpType, context: 'signup', accountType } });
      } else {
        navigate(postAuthPath);
      }
    } catch (err) { setApiErr(extractAuthError(err)); }
  };

  const handleGoogle = async () => {
    setApiErr(''); setGoogleLoad(true);
    try {
      await authService.googleSignIn();
      navigate(postAuthPath);
    } catch (err) { setApiErr(extractAuthError(err)); }
    finally { setGoogleLoad(false); }
  };

  const busy = isSubmitting || googleLoad;
  // Creator must verify phone before submitting
  const canSubmit = isCreator ? phoneVerified : true;

  return (
    <main id="main-content" className="in-auth-page" aria-label="Sign up">
      <div className="in-auth-blob in-auth-blob--tl" aria-hidden="true"/>
      <div className="in-auth-blob in-auth-blob--br" aria-hidden="true"/>

      <div className="in-auth-container">
        <AuthPanel mode="signup" onSwitch={() => navigate('/login')}/>

        <div className="in-auth-form-side">
          <div className="in-auth-mobile-logo"><Logo size="lg"/></div>

          <div style={{ width: '100%', maxWidth: 400, marginBottom: 24 }}>
            <div className="in-auth-tabs" role="tablist" aria-label="Auth mode">
              <button role="tab" aria-selected={false} className="in-auth-tabs__btn" onClick={() => navigate('/login')}>Log In</button>
              <button role="tab" aria-selected={true}  className="in-auth-tabs__btn in-auth-tabs__btn--active">Sign Up</button>
            </div>
          </div>

          <div className="in-auth-form-card">

            {/* ── STAGE 1: Role picker ── */}
            {!accountType ? (
              <>
                <div className="in-auth-form-header">
                  <h1 className="in-auth-form-title">Create your account</h1>
                  <p className="in-auth-form-sub">Choose how you want to use Influnz.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                  {ROLE_OPTIONS.map(opt => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setAccountType(opt.type)}
                      aria-label={opt.title}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                        border: '2px solid var(--in-gray-light)', background: 'white', width: '100%',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--in-coral)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(242,132,107,0.05)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--in-gray-light)'; (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
                    >
                      <span style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <opt.icon size={22} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--in-charcoal)' }}>{opt.title}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', marginTop: 2 }}>{opt.desc}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--in-gray-light)' }}>
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="in-switch" style={{ marginTop: 20 }}>
                  Already have an account? <Link to="/login" className="in-link">Sign in →</Link>
                </p>
              </>
            ) : (

              /* ── STAGE 2: Signup form ── */
              <>
                <div className="in-auth-form-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg, var(--in-coral), var(--in-coral-dark))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isCreator ? <Megaphone size={16} /> : <Building2 size={16} />}
                    </span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-coral-text)' }}>
                      {isCreator ? 'Creator account' : 'Business account'}
                    </span>
                    <button type="button" onClick={() => setAccountType(null)} style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--in-gray)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 6, textDecoration: 'underline' }}>
                      Change
                    </button>
                  </div>
                  <h1 className="in-auth-form-title">
                    {isCreator ? 'Create your creator account' : 'Create your business account'}
                  </h1>
                  <p className="in-auth-form-sub">
                    {isCreator ? 'Get discovered by brands and get paid for your content.' : 'Start growing with creator marketing in minutes.'}
                  </p>
                </div>

                {/* Google — business only */}
                {!isCreator && (
                  <>
                    <button type="button" className="in-google-btn" onClick={handleGoogle} disabled={busy} aria-label="Continue with Google">
                      <GoogleIcon/> Continue with Google
                    </button>
                    <div className="in-divider"><span>or fill in your details</span></div>
                  </>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="in-form" aria-label="Sign up form">

                  {/* Name */}
                  <Field label={isCreator ? 'Your name' : 'Business name'} error={errors.businessName?.message} htmlFor="su-biz">
                    <div className={`in-input-wrap${errors.businessName ? ' in-input-wrap--err' : ''}`}>
                      <span className="in-icon">{isCreator ? <UserIcon/> : <BuildingIcon/>}</span>
                      <input id="su-biz" type="text"
                        placeholder={isCreator ? 'e.g. Priya Ramesh' : 'e.g. Brew & Bite Café'}
                        autoComplete={isCreator ? 'name' : 'organization'} disabled={busy}
                        className="in-input" {...register('businessName')}/>
                    </div>
                  </Field>

                  {/* Email — business only; creator provides email during onboarding verification */}
                  {!isCreator && (
                    <Field label="Work email" error={isEmailWarn ? undefined : emailErr} hint={isEmailWarn ? emailErr : undefined} htmlFor="su-email">
                      <div className={`in-input-wrap${emailErr && !isEmailWarn ? ' in-input-wrap--err' : ''}`}>
                        <span className="in-icon"><MailIcon/></span>
                        <input id="su-email" type="email" placeholder="you@company.com"
                          autoComplete="email" inputMode="email" disabled={busy}
                          className="in-input" {...register('email')}/>
                      </div>
                    </Field>
                  )}

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

                  {/* Phone + inline OTP */}
                  <Field label="Phone number" error={errors.phone?.message} htmlFor="su-phone">
                    <div className={`in-input-wrap${errors.phone ? ' in-input-wrap--err' : ''}`}>
                      <span className="in-phone-prefix" aria-label="India +91">🇮🇳 +91</span>
                      <input id="su-phone" type="tel" placeholder="9XXXXXXXXX"
                        autoComplete="tel-national" inputMode="tel" enterKeyHint="next"
                        disabled={busy || (isCreator && phoneVerified)}
                        className="in-input in-input--phone"
                        style={{ paddingLeft: 12 }}
                        {...register('phone')}/>
                      {isCreator && phoneVerified && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, paddingRight: 10, fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-success)', flexShrink: 0 }}>
                          <Check size={14} /> Verified
                        </span>
                      )}
                    </div>
                  </Field>

                  {/* Phone OTP widget — creator only */}
                  {isCreator && !phoneVerified && (
                    <PhoneOtpWidget
                      phone={phoneValue}
                      onVerified={() => setPhoneVerified(true)}
                      disabled={busy}
                    />
                  )}

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

                  {/* Creator hint when phone not yet verified */}
                  {isCreator && !phoneVerified && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--in-gray)', padding: '8px 12px', background: 'rgba(242,132,107,0.06)', borderRadius: 8 }}>
                      <AlertCircle size={13} style={{ color: 'var(--in-coral-text)', flexShrink: 0 }} />
                      Verify your phone number above to continue
                    </div>
                  )}

                  {apiErr && (
                    <div className="in-api-err" role="alert">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                      {apiErr}
                    </div>
                  )}

                  <button type="submit" className="in-submit" disabled={busy || !canSubmit}>
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
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
