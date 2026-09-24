import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import { BRAND } from '../../lib/brand';

// ── Navigation ────────────────────────────────────────────────────────────────
function Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`in-nav${scrolled ? ' in-nav--scrolled' : ''}`} aria-label="Main navigation">
        <Link to="/" aria-label={`${BRAND.name} home`}><Logo size="sm" /></Link>

        <ul className="in-nav__links" role="list">
          {[['How it works', 'how-it-works'], ['Features', 'features'], ['Benefits', 'benefits']].map(([label, id]) => (
            <li key={id}>
              <button className="in-nav__link" onClick={() => scrollTo(id)}>{label}</button>
            </li>
          ))}
        </ul>

        <div className="in-nav__actions">
          <button className="in-btn in-btn--ghost" style={{ padding: '8px 18px', fontSize: '0.875rem' }} onClick={() => navigate('/login')}>
            Log in
          </button>
          <button className="in-btn in-btn--primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }} onClick={() => navigate('/signup')}>
            Get started
          </button>
          <button
            className="in-nav__hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {menuOpen
                ? <><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>
                : <><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="in-mobile-menu"
          id="mobile-menu"
          onClick={() => setMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="in-mobile-menu__panel" onClick={e => e.stopPropagation()}>
            <Logo size="sm" />
            <div style={{ height: 16 }} />
            {[['How it works', 'how-it-works'], ['Features', 'features'], ['Benefits', 'benefits']].map(([label, id]) => (
              <button key={id} className="in-nav__link" style={{ textAlign: 'left', width: '100%', padding: '12px 8px' }} onClick={() => scrollTo(id)}>
                {label}
              </button>
            ))}
            <div style={{ height: 16 }} />
            <button className="in-btn in-btn--primary" style={{ width: '100%' }} onClick={() => { navigate('/signup'); setMenuOpen(false); }}>
              Get started
            </button>
            <button className="in-btn in-btn--ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => { navigate('/login'); setMenuOpen(false); }}>
              Log in
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Product mock (HTML/CSS, no stock images) ──────────────────────────────────
function ProductMock() {
  return (
    <div className="in-hero__mock" aria-hidden="true" role="presentation">
      <div className="in-mock-header">
        <div className="in-mock-dot" style={{ background: '#e05252' }} />
        <div className="in-mock-dot" style={{ background: '#f5a08a' }} />
        <div className="in-mock-dot" style={{ background: '#7cc4a4' }} />
        <span className="in-mock-title">🤖 AI Campaign Brief</span>
      </div>
      <div className="in-mock-body">
        <div className="in-mock-brief">
          <strong>"</strong>I have ₹1,50,000. I'm launching a new café in Chennai and want Tamil-speaking food creators who can drive real store visits.<strong>"</strong>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--in-coral)', display: 'inline-block', animation: 'glow 2s infinite' }} />
          AI is generating strategies…
        </div>
        <div className="in-mock-strategy">
          {[
            { tag: 'Recommended', name: '🎯 Hyperlocal Reach', reach: '~3.2L reach', active: true },
            { tag: 'Performance', name: '⚡ Performance Focus', reach: '~1.8L reach', active: false },
          ].map(s => (
            <div key={s.name} className={`in-mock-strategy-card${s.active ? ' in-mock-strategy-card--active' : ''}`}>
              <span className="in-mock-strategy-card__tag">{s.tag}</span>
              <span className="in-mock-strategy-card__name">{s.name}</span>
              <span className="in-mock-strategy-card__reach">{s.reach}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['8 Nano creators', 'Tamil/Tanglish', 'Chennai, 15km', '₹1,42,000'].map(tag => (
            <span key={tag} className="in-badge in-badge--coral">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Trust strip ───────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: '✅', label: '15,000+ Verified creators' },
  { icon: '🔒', label: 'Secure payments & contracts' },
  { icon: '📊', label: 'Real performance tracking' },
  { icon: '🗺️', label: 'Regional creator access' },
];

// ── How it works steps ────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Tell the AI your goal', desc: 'Describe your business objective and budget in plain language. No jargon needed.' },
  { title: 'AI builds your campaign', desc: 'The AI extracts objective, geography, language, audience and creator mix — you review every field.' },
  { title: 'Pick a strategy', desc: 'Choose from AI-generated portfolio strategies (Hyperlocal, Performance, Hybrid) with estimated reach and trade-offs.' },
  { title: 'Review creator matches', desc: 'See why each creator fits — audience overlap, geography, language, reliability and pricing.' },
  { title: 'Set guardrails & invite', desc: 'Define max price per creator, min score, allowed categories. Private invitations go out automatically.' },
  { title: 'AI negotiates for you', desc: 'The AI negotiates within your exact limits. Every action is logged and auditable. You can intervene anytime.' },
  { title: 'Review & approve content', desc: 'AI checks brand mention, disclosure, CTA and format. You approve or request contract-compliant revisions.' },
  { title: 'Pay and measure results', desc: 'Protected payments release on milestone completion. See real reach, clicks, enquiries and store visits.' },
];

// ── Features grid ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🤖', title: 'AI Campaign Planning', desc: 'Describe your goal in plain language. AI builds the entire campaign brief, strategy and creator shortlist.' },
  { icon: '🔍', title: 'Verified Creator Intelligence', desc: 'Audience geography, engagement, reliability scores, brand safety and campaign fit — not just follower counts.' },
  { icon: '🤝', title: 'AI Negotiation', desc: 'Set your guardrails. The AI negotiates within your exact limits with a full auditable transcript.' },
  { icon: '📄', title: 'Contracts & e-Signature', desc: 'Auto-generated from agreed deal terms. Any change requires an explicit amendment — nothing slips through.' },
  { icon: '✅', title: 'AI Content Compliance', desc: 'Checks product mention, brand mention, CTA, paid disclosure and format before you ever see the content.' },
  { icon: '📈', title: 'Real-Time Analytics', desc: 'Views, clicks, enquiries, store visits and CAC per creator. Budget optimization recommendations included.' },
  { icon: '🔒', title: 'Protected Payments', desc: 'Payment releases on milestone completion. Campaign status and payment status are always tracked separately.' },
  { icon: '🗺️', title: 'Hyperlocal Creators', desc: 'Filter by city, radius, language (Tamil, Hindi, Kannada…) and audience geography for local campaigns.' },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How much does Influnz cost?',
    a: 'Pricing is not yet finalized. [Placeholder: we will share pricing plans before launch. Sign up to be notified.]',
  },
  {
    q: 'How are creators verified?',
    a: 'Creators connect their social accounts and verify their identity. The platform imports their audience data, engagement metrics and campaign history. Brand safety and reliability scores are calculated from this data.',
  },
  {
    q: 'How are my payments protected?',
    a: 'Payments are committed when a deal is confirmed and released only after the agreed milestone is met. [Note: exact escrow model and payment provider are not yet finalized and will be communicated before launch.]',
  },
  {
    q: 'Do I need marketing experience?',
    a: 'No. Just describe your business goal and budget in plain language — "I want more customers at my Chennai café." The AI handles the rest, and you review and approve every step.',
  },
  {
    q: 'Which languages and regions are supported?',
    a: 'Currently English, Tamil and Tanglish. Hindi, Kannada, Telugu and other regional languages are planned. Creator filtering by city, region and language is available now.',
  },
  {
    q: 'What is Creator Discovery?',
    a: 'Discovery is an optional, business-controlled channel where you can open your campaign to additional qualified creators. It is not the main flow — creators are normally invited privately based on AI matching.',
  },
];

// ── FAQ Accordion item ────────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${index}`;
  const bodyId = `faq-body-${index}`;

  return (
    <div className="in-faq-item">
      <button
        className="in-faq-item__trigger"
        aria-expanded={open}
        aria-controls={bodyId}
        id={id}
        onClick={() => setOpen(v => !v)}
      >
        {q}
        <svg
          className={`in-faq-item__icon${open ? ' in-faq-item__icon--open' : ''}`}
          width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={`in-faq-item__body${open ? ' in-faq-item__body--open' : ''}`}
        id={bodyId}
        role="region"
        aria-labelledby={id}
      >
        <div className="in-faq-item__body-inner">{a}</div>
      </div>
    </div>
  );
}

// ── Main landing ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Nav />

      <main id="main-content">

        {/* ── Hero ── */}
        <section className="in-hero" aria-label="Hero">
          <div className="in-hero__blob in-hero__blob--tl" aria-hidden="true" />
          <div className="in-hero__blob in-hero__blob--br" aria-hidden="true" />
          <div className="in-hero__inner">
            <div className="in-hero__badge" aria-label="New — India-first AI platform">
              <span className="in-hero__badge-dot" aria-hidden="true" />
              India-first AI creator commerce platform
            </div>

            <h1 className="in-hero__h1">
              Tell your goal.<br />
              We <em>handle</em> the rest.
            </h1>

            <p className="in-hero__sub">
              {BRAND.description}
            </p>

            <div className="in-hero__ctas">
              <button className="in-btn in-btn--primary" style={{ height: 52, padding: '0 28px', fontSize: '1rem' }} onClick={() => navigate('/signup')}>
                Create your business account →
              </button>
              <button className="in-btn in-btn--ghost" style={{ height: 52, padding: '0 28px', fontSize: '1rem' }} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                See how it works
              </button>
            </div>

            <ProductMock />
          </div>
        </section>

        {/* ── Trust strip ── */}
        <div className="in-trust-strip" aria-label="Platform trust indicators">
          {TRUST_ITEMS.map(item => (
            <div key={item.label} className="in-trust-item">
              <span className="in-trust-item__icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* ── How it works ── */}
        <section className="in-section" id="how-it-works" aria-labelledby="how-heading">
          <div style={{ maxWidth: 760 }}>
            <p className="in-section__tag">
              <span aria-hidden="true">🗺️</span> The journey
            </p>
            <h2 className="in-section__h2" id="how-heading">
              From goal to results <em>in one place</em>
            </h2>
            <p className="in-section__sub">
              The entire campaign lifecycle — brief, strategy, creators, negotiation, content, payment — managed by AI with you in control.
            </p>

            <div className="in-steps" role="list">
              {STEPS.map((s, i) => (
                <div key={s.title} className="in-step" role="listitem">
                  <div className="in-step__num" aria-hidden="true">{i + 1}</div>
                  <div className="in-step__body">
                    <p className="in-step__title">{s.title}</p>
                    <p className="in-step__desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="in-section--alt" id="features" aria-labelledby="features-heading">
          <div className="in-section__inner">
            <p className="in-section__tag"><span aria-hidden="true">⚡</span> Features</p>
            <h2 className="in-section__h2" id="features-heading">
              Everything you need to run <em>smarter campaigns</em>
            </h2>
            <p className="in-section__sub">
              Purpose-built for Indian businesses, from solo-run cafés to national brands.
            </p>
            <div className="in-feature-grid">
              {FEATURES.map(f => (
                <div key={f.title} className="in-feature-card">
                  <div className="in-feature-card__icon" aria-hidden="true">{f.icon}</div>
                  <p className="in-feature-card__title">{f.title}</p>
                  <p className="in-feature-card__desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Example scenario ── */}
        <section className="in-section" aria-labelledby="scenario-heading">
          <div>
            <p className="in-section__tag"><span aria-hidden="true">📍</span> Example</p>
            <h2 className="in-section__h2" id="scenario-heading">
              See it in action: <em>Chennai café campaign</em>
            </h2>
            <p className="in-section__sub" style={{ marginBottom: 24 }}>
              This is an illustrative example only — not real results or a guarantee of performance.
            </p>
            <div className="in-scenario">
              <div className="in-scenario__tag">
                <span aria-hidden="true">ℹ️</span> Illustrative example
              </div>
              <h3 className="in-scenario__title">₹1,50,000 · Chennai · Café · Local store visits</h3>
              {[
                ['Objective', 'Drive local foot traffic to new café'],
                ['Budget', '₹1,50,000'],
                ['Strategy selected', 'Hyperlocal Reach (AI recommended)'],
                ['Creator mix', '8 Nano + 2 Micro (Tamil/Tanglish food creators)'],
                ['Estimated reach', '~3.2 lakh (not guaranteed)'],
                ['Platform', 'Instagram Reels + Stories'],
                ['AI negotiation', 'Creator B countered; AI settled within guardrails'],
                ['Content check', 'Brand mention ✓ · Disclosure ✓ · CTA ✓'],
                ['Payment', 'Released on content approval milestone'],
              ].map(([label, val]) => (
                <div key={label as string} className="in-scenario__row">
                  <span className="in-scenario__row-label">{label}</span>
                  <span className="in-scenario__row-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Value pillars / Benefits ── */}
        <section className="in-section--alt" id="benefits" aria-labelledby="pillars-heading">
          <div className="in-section__inner">
            <p className="in-section__tag"><span aria-hidden="true">🎯</span> Why Influnz</p>
            <h2 className="in-section__h2" id="pillars-heading">
              Plan with AI · Work with the <em>right creators</em> · Get real results
            </h2>
            <p className="in-section__sub">
              More customers · Stronger brand · Real growth. For every kind of Indian business.
            </p>
            <div className="in-pillars">
              {[
                { icon: '🤖', num: '01', title: 'Plan with AI', desc: 'Describe your goal. AI builds the campaign brief, strategy and creator shortlist — all editable by you.' },
                { icon: '🤝', num: '02', title: 'Work with the right creators', desc: 'Matched on audience, geography, language, performance and reliability. Invited privately, not posted publicly.' },
                { icon: '📊', num: '03', title: 'Get real business results', desc: 'Track store visits, clicks, enquiries and conversions. Reallocate budget to what works. Pay only on results.' },
              ].map(p => (
                <div key={p.num} className="in-pillar">
                  <div className="in-pillar__icon" aria-hidden="true">{p.icon}</div>
                  <span className="in-pillar__num">{p.num}</span>
                  <p className="in-pillar__title">{p.title}</p>
                  <p className="in-pillar__desc">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="in-section" aria-labelledby="faq-heading">
          <div style={{ maxWidth: 760 }}>
            <p className="in-section__tag"><span aria-hidden="true">❓</span> Questions</p>
            <h2 className="in-section__h2" id="faq-heading">Frequently asked questions</h2>
            <p className="in-section__sub">Have more questions? Email us at <a href="mailto:support@influnz.in" style={{ color: 'var(--in-coral-text)' }}>{BRAND.supportEmail}</a></p>
            <div className="in-faq" role="list">
              {FAQS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── CTA band ── */}
        <section className="in-cta-band" aria-labelledby="cta-heading">
          <div className="in-cta-band__blob in-cta-band__blob--1" aria-hidden="true" />
          <div className="in-cta-band__blob in-cta-band__blob--2" aria-hidden="true" />
          <h2 className="in-cta-band__h2" id="cta-heading">
            Ready to grow your business?
          </h2>
          <p className="in-cta-band__sub">
            Join businesses across India running creator campaigns that drive real, measurable results.
          </p>
          <button className="in-cta-band__btn" onClick={() => navigate('/signup')}>
            Create your business account →
          </button>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="in-footer" aria-label="Site footer">
        <div className="in-footer__inner">
          <div className="in-footer__top">
            <div className="in-footer__brand-col">
              <span className="in-footer__brand">
                Influn<em>z</em>
              </span>
              <p className="in-footer__tagline">{BRAND.tagline}</p>
              <p className="in-footer__tagline" style={{ fontSize: '0.8125rem', marginTop: 4 }}>
                For Indian businesses. By Indian builders.
              </p>
            </div>
            <div>
              <p className="in-footer__links-title">Platform</p>
              <div className="in-footer__links">
                {['How it works', 'Features', 'Pricing', 'Creator sign-up'].map(l => (
                  <button key={l} className="in-footer__link">{l}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="in-footer__links-title">Company</p>
              <div className="in-footer__links">
                {['About', 'Blog', 'Careers', 'Contact'].map(l => (
                  <button key={l} className="in-footer__link">{l}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="in-footer__links-title">Legal</p>
              <div className="in-footer__links">
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(l => (
                  <button key={l} className="in-footer__link">{l}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="in-footer__bottom">
            <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
            <div className="in-footer__legal">
              <button className="in-footer__link">Terms</button>
              <button className="in-footer__link">Privacy</button>
              <button className="in-footer__link">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
