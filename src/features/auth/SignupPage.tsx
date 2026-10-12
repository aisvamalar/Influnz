import { useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, AtSign, BadgeCheck, Briefcase, Building2, ChevronDown, Copy, Eye, EyeOff,
  Globe, Lock, Mail, MapPin, UserRound,
} from 'lucide-react';
import { useAuth } from '../../app/AuthContext';
import { passwordStrength } from './schemas';
import AuthShell, { IndiaFlag } from './AuthShell';
import FormField from './FormField';
import OtpInput from './OtpInput';
import { DEMO_OTP, useOtpVerification, type OtpVerification } from './useOtpVerification';
import {
  BUSINESS_TYPES, PATTERNS, POPULAR_CITIES, createBusinessAccount, presenceKind, type PresenceKind,
} from '../business/businessProfile';

interface SignupForm {
  businessName: string;
  contactPerson: string;
  businessType: string;
  city: string;
  presence: string;
  phone: string;
  email: string;
  password: string;
  consent: boolean;
}

type Errors = Partial<Record<keyof SignupForm, string>>;

type PresenceStatus = 'idle' | 'pending' | 'checking' | 'verified';

const PRESENCE_COPY: Record<PresenceKind, { label: string; where: string }> = {
  instagram: { label: 'Instagram', where: 'to your Instagram bio' },
  linkedin: { label: 'LinkedIn', where: "to your LinkedIn page's About section" },
  website: { label: 'Website', where: 'anywhere on your homepage, such as the footer' },
};

const INITIAL: SignupForm = {
  businessName: '',
  contactPerson: '',
  businessType: 'Company',
  city: '',
  presence: '',
  phone: '',
  email: '',
  password: '',
  consent: false,
};

