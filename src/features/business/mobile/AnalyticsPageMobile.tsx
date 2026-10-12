/**
 * Mobile Analytics: overall spend across campaigns, performance KPIs, views trend,
 * per-campaign budget use, top creators and AI optimization recommendations.
 */
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Info, Target, TrendingUp, Zap } from 'lucide-react';
import MobileAppHeader from '../../../components/mobile/MobileAppHeader';
import MobileBottomNav from '../../../components/mobile/MobileBottomNav';
import { AI_OPTS, CREATOR_PERF, KPIS, TREND, type AiRecommendation } from '../analyticsData';
import { NAMED_CREATOR_PHOTOS, creatorInitials, unsplashPhoto } from './creatorPhotos';
import { CAMPAIGNS, STATUS_LABEL, type Status } from './mobileCampaigns';
import './analytics-mobile.css';

const STATUS_ORDER: Status[] = ['active', 'pending', 'draft', 'completed'];

const REC_ICON: Record<AiRecommendation['kind'], ReactNode> = {
  growth: <TrendingUp size={18} strokeWidth={2.2} />,
  alert: <Zap size={18} strokeWidth={2.2} />,
  target: <Target size={18} strokeWidth={2.2} />,
};

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const compact = (n: number) => (n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${Math.round(n / 1000)}K` : String(n));

function CreatorPhoto({ name }: { name: string }) {
  const photo = NAMED_CREATOR_PHOTOS[name];
  const [failed, setFailed] = useState(false);
  if (!photo || failed) {
    return (
      <span className="man-avatar man-avatar--initials" aria-hidden="true">
        {creatorInitials(name)}
      </span>
    );
  }
  return <img className="man-avatar" src={unsplashPhoto(photo, 96, 96)} alt="" loading="lazy" onError={() => setFailed(true)} />;
}

export default function AnalyticsPageMobile() {
  const navigate = useNavigate();
  const [applied, setApplied] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const portfolio = useMemo(() => {
    const budget = CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
    const spent = CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
    const byStatus = STATUS_ORDER.map((status) => ({
      status,
      count: CAMPAIGNS.filter((c) => c.status === status).length,
    }));
    return { budget, spent, pct: budget ? Math.round((spent / budget) * 100) : 0, byStatus };
  }, []);

  const maxViews = Math.max(...TREND.map((t) => t.views), 1);
  const topCreators = [...CREATOR_PERF].sort((a, b) => b.perf - a.perf);

  return (
    <div className="man">
      <MobileAppHeader showChevron />

      <main id="main-content" aria-label="Analytics">
        <div className="man-head">
          <h1 className="man-head__title">Analytics</h1>
          <p className="man-head__sub">Overall performance across your campaigns.</p>
        </div>

        <section className="man-hero" aria-label="Overall spend">
          <span className="man-hero__label">Total spend</span>
          <strong className="man-hero__value">{inr(portfolio.spent)}</strong>
          <span className="man-hero__sub">
            of {inr(portfolio.budget)} budget • {portfolio.pct}% used
          </span>
          <div
            className="man-bar man-bar--hero"
            role="progressbar"
            aria-label="Budget used across campaigns"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={portfolio.pct}
            style={{ '--man-fill': `${portfolio.pct}%` } as CSSProperties}
          />
          <dl className="man-hero__grid">
            {portfolio.byStatus.map((s) => (
              <div key={s.status} className="man-hero__stat">
                <dt>
                  <span className={`man-dot man-dot--${s.status}`} aria-hidden="true" />
                  {STATUS_LABEL[s.status]}
                </dt>
                <dd>{s.count}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="man-section" aria-labelledby="man-kpi-title">
          <div className="man-section__head">
            <h2 id="man-kpi-title" className="man-section__title">
              Performance
            </h2>
            <span className="man-section__meta">1 Sep – 30 Sep 2026</span>
          </div>
          <dl className="man-kpis">
            {KPIS.map((k) => (
              <div key={k.label} className="man-kpi">
                <dt>{k.label}</dt>
                <dd>{k.value}</dd>
                {k.delta && <span className={`man-kpi__delta man-kpi__delta--${k.dir || 'flat'}`}>{k.delta}</span>}
              </div>
            ))}
          </dl>
        </section>

        <section className="man-section man-panel" aria-labelledby="man-trend-title">
          <div className="man-section__head">
            <h2 id="man-trend-title" className="man-section__title">
              Views over time
            </h2>
            <span className="man-section__meta">{compact(TREND[TREND.length - 1].views)} latest</span>
          </div>
          <ol className="man-chart" aria-label="Weekly views">
            {TREND.map((t, i) => {
              const height = Math.max(4, Math.round((t.views / maxViews) * 100));
              const last = i === TREND.length - 1;
              return (
                <li key={t.label} className="man-chart__col">
                  <span className="man-chart__value">{t.views ? compact(t.views) : '—'}</span>
                  <span className="man-chart__track">
                    <span
                      className={`man-chart__bar${last ? ' is-latest' : ''}`}
                      style={{ '--man-h': `${height}%` } as CSSProperties}
                    />
                  </span>
                  <span className="man-chart__label">{t.label}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="man-section" aria-labelledby="man-camp-title">
          <div className="man-section__head">
            <h2 id="man-camp-title" className="man-section__title">
              Campaigns
            </h2>
            <button type="button" className="man-link" onClick={() => navigate('/business/campaigns')}>
              See all
            </button>
          </div>
          <ul className="man-list">
            {CAMPAIGNS.map((c) => {
              const pct = c.budget ? Math.round((c.spent / c.budget) * 100) : 0;
              return (
                <li key={c.id}>
                  <button type="button" className="man-camp" onClick={() => navigate(`/business/campaigns/${c.id}`)}>
                    <img className="man-camp__img" src={c.image} alt="" loading="lazy" />
                    <span className="man-camp__body">
                      <span className="man-camp__top">
                        <span className="man-camp__name">{c.name}</span>
                        <span className={`man-pill man-pill--${c.status}`}>{STATUS_LABEL[c.status]}</span>
                      </span>
                      <span className="man-camp__spend">
                        <strong>{inr(c.spent)}</strong> of {inr(c.budget)}
                      </span>
                      <span className="man-bar" style={{ '--man-fill': `${pct}%` } as CSSProperties} aria-hidden="true" />
                    </span>
                    <span className="man-camp__pct">{pct}%</span>
                    <ChevronRight className="man-camp__chev" size={18} strokeWidth={2} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="man-section" aria-labelledby="man-creators-title">
          <div className="man-section__head">
            <h2 id="man-creators-title" className="man-section__title">
              Top creators
            </h2>
            <span className="man-section__meta">by performance score</span>
          </div>
          <ul className="man-list">
            {topCreators.map((c) => (
              <li key={c.name} className="man-creator">
                <div className="man-creator__top">
                  <CreatorPhoto name={c.name} />
                  <span className="man-creator__who">
                    <span className="man-creator__name">{c.name}</span>
                    <span className="man-creator__sub">
                      {c.reach} reach • {c.enquiries} enquiries
                    </span>
                  </span>
                  <span
                    className={`man-score${c.perf >= 90 ? ' is-high' : ''}`}
                    style={{ '--man-score': c.perf } as CSSProperties}
                    aria-label={`Performance score ${c.perf}`}
                  >
                    <span>{c.perf}</span>
                  </span>
                </div>
                <dl className="man-creator__stats">
                  <div>
                    <dt>Views</dt>
                    <dd>{c.views}</dd>
                  </div>
                  <div>
                    <dt>Engaged</dt>
                    <dd>{c.engagements}</dd>
                  </div>
                  <div>
                    <dt>Spend</dt>
                    <dd>{c.spend}</dd>
                  </div>
                  <div>
                    <dt>CAC</dt>
                    <dd className="man-good">{c.cac}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <section className="man-section" aria-labelledby="man-ai-title">
          <h2 id="man-ai-title" className="man-section__title">
            AI recommendations
          </h2>
          <ul className="man-list">
            {AI_OPTS.map((o, i) => {
              const done = applied.includes(i);
              return (
                <li key={o.rec} className="man-rec">
                  <span className={`man-rec__icon man-rec__icon--${o.kind}`} aria-hidden="true">
                    {REC_ICON[o.kind]}
                  </span>
                  <p className="man-rec__text">{o.rec}</p>
                  <button
                    type="button"
                    className={`man-rec__btn${done ? ' is-done' : ''}`}
                    disabled={done}
                    onClick={() => {
                      setApplied((list) => [...list, i]);
                      setToast('Recommendation applied');
                    }}
                  >
                    {done ? (
                      <>
                        <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                        Applied
                      </>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="man-note">
            <Info size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>
              Missing or incomplete analytics are labeled as such. Optimization changes require your approval unless
              automation is enabled.
            </span>
          </p>
        </section>
      </main>

      <MobileBottomNav activeItem="analytics" />

      <div className="man-toast-region" role="status" aria-live="polite">
        {toast && <div className="man-toast">{toast}</div>}
      </div>
    </div>
  );
}
