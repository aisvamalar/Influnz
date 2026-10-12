import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, ChevronRight, CircleCheck, Target, TrendingUp, Users, Wallet } from 'lucide-react';
import { useAuth } from '../../../app/AuthContext';
import MobileAppHeader from '../../../components/mobile/MobileAppHeader';
import MobileBottomNav from '../../../components/mobile/MobileBottomNav';
import RobotMark from '../../../components/mobile/RobotMark';
import { KPIS } from '../analyticsData';
import type { CreatorData } from '../campaignWorkspaceData';
import { getPendingApprovals } from './approvalsData';
import { CAMPAIGNS, STATUS_LABEL } from './mobileCampaigns';
import { avatarUrl, creatorInitials, getWorkspaceCampaign } from './workspaceUtils';
import './business-dashboard-mobile.css';

const SNAPSHOT_LABELS = ['Total views', 'Enquiries', 'Avg. CAC'];

const SPEND_COLORS = ['#e0603f', '#f2a33a', '#5b5bd6', '#2bb39a'];

const TICKET_CELLS = 25;

const AVG_FIT = 91;

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function Face({ creator, size }: { creator: CreatorData; size: number }) {
  const src = avatarUrl(creator, size * 2);
  if (!src) {
    return (
      <span className="mdb-face mdb-face--initials" aria-hidden="true">
        {creatorInitials(creator.name)}
      </span>
    );
  }
  return <img className="mdb-face" src={src} alt="" loading="lazy" />;
}

/**
 * Mobile Business Dashboard
 * Phone-first overview: budget, AI nudges, campaigns, performance and approvals.
 */
