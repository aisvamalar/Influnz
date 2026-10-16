import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, ChevronRight } from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { compact, dueLabel, daysUntil, inr } from '../format';
import type { PaymentStatus } from '../types';
import './creator-dashboard-mobile.css';

const TAKEN = ['accepted', 'contract_pending', 'active', 'completed'];
const FRESH = ['new', 'in_negotiation'];

function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPageMobile() {
  const navigate = useNavigate();
  const { profile, invitations, payments, deliverables, ensureDeliverables } = useCreator();
  const today = new Date();
  const first = profile.displayName.split(' ')[0];

  const fresh = useMemo(
    () => invitations.filter(i => FRESH.includes(i.status)).sort((a, b) => b.matchPct - a.matchPct),
    [invitations],
  );
  const featured = fresh[0];
  const more = fresh.slice(1, 4);
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

  const next = [...running]
    .map(i => ({ inv: i, days: daysUntil(i.brief.endDate) }))
    .sort((a, b) => a.days - b.days)[0];

  const openWork = running.flatMap(i => {
    const open = (deliverables[i.id] ?? []).filter(d => d.status === 'not_started' || d.status === 'changes_requested');
    return open.length ? [{ inv: i, count: open.length }] : [];
  });

  return (
    <div className="cdm">
      <header className="cdm-hello">
        <div>
          <p className="cdm-hello__date">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
          <h1>{greetingFor(today)}, <span>{first}</span></h1>
        </div>
        <button type="button" className="cdm-score" onClick={() => navigate('/creator/reputation')} aria-label={`Reliability ${profile.reliability} out of 100`}>
          <strong>{profile.reliability}</strong>
          <span>score</span>
        </button>
      </header>

      {featured ? (
        <article className="cdm-cover">
          <div className="cdm-cover__media">
            {featured.image && <img src={featured.image} alt="" />}
          </div>
          <div className="cdm-cover__body">
            <p className="cdm-cover__float">
              <span className="cdm-pill">New invite</span>
              <span className="cdm-fit">{featured.matchPct}% fit</span>
            </p>
            <p className="cdm-cover__brand">
              {featured.brand}
              {featured.brandVerified && <BadgeCheck size={14} />}
              <span>· {featured.category}</span>
            </p>
            <h2>{featured.brief.title}</h2>
            {featured.whySelected[0] && <p className="cdm-cover__why">{featured.whySelected[0]}</p>}
            <div className="cdm-cover__pay">
              <div>
                <b>{inr(featured.proposedRate)}</b>
                <span>Your payout</span>
              </div>
              <span className="cdm-cover__meta">{featured.deliverables.length} deliverables</span>
            </div>
            <button type="button" className="cdm-cta" onClick={() => navigate(`/creator/invitations/${featured.id}`)}>
              Review invitation <ArrowRight size={16} />
            </button>
            <p className="cdm-fine">Nothing is confirmed until you accept.</p>
          </div>
        </article>
      ) : (
        <section className="cdm-empty">
          <h2>No invitation yet</h2>
          <p>When a brand chooses you, it lands here first. This is not a public job board.</p>
        </section>
      )}

      <section className="cdm-rail" aria-label="Snapshot">
        <button type="button" onClick={() => navigate('/creator/invitations')}>
          <b>{fresh.length}</b>
          <span>Invites</span>
        </button>
        <button type="button" onClick={() => navigate('/creator/campaigns')}>
          <b>{running.length}</b>
          <span>Active</span>
        </button>
        <button type="button" onClick={() => navigate('/creator/earnings')}>
          <b>{compact(paid) === '0' ? '₹0' : `₹${compact(paid)}`}</b>
          <span>Paid</span>
        </button>
        <button type="button" onClick={() => navigate('/creator/earnings')}>
          <b>{compact(expected) === '0' ? '₹0' : `₹${compact(expected)}`}</b>
          <span>Expected</span>
        </button>
      </section>

      {more.length > 0 && (
        <section className="cdm-block">
          <div className="cdm-block__head">
            <h2>Also for you</h2>
            <button type="button" className="cdm-link" onClick={() => navigate('/creator/invitations')}>
              All <ChevronRight size={14} />
            </button>
          </div>
          <ul className="cdm-scroll">
            {more.map(inv => (
              <li key={inv.id}>
                <button type="button" className="cdm-mini" onClick={() => navigate(`/creator/invitations/${inv.id}`)}>
                  {inv.image && <img src={inv.image} alt="" />}
                  <span className="cdm-mini__body">
                    <strong>{inv.brief.title}</strong>
                    <small>{inv.brand} · {inv.matchPct}% fit</small>
                    <b>{inr(inv.proposedRate)}</b>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="cdm-money">
        <div className="cdm-money__top">
          <div>
            <p>Received</p>
            <strong>{inr(paid)}</strong>
          </div>
          <button type="button" className="cdm-link" onClick={() => navigate('/creator/earnings')}>
            Earnings <ChevronRight size={14} />
          </button>
        </div>
        <ul>
          <li><span>Pending</span><b>{inr(pending)}</b></li>
          <li><span>Processing</span><b>{inr(processing)}</b></li>
          <li className="is-expected"><span>Expected</span><b>{inr(expected)}</b></li>
        </ul>
        <p className="cdm-fine">Expected is not earned until it is paid.</p>
      </section>

      {openWork[0] && (
        <button type="button" className="cdm-nudge" onClick={() => navigate(`/creator/campaigns/${openWork[0].inv.id}`)}>
          <span>
            <strong>Submit {openWork[0].count} piece{openWork[0].count > 1 ? 's' : ''} for {openWork[0].inv.brand}</strong>
            <small>{openWork[0].inv.brief.title}</small>
          </span>
          <ChevronRight size={18} />
        </button>
      )}

      <section className="cdm-block cdm-quiet">
        <div className="cdm-block__head">
          <h2>{next ? 'Next deadline' : 'Deadlines'}</h2>
        </div>
        {next ? (
          <button type="button" className="cdm-due" onClick={() => navigate(`/creator/campaigns/${next.inv.id}`)}>
            <strong>{next.inv.brief.title}</strong>
            <span>{dueLabel(next.inv.brief.endDate)}</span>
          </button>
        ) : (
          <p className="cdm-quiet__line">No deadlines until a campaign is active.</p>
        )}
      </section>

      <button type="button" className="cdm-perf" onClick={() => navigate('/creator/growth')}>
        <span><b>{compact(profile.followers)}</b><small>Followers</small></span>
        <span><b>{profile.engagement}%</b><small>Engagement</small></span>
        <span><b>{compact(profile.avgViews)}</b><small>Avg views</small></span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