function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return `INF-${Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState<SignupForm>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const phoneOtp = useOtpVerification();
  const emailOtp = useOtpVerification();

  const [presenceStatus, setPresenceStatus] = useState<PresenceStatus>('idle');
  const [presenceCode, setPresenceCode] = useState('');
  const [copied, setCopied] = useState(false);

  const kind = presenceKind(form.presence);
  const strength = passwordStrength(form.password);

  const set = <K extends keyof SignupForm>(key: K, value: SignupForm[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => (e[key] ? { ...e, [key]: undefined } : e));
    if (key === 'phone' && phoneOtp.status !== 'idle') phoneOtp.reset();
    if (key === 'email' && emailOtp.status !== 'idle') emailOtp.reset();
    if (key === 'presence' && presenceStatus !== 'idle') setPresenceStatus('idle');
  };

  const fieldError = (key: keyof SignupForm, f: SignupForm = form): string => {
    switch (key) {
      case 'businessName':
        return f.businessName.trim().length < 2 ? 'Enter your business name' : '';
      case 'contactPerson':
        return f.contactPerson.trim().length < 2 ? 'Enter the name of the person we should contact' : '';
      case 'businessType':
        return f.businessType ? '' : 'Choose your business type';
      case 'city':
        return f.city.trim().length < 2 ? 'Enter your city' : '';
      case 'presence':
        if (!f.presence.trim()) return '';
        if (!kind) return 'Enter a website, an @instagram handle or a LinkedIn page link';
        return presenceStatus === 'verified' ? '' : 'Verify this link, or leave it empty';
      case 'phone':
        if (!PATTERNS.phone.test(f.phone)) return 'Enter a valid 10-digit mobile number';
        return phoneOtp.status === 'verified' ? '' : 'Verify your phone number to continue';
      case 'email':
        if (!f.email.trim()) return '';
        if (!PATTERNS.email.test(f.email.trim())) return 'Enter a valid email address';
        return emailOtp.status === 'verified' ? '' : 'Verify this email, or leave it empty';
      case 'password':
        if (f.password.length < 8) return 'Use at least 8 characters';
        if (!/[A-Z]/.test(f.password) || !/[a-z]/.test(f.password) || !/\d/.test(f.password)) {
          return 'Mix upper and lower case letters with at least one number';
        }
        return '';
      case 'consent':
        return f.consent ? '' : 'Please accept the Terms and Privacy Policy';
    }
  };

  const blurCheck = (key: keyof SignupForm) => {
    if (key === 'phone' || key === 'email' || key === 'presence') return;
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

  const startEmail = () => {
    if (!PATTERNS.email.test(form.email.trim())) {
      setErrors(e => ({ ...e, email: 'Enter a valid email address' }));
      return;
    }
    setErrors(e => ({ ...e, email: undefined }));
    emailOtp.send();
  };

  const startPresence = () => {
    if (!kind) {
      setErrors(e => ({ ...e, presence: 'Enter a website, an @instagram handle or a LinkedIn page link' }));
      return;
    }
    setErrors(e => ({ ...e, presence: undefined }));
    setPresenceCode(makeCode());
    setCopied(false);
    setPresenceStatus('pending');
  };

  const checkPresence = () => {
    setPresenceStatus('checking');
    setTimeout(() => setPresenceStatus('verified'), 1200);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(presenceCode);
      setCopied(true);
    } catch { /* clipboard unavailable */ }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const keys = Object.keys(INITIAL) as Array<keyof SignupForm>;
    const next: Errors = {};
    keys.forEach(k => {
      const message = fieldError(k);
      if (message) next[k] = message;
    });
    setErrors(next);

    const first = keys.find(k => next[k]);
    if (first) {
      requestAnimationFrame(() => {
        const el = document.getElementById(`su-${first}`);
        el?.focus({ preventScroll: true });
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    setSubmitting(true);
    const email = form.email.trim();
    const businessName = form.businessName.trim();
    setTimeout(() => {
      createBusinessAccount({
        businessName,
        contactPerson: form.contactPerson.trim(),
        phone: form.phone,
        email,
        emailVerified: Boolean(email),
        businessType: form.businessType,
        presence: form.presence.trim(),
        presenceVerified: Boolean(form.presence.trim()),
        city: form.city.trim(),
      });
      setUser({
        id: `usr_${Date.now()}`,
        businessName,
        email,
        phone: form.phone,
        role: 'owner',
        accountType: 'business',
        avatarInitials: businessName.slice(0, 2).toUpperCase(),
      });
      navigate('/business', { replace: true });
    }, 900);
  };

  const invalid = (key: keyof SignupForm) => (errors[key] ? ' is-invalid' : '');

  return (
    <AuthShell mode="signup">
      <div className="aw-card aw-card--wide">
        <div className="aw-head">
          <span className="aw-step">Step 1 of 3 · Account</span>
          <h1 className="aw-title">Create your business account</h1>
          <p className="aw-sub">
            Tell us about your business and verify your phone. You can add GSTIN and payment details later.
          </p>
        </div>

        <form className="aw-form" onSubmit={onSubmit} noValidate aria-label="Create business account">
          <fieldset className="aw-section" disabled={submitting}>
            <legend className="aw-section__title">Business details</legend>
            <div className="aw-grid">
              <FormField id="su-businessName" label="Business name" error={errors.businessName}>
                <div className={`aw-control${invalid('businessName')}`}>
                  <Building2 className="aw-control__icon" size={17} />
                  <input
                    id="su-businessName" type="text" placeholder="e.g. Brew & Bites Café"
                    autoComplete="organization" value={form.businessName}
                    aria-invalid={Boolean(errors.businessName)}
                    onChange={e => set('businessName', e.target.value)}
                    onBlur={() => blurCheck('businessName')}
                  />
                </div>
              </FormField>

              <FormField id="su-contactPerson" label="Contact person" error={errors.contactPerson}>
                <div className={`aw-control${invalid('contactPerson')}`}>
                  <UserRound className="aw-control__icon" size={17} />
                  <input
                    id="su-contactPerson" type="text" placeholder="Full name"
                    autoComplete="name" value={form.contactPerson}
                    aria-invalid={Boolean(errors.contactPerson)}
                    onChange={e => set('contactPerson', e.target.value)}
                    onBlur={() => blurCheck('contactPerson')}
                  />
                </div>
              </FormField>

              <FormField id="su-businessType" label="Business type" error={errors.businessType}>
                <div className={`aw-control aw-control--select${invalid('businessType')}`}>
                  <Briefcase className="aw-control__icon" size={17} />
                  <select
                    id="su-businessType" value={form.businessType}
                    onChange={e => set('businessType', e.target.value)}
                  >
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="aw-control__chevron" size={16} />
                </div>
              </FormField>

              <FormField id="su-city" label="City" error={errors.city}>
                <div className={`aw-control${invalid('city')}`}>
                  <MapPin className="aw-control__icon" size={17} />
                  <input
                    id="su-city" type="text" placeholder="e.g. Chennai" list="su-city-list"
                    autoComplete="address-level2" value={form.city}
                    aria-invalid={Boolean(errors.city)}
                    onChange={e => set('city', e.target.value)}
                    onBlur={() => blurCheck('city')}
                  />
                  <datalist id="su-city-list">
                    {POPULAR_CITIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </FormField>

              <FormField
                id="su-presence" label="Website / Instagram / LinkedIn" optional full
                error={errors.presence}
                help={presenceStatus === 'idle' ? 'Helps creators trust your brand. We verify it before you sign up.' : undefined}
              >
                <div className={`aw-control${invalid('presence')}${presenceStatus === 'verified' ? ' is-verified' : ''}`}>
                  {kind === 'instagram' ? <AtSign className="aw-control__icon" size={17} /> : <Globe className="aw-control__icon" size={17} />}
                  <input
                    id="su-presence" type="text" placeholder="yourbrand.in, @yourbrand or linkedin.com/company/…"
                    autoComplete="url" value={form.presence}
                    aria-invalid={Boolean(errors.presence)}
                    readOnly={presenceStatus === 'verified'}
                    onChange={e => set('presence', e.target.value)}
                  />
                  {kind && presenceStatus === 'idle' && (
                    <span className="aw-kind">{PRESENCE_COPY[kind].label}</span>
                  )}
                  <VerifyAction
                    show={Boolean(form.presence.trim())}
                    verified={presenceStatus === 'verified'}
                    busy={false}
                    started={presenceStatus !== 'idle'}
                    onVerify={startPresence}
                    onChange={() => setPresenceStatus('idle')}
                  />
                </div>
                {kind && (presenceStatus === 'pending' || presenceStatus === 'checking') && (
                  <div className="aw-verify">
                    <p className="aw-verify__text">
                      Add this code {PRESENCE_COPY[kind].where}, then check. You can remove it once we confirm.
                    </p>
                    <div className="aw-verify__row">
                      <button type="button" className="aw-code" onClick={copyCode} aria-label={`Copy code ${presenceCode}`}>
                        <span>{presenceCode}</span>
                        <Copy size={14} />
                        <small>{copied ? 'Copied' : 'Copy'}</small>
                      </button>
                      <button
                        type="button" className="aw-btn aw-btn--soft"
                        onClick={checkPresence} disabled={presenceStatus === 'checking'}
                      >
                        {presenceStatus === 'checking' ? <><span className="aw-spin" /> Checking…</> : "I've added it, check now"}
                      </button>
                    </div>
                  </div>
                )}
              </FormField>
            </div>
          </fieldset>

          <fieldset className="aw-section" disabled={submitting}>
            <legend className="aw-section__title">Verify contact</legend>
            <div className="aw-grid">
              <FormField
                id="su-phone" label="Phone number" full error={errors.phone}
                help={phoneOtp.status === 'idle' ? "We'll send a one-time code to this number. You'll use it to sign in." : undefined}
              >
                <div className={`aw-control${invalid('phone')}${phoneOtp.status === 'verified' ? ' is-verified' : ''}`}>
                  <span className="aw-prefix aw-prefix--flag"><IndiaFlag /> +91</span>
                  <input
                    id="su-phone" type="tel" inputMode="numeric" placeholder="98765 43210"
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

              <FormField
                id="su-email" label="Work email" optional full error={errors.email}
                help={emailOtp.status === 'idle' ? 'For invoices and campaign updates. Verified with a code.' : undefined}
              >
                <div className={`aw-control${invalid('email')}${emailOtp.status === 'verified' ? ' is-verified' : ''}`}>
                  <Mail className="aw-control__icon" size={17} />
                  <input
                    id="su-email" type="email" inputMode="email" placeholder="you@company.com"
                    autoComplete="email" value={form.email}
                    aria-invalid={Boolean(errors.email)}
                    readOnly={emailOtp.status === 'verified'}
                    onChange={e => set('email', e.target.value)}
                  />
                  <VerifyAction
                    show={Boolean(form.email.trim())}
                    verified={emailOtp.status === 'verified'}
                    busy={emailOtp.status === 'sending'}
                    started={emailOtp.status !== 'idle'}
                    onVerify={startEmail}
                    onChange={emailOtp.reset}
                    label="Send code"
                  />
                </div>
                <OtpPanel otp={emailOtp} target={form.email.trim()} onResend={startEmail} />
              </FormField>
            </div>
          </fieldset>

          <fieldset className="aw-section" disabled={submitting}>
            <legend className="aw-section__title">Secure your account</legend>
            <FormField
              id="su-password" label="Password" full error={errors.password}
              help={!form.password ? 'At least 8 characters with upper and lower case letters and a number.' : undefined}
            >
              <div className={`aw-control${invalid('password')}`}>
                <Lock className="aw-control__icon" size={17} />
                <input
                  id="su-password" type={showPwd ? 'text' : 'password'} placeholder="Create a password"
                  autoComplete="new-password" value={form.password}
                  aria-invalid={Boolean(errors.password)}
                  onChange={e => set('password', e.target.value)}
                  onBlur={() => form.password && blurCheck('password')}
                />
                <button
                  type="button" className="aw-icon-btn" onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {form.password && (
                <div className="aw-strength" aria-live="polite">
                  {[1, 2, 3, 4].map(i => (
                    <span key={i} style={{ background: i <= strength.score ? strength.color : undefined }} />
                  ))}
                  <small style={{ color: strength.color }}>{strength.label}</small>
                </div>
              )}
            </FormField>

            <div className="aw-consent-wrap">
              <label className={`aw-consent${errors.consent ? ' is-invalid' : ''}`} htmlFor="su-consent">
                <input
                  id="su-consent" type="checkbox" checked={form.consent}
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

          <VerificationSummary
            phone={phoneOtp.status === 'verified'}
            email={!form.email.trim() ? null : emailOtp.status === 'verified'}
            presence={!form.presence.trim() ? null : presenceStatus === 'verified'}
          />

          <button type="submit" className="aw-submit" disabled={submitting}>
            {submitting ? <><span className="aw-spin aw-spin--light" /> Creating account…</> : <>Create business account <ArrowRight size={18} /></>}
          </button>

          <p className="aw-demo">Demo mode: phone and email codes are {DEMO_OTP}.</p>
        </form>
      </div>
    </AuthShell>
  );
}

function VerifyAction({
  show, verified, busy, started, onVerify, onChange, label = 'Verify',
}: {
  show: boolean;
  verified: boolean;
  busy: boolean;
  started: boolean;
  onVerify: () => void;
  onChange: () => void;
  label?: string;
}) {
  if (verified) {
    return (
      <span className="aw-verified">
        <BadgeCheck size={16} />
        Verified
        <button type="button" className="aw-verified__change" onClick={onChange}>Change</button>
      </span>
    );
  }
  if (!show || started) return null;
  return (
    <button type="button" className="aw-inline-btn" onClick={onVerify} disabled={busy}>
      {busy ? <span className="aw-spin" /> : label}
    </button>
  );
}

function OtpPanel({ otp, target, onResend }: { otp: OtpVerification; target: string; onResend: () => void }) {
  if (otp.status === 'idle' || otp.status === 'verified') return null;
  const sending = otp.status === 'sending';
  return (
    <div className="aw-verify" aria-live="polite">
      {sending ? (
        <p className="aw-verify__text"><span className="aw-spin" /> Sending code to {target}…</p>
      ) : (
        <>
          <p className="aw-verify__text">
            Enter the 6-digit code sent to <strong>{target}</strong>
          </p>
          <div className="aw-verify__row">
            <OtpInput
              size="sm" value={otp.code} onChange={otp.enter} autoFocus
              invalid={Boolean(otp.error)} disabled={otp.status === 'checking'}
            />
            {otp.status === 'checking' && <span className="aw-verify__checking"><span className="aw-spin" /> Checking…</span>}
          </div>
          {otp.error && <p className="aw-error" role="alert">{otp.error}</p>}
          <p className="aw-verify__meta">
            {otp.timer > 0 ? <>Resend code in {otp.timer}s</> : (
              <button type="button" className="aw-link" onClick={onResend}>Resend code</button>
            )}
            <span aria-hidden="true">·</span>
            <button type="button" className="aw-link aw-link--muted" onClick={otp.reset}>Cancel</button>
          </p>
        </>
      )}
    </div>
  );
}

function VerificationSummary({
  phone, email, presence,
}: {
  phone: boolean;
  email: boolean | null;
  presence: boolean | null;
}) {
  const item = (label: string, state: boolean | null, required: boolean): ReactNode => {
    const text = state === null ? (required ? 'Required' : 'Not added') : state ? 'Verified' : 'Needs verifying';
    const tone = state ? 'ok' : state === null && !required ? 'idle' : 'warn';
    return (
      <li className={`aw-summary__item is-${tone}`}>
        <span className="aw-summary__dot" />
        {label}
        <small>{text}</small>
      </li>
    );
  };
  return (
    <ul className="aw-summary" aria-label="Verification status">
      {item('Phone', phone ? true : null, true)}
      {item('Email', email, false)}
      {item('Link', presence, false)}
    </ul>
  );
}
