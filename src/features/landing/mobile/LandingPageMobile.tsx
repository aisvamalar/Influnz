/**
 * Mobile landing page (< 768px): editorial hero, brand marquee, how-it-works timeline,
 * bento feature grid, stats, brands/creators switch, testimonials, FAQ and a final CTA.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Bot,
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
} from 'lucide-react';
import logoImg from '../../../assets/logo.png';
import { AUDIENCES, CHART, FAQS, LANGUAGES, MATCHES, PHOTOS, QUOTES, STATS, STEPS, photo, type Audience } from '../landingContent';
import { useReveal } from '../useReveal';
import './landing-mobile.css';

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mlp-eyebrow">
      <Sparkles size={13} strokeWidth={2.4} aria-hidden="true" />
      {children}
    </span>
  );
}

export default function LandingPageMobile() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const quotesRef = useRef<HTMLUListElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [audience, setAudience] = useState<Audience>('brands');
  const [activeQuote, setActiveQuote] = useState(0);

  useReveal(rootRef, '.mlp-reveal');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onQuotesScroll = () => {
    const list = quotesRef.current;
    if (!list) return;
    const item = list.firstElementChild as HTMLElement | null;
    const step = item ? item.offsetWidth + 12 : list.clientWidth;
    setActiveQuote(Math.min(QUOTES.length - 1, Math.round(list.scrollLeft / step)));
  };

  const goToQuote = (i: number) => {
    const list = quotesRef.current;
    const item = list?.children[i] as HTMLElement | undefined;
    if (list && item) list.scrollTo({ left: item.offsetLeft - list.offsetLeft, behavior: 'smooth' });
  };

  const current = AUDIENCES[audience];

  return (
    <div className="mlp" ref={rootRef}>
      <header className={`mlp-top${scrolled ? ' is-scrolled' : ''}`}>
        <a href="#top" className="mlp-top__brand" aria-label="Influnz home">
          <img src={logoImg} alt="Influnz" className="mlp-logo" />
        </a>
        <nav className="mlp-top__actions" aria-label="Account">
          <button type="button" className="mlp-top__login" onClick={() => navigate('/login')}>
            Log in
          </button>
          <button type="button" className="mlp-btn mlp-btn--ink mlp-btn--sm" onClick={() => navigate('/signup')}>
            Get started
          </button>
        </nav>
      </header>

      <main id="top">
        {/* ── Hero ── */}
        <section className="mlp-hero" aria-labelledby="mlp-hero-title">
          <span className="mlp-hero__glow" aria-hidden="true" />
          <Eyebrow>India's AI creator marketplace</Eyebrow>
          <h1 id="mlp-hero-title" className="mlp-hero__title">
            Creators create.
            <br />
            Brands grow.
            <br />
            We make it <em className="mlp-accent">happen.</em>
          </h1>
          <p className="mlp-hero__sub">
            Influnz finds the right local creators, negotiates fair deals with AI and releases payment only when
            content goes live.
          </p>

          <div className="mlp-hero__ctas">
            <button type="button" className="mlp-btn mlp-btn--coral mlp-btn--lg" onClick={() => navigate('/signup')}>
              Start a campaign
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
            </button>
            <button type="button" className="mlp-btn mlp-btn--ghost mlp-btn--lg" onClick={() => navigate('/signup')}>
              I'm a creator
            </button>
          </div>

          <div className="mlp-proof">
            <span className="mlp-faces" aria-hidden="true">
              {[PHOTOS.pranav, PHOTOS.anu, PHOTOS.rohit, PHOTOS.explorer].map((id) => (
                <img key={id} src={photo(id, 64, 64)} alt="" loading="lazy" />
              ))}
            </span>
            <span className="mlp-proof__text">
              <span className="mlp-proof__stars" aria-label="Rated 4.9 out of 5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={12} strokeWidth={0} fill="currentColor" aria-hidden="true" />
                ))}
                <strong>4.9</strong>
              </span>
              2,400+ creators in 40 cities
            </span>
          </div>

          <div className="mlp-stage" aria-hidden="true">
            <img className="mlp-stage__back" src={photo(PHOTOS.latte, 320, 400)} alt="" />
            <figure className="mlp-stage__main">
              <img src={photo(PHOTOS.hero, 560, 700)} alt="" />
              <span className="mlp-stage__shade" />
              <span className="mlp-live">
                <span className="mlp-live__dot" />
                Live · Chennai Café Launch
              </span>
              <figcaption className="mlp-stage__who">
                <strong>Shruti Vlogs</strong>
                <span>
                  <MapPin size={12} strokeWidth={2.4} />
                  Chennai · 482K followers
                </span>
              </figcaption>
            </figure>

            <span className="mlp-float mlp-float--match">
              <span className="mlp-ring" style={{ '--mlp-pct': 96 } as CSSProperties}>
                <strong>96</strong>
              </span>
              <span>
                <strong>AI match</strong>
                <span>Audience fit</span>
              </span>
            </span>

            <span className="mlp-float mlp-float--deal">
              <img src={photo(PHOTOS.pranav, 72, 72)} alt="" />
              <span>
                <strong>Offer accepted</strong>
                <span>₹28,000 · 1 Reel + 2 Stories</span>
              </span>
              <CircleCheck className="mlp-float__ok" size={18} strokeWidth={2.4} />
            </span>

            <span className="mlp-float mlp-float--reach">
              <TrendingUp size={14} strokeWidth={2.4} />
              <strong>+42%</strong> reach
            </span>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" className="mlp-section" aria-labelledby="mlp-how-title">
          <div className="mlp-reveal">
            <Eyebrow>How it works</Eyebrow>
            <h2 id="mlp-how-title" className="mlp-h2">
              Launch a campaign in <em className="mlp-accent">three</em> taps
            </h2>
          </div>

          <ol className="mlp-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="mlp-step mlp-reveal">
                <span className="mlp-step__num">{i + 1}</span>
                <div className="mlp-step__body">
                  <h3 className="mlp-step__title">{s.title}</h3>
                  <p className="mlp-step__text">{s.text}</p>

                  {i === 0 && (
                    <div className="mlp-mini mlp-mini--chat" aria-hidden="true">
                      <span className="mlp-bubble mlp-bubble--me">Promote my café in Chennai, ₹50k budget</span>
                      <span className="mlp-bubble mlp-bubble--ai">
                        <Bot size={13} strokeWidth={2.2} />
                        Got it! Finding food creators near T. Nagar…
                      </span>
                    </div>
                  )}
                  {i === 1 && (
                    <ul className="mlp-mini mlp-mini--match" aria-hidden="true">
                      {MATCHES.map((m) => (
                        <li key={m.name}>
                          <img src={photo(m.photo, 64, 64)} alt="" loading="lazy" />
                          <span>{m.name}</span>
                          <strong>{m.fit}%</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                  {i === 2 && (
                    <div className="mlp-mini mlp-mini--escrow" aria-hidden="true">
                      <ShieldCheck size={18} strokeWidth={2.2} />
                      <span>
                        <strong>₹28,000 held in escrow</strong>
                        <span>Released when the Reel goes live</span>
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Bento features ── */}
        <section id="features" className="mlp-section mlp-section--tint" aria-labelledby="mlp-features-title">
          <div className="mlp-reveal">
            <Eyebrow>Everything in one place</Eyebrow>
            <h2 id="mlp-features-title" className="mlp-h2">
              Built for the way India <em className="mlp-accent">creates</em>
            </h2>
          </div>

          <div className="mlp-bento">
            <article className="mlp-tile mlp-tile--wide mlp-tile--ink mlp-reveal">
              <div className="mlp-tile__row">
                <div>
                  <h3 className="mlp-tile__title">AI matchmaking</h3>
                  <p className="mlp-tile__text">Matched by city, language, audience and past performance.</p>
                </div>
                <span className="mlp-ring mlp-ring--lg" style={{ '--mlp-pct': 96 } as CSSProperties} aria-label="96% match">
                  <strong>96%</strong>
                </span>
              </div>
              <span className="mlp-faces mlp-faces--lg" aria-hidden="true">
                {[PHOTOS.foodtales, PHOTOS.cafe, PHOTOS.arjun, PHOTOS.explorer, PHOTOS.anu].map((id) => (
                  <img key={id} src={photo(id, 80, 80)} alt="" loading="lazy" />
                ))}
                <span className="mlp-faces__more">+2.4K</span>
              </span>
            </article>

            <article className="mlp-tile mlp-tile--peach mlp-reveal">
              <Bot className="mlp-tile__icon" size={22} strokeWidth={2} aria-hidden="true" />
              <h3 className="mlp-tile__title">AI negotiation</h3>
              <div className="mlp-nego" aria-hidden="true">
                <span className="mlp-nego__ask">Ask ₹40,000</span>
                <span className="mlp-nego__deal">
                  <Check size={12} strokeWidth={3} />
                  Deal ₹28,000
                </span>
              </div>
            </article>

            <article className="mlp-tile mlp-tile--white mlp-reveal">
              <ShieldCheck className="mlp-tile__icon mlp-tile__icon--green" size={22} strokeWidth={2} aria-hidden="true" />
              <h3 className="mlp-tile__title">Escrow payments</h3>
              <p className="mlp-tile__text">₹0 lost to no-shows. Pay on delivery.</p>
            </article>

            <article className="mlp-tile mlp-tile--wide mlp-tile--white mlp-reveal">
              <div className="mlp-tile__row">
                <div>
                  <h3 className="mlp-tile__title">Live analytics</h3>
                  <p className="mlp-tile__text">Views, enquiries and cost per customer — in real time.</p>
                </div>
                <span className="mlp-roi">
                  <strong>3.2x</strong>
                  <span>avg. ROI</span>
                </span>
              </div>
              <span className="mlp-chart" aria-hidden="true">
                {CHART.map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </span>
            </article>

            <article className="mlp-tile mlp-tile--coral mlp-reveal">
              <BadgeCheck className="mlp-tile__icon" size={22} strokeWidth={2} aria-hidden="true" />
              <h3 className="mlp-tile__title">Approve from your phone</h3>
              <p className="mlp-tile__text">Review, request changes or approve in a tap.</p>
            </article>

            <article className="mlp-tile mlp-tile--cream mlp-reveal">
              <Languages className="mlp-tile__icon" size={22} strokeWidth={2} aria-hidden="true" />
              <h3 className="mlp-tile__title">Speaks your language</h3>
              <ul className="mlp-langs">
                {LANGUAGES.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="mlp-stats" aria-label="Influnz in numbers">
          <dl className="mlp-stats__grid">
            {STATS.map((s) => (
              <div key={s.label} className="mlp-stats__item mlp-reveal">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Audience switch ── */}
        <section className="mlp-section" aria-labelledby="mlp-audience-title">
          <div className="mlp-reveal">
            <Eyebrow>Two sides, one platform</Eyebrow>
            <h2 id="mlp-audience-title" className="mlp-h2">
              Made for both sides of the <em className="mlp-accent">deal</em>
            </h2>
          </div>

          <div className="mlp-switch" role="radiogroup" aria-label="Show benefits for">
            {(Object.keys(AUDIENCES) as Audience[]).map((key) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={audience === key}
                className={`mlp-switch__opt${audience === key ? ' is-active' : ''}`}
                onClick={() => setAudience(key)}
              >
                {AUDIENCES[key].label}
              </button>
            ))}
            <span className={`mlp-switch__thumb mlp-switch__thumb--${audience}`} aria-hidden="true" />
          </div>

          <ul className="mlp-points" key={audience}>
            {current.points.map((p) => (
              <li key={p}>
                <span className="mlp-points__check" aria-hidden="true">
                  <Check size={14} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <button type="button" className="mlp-btn mlp-btn--ink mlp-btn--lg mlp-btn--block" onClick={() => navigate('/signup')}>
            {current.cta}
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </section>

        {/* ── Testimonials ── */}
        <section className="mlp-section mlp-section--band" aria-labelledby="mlp-quotes-title">
          <div className="mlp-reveal">
            <Eyebrow>Loved across India</Eyebrow>
            <h2 id="mlp-quotes-title" className="mlp-h2">
              Real results, <em className="mlp-accent">real</em> people
            </h2>
          </div>

          <ul className="mlp-quotes" ref={quotesRef} onScroll={onQuotesScroll} aria-label="Testimonials">
            {QUOTES.map((q) => (
              <li key={q.name} className="mlp-quote">
                <Quote className="mlp-quote__mark" size={26} strokeWidth={2} aria-hidden="true" />
                <p className="mlp-quote__text">{q.quote}</p>
                <span className="mlp-quote__who">
                  <img src={photo(q.photo, 88, 88)} alt="" loading="lazy" />
                  <span>
                    <strong>{q.name}</strong>
                    <span>{q.role}</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mlp-dots" role="group" aria-label="Choose testimonial">
            {QUOTES.map((q, i) => (
              <button
                key={q.name}
                type="button"
                className={`mlp-dots__dot${activeQuote === i ? ' is-active' : ''}`}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={activeQuote === i ? 'true' : undefined}
                onClick={() => goToQuote(i)}
              />
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="mlp-section" aria-labelledby="mlp-faq-title">
          <div className="mlp-reveal">
            <Eyebrow>Questions</Eyebrow>
            <h2 id="mlp-faq-title" className="mlp-h2">
              Good to <em className="mlp-accent">know</em>
            </h2>
          </div>
          <div className="mlp-faq">
            {FAQS.map((f) => (
              <details key={f.q} className="mlp-faq__item">
                <summary>
                  {f.q}
                  <ChevronDown className="mlp-faq__chev" size={18} strokeWidth={2.2} aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="mlp-final" aria-labelledby="mlp-final-title">
          <div className="mlp-final__panel mlp-reveal">
            <span className="mlp-final__chip">
              <Clock size={13} strokeWidth={2.4} aria-hidden="true" />
              Takes under 2 minutes
            </span>
            <h2 id="mlp-final-title" className="mlp-final__title">
              Your next campaign is <em className="mlp-accent mlp-accent--light">one chat</em> away
            </h2>
            <p className="mlp-final__text">Free to start. No credit card. Pay only when creators deliver.</p>
            <button type="button" className="mlp-btn mlp-btn--white mlp-btn--lg mlp-btn--block" onClick={() => navigate('/signup')}>
              Get started free
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
            </button>
            <button type="button" className="mlp-final__login" onClick={() => navigate('/login')}>
              Already have an account? <strong>Log in</strong>
            </button>
          </div>
        </section>
      </main>

      <footer className="mlp-foot">
        <img src={logoImg} alt="Influnz" className="mlp-logo" />
        <p className="mlp-foot__tag">AI-powered creator marketing for Indian businesses.</p>
        <nav className="mlp-foot__links" aria-label="Footer">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <button type="button" onClick={() => navigate('/login')}>
            Log in
          </button>
          <button type="button" onClick={() => navigate('/signup')}>
            Sign up
          </button>
        </nav>
        <p className="mlp-foot__copy">© 2026 Influnz · Made in India</p>
      </footer>
    </div>
  );
}
