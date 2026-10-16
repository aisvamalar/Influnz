/**
 * Business dashboard — web.
 * KPIs, campaign performance, AI next steps, active campaigns, review queue and deadlines.
 */
import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  Megaphone,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../../app/AuthContext';
import BusinessLayout from '../BusinessLayout';
import { NAMED_CREATOR_PHOTOS, unsplashPhoto } from '../mobile/creatorPhotos';
import { profileProgress, useBusinessProfile } from '../businessProfile';
import { INITIAL_CREATORS } from '../campaignWorkspaceData';
import './business-dashboard-web.css';
import '../profile/business-profile.css';

interface Kpi {
  label: string;
  value: string;
  delta: string;
  note: string;
  icon: LucideIcon;
  tone: 'coral' | 'amber' | 'teal' | 'violet';
  trend: number[];
}

const KPIS: Kpi[] = [
  { label: 'Active campaigns', value: '3', delta: '+1', note: 'vs last month', icon: Megaphone, tone: 'coral', trend: [1, 2, 2, 2, 3, 3] },
  { label: 'Total spend', value: '₹1.02L', delta: '68%', note: 'of ₹1.5L budget', icon: Wallet, tone: 'amber', trend: [12, 28, 41, 60, 84, 102] },
  { label: 'Creators active', value: '8', delta: '+3', note: 'confirmed deals', icon: Users, tone: 'teal', trend: [3, 4, 4, 5, 7, 8] },
  { label: 'Avg. campaign fit', value: '91%', delta: '+2%', note: 'creator match score', icon: Target, tone: 'violet', trend: [84, 86, 85, 88, 89, 91] },
];

const BUDGET_SPLIT = [
  { label: 'Spent', amount: '₹1,02,000', share: 35, color: '#f2846b' },
  { label: 'Committed', amount: '₹35,200', share: 12, color: '#f6c09f' },
  { label: 'Available', amount: '₹1,52,800', share: 53, color: '#ece6e1' },
];

type MetricKey = 'reach' | 'engagement';

const WEEKS = ['4 Aug', '11 Aug', '18 Aug', '25 Aug', '1 Sep', '8 Sep', '15 Sep', '22 Sep'];

const METRICS: Record<MetricKey, {
  label: string;
  total: string;
  caption: string;
  delta: string;
  data: number[];
  max: number;
  format: (v: number) => string;
}> = {
  reach: {
    label: 'Reach',
    total: '5.92L',
    caption: 'people reached in the last 8 weeks',
    delta: '+18%',
    data: [42, 58, 51, 74, 69, 92, 88, 118],
    max: 150,
    format: v => `${v}K`,
  },
  engagement: {
    label: 'Engagement',
    total: '4.6%',
    caption: 'average engagement rate this week',
    delta: '+0.5 pts',
    data: [3.1, 3.4, 3.2, 3.9, 3.7, 4.3, 4.1, 4.6],
    max: 6,
    format: v => `${v}%`,
  },
};

const CAMPAIGNS = [
  {
    id: 1,
    name: 'Chennai Café Launch',
    status: 'active' as const,
    budget: '₹1,50,000',
    spent: '₹1,02,000',
    fill: 68,
    creators: 8,
    due: '30 Sep',
    thumb: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop&crop=center',
  },
  {
    id: 2,
    name: 'Mumbai Fashion Drop',
    status: 'pending' as const,
    budget: '₹80,000',
    spent: '₹0',
    fill: 0,
    creators: 0,
    due: '10 Oct',
    thumb: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&crop=center',
  },
  {
    id: 3,
    name: 'Bangalore Tech Event',
    status: 'pending' as const,
    budget: '₹60,000',
    spent: '₹0',
    fill: 0,
    creators: 0,
    due: 'TBD',
    thumb: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop&crop=center',
  },
];

const STATUS_LABEL = { active: 'Active', pending: 'Pending', draft: 'Draft' } as const;

const workspaceLink = (tab: 'overview' | 'creators' | 'content', creator?: string) =>
  `/business/campaigns/1?tab=${tab}${creator ? `&creator=${creator}` : ''}`;

