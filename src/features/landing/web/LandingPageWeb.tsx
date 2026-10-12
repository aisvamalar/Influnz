/**
 * Web landing page (>= 768px): split hero with a photo stage, brand marquee, three-step flow,
 * bento feature grid, stats band, brands/creators switch with a live preview, testimonials,
 * FAQ and a final CTA. Shares its copy with the mobile page via ../landingContent.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock,
  Languages,
  MapPin,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import logoImg from '../../../assets/logo.png';
import { useViewportScale } from '../../../hooks/useViewportScale';
import { AUDIENCES, CHART, FAQS, LANGUAGES, MATCHES, PHOTOS, QUOTES, STATS, STEPS, photo, type Audience } from '../landingContent';
import { useReveal } from '../useReveal';
import './landing-web.css';

/** Width the page is designed at; wider viewports scale it up instead of leaving empty margins. */
const DESIGN_WIDTH = 1600;

const NAV_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#audience', label: 'For creators' },
  { href: '#faq', label: 'FAQ' },
];

const TRUST = [
  { icon: ShieldCheck, label: 'Escrow payments' },
  { icon: BadgeCheck, label: 'Verified creators only' },
  { icon: Languages, label: '12 Indian languages' },
];

const CAMPAIGN_ROWS = [
  { name: 'Shruti Vlogs', photo: PHOTOS.hero, status: 'Live', tone: 'live' },
  { name: 'Thefoodiepranav', photo: PHOTOS.pranav, status: 'In review', tone: 'review' },
  { name: 'Food Tales', photo: PHOTOS.foodtales, status: 'Negotiating', tone: 'nego' },
] as const;

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="wlp-eyebrow">
      <Sparkles size={14} strokeWidth={2.4} aria-hidden="true" />
      {children}
    </span>
  );
}

