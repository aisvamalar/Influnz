import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { useResponsive } from '../../../hooks/useResponsive';
import { useCreator } from '../CreatorContext';
import { compact, daysUntil, dueLabel, inr } from '../format';
import type { Invitation, PaymentStatus } from '../types';
import DashboardPageMobile from './DashboardPageMobile';
import './creator-dashboard.css';

const TAKEN = ['accepted', 'contract_pending', 'active', 'completed'];
const FRESH = ['new', 'in_negotiation'];

function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function DashboardWeb() {
  const navigate = useNavigate();
  const { profile, invitations, payments, deliverables, ensureDeliverables } = useCreator();
  const today = new Date();

  const fresh = useMemo(
    () => invitations.filter(i => FRESH.includes(i.status)).sort((a, b) => b.matchPct - a.matchPct),
    [invitations],
  );
  const featured = fresh[0];
  const running = useMemo(
    () => invitations.filter(i => TAKEN.includes(i.status)),
    [invitations],
  );

  useEffect(() => {
    running.forEach(ensureDeliverables);
  }, [running, ensureDeliverables]);

  const sum = (statuses: PaymentStatus[]) =>
    payments.filter(p => statuses.includes(p.status)).reduce((s, p) => s + p.amount, 0);
  const paid = sum(['paid']);
  const pending = sum(['pending']);
  const processing = sum(['processing']);
  const expected = sum(['upcoming']);
  const problem = sum(['failed', 'disputed']);

  const next = [...running]
    .map(i => ({ inv: i, days: daysUntil(i.brief.endDate) }))
    .sort((a, b) => a.days - b.days)[0];

  const openWork = running.flatMap(i => {
    const open = (deliverables[i.id] ?? []).filter(d => d.status === 'not_started' || d.status === 'changes_requested');
    return open.length ? [{ inv: i, count: open.length }] : [];
  });

  const audience = [
    { label: profile.audience.topCity, pct: profile.audience.topCityPct },
    { label: profile.audience.topLanguage, pct: profile.audience.topLanguagePct },
    { label: profile.audience.topAgeRange, pct: profile.audience.topAgePct },
    { label: profile.audience.topCountry, pct: profile.audience.topCountryPct },
  ];
  const others = fresh.filter(inv => inv.id !== featured?.id);
  const nextOpen = next ? openWork.find(item => item.inv.id === next.inv.id) : undefined;
  const otherWork = openWork.filter(item => item.inv.id !== next?.inv.id);
  const todoCount = otherWork.length + (next ? 1 : 0);

  return (
    <div className="cdb">
      <header className="cdb-hello">
        <p className="cdb-hello__date">
          {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1>{greetingFor(today)}, {profile.displayName}</h1>
        <p>One invitation to open, the work that is due, and what you have been paid.</p>
      </header>

      <section className="cdb-kpis" aria-label="Snapshot">
        <Kpi
          label="New invitations"
          value={String(fresh.length)}
          note={fresh[0] ? `${fresh[0].matchPct}% best fit` : 'None waiting'}
          onClick={() => navigate('/creator/invitations')}
        />
        <Kpi
          label="Campaigns in progress"
          value={String(running.length)}
          note={running.length ? 'Accepted work' : 'Nothing active'}
          onClick={() => navigate('/creator/campaigns')}
        />
        <Kpi
          label="Next deadline"
          value={next ? shortDay(next.inv.brief.endDate) : '—'}
          note={next ? next.inv.brief.title : 'No deadlines yet'}
          onClick={() => navigate(next ? `/creator/campaigns/${next.inv.id}` : '/creator/campaigns')}
        />
        <Kpi
          label="Received"
          value={inr(paid)}
          note="Already paid to you"
          onClick={() => navigate('/creator/earnings')}
        />
      </section>

      <div className="cdb-main">
      <section className="cdb-hero">
        <div className="cdb-hero__art">
          {featured?.image && <img src={featured.image} alt="" />}
        </div>
        <div className="cdb-hero__copy">
          <span className="cdb-hero__kicker">
            {featured ? `New invitation · ${featured.matchPct}% fit` : 'Invitations'}
          </span>
          <h2>{featured ? featured.brief.title : 'Nothing waiting'}</h2>
          <p className="cdb-hero__by">
            {featured
              ? `${featured.brand} · ${featured.category} · ${featured.location}`
              : 'When a brand chooses you, the invitation shows up here.'}
          </p>
          {featured && <p className="cdb-hero__lead">{featured.brief.summary}</p>}
          {featured && <b className="cdb-hero__pay">{inr(featured.agreedRate ?? featured.proposedRate)}</b>}
          <button type="button" className="cdb-btn" onClick={() => navigate(featured ? `/creator/invitations/${featured.id}` : '/creator/invitations')}>
            {featured ? 'Open invitation' : 'See invitations'} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {others.length > 0 && (
        <section className="cdb-panel cdb-invites">
          <div className="cdb-panel__head">
            <div>
              <h2>Also waiting</h2>
              <p>Other invitations matched to you.</p>
            </div>
            <button type="button" className="cdb-textlink" onClick={() => navigate('/creator/invitations')}>View all</button>
          </div>
          {others.slice(0, 3).map(inv => (
            <InviteRow key={inv.id} inv={inv} onOpen={() => navigate(`/creator/invitations/${inv.id}`)} />
          ))}
        </section>
      )}

      <section className="cdb-panel cdb-perf">
        <div className="cdb-panel__head">
          <div>
            <h2>Performance</h2>
            <p>From your connected profiles.</p>
          </div>
          <button type="button" className="cdb-textlink" onClick={() => navigate('/creator/growth')}>Open growth</button>
        </div>
        <div className="cdb-perf__body">
          <div className="cdb-metrics">
            <Metric label="Followers" value={compact(profile.followers)} />
            <Metric label="Engagement" value={`${profile.engagement}%`} />
            <Metric label="Avg views" value={compact(profile.avgViews)} />
          </div>
          <div className="cdb-bars" aria-hidden>
            {audience.map(a => (
              <span key={a.label} style={{ height: `${Math.max(18, a.pct)}%` }} />
            ))}
          </div>
        </div>
        <ul className="cdb-audience">
          {audience.map(a => (
            <li key={a.label}><strong>{a.pct}%</strong> {a.label}</li>
          ))}
        </ul>
      </section>
      </div>

      <aside className="cdb-side">
        <section className="cdb-panel">
          <div className="cdb-panel__head">
            <h2>To do{todoCount > 0 && <span className="cdb-count">{todoCount}</span>}</h2>
            <button type="button" className="cdb-textlink" onClick={() => navigate('/creator/campaigns')}>Campaigns</button>
          </div>
          {next && (
            <button type="button" className="cdb-task" onClick={() => navigate(`/creator/campaigns/${next.inv.id}`)}>
              <b>Due</b>
              <span>
                <strong>{next.inv.brief.title}</strong>
                <small>
                  {nextOpen ? `Submit ${nextOpen.count} piece${nextOpen.count > 1 ? 's' : ''} · ` : ''}
                  {dueLabel(next.inv.brief.endDate)}
                </small>
              </span>
            </button>
          )}
          {otherWork.slice(0, 3).map(item => (
            <button key={item.inv.id} type="button" className="cdb-task" onClick={() => navigate(`/creator/campaigns/${item.inv.id}`)}>
              <b>Send</b>
              <span>
                <strong>{item.inv.brief.title}</strong>
                <small>Submit {item.count} piece{item.count > 1 ? 's' : ''}</small>
              </span>
            </button>
          ))}
          {todoCount === 0 && <p className="cdb-empty">You are caught up.</p>}
        </section>

        <section className="cdb-panel">
          <div className="cdb-panel__head">
            <h2>Earnings</h2>
            <button type="button" className="cdb-textlink" onClick={() => navigate('/creator/earnings')}>View all</button>
          </div>
          <dl className="cdb-earn__more">
            <div><dt>Received</dt><dd>{inr(paid)}</dd></div>
            <div><dt>Expected</dt><dd>{inr(expected)}</dd></div>
            <div><dt>Pending</dt><dd>{inr(pending)}</dd></div>
            <div><dt>Processing</dt><dd>{inr(processing)}</dd></div>
            {problem > 0 && <div className="is-bad"><dt>Failed or disputed</dt><dd>{inr(problem)}</dd></div>}
          </dl>
          <p className="cdb-note">Expected is not earned until it is paid.</p>
        </section>

        <section className="cdb-panel">
          <h2>Standing</h2>
          <button type="button" className="cdb-stand" onClick={() => navigate('/creator/reputation')}>
            <b>{profile.reliability}</b>
            <span>Reliability · rating {profile.rating.toFixed(1)}</span>
          </button>
        </section>
      </aside>
    </div>
  );
}

function shortDay(iso: string): string {
  const hit = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!hit) return '—';
  return `${Number(hit[3])} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(hit[2]) - 1]}`;
}

function Kpi({ label, value, note, onClick }: {
  label: string;
  value: string;
  note: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="cdb-kpi" onClick={onClick}>
      <span className="cdb-kpi__label">{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="cdb-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InviteRow({ inv, onOpen }: { inv: Invitation; onOpen: () => void }) {
  return (
    <article className="cdb-invite">
      {inv.image ? <img src={inv.image} alt="" /> : <span className="cdb-invite__ph" />}
      <div className="cdb-invite__main">
        <strong>{inv.brief.title}</strong>
        <span>{inv.category} · {inv.location}</span>
        <small>
          {inv.brand}
          {inv.brandVerified && <BadgeCheck size={13} />}
          {' · '}{inv.deliverables.length} deliverable{inv.deliverables.length === 1 ? '' : 's'}
          {' · '}{inv.matchPct}% match
        </small>
      </div>
      <div className="cdb-invite__pay">
        <b>{inr(inv.proposedRate)}</b>
        <span>Your payout</span>
      </div>
      <div className="cdb-invite__actions">
        <button type="button" className="cdb-btn" onClick={onOpen}>Open</button>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const { isMobile } = useResponsive();
  return isMobile ? <DashboardPageMobile /> : <DashboardWeb />;
}

