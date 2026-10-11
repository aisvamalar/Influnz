/**
 * Web auth layout: photo brand panel on the left, form on a warm canvas on the right.
 * The panel hides below 900px and the logo moves above the form.
 */
import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Building2, ChartNoAxesColumn, CreditCard, Headset, Quote, ShieldCheck,
  Sparkles, Users, Zap, type LucideIcon,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import LogoLight from '../../components/LogoLight';
import FormField from './FormField';
import { PATTERNS } from '../business/businessProfile';
import './auth-web.css';

const BRAND_PHOTO = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&q=75&auto=format&fit=crop';

const FEATURES: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Users, title: 'Work with verified creators', text: 'Authentic creators across India' },
  { icon: ChartNoAxesColumn, title: 'Track real performance', text: 'Reach, engagement and ROI' },
  { icon: ShieldCheck, title: 'Secure, milestone-based payments', text: 'Pay only when content is approved' },
  { icon: Headset, title: 'Dedicated support', text: 'From brief to final delivery' },
];

const LEVELS = [
  { title: 'Create your account', text: 'Business details and a verified phone. About 2 minutes.' },
  { title: 'Verify your business', text: 'Add your GSTIN from your profile, whenever you are ready.' },
  { title: 'Set up payments', text: 'PAN, billing and bank details, only when you pay creators.' },
];

const STATS = [
  { value: '15,000+', label: 'Verified creators' },
  { value: '500+', label: 'Brands trust us' },
  { value: '3x', label: 'Average growth' },
];

const STRIP: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Zap, label: 'Manage campaigns' },
  { icon: ChartNoAxesColumn, label: 'Track performance' },
  { icon: CreditCard, label: 'Make payments' },
];

interface AuthShellProps {
  mode: 'login' | 'signup';
  children: ReactNode;
}

