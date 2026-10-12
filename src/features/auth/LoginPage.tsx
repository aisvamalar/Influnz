import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, PhoneCall, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../app/AuthContext';
import AuthShell, { IndiaFlag, type Audience } from './AuthShell';
import FormField from './FormField';
import OtpInput from './OtpInput';
import { DEMO_OTP, useOtpVerification } from './useOtpVerification';
import { PATTERNS, getBusinessProfile, updateBusinessAccount } from '../business/businessProfile';
import { signInCreator } from '../creator/creatorAccount';

const TRUST = [
  { icon: PhoneCall, text: 'Secure OTP verification' },
  { icon: Lock, text: 'No password to remember' },
  { icon: ShieldCheck, text: 'Your data is encrypted' },
];

function safeRedirect(value: string | null, fallback: string) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
}

export default function LoginPage() {
  return (
    <AuthShell mode="login" creator={<LoginForm audience="creator" />}>
      <LoginForm audience="business" />
    </AuthShell>
  );
}

/**
 * Phone + OTP sign-in, shared by both audiences. The audience decides the copy,
 * which demo account the number signs into, and where the user lands afterwards.
 */
function LoginForm({ audience }: { audience: Audience }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setUser } = useAuth();
  const otp = useOtpVerification();
  const isCreator = audience === 'creator';

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const onCodeStep = otp.status === 'code' || otp.status === 'checking' || otp.status === 'verified';
  const formatted = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  const inputId = `login-phone-${audience}`;

  const sendCode = (e?: FormEvent) => {
    e?.preventDefault();
    if (!PATTERNS.phone.test(phone)) {
      setPhoneError('Enter the 10-digit mobile number linked to your account');
      return;
    }
    setPhoneError('');
    otp.send();
  };

  const changeNumber = () => {
    otp.reset();
    requestAnimationFrame(() => document.getElementById(inputId)?.focus());
  };

  useEffect(() => {
    if (otp.status !== 'verified') return;

    if (isCreator) {
      // Demo mode: any number signs into the stored creator account (or the demo creator).
      const account = signInCreator(phone);
      setUser({
        id: `usr_${phone}`,
        businessName: account.displayName,
        email: account.email,
        phone,
        role: 'owner',
        accountType: 'creator',
        avatarInitials: account.displayName.slice(0, 2).toUpperCase(),
      });
      navigate(safeRedirect(params.get('redirect'), '/creator'), { replace: true });
      return;
    }

    // Demo mode: any number signs into the stored business account.
    if (getBusinessProfile().account.phone !== phone) updateBusinessAccount({ phone });
    const { account } = getBusinessProfile();
    const businessName = account.businessName;
    setUser({
      id: `usr_${phone}`,
      businessName,
      email: account.email,
      phone,
      role: 'owner',
      accountType: 'business',
      avatarInitials: businessName.slice(0, 2).toUpperCase(),
    });
    navigate(safeRedirect(params.get('redirect'), '/business'), { replace: true });
  }, [otp.status, phone, params, navigate, setUser, isCreator]);

  return (
    <div className="aw-panel">
      {!onCodeStep ? (
        <form className="aw-form" onSubmit={sendCode} noValidate aria-label="Sign in with phone">
          <div className="aw-head">
            <h1 className="aw-title aw-title--lg">Welcome back</h1>
            <p className="aw-sub">{isCreator ? 'Sign in to your creator account' : 'Sign in to your business account'}</p>
          </div>

          <FormField id={inputId} label="Phone number" error={phoneError}>
            <div className={`aw-control aw-control--lg${phoneError ? ' is-invalid' : ''}`}>
              <span className="aw-prefix aw-prefix--flag"><IndiaFlag /> +91</span>
              <input
                id={inputId} type="tel" inputMode="numeric" placeholder="98765 43210"
                autoComplete="tel-national" maxLength={10} autoFocus value={phone}
                aria-invalid={Boolean(phoneError)}
                disabled={otp.status === 'sending'}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneError(''); }}
              />
            </div>
          </FormField>

          <button type="submit" className="aw-submit" disabled={otp.status === 'sending'}>
            {otp.status === 'sending'
              ? <><span className="aw-spin aw-spin--light" /> Sending code…</>
              : <>Send OTP <ArrowRight size={18} /></>}
          </button>
        </form>
      ) : (
        <div className="aw-form" aria-live="polite">
          <button type="button" className="aw-back" onClick={changeNumber}>
            <ArrowLeft size={16} /> Change number
          </button>

          <div className="aw-head">
            <h1 className="aw-title aw-title--lg">Enter the code</h1>
            <p className="aw-sub">We sent a 6-digit code to <strong>{formatted}</strong></p>
          </div>

          <OtpInput
            value={otp.code} onChange={otp.enter} autoFocus
            invalid={Boolean(otp.error)} disabled={otp.status !== 'code'}
            label="Sign-in code"
          />
          {otp.error && <p className="aw-error" role="alert">{otp.error}</p>}

          <button
            type="button" className="aw-submit"
            onClick={() => otp.confirm(otp.code)}
            disabled={otp.status !== 'code' || otp.code.length < 6}
          >
            {otp.status === 'code'
              ? <>Verify and sign in <ArrowRight size={18} /></>
              : <><span className="aw-spin aw-spin--light" /> Signing you in…</>}
          </button>

          <p className="aw-switch">
            Didn't get it?{' '}
            {otp.timer > 0
              ? <span className="aw-muted">Resend in {otp.timer}s</span>
              : <button type="button" className="aw-link" onClick={() => sendCode()}>Resend code</button>}
          </p>
        </div>
      )}

      <ul className="aw-trust">
        {TRUST.map(({ icon: Icon, text }) => (
          <li key={text}><Icon size={20} />{text}</li>
        ))}
      </ul>

      <p className="aw-legal">
        By signing in, you agree to our <Link to="/terms">Terms of Service</Link> and{' '}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <p className="aw-legal aw-legal--demo">Demo mode: any number works, and the code is {DEMO_OTP}.</p>
    </div>
  );
}