export default function BusinessDashboardMobile() {
  const navigate = useNavigate();
  const { state } = useAuth();

  const businessName = state.user?.businessName ?? 'Demo Business';
  const today = new Date();
  const budget = CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const spent = CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
  const spentPct = budget ? Math.round((spent / budget) * 100) : 0;
  const inProgress = CAMPAIGNS.filter((c) => c.status !== 'completed');
  const workspaceCreators = getWorkspaceCampaign('1')?.creators ?? [];
  const activeCreators = CAMPAIGNS.reduce((s, c) => s + (getWorkspaceCampaign(String(c.id))?.creators.length ?? 0), 0);
  const faces = workspaceCreators.slice(0, 3);
  const snapshot = SNAPSHOT_LABELS.flatMap((label) => KPIS.filter((k) => k.label === label));
  const approvals = getPendingApprovals();

  const segments = CAMPAIGNS.filter((c) => c.spent > 0).map((c, i) => ({
    id: c.id,
    name: c.name,
    spent: c.spent,
    color: SPEND_COLORS[i % SPEND_COLORS.length],
  }));
  const cells = segments
    .flatMap((s) => Array<string>(budget ? Math.round((s.spent / budget) * TICKET_CELLS) : 0).fill(s.color))
    .slice(0, TICKET_CELLS);
  while (cells.length < TICKET_CELLS) cells.push('');

  return (
    <div className="mdb">
      <MobileAppHeader showChevron />

      <main id="main-content" aria-label="Business dashboard">
        <section className="mdb-hello">
          <p className="mdb-hello__date">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="mdb-hello__title">
            {greetingFor(today)}, <span className="mdb-hello__name">{businessName}</span>
          </h1>
        </section>

        <section className="mdb-ticket" aria-labelledby="mdb-ticket-title">
          <div className="mdb-ticket__top">
            <div className="mdb-ticket__head">
              <span className="mdb-ticket__icon" aria-hidden="true">
                <Wallet size={17} strokeWidth={2.2} />
              </span>
              <div>
                <h2 id="mdb-ticket-title" className="mdb-ticket__title">
                  Spend ticket
                </h2>
                <span className="mdb-ticket__meta">
                  {today.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} • {CAMPAIGNS.length} campaigns
                </span>
              </div>
            </div>

            <span className="mdb-ticket__stamp" aria-hidden="true">
              <strong>{spentPct}%</strong>
              <span>used</span>
            </span>

            <span className="mdb-ticket__label">Total spent</span>
            <strong className="mdb-ticket__value">{inr(spent)}</strong>
            <span className="mdb-ticket__sub">of {inr(budget)} budget</span>

            <span
              className="mdb-ticket__cells"
              role="img"
              aria-label={`${spentPct}% of the budget used, ${inr(budget - spent)} left`}
            >
              {cells.map((color, i) => (
                <span
                  key={i}
                  className={`mdb-ticket__cell${color ? '' : ' mdb-ticket__cell--free'}`}
                  style={color ? { background: color } : undefined}
                />
              ))}
            </span>
          </div>

          <div className="mdb-ticket__tear" aria-hidden="true" />

          <div className="mdb-ticket__stub">
            <ul className="mdb-ticket__lines" aria-label="Spend by campaign">
              {segments.map((s) => (
                <li key={s.id} className="mdb-ticket__line">
                  <span className="mdb-ticket__dot" style={{ background: s.color }} aria-hidden="true" />
                  <span className="mdb-ticket__name">{s.name}</span>
                  <span className="mdb-ticket__leader" aria-hidden="true" />
                  <strong className="mdb-ticket__amt">{inr(s.spent)}</strong>
                </li>
              ))}
              <li className="mdb-ticket__line mdb-ticket__line--left">
                <span className="mdb-ticket__dot mdb-ticket__dot--free" aria-hidden="true" />
                <span className="mdb-ticket__name">Left to spend</span>
                <span className="mdb-ticket__leader" aria-hidden="true" />
                <strong className="mdb-ticket__amt">{inr(budget - spent)}</strong>
              </li>
            </ul>

            <div className="mdb-ticket__foot">
              <dl className="mdb-ticket__stats">
                <div>
                  <dt>Live</dt>
                  <dd>{inProgress.length}</dd>
                </div>
                <div>
                  <dt>Creators</dt>
                  <dd>{activeCreators}</dd>
                </div>
                <div>
                  <dt>Approvals</dt>
                  <dd>{approvals.length}</dd>
                </div>
              </dl>
              <button type="button" className="mdb-ticket__link" onClick={() => navigate('/business/payments')}>
                Payments <ChevronRight size={14} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <section className="mdb-ai" aria-label="AI assistant">
          <span className="mdb-ai__bot">
            <RobotMark size={34} />
          </span>
          <p className="mdb-ai__text">
            {approvals.length > 0 ? (
              <>
                <strong>
                  {approvals.length} {approvals.length === 1 ? 'approval is' : 'approvals are'}
                </strong>{' '}
                waiting and 1 creator slot is still open.
              </>
            ) : (
              <>
                <strong>All approvals cleared.</strong> 1 creator slot is still open.
              </>
            )}
          </p>
          <button type="button" className="mdb-ai__btn" onClick={() => navigate('/business/approvals')}>
            Review
          </button>
        </section>

        <section className="mdb-tiles" aria-label="Creator metrics">
          <button type="button" className="mdb-tile" onClick={() => navigate('/business/campaigns/1?tab=creators')}>
            <span className="mdb-tile__label">
              <Users size={15} strokeWidth={2} aria-hidden="true" />
              Creators active
            </span>
            <strong className="mdb-tile__value">{activeCreators}</strong>
            <span className="mdb-tile__faces" aria-hidden="true">
              {faces.map((c) => (
                <Face key={c.id} creator={c} size={26} />
              ))}
              {activeCreators > faces.length && (
                <span className="mdb-face mdb-face--more">+{activeCreators - faces.length}</span>
              )}
            </span>
          </button>
          <button type="button" className="mdb-tile" onClick={() => navigate('/business/analytics')}>
            <span className="mdb-tile__label">
              <Target size={15} strokeWidth={2} aria-hidden="true" />
              Avg. campaign fit
            </span>
            <strong className="mdb-tile__value">{AVG_FIT}%</strong>
            <span className="mdb-tile__meter" aria-hidden="true">
              <span style={{ width: `${AVG_FIT}%` }} />
            </span>
            <span className="mdb-tile__foot">
              <TrendingUp size={13} strokeWidth={2.2} aria-hidden="true" />
              +2% match score
            </span>
          </button>
        </section>

        <section className="mdb-section" aria-labelledby="mdb-campaigns-title">
          <div className="mdb-section__head">
            <div>
              <h2 id="mdb-campaigns-title" className="mdb-section__title">
                Campaigns
              </h2>
              <p className="mdb-section__sub">{inProgress.length} in progress</p>
            </div>
            <button type="button" className="mdb-section__link" onClick={() => navigate('/business/campaigns')}>
              View all <ArrowRight size={15} />
            </button>
          </div>

          <ul className="mdb-carousel">
            {inProgress.map((c) => {
              const pct = c.budget ? Math.round((c.spent / c.budget) * 100) : 0;
              const creators = getWorkspaceCampaign(String(c.id))?.creators.length ?? 0;
              const due = c.dates.split('–')[1]?.trim() ?? c.dates;
              return (
                <li key={c.id}>
                  <button type="button" className="mdb-camp" onClick={() => navigate(`/business/campaigns/${c.id}`)}>
                    <span className="mdb-camp__media">
                      <img src={c.image} alt="" loading="lazy" />
                      <span className={`mdb-camp__status mdb-camp__status--${c.status}`}>
                        <span className="mdb-camp__dot" aria-hidden="true" />
                        {STATUS_LABEL[c.status]}
                      </span>
                    </span>
                    <span className="mdb-camp__body">
                      <span className="mdb-camp__name">{c.name}</span>
                      <span className="mdb-camp__meta">
                        {c.platform} • {creators} creators
                      </span>
                      <span className="mdb-camp__spend">
                        <strong>{inr(c.spent)}</strong>
                        <span>of {inr(c.budget)}</span>
                        <span className="mdb-camp__pct">{pct}%</span>
                      </span>
                      <span className={`mdb-camp__bar mdb-camp__bar--${c.status}`} aria-hidden="true">
                        <span style={{ width: `${Math.max(pct, 2)}%` }} />
                      </span>
                      <span className="mdb-camp__due">
                        <CalendarDays size={13} strokeWidth={2} aria-hidden="true" />
                        Ends {due}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mdb-section" aria-labelledby="mdb-perf-title">
          <div className="mdb-section__head">
            <div>
              <h2 id="mdb-perf-title" className="mdb-section__title">
                Performance
              </h2>
              <p className="mdb-section__sub">Last 30 days</p>
            </div>
            <button type="button" className="mdb-section__link" onClick={() => navigate('/business/analytics')}>
              Analytics <ArrowRight size={15} />
            </button>
          </div>
          <dl className="mdb-snap">
            {snapshot.map((k) => (
              <div key={k.label} className="mdb-snap__item">
                <dt>{k.label}</dt>
                <dd>{k.value}</dd>
                {k.delta && <span className="mdb-snap__delta">{k.delta}</span>}
              </div>
            ))}
          </dl>
        </section>

        <section className="mdb-section" aria-labelledby="mdb-approvals-title">
          <div className="mdb-section__head">
            <div>
              <h2 id="mdb-approvals-title" className="mdb-section__title">
                Pending approvals
              </h2>
              <p className="mdb-section__sub">
                {approvals.length === 0
                  ? 'Nothing waiting on you'
                  : `${approvals.length} ${approvals.length === 1 ? 'item needs' : 'items need'} your review`}
              </p>
            </div>
            <button type="button" className="mdb-section__link" onClick={() => navigate('/business/approvals')}>
              View all <ArrowRight size={15} />
            </button>
          </div>

          {approvals.length === 0 ? (
            <p className="mdb-caught-up">
              <CircleCheck size={18} strokeWidth={2.2} aria-hidden="true" />
              You're all caught up.
            </p>
          ) : (
            <ul className="mdb-approvals">
              {approvals.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    className="mdb-appr"
                    onClick={() => navigate(a.path, { state: { pushed: true } })}
                  >
                    <Face creator={a.creator} size={44} />
                    <span className="mdb-appr__info">
                      <span className="mdb-appr__name">{a.creator.name}</span>
                      <span className="mdb-appr__campaign">{a.kind === 'content' ? a.title : a.detail}</span>
                      <span className={`mdb-appr__chip mdb-appr__chip--${a.kind}`}>
                        {a.kind === 'content' ? 'Content review' : 'Counter offer'}
                      </span>
                    </span>
                    <span className="mdb-appr__go">
                      Review
                      <ChevronRight size={15} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <MobileBottomNav activeItem="home" />
    </div>
  );
}