export default function AuthShell({ mode, children }: AuthShellProps) {
  const isSignup = mode === 'signup';
  const [audience, setAudience] = useState<'business' | 'creator'>('business');

  return (
    <main id="main-content" className={`aw aw--${mode}`}>
      <aside className="aw-brand" aria-label="About Influnz">
        <img className="aw-brand__photo" src={BRAND_PHOTO} alt="" />
        <div className="aw-brand__inner">
          <Link to="/" className="aw-brand__logo-link" aria-label="Influnz home">
            <LogoLight className="aw-brand__logo" height={42} />
          </Link>

          <div className="aw-brand__body">
            <span className="aw-brand__eyebrow">For brands &amp; businesses</span>
            <h2 className="aw-brand__title">
              {isSignup
                ? <>Start collaborating with creators in <em>three simple steps.</em></>
                : <>Collaborate with verified creators and drive <em>real results.</em></>}
            </h2>

            {isSignup ? (
              <ol className="aw-feats">
                {LEVELS.map((level, i) => (
                  <li key={level.title} className={i === 0 ? 'is-current' : undefined}>
                    <span className="aw-feats__icon aw-feats__icon--num">{i + 1}</span>
                    <span>
                      <strong>{level.title}</strong>
                      <small>{level.text}</small>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="aw-feats">
                {FEATURES.map(({ icon: Icon, title, text }) => (
                  <li key={title}>
                    <span className="aw-feats__icon"><Icon size={19} /></span>
                    <span>
                      <strong>{title}</strong>
                      <small>{text}</small>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <figure className="aw-quote">
            <Quote className="aw-quote__mark" size={26} />
            <blockquote>
              We filled every creator slot for our café launch in two days, and paid everyone from one place.
            </blockquote>
            <figcaption>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces&auto=format"
                alt=""
                loading="lazy"
              />
              <span>
                <strong>Karthik Sundar</strong>
                <small>Owner, Brew &amp; Bites · Chennai</small>
              </span>
            </figcaption>
          </figure>

          <dl className="aw-stats">
            {STATS.map(s => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      <section className="aw-main">
        <span className="aw-deco aw-deco--a" aria-hidden="true" />
        <span className="aw-deco aw-deco--b" aria-hidden="true" />

        <div className="aw-hero">
          <img className="aw-hero__photo" src={BRAND_PHOTO} alt="" />
          <div className="aw-hero__bar">
            <Link to="/" aria-label="Influnz home"><LogoLight height={30} /></Link>
            <Link to={isSignup ? '/login' : '/signup'} className="aw-hero__link">
              {isSignup ? 'Sign in' : 'Create account'}
            </Link>
          </div>
          <span className="aw-hero__eyebrow">For brands &amp; businesses</span>
          <p className="aw-hero__title">
            {isSignup
              ? <>Start with creators in <em>three simple steps.</em></>
              : <>Collaborate with verified creators, <em>drive real results.</em></>}
          </p>
        </div>

        <header className="aw-top">
          <Link to="/" className="aw-top__logo-link" aria-label="Influnz home">
            <img className="aw-top__logo" src={logoImg} alt="Influnz" />
          </Link>
          <p className="aw-top__switch">
            <span>{isSignup ? 'Already have an account?' : 'New to Influnz?'}</span>
            <Link to={isSignup ? '/login' : '/signup'} className="aw-top__link">
              {isSignup ? 'Sign in' : 'Create a business account'}
              <ArrowRight size={15} />
            </Link>
          </p>
        </header>

        <div className="aw-main__inner">
          <div className={`aw-stage aw-stage--${mode}`}>
            <div className="aw-audience" role="tablist" aria-label="Account type">
              <button
                type="button" role="tab" aria-selected={audience === 'business'}
                className={`aw-audience__btn${audience === 'business' ? ' is-active' : ''}`}
                onClick={() => setAudience('business')}
              >
                <Building2 size={17} /> Business
              </button>
              <button
                type="button" role="tab" aria-selected={audience === 'creator'}
                className={`aw-audience__btn${audience === 'creator' ? ' is-active' : ''}`}
                onClick={() => setAudience('creator')}
              >
                <Sparkles size={17} /> Creator <span className="aw-audience__soon">Soon</span>
              </button>
            </div>
            {audience === 'business'
              ? children
              : <CreatorComingSoon mode={mode} onBusiness={() => setAudience('business')} />}
          </div>
        </div>

        {!isSignup && (
          <p className="aw-note" aria-hidden="true">
            Same account,<br />across all your<br />brand campaigns
          </p>
        )}

        <footer className="aw-strip">
          {STRIP.map(({ icon: Icon, label }) => (
            <span key={label} className="aw-strip__item">
              <Icon size={18} />
              {label}
            </span>
          ))}
        </footer>
      </section>
    </main>
  );
}

const CREATOR_PERKS = [
  'Get brand deals that match your audience',
  'Paid on time, straight to your bank',
  'Track every campaign and payout in one place',
];

function CreatorComingSoon({ mode, onBusiness }: { mode: 'login' | 'signup'; onBusiness: () => void }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!PATTERNS.phone.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setJoined(true);
  };

  return (
    <div className="aw-panel aw-creator">
      <span className="aw-creator__icon"><Sparkles size={22} /></span>
      <div className="aw-head">
        <h1 className="aw-title">Creator accounts are coming soon</h1>
        <p className="aw-sub">
          We're opening Influnz to creators shortly. Leave your number and we'll text you the day
          {mode === 'signup' ? ' sign-ups open.' : ' you can sign in.'}
        </p>
      </div>

      <ul className="aw-creator__perks">
        {CREATOR_PERKS.map(p => (
          <li key={p}><BadgeCheck size={16} />{p}</li>
        ))}
      </ul>

      {joined ? (
        <p className="aw-creator__done" role="status">
          <BadgeCheck size={18} /> You're on the list. We'll text +91 {phone.slice(0, 5)} {phone.slice(5)}.
        </p>
      ) : (
        <form className="aw-creator__form" onSubmit={submit} noValidate>
          <FormField id="creator-phone" label="Phone number" error={error}>
            <div className={`aw-control${error ? ' is-invalid' : ''}`}>
              <span className="aw-prefix aw-prefix--flag"><IndiaFlag /> +91</span>
              <input
                id="creator-phone" type="tel" inputMode="numeric" placeholder="98765 43210"
                autoComplete="tel-national" maxLength={10} value={phone}
                aria-invalid={Boolean(error)}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
              />
            </div>
          </FormField>
          <button type="submit" className="aw-submit">Notify me <ArrowRight size={18} /></button>
        </form>
      )}

      <p className="aw-switch">
        Running a brand or business?{' '}
        <button type="button" className="aw-link" onClick={onBusiness}>
          {mode === 'signup' ? 'Create a business account' : 'Sign in as a business'}
        </button>
      </p>
    </div>
  );
}

/** India flag for the +91 prefix (flag emoji doesn't render on Windows). */
export function IndiaFlag() {
  return (
    <svg className="aw-flag" width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" rx="2" fill="#fff" />
      <path d="M0 2a2 2 0 012-2h16a2 2 0 012 2v2.67H0z" fill="#ff9933" />
      <path d="M0 9.33h20V12a2 2 0 01-2 2H2a2 2 0 01-2-2z" fill="#138808" />
      <circle cx="10" cy="7" r="1.7" fill="none" stroke="#000080" strokeWidth="0.6" />
    </svg>
  );
}