const REVIEWS = (
  [
    { id: 'pranav', type: 'content' as const, path: workspaceLink('content', 'pranav') },
    { id: 'explorer', type: 'counter' as const, path: workspaceLink('creators', 'explorer') },
    { id: 'foodtales', type: 'content' as const, path: workspaceLink('content', 'foodtales') },
  ]
).map(r => {
  const creator = INITIAL_CREATORS.find(c => c.id === r.id)!;
  return { ...r, name: creator.name, avatar: creator.avatar };
});

const NEXT_STEPS = [
  { text: 'Review 2 content submissions', path: workspaceLink('content', 'pranav') },
  { text: "Reply to Chennai Explorer's counter offer", path: workspaceLink('creators', 'explorer') },
  { text: 'Fill 1 open creator slot', path: '/business/campaigns/creators' },
];

const UPCOMING = [
  { day: '30', month: 'Sep', title: 'Content deadline', sub: 'Chennai Café Launch · 8 creators' },
  { day: '10', month: 'Oct', title: 'Campaign goes live', sub: 'Mumbai Fashion Drop' },
  { day: '15', month: 'Oct', title: 'Finalise the brief', sub: 'Bangalore Tech Event · pending' },
];

function greeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 80 + 2},${26 - ((v - min) / range) * 22}`)
    .join(' ');
  return (
    <svg className="bdw-kpi__spark" viewBox="0 0 84 30" fill="none" aria-hidden="true">
      <polyline points={points} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PerformanceChart() {
  const [metricKey, setMetricKey] = useState<MetricKey>('reach');
  const [hover, setHover] = useState<number | null>(null);
  const metric = METRICS[metricKey];
  const last = metric.data.length - 1;
  const active = hover ?? last;

  const pts = metric.data.map((v, i) => ({ x: (i / last) * 100, y: 100 - (v / metric.max) * 100 }));
  const line = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `0,100 ${line} 100,100`;
  const ticks = [1, 2 / 3, 1 / 3, 0].map(f => metric.format(Math.round(metric.max * f * 10) / 10));

  return (
    <section className="bdw-panel" aria-labelledby="bdw-perf-title">
      <div className="bdw-panel__head">
        <div>
          <h2 className="bdw-panel__title" id="bdw-perf-title">Campaign performance</h2>
          <p className="bdw-panel__sub">Across all active campaigns</p>
        </div>
        <div className="bdw-tabs" role="tablist" aria-label="Metric">
          {(Object.keys(METRICS) as MetricKey[]).map(key => (
            <button
              key={key}
              type="button"
              role="tab"
              className="bdw-tab"
              aria-selected={metricKey === key}
              onClick={() => { setMetricKey(key); setHover(null); }}
            >
              {METRICS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bdw-chart__summary">
        <span className="bdw-chart__total">{metric.total}</span>
        <span className="bdw-delta"><ArrowUpRight size={12} strokeWidth={2.5} />{metric.delta}</span>
        <span className="bdw-chart__caption">{metric.caption}</span>
      </div>

      <div className="bdw-chart">
        <div className="bdw-chart__axis" aria-hidden="true">
          {ticks.map(t => <span key={t}>{t}</span>)}
        </div>
        <div className="bdw-chart__plot" onMouseLeave={() => setHover(null)}>
          <div className="bdw-chart__grid" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <svg className="bdw-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points={area} fill="rgba(242, 132, 107, 0.12)" />
            <polyline
              points={line}
              fill="none"
              stroke="#f2846b"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="bdw-chart__guide" style={{ left: `${pts[active].x}%` }} />
          <span className="bdw-chart__dot" style={{ left: `${pts[active].x}%`, top: `${pts[active].y}%` }} />
          <span
            className={`bdw-chart__tip${pts[active].x > 85 ? ' bdw-chart__tip--end' : pts[active].x < 15 ? ' bdw-chart__tip--start' : ''}`}
            style={{ left: `${pts[active].x}%`, top: `${pts[active].y}%` }}
          >
            {metric.format(metric.data[active])}
            <small>Week of {WEEKS[active]}</small>
          </span>
          <div className="bdw-chart__hits">
            {metric.data.map((_, i) => (
              <span key={i} onMouseEnter={() => setHover(i)} />
            ))}
          </div>
        </div>
        <div className="bdw-chart__x" aria-hidden="true">
          {WEEKS.map(w => <span key={w}>{w}</span>)}
        </div>
      </div>
    </section>
  );
}

function BudgetOverview({ onPayments }: { onPayments: () => void }) {
  return (
    <section className="bdw-panel bdw-budget" aria-labelledby="bdw-budget-title">
      <div>
        <h2 className="bdw-budget__label" id="bdw-budget-title">Total campaign budget</h2>
        <div className="bdw-budget__total">
          <strong>₹2,90,000</strong>
          <span>across 3 campaigns</span>
        </div>
        <div className="bdw-split" role="img" aria-label="35% spent, 12% committed, 53% available">
          {BUDGET_SPLIT.map(s => (
            <span key={s.label} style={{ width: `${s.share}%`, background: s.color }} />
          ))}
        </div>
        <div className="bdw-legend">
          {BUDGET_SPLIT.map(s => (
            <div key={s.label} className="bdw-legend__item" style={{ '--dot': s.color } as CSSProperties}>
              <span>{s.label} · {s.share}%</span>
              <strong>{s.amount}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="bdw-payout">
        <span className="bdw-payout__head"><Clock size={13} /> Next payout · 25 Sep</span>
        <div className="bdw-payout__who">
          <img className="bdw-avatar" src={unsplashPhoto(NAMED_CREATOR_PHOTOS['Foodie Tamilan'], 96, 96)} alt="" />
          <div>
            <strong>Foodie Tamilan</strong>
            <small>Releases when content is approved</small>
          </div>
        </div>
        <span className="bdw-payout__amount">₹10,000</span>
        <button type="button" className="bdw-btn bdw-btn--ghost" onClick={onPayments}>
          Go to payments
        </button>
      </div>
    </section>
  );
}

export default function BusinessDashboardWeb() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const name = state.user?.businessName ?? 'there';
  const progress = profileProgress(useBusinessProfile());
  const now = new Date();
  const today = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <BusinessLayout breadcrumb="Dashboard">
      <div className="bdw">
        <header className="bdw-head">
          <div>
            <p className="bdw-head__date">{today}</p>
            <h1 className="bdw-head__title">{greeting(now.getHours())}, {name}</h1>
            <p className="bdw-head__sub">Here's how your campaigns are doing today.</p>
          </div>
          <div className="bdw-head__actions">
            <button type="button" className="bdw-btn bdw-btn--ghost" onClick={() => navigate('/business/campaigns')}>
              View campaigns
            </button>
            <button type="button" className="bdw-btn bdw-btn--dark" onClick={() => navigate('/business/campaigns/new')}>
              <Plus size={16} strokeWidth={2.5} />
              New campaign
            </button>
          </div>
        </header>

        {!progress.profileComplete && (
          <div className="bp-banner">
            <span className="bp-banner__icon"><ShieldCheck size={20} /></span>
            <div className="bp-banner__body">
              <p className="bp-banner__title">Finish verifying your business</p>
              <p className="bp-banner__text">
                Verified businesses get a badge creators see on every invite. GSTIN is optional and takes a minute.
              </p>
            </div>
            <div className="bp-banner__meter">
              Profile {progress.percent}% complete
              <div className="bp-bar"><span style={{ width: `${progress.percent}%` }} /></div>
            </div>
            <button
              type="button"
              className="bp-btn bp-btn--primary"
              onClick={() => navigate('/business/settings#verification')}
            >
              Complete profile
            </button>
          </div>
        )}

        <div className="bdw-row bdw-row--stretch">
          <BudgetOverview onPayments={() => navigate('/business/payments')} />

          <aside className="bdw-ai" aria-labelledby="bdw-ai-title">
            <span className="bdw-ai__badge"><Sparkles size={13} />AI assistant</span>
            <h2 className="bdw-ai__title" id="bdw-ai-title">
              3 things to do today to keep Chennai Café Launch on schedule
            </h2>
            <p className="bdw-ai__text">
              Content is due on 30 Sep. Clearing these now leaves creators a full week to post.
            </p>
            <ol className="bdw-ai__list">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.text}>
                  <button type="button" className="bdw-ai__item" onClick={() => navigate(step.path)}>
                    <span className="bdw-ai__num">{i + 1}</span>
                    <span>{step.text}</span>
                    <ArrowRight size={16} />
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <section className="bdw-kpis" aria-label="Key metrics">
          {KPIS.map(({ label, value, delta, note, icon: Icon, tone, trend }) => (
            <article key={label} className={`bdw-panel bdw-kpi bdw-kpi--${tone}`}>
              <div className="bdw-kpi__top">
                <span className="bdw-kpi__icon"><Icon size={17} /></span>
                {label}
              </div>
              <div className="bdw-kpi__mid">
                <span className="bdw-kpi__value">{value}</span>
                <Sparkline values={trend} />
              </div>
              <div className="bdw-kpi__foot">
                <span className="bdw-delta"><ArrowUpRight size={12} strokeWidth={2.5} />{delta}</span>
                {note}
              </div>
            </article>
          ))}
        </section>

        <div className="bdw-row bdw-row--stretch">
          <PerformanceChart />

          <section className="bdw-panel bdw-review" aria-labelledby="bdw-review-title">
            <div className="bdw-panel__head">
              <div>
                <h2 className="bdw-panel__title" id="bdw-review-title">Waiting for review</h2>
                <p className="bdw-panel__sub">Chennai Café Launch</p>
              </div>
              <span className="bdw-count" aria-label={`${REVIEWS.length} items`}>{REVIEWS.length}</span>
            </div>
            {REVIEWS.map(r => (
              <div key={r.id} className="bdw-review__item">
                <img className="bdw-avatar" src={r.avatar} alt="" />
                <div className="bdw-review__body">
                  <span className="bdw-review__name">{r.name}</span>
                  <span className="bdw-review__type">
                    {r.type === 'content'
                      ? <><FileText size={12} /> Content submitted</>
                      : <><MessageSquare size={12} /> Counter offer</>}
                  </span>
                </div>
                <button type="button" className="bdw-review__btn" onClick={() => navigate(r.path)}>
                  {r.type === 'content' ? 'Review' : 'Respond'}
                </button>
              </div>
            ))}
          </section>
        </div>

        <div className="bdw-row bdw-row--stretch">
          <section className="bdw-panel bdw-campaigns" aria-labelledby="bdw-camp-title">
            <div className="bdw-panel__head">
              <div>
                <h2 className="bdw-panel__title" id="bdw-camp-title">Your campaigns</h2>
                <p className="bdw-panel__sub">{CAMPAIGNS.length} campaigns · 1 live</p>
              </div>
              <button type="button" className="bdw-link" onClick={() => navigate('/business/campaigns')}>
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="bdw-table__head" aria-hidden="true">
              <span>Campaign</span>
              <span>Status</span>
              <span>Budget used</span>
              <span />
            </div>
            {CAMPAIGNS.map(c => (
              <button
                key={c.id}
                type="button"
                className="bdw-camp"
                onClick={() => navigate(`/business/campaigns/${c.id}`)}
              >
                <span className="bdw-camp__main">
                  <img className="bdw-camp__thumb" src={c.thumb} alt="" />
                  <span style={{ minWidth: 0 }}>
                    <span className="bdw-camp__name">{c.name}</span>
                    <span className="bdw-camp__meta">
                      <Users size={12} /> {c.creators} creators
                      <span aria-hidden="true">·</span>
                      <CalendarDays size={12} /> Due {c.due}
                    </span>
                  </span>
                </span>
                <span className={`bdw-status bdw-status--${c.status}`}>{STATUS_LABEL[c.status]}</span>
                <span className="bdw-camp__budget">
                  <span><strong>{c.spent}</strong> of {c.budget}</span>
                  <span className="bdw-bar" role="progressbar" aria-valuenow={c.fill} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.name} budget used`}>
                    <span style={{ width: `${c.fill}%` }} />
                  </span>
                </span>
                <ChevronRight className="bdw-camp__go" size={18} />
              </button>
            ))}
          </section>

          <section className="bdw-panel" aria-labelledby="bdw-upcoming-title">
            <div className="bdw-panel__head">
              <h2 className="bdw-panel__title" id="bdw-upcoming-title">Coming up</h2>
            </div>
            <div className="bdw-upcoming">
              {UPCOMING.map(e => (
                <div key={e.title} className="bdw-event">
                  <span className="bdw-event__date">
                    <span style={{ display: 'grid', justifyItems: 'center', gap: 3 }}>
                      <strong>{e.day}</strong>
                      <small>{e.month}</small>
                    </span>
                  </span>
                  <span>
                    <span className="bdw-event__title">{e.title}</span>
                    <span className="bdw-event__sub">{e.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </BusinessLayout>
  );
}
