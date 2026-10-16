/**
 * Creator sign-up (Step 1 of the creator journey).
 * Collects a name and a verified phone — the same shell, controls and inline OTP
 * pattern as the business form. There is no password: creators sign in with a
 * one-time code sent to their phone, and the account can only be created once
 * that phone is verified. Email, social accounts and the
 * creator passport are collected in /creator/onboarding.
 */
import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, UserRound } from 'lucide-react';
import { useAuth } from '../../app/AuthContext';
import { authService } from '../../lib/auth/authService';
import { extractAuthError } from './authErrors';
import { IndiaFlag } from './AuthShell';
import FormField from './FormField';
import { OtpPanel, VerifyAction } from './VerifyControls';
import { DEMO_OTP, useOtpVerification } from './useOtpVerification';
import { PATTERNS } from '../business/businessProfile';
import { createCreatorAccount } from '../creator/creatorAccount';

interface CreatorForm {
  name: string;
  phone: string;
  consent: boolean;
}

type Errors = Partial<Record<keyof CreatorForm, string>>;

const INITIAL: CreatorForm = { name: '', phone: '', consent: false };

export default function CreatorSignupForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState<CreatorForm>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const phoneOtp = useOtpVerification();
  const phoneVerified = phoneOtp.status === 'verified';

  const set = <K extends keyof CreatorForm>(key: K, value: CreatorForm[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => (e[key] ? { ...e, [key]: undefined } : e));
    if (key === 'phone' && phoneOtp.status !== 'idle') phoneOtp.reset();
  };

  const fieldError = (key: keyof CreatorForm): string => {
    switch (key) {
      case 'name':
        return form.name.trim().length < 2 ? 'Enter the name brands should see' : '';
      case 'phone':
        if (!PATTERNS.phone.test(form.phone)) return 'Enter a valid 10-digit mobile number';
        return phoneOtp.status === 'verified' ? '' : 'Verify your phone number to continue';
      case 'consent':
        return form.consent ? '' : 'Please accept the Terms and Privacy Policy';
    }
  };

  const blurCheck = (key: keyof CreatorForm) => {
    if (key === 'phone') return;
    const message = fieldError(key);
    setErrors(e => ({ ...e, [key]: message || undefined }));
  };

  const startPhone = () => {
    if (!PATTERNS.phone.test(form.phone)) {
      setErrors(e => ({ ...e, phone: 'Enter a valid 10-digit mobile number' }));
      return;
    }
    setErrors(e => ({ ...e, phone: undefined }));
    phoneOtp.send();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const keys = Object.keys(INITIAL) as Array<keyof CreatorForm>;
    const next: Errors = {};
    keys.forEach(k => {
      const message = fieldError(k);
      if (message) next[k] = message;
    });
    setErrors(next);

    const first = keys.find(k => next[k]);
    if (first) {
      requestAnimationFrame(() => {
        const el = document.getElementById(`cs-${first}`);
        el?.focus({ preventScroll: true });
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    setSubmitting(true);
    setApiError('');
    const name = form.name.trim();
    try {
      const res = await authService.signup({
        businessName: name,
        email: '',
        phone: form.phone,
        password: '',
        accountType: 'creator',
      });
      createCreatorAccount({ displayName: name, phone: form.phone });
      setUser(res.user);
      navigate('/creator/onboarding', { replace: true });
    } catch (err) {
      setApiError(extractAuthError(err));
      setSubmitting(false);
    }
  };

  const invalid = (key: keyof CreatorForm) => (errors[key] ? ' is-invalid' : '');

  return (
    <div className="aw-card aw-card--wide">
      <div className="aw-head">
        <span className="aw-step">Step 1 of 4 · Account</span>
        <h1 className="aw-title">Create your creator account</h1>
        <p className="aw-sub">
          Your name and a verified phone to start. You&apos;ll add your email, socials and creator passport next.
        </p>
      </div>

      <form className="aw-form" onSubmit={onSubmit} noValidate aria-label="Create creator account">
        <fieldset className="aw-section" disabled={submitting}>
          <legend className="aw-section__title">About you</legend>
          <FormField
            id="cs-name" label="Your name" full error={errors.name}
            help={!errors.name ? 'The name brands will see on your creator passport.' : undefined}
          >
            <div className={`aw-control${invalid('name')}`}>
              <UserRound className="aw-control__icon" size={17} />
              <input
                id="cs-name" type="text" placeholder="e.g. Shruti Menon"
                autoComplete="name" value={form.name}
                aria-invalid={Boolean(errors.name)}
                onChange={e => set('name', e.target.value)}
                onBlur={() => blurCheck('name')}
              />
            </div>
          </FormField>
        </fieldset>

        <fieldset className="aw-section" disabled={submitting}>
          <legend className="aw-section__title">Verify phone</legend>
          <FormField
            id="cs-phone" label="Phone number" full error={errors.phone}
            help={phoneOtp.status === 'idle' ? "We'll send a one-time code to this number. You'll use it to sign in." : undefined}
          >
            <div className={`aw-control${invalid('phone')}${phoneOtp.status === 'verified' ? ' is-verified' : ''}`}>
              <span className="aw-prefix aw-prefix--flag"><IndiaFlag /> +91</span>
              <input
                id="cs-phone" type="tel" inputMode="numeric" placeholder="98765 43210"
                autoComplete="tel-national" maxLength={10} value={form.phone}
                aria-invalid={Boolean(errors.phone)}
                readOnly={phoneOtp.status === 'verified'}
                onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
              <VerifyAction
                show={form.phone.length > 0}
                verified={phoneOtp.status === 'verified'}
                busy={phoneOtp.status === 'sending'}
                started={phoneOtp.status !== 'idle'}
                onVerify={startPhone}
                onChange={phoneOtp.reset}
                label="Send OTP"
              />
            </div>
            <OtpPanel otp={phoneOtp} target={`+91 ${form.phone.slice(0, 5)} ${form.phone.slice(5)}`} onResend={startPhone} />
          </FormField>
        </fieldset>

        <fieldset className="aw-section" disabled={submitting}>
          <legend className="aw-section__title">Terms</legend>
          <div className="aw-consent-wrap">
            <label className={`aw-consent${errors.consent ? ' is-invalid' : ''}`} htmlFor="cs-consent">
              <input
                id="cs-consent" type="checkbox" checked={form.consent}
                onChange={e => set('consent', e.target.checked)}
              />
              <span>
                I agree to the <Link to="/terms" className="aw-link">Terms</Link> and{' '}
                <Link to="/privacy" className="aw-link">Privacy Policy</Link>
              </span>
            </label>
            {errors.consent && <p className="aw-error" role="alert">{errors.consent}</p>}
          </div>
        </fieldset>

        {apiError && <p className="aw-error" role="alert">{apiError}</p>}

        <button type="submit" className="aw-submit" disabled={submitting || !phoneVerified}>
          {submitting ? <><span className="aw-spin aw-spin--light" /> Creating account…</> : <>Create creator account <ArrowRight size={18} /></>}
        </button>

        {!phoneVerified && (
          <p className="aw-help" style={{ textAlign: 'center' }}>Verify your phone number to create your account.</p>
        )}

        <p className="aw-demo">Demo mode: the phone code is {DEMO_OTP}.</p>
      </form>
    </div>
  );
}