function BrandPreview() {
  return (
    <div className="wlp-mock" aria-hidden="true">
      <div className="wlp-mock__head">
        <span>
          <strong>Chennai Café Launch</strong>
          <span>Kaapi House · 3 creators</span>
        </span>
        <span className="wlp-chip wlp-chip--live">
          <span className="wlp-live__dot" />
          Live
        </span>
      </div>
      <div className="wlp-mock__stats">
        <span>
          <span>Reach</span>
          <strong>125K</strong>
        </span>
        <span>
          <span>Spent</span>
          <strong>₹1.2L</strong>
        </span>
        <span>
          <span>ROI</span>
          <strong className="wlp-mock__roi">3.2x</strong>
        </span>
      </div>
      <div className="wlp-mock__bar">
        <span style={{ width: '62%' }} />
      </div>
      <p className="wlp-mock__caption">₹1.2L of ₹2L budget used</p>
      <ul className="wlp-mock__rows">
        {CAMPAIGN_ROWS.map((r) => (
          <li key={r.name}>
            <img src={photo(r.photo, 72, 72)} alt="" loading="lazy" />
            <span>{r.name}</span>
            <span className={`wlp-chip wlp-chip--${r.tone}`}>{r.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreatorPreview() {
  return (
    <div className="wlp-mock" aria-hidden="true">
      <div className="wlp-mock__head">
        <span className="wlp-mock__brand">
          <img src={photo(PHOTOS.cafe, 80, 80)} alt="" loading="lazy" />
          <span>
            <strong>Kaapi House sent you an offer</strong>
            <span>Café launch · Chennai</span>
          </span>
        </span>
      </div>
      <div className="wlp-offer">
        <span className="wlp-offer__label">Offer</span>
        <strong className="wlp-offer__amount">₹28,000</strong>
        <span className="wlp-offer__meta">
          <span>
            <Sparkles size={13} strokeWidth={2.4} />1 Reel + 2 Stories
          </span>
          <span>
            <CalendarDays size={13} strokeWidth={2.4} />
            Due 24 Oct
          </span>
        </span>
      </div>
      <div className="wlp-escrow">
        <ShieldCheck size={18} strokeWidth={2.2} />
        <span>
          <strong>Payment secured in escrow</strong>
          <span>Paid out within 48h of going live</span>
        </span>
      </div>
      <div className="wlp-mock__actions">
        <span className="wlp-mock__btn wlp-mock__btn--ghost">Counter</span>
        <span className="wlp-mock__btn wlp-mock__btn--coral">Accept offer</span>
      </div>
    </div>
  );
}

export default function LandingPageWeb() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [audience, setAudience] = useState<Audience>('brands');
  const scale = useViewportScale(DESIGN_WIDTH);

  useReveal(rootRef, '.wlp-reveal');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const current = AUDIENCES[audience];
  const [featured, ...otherQuotes] = QUOTES;

  return (
    <div className="wlp" ref={rootRef} style={{ zoom: scale }}>
      <header className={`wlp-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="wlp-wrap wlp-nav__inner">
          <a href="#top" className="wlp-nav__brand" aria-label="Influnz home">
            <img src={logoImg} alt="Influnz" className="wlp-logo" />
          </a>
          <nav className="wlp-nav__links" aria-label="Sections">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="wlp-nav__actions">
            <button type="button" className="wlp-nav__login" onClick={() => navigate('/login')}>
              Log in
            </button>
            <button type="button" className="wlp-btn wlp-btn--ink wlp-btn--sm" onClick={() => navigate('/signup')}>
              Get started
              <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ── Hero ── */}
        <section className="wlp-hero" aria-labelledby="wlp-hero-title">
          <span className="wlp-hero__glow" aria-hidden="true" />
          <div className="wlp-wrap wlp-hero__grid">
            <div className="wlp-hero__copy">
              <Eyebrow>India's AI creator marketplace</Eyebrow>
              <h1 id="wlp-hero-title" className="wlp-hero__title">
                Creators create.
                <br />
                Brands grow.
                <br />
                We make it <em className="wlp-accent">happen.</em>
              </h1>
              <p className="wlp-hero__sub">
                Influnz finds the right local creators, negotiates fair deals with AI and releases payment only when
                content goes live.
              </p>

              <div className="wlp-hero__ctas">
                <button type="button" className="wlp-btn wlp-btn--coral wlp-btn--lg" onClick={() => navigate('/signup')}>
                  Start a campaign
                  <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
                </button>
                <button type="button" className="wlp-btn wlp-btn--ghost wlp-btn--lg" onClick={() => navigate('/signup?type=creator')}>
                  I'm a creator
                </button>
              </div>

              <div className="wlp-proof">
                <span className="wlp-faces" aria-hidden="true">
                  {[PHOTOS.pranav, PHOTOS.anu, PHOTOS.rohit, PHOTOS.explorer].map((id) => (
                    <img key={id} src={photo(id, 80, 80)} alt="" loading="lazy" />
                  ))}
                </span>
                <span className="wlp-proof__text">
                  <span className="wlp-proof__stars" aria-label="Rated 4.9 out of 5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={14} strokeWidth={0} fill="currentColor" aria-hidden="true" />
                    ))}
                    <strong>4.9</strong>
                  </span>
                  2,400+ creators in 40 cities
                </span>
              </div>

              <ul className="wlp-trust">
                {TRUST.map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="wlp-stage" aria-hidden="true">
              <span className="wlp-stage__blob" />
              <img className="wlp-stage__back" src={photo(PHOTOS.latte, 400, 500)} alt="" />
              <figure className="wlp-stage__main">
                <img src={photo(PHOTOS.hero, 760, 1000)} alt="" />
                <span className="wlp-stage__shade" />
                <span className="wlp-live">
                  <span className="wlp-live__dot" />
                  Live · Chennai Café Launch
                </span>
                <figcaption className="wlp-stage__who">
                  <strong>Shruti Vlogs</strong>
                  <span>
                    <MapPin size={13} strokeWidth={2.4} />
                    Chennai · 482K followers
                  </span>
                </figcaption>
              </figure>

              <span className="wlp-float wlp-float--chat">
                <span className="wlp-float__bot">
                  <Bot size={16} strokeWidth={2.2} />
                </span>
                <span>
                  <strong>Found 24 creators</strong>
                  <span>Food · near T. Nagar, Chennai</span>
                </span>
              </span>

              <span className="wlp-float wlp-float--match">
                <span className="wlp-ring" style={{ '--wlp-pct': 96 } as CSSProperties}>
                  <strong>96</strong>
                </span>
                <span>
                  <strong>AI match</strong>
                  <span>Audience fit</span>
                </span>
              </span>

              <span className="wlp-float wlp-float--deal">
                <img src={photo(PHOTOS.pranav, 80, 80)} alt="" />
                <span>
                  <strong>Offer accepted</strong>
                  <span>₹28,000 · 1 Reel + 2 Stories</span>
                </span>
                <CircleCheck className="wlp-float__ok" size={20} strokeWidth={2.4} />
              </span>

              <span className="wlp-float wlp-float--reach">
                <TrendingUp size={15} strokeWidth={2.4} />
                <strong>+42%</strong> reach
              </span>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" className="wlp-section" aria-labelledby="wlp-how-title">
          <div className="wlp-wrap">
            <div className="wlp-head wlp-reveal">
              <Eyebrow>How it works</Eyebrow>
              <h2 id="wlp-how-title" className="wlp-h2">
                Launch a campaign in <em className="wlp-accent">three</em> steps
              </h2>
              <p className="wlp-lead">From a single message to live content — no agencies, no spreadsheets, no chasing payments.</p>
            </div>

            <ol className="wlp-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="wlp-step wlp-reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                  <span className="wlp-step__num">{i + 1}</span>
                  <h3 className="wlp-step__title">{s.title}</h3>
                  <p className="wlp-step__text">{s.text}</p>

                  {i === 0 && (
                    <div className="wlp-mini wlp-mini--chat" aria-hidden="true">
                      <span className="wlp-bubble wlp-bubble--me">Promote my café in Chennai, ₹50k budget</span>
                      <span className="wlp-bubble wlp-bubble--ai">
                        <Bot size={14} strokeWidth={2.2} />
                        Got it! Finding food creators near T. Nagar…
                      </span>
                    </div>
                  )}
                  {i === 1 && (
                    <ul className="wlp-mini wlp-mini--match" aria-hidden="true">
                      {MATCHES.map((m) => (
                        <li key={m.name}>
                          <img src={photo(m.photo, 72, 72)} alt="" loading="lazy" />
                          <span>{m.name}</span>
                          <strong>{m.fit}%</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                  {i === 2 && (
                    <div className="wlp-mini wlp-mini--escrow" aria-hidden="true">
                      <ShieldCheck size={20} strokeWidth={2.2} />
                      <span>
                        <strong>₹28,000 held in escrow</strong>
                        <span>Released when the Reel goes live</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Bento features ── */}
        <section id="features" className="wlp-section wlp-section--tint" aria-labelledby="wlp-features-title">
          <div className="wlp-wrap">
            <div className="wlp-head wlp-reveal">
              <Eyebrow>Everything in one place</Eyebrow>
              <h2 id="wlp-features-title" className="wlp-h2">
                Built for the way India <em className="wlp-accent">creates</em>
              </h2>
              <p className="wlp-lead">One workspace for discovery, negotiation, approvals, payments and results.</p>
            </div>

            <div className="wlp-bento">
              <article className="wlp-tile wlp-tile--wide wlp-tile--ink wlp-reveal">
                <div className="wlp-tile__row">
                  <div>
                    <h3 className="wlp-tile__title">AI matchmaking</h3>
                    <p className="wlp-tile__text">Matched by city, language, audience and past performance — not just follower count.</p>
                  </div>
                  <span className="wlp-ring wlp-ring--lg" style={{ '--wlp-pct': 96 } as CSSProperties} aria-label="96% match">
                    <strong>96%</strong>
                  </span>
                </div>
                <span className="wlp-faces wlp-faces--lg" aria-hidden="true">
                  {[PHOTOS.foodtales, PHOTOS.cafe, PHOTOS.arjun, PHOTOS.explorer, PHOTOS.anu].map((id) => (
                    <img key={id} src={photo(id, 96, 96)} alt="" loading="lazy" />
                  ))}
                  <span className="wlp-faces__more">+2.4K</span>
                </span>
              </article>

              <article className="wlp-tile wlp-tile--peach wlp-reveal">
                <Bot className="wlp-tile__icon" size={24} strokeWidth={2} aria-hidden="true" />
                <h3 className="wlp-tile__title">AI negotiation</h3>
                <p className="wlp-tile__text">Fair rates, agreed within your guardrails.</p>
                <div className="wlp-nego" aria-hidden="true">
                  <span className="wlp-nego__ask">Ask ₹40,000</span>
                  <span className="wlp-nego__deal">
                    <Check size={13} strokeWidth={3} />
                    Deal ₹28,000
                  </span>
                </div>
              </article>

              <article className="wlp-tile wlp-tile--white wlp-reveal">
                <ShieldCheck className="wlp-tile__icon wlp-tile__icon--green" size={24} strokeWidth={2} aria-hidden="true" />
                <h3 className="wlp-tile__title">Escrow payments</h3>
                <p className="wlp-tile__text">₹0 lost to no-shows. Money moves only when content is delivered.</p>
              </article>

              <article className="wlp-tile wlp-tile--wide wlp-tile--white wlp-reveal">
                <div className="wlp-tile__row">
                  <div>
                    <h3 className="wlp-tile__title">Live analytics</h3>
                    <p className="wlp-tile__text">Views, enquiries and cost per customer — in real time.</p>
                  </div>
                  <span className="wlp-roi">
                    <strong>3.2x</strong>
                    <span>avg. ROI</span>
                  </span>
                </div>
                <span className="wlp-chart" aria-hidden="true">
                  {CHART.map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }} />
                  ))}
                </span>
              </article>

              <article className="wlp-tile wlp-tile--coral wlp-reveal">
                <BadgeCheck className="wlp-tile__icon" size={24} strokeWidth={2} aria-hidden="true" />
                <h3 className="wlp-tile__title">Approve from anywhere</h3>
                <p className="wlp-tile__text">Review, request changes or approve in a click — on web or phone.</p>
              </article>

              <article className="wlp-tile wlp-tile--cream wlp-reveal">
                <Languages className="wlp-tile__icon" size={24} strokeWidth={2} aria-hidden="true" />
                <h3 className="wlp-tile__title">Speaks your language</h3>
                <ul className="wlp-langs">
                  {LANGUAGES.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="wlp-stats" aria-label="Influnz in numbers">
          <div className="wlp-wrap">
            <dl className="wlp-stats__grid">
              {STATS.map((s, i) => (
                <div key={s.label} className="wlp-stats__item wlp-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Audience switch ── */}
        <section id="audience" className="wlp-section" aria-labelledby="wlp-audience-title">
          <div className="wlp-wrap wlp-split">
            <div className="wlp-reveal">
              <Eyebrow>Two sides, one platform</Eyebrow>
              <h2 id="wlp-audience-title" className="wlp-h2">
                Made for both sides of the <em className="wlp-accent">deal</em>
              </h2>

              <div className="wlp-switch" role="radiogroup" aria-label="Show benefits for">
                {(Object.keys(AUDIENCES) as Audience[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={audience === key}
                    className={`wlp-switch__opt${audience === key ? ' is-active' : ''}`}
                    onClick={() => setAudience(key)}
                  >
                    {key === 'brands' ? <TrendingUp size={16} strokeWidth={2.4} aria-hidden="true" /> : <Users size={16} strokeWidth={2.4} aria-hidden="true" />}
                    {AUDIENCES[key].label}
                  </button>
                ))}
                <span className={`wlp-switch__thumb wlp-switch__thumb--${audience}`} aria-hidden="true" />
              </div>

              <ul className="wlp-points" key={audience}>
                {current.points.map((p) => (
                  <li key={p}>
                    <span className="wlp-points__check" aria-hidden="true">
                      <Check size={15} strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <button type="button" className="wlp-btn wlp-btn--ink wlp-btn--lg" onClick={() => navigate('/signup')}>
                {current.cta}
                <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>

            <div className="wlp-preview wlp-reveal">
              <span className="wlp-preview__glow" aria-hidden="true" />
              <div className="wlp-preview__swap" key={audience}>
                {audience === 'brands' ? <BrandPreview /> : <CreatorPreview />}
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="wlp-section wlp-section--band" aria-labelledby="wlp-quotes-title">
          <div className="wlp-wrap">
            <div className="wlp-head wlp-reveal">
              <Eyebrow>Loved across India</Eyebrow>
              <h2 id="wlp-quotes-title" className="wlp-h2">
                Real results, <em className="wlp-accent">real</em> people
              </h2>
            </div>

            <ul className="wlp-quotes">
              <li className="wlp-quote wlp-quote--featured wlp-reveal">
                <Quote className="wlp-quote__mark" size={34} strokeWidth={2} aria-hidden="true" />
                <p className="wlp-quote__text">{featured.quote}</p>
                <span className="wlp-quote__who">
                  <img src={photo(featured.photo, 104, 104)} alt="" loading="lazy" />
                  <span>
                    <strong>{featured.name}</strong>
                    <span>{featured.role}</span>
                  </span>
                </span>
              </li>
              {otherQuotes.map((q) => (
                <li key={q.name} className="wlp-quote wlp-reveal">
                  <Quote className="wlp-quote__mark" size={26} strokeWidth={2} aria-hidden="true" />
                  <p className="wlp-quote__text">{q.quote}</p>
                  <span className="wlp-quote__who">
                    <img src={photo(q.photo, 96, 96)} alt="" loading="lazy" />
                    <span>
                      <strong>{q.name}</strong>
                      <span>{q.role}</span>
                    </span>
                  </span>
                </li>
              ))}
              <li className="wlp-quote wlp-quote--rating wlp-reveal">
                <strong className="wlp-rating__value">4.9</strong>
                <span className="wlp-proof__stars" aria-label="Rated 4.9 out of 5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={18} strokeWidth={0} fill="currentColor" aria-hidden="true" />
                  ))}
                </span>
                <span className="wlp-rating__text">Average rating from 1,200+ brands and creators</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="wlp-section" aria-labelledby="wlp-faq-title">
          <div className="wlp-wrap wlp-split wlp-split--faq">
            <div className="wlp-reveal">
              <Eyebrow>Questions</Eyebrow>
              <h2 id="wlp-faq-title" className="wlp-h2">
                Good to <em className="wlp-accent">know</em>
              </h2>
              <p className="wlp-lead">Everything you need before your first campaign. Still curious? Create a free account and look around.</p>
            </div>
            <div className="wlp-faq wlp-reveal">
              {FAQS.map((f, i) => (
                <details key={f.q} className="wlp-faq__item" open={i === 0}>
                  <summary>
                    {f.q}
                    <ChevronDown className="wlp-faq__chev" size={20} strokeWidth={2.2} aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="wlp-final" aria-labelledby="wlp-final-title">
          <div className="wlp-wrap">
            <div className="wlp-final__panel wlp-reveal">
              <div className="wlp-final__copy">
                <span className="wlp-final__chip">
                  <Clock size={14} strokeWidth={2.4} aria-hidden="true" />
                  Takes under 2 minutes
                </span>
                <h2 id="wlp-final-title" className="wlp-final__title">
                  Your next campaign is <em className="wlp-accent wlp-accent--light">one chat</em> away
                </h2>
                <p className="wlp-final__text">Free to start. No credit card. Pay only when creators deliver.</p>
                <div className="wlp-final__ctas">
                  <button type="button" className="wlp-btn wlp-btn--white wlp-btn--lg" onClick={() => navigate('/signup')}>
                    Get started free
                    <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
                  </button>
                  <button type="button" className="wlp-final__login" onClick={() => navigate('/login')}>
                    Already have an account? <strong>Log in</strong>
                  </button>
                </div>
              </div>
              <div className="wlp-final__art" aria-hidden="true">
                {[PHOTOS.hero, PHOTOS.pranav, PHOTOS.foodtales].map((id, i) => (
                  <img key={id} className={`wlp-final__photo wlp-final__photo--${i}`} src={photo(id, 300, 380)} alt="" loading="lazy" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="wlp-foot">
        <div className="wlp-wrap">
          <div className="wlp-foot__top">
            <div className="wlp-foot__brand">
              <img src={logoImg} alt="Influnz" className="wlp-logo" />
              <p>AI-powered creator marketing for Indian businesses — from first chat to final payout.</p>
            </div>
            <nav className="wlp-foot__col" aria-label="Product">
              <h3>Product</h3>
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#faq">FAQ</a>
            </nav>
            <nav className="wlp-foot__col" aria-label="Get started">
              <h3>Get started</h3>
              <button type="button" onClick={() => navigate('/signup')}>
                Start a campaign
              </button>
              <button type="button" onClick={() => navigate('/signup?type=creator')}>
                Join as a creator
              </button>
              <button type="button" onClick={() => navigate('/login')}>
                Log in
              </button>
            </nav>
          </div>
          <p className="wlp-foot__copy">© 2026 Influnz · Made in India</p>
        </div>
      </footer>
    </div>
  );
}
