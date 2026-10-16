import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Briefcase, CalendarClock, CircleCheck, Clapperboard, Mail, Sparkles, TrendingUp, Wallet,
} from 'lucide-react';
import { useCreator } from '../CreatorContext';
import { Button, EmptyState, ProgressBar, StatCard } from '../ui';
import { Panel, Pill, SeeAll } from '../campaignParts';
import { compact, dueLabel, daysUntil, inr, shortDate } from '../format';
import type { Deliverable, Invitation } from '../types';
import '../campaign-ui.css';

const TAKEN = ['accepted', 'contract_pending', 'active'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profile, invitations, payments, deliverables, ensureDeliverables } = useCreator();

  const fresh = invitations.filter(i => i.status === 'new');
  const negotiating = invitations.filter(i => i.status === 'in_negotiation');
  const running = invitations.filter(i => TAKEN.includes(i.status));
  useEffect(() => { running.forEach(ensureDeliverables); }, [running, ensureDeliverables]);

  const paid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => ['pending', 'processing', 'upcoming'].includes(p.status)).reduce((s, p) => s + p.amount, 0);

  // Every piece of content still owed, across all running campaigns, soonest first.
  const deadlines = useMemo(() => {
    const rows: Array<{ inv: Invitation; item: Deliverable }> = [];
    running.forEach(inv => (deliverables[inv.id] ?? []).filter(d => d.status !== 'approved').forEach(item => rows.push({ inv, item })));
    return rows.sort((a, b) => a.item.dueDate.localeCompare(b.item.dueDate));
  }, [running, deliverables]);

  const nextDeadline = deadlines[0]?.item.dueDate;
  const topMatches = [...fresh].sort((a, b) => b.matchPct - a.matchPct).slice(0, 3);

  const actions = [
    ...fresh.slice(0, 1).map(i => ({ text: `Review the ${i.brief.title} invitation from ${i.brand}`, to: `/creator/invitations/${i.id}` })),
    ...running.filter(i => i.status !== 'active').slice(0, 1).map(i => ({ text: `Sign your contract for ${i.brief.title}`, to: `/creator/deal/${i.id}` })),
    ...deadlines.slice(0, 1).map(d => ({ text: `Submit ${d.item.label}. ${dueLabel(d.item.dueDate)}`, to: `/creator/campaigns/${d.inv.id}` })),
    ...negotiating.slice(0, 1).map(i => ({ text: `AI negotiation needs review for ${i.brief.title}`, to: `/creator/negotiation/${i.id}` })),
  ];

  return (
    <div className="cx">
      <div className="cx-row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="cr-page-title">Welcome, {profile.displayName}</h1>
          <p className="cr-page-sub">Campaigns brands have published for you, and what you owe each of them.</p>
        </div>
        <span className="cr-chip cr-chip--static" style={{ background: 'rgba(242,132,107,0.1)', borderColor: 'var(--in-coral)', color: 'var(--in-coral-text)' }}>
          <TrendingUp size={15} /> Rising Creator · {profile.reliability}/100
        </span>
      </div>

      <div className="cr-grid cr-grid--4 cx-kpis">
        <StatCard icon={Mail} value={fresh.length} label="New invitations" />
        <StatCard icon={Briefcase} value={running.length} label="Campaigns in progress" />
        <StatCard icon={CalendarClock} value={nextDeadline ? (daysUntil(nextDeadline) <= 0 ? 'Today' : `${daysUntil(nextDeadline)}d`) : '—'} label={nextDeadline ? `Next deadline · ${shortDate(nextDeadline)}` : 'Next deadline'} />
        <StatCard icon={Wallet} value={`₹${compact(paid + pending)}`} label="Earned and coming" />
      </div>

      <div className="cx-cols">
        <div className="cx-stack">
          <Panel
            icon={<Mail size={18} />} title="New for you"
            sub={fresh.length ? `${fresh.length} campaign${fresh.length === 1 ? '' : 's'} published and matched to you` : 'Matched to your topics, audience and rates'}
            tail={fresh.length > 0 ? <SeeAll onClick={() => navigate('/creator/invitations')}>All invitations</SeeAll> : undefined}
          >
            {topMatches.length === 0 ? (
              <EmptyState icon={Mail} title="No new campaigns right now" text="When a brand publishes a campaign that fits you, it shows up here with your payout." />
            ) : (
              <div>
                {topMatches.map(i => (
                  <button key={i.id} type="button" className="cx-mini" onClick={() => navigate(`/creator/invitations/${i.id}`)}>
                    {i.image ? <img src={i.image} alt="" /> : <span />}
                    <span style={{ minWidth: 0 }}>
                      <span className="cx-mini__t" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {i.brief.title}{i.brandVerified && <BadgeCheck size={14} style={{ color: 'var(--cr-coral-ink)' }} />}
                      </span>
                      <span className="cx-mini__s" style={{ display: 'block' }}>
                        {i.brand} · {i.brief.deliverableSpecs.length} deliverable{i.brief.deliverableSpecs.length === 1 ? '' : 's'} · {i.matchPct}% match
                      </span>
                    </span>
                    <span style={{ textAlign: 'right' }}>
                      <span className="cx-amount" style={{ fontSize: '1.0625rem', display: 'block' }}>{inr(i.proposedRate)}</span>
                      <span className="cx-mini__s cx-sm-hide">your payout</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            icon={<Clapperboard size={18} />} title="In progress"
            sub="Campaigns you have taken on"
            tail={running.length > 0 ? <SeeAll onClick={() => navigate('/creator/campaigns')}>All campaigns</SeeAll> : undefined}
          >
            {running.length === 0 ? (
              <EmptyState icon={Briefcase} title="No campaigns in progress" text="Accept an invitation and it moves here with its deliverables and deadlines." />
            ) : (
              <div>
                {running.map(i => {
                  const items = deliverables[i.id] ?? [];
                  const done = items.filter(d => d.status === 'approved').length;
                  return (
                    <button key={i.id} type="button" className="cx-mini" onClick={() => navigate(`/creator/campaigns/${i.id}`)}>
                      {i.image ? <img src={i.image} alt="" /> : <span />}
                      <span style={{ minWidth: 0 }}>
                        <span className="cx-mini__t">{i.brief.title}</span>
                        <span className="cx-mini__s" style={{ display: 'block', marginBottom: 6 }}>{i.brand} · {done}/{items.length} approved</span>
                        <span className="cx-bar" style={{ display: 'block' }}><i style={{ width: `${items.length ? (done / items.length) * 100 : 0}%`, background: '#f0735a' }} /></span>
                      </span>
                      <Pill status={i.status} />
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>

        <div className="cx-stack">
          <Panel icon={<CalendarClock size={18} />} title="Upcoming deadlines" sub="Content you owe, soonest first">
            {deadlines.length === 0 ? (
              <p className="cx-text cx-muted">No deadlines yet. They appear once you take on a campaign.</p>
            ) : (
              <ul className="cx-line">
                {deadlines.slice(0, 5).map(({ inv, item }) => {
                  const late = daysUntil(item.dueDate) < 0;
                  const [day, mon] = shortDate(item.dueDate).split(' ');
                  return (
                    <li key={item.id} onClick={() => navigate(`/creator/campaigns/${inv.id}`)}>
                      <span className={`cx-date${late ? ' is-late' : ''}`}><b>{day}</b><span>{mon}</span></span>
                      <span>
                        <span className="cx-line__t" style={{ display: 'block' }}>{item.label}</span>
                        <span className="cx-line__s">{inv.brief.title} · {dueLabel(item.dueDate)}</span>
                      </span>
                      <ArrowRight size={15} style={{ color: 'var(--cr-faint)' }} />
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel icon={<CircleCheck size={18} />} title="Pending actions">
            {actions.length === 0 ? (
              <p className="cx-text" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cx-green)', fontWeight: 600 }}>
                <CircleCheck size={18} /> You are all caught up
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {actions.map(a => (
                  <button key={a.to + a.text} className="cr-nav-link" style={{ padding: '10px 8px', height: 'auto', textAlign: 'left' }} onClick={() => navigate(a.to)}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--cr-ink)', fontWeight: 600, flex: 1 }}>{a.text}</span>
                    <ArrowRight size={14} style={{ color: 'var(--cr-faint)' }} />
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <Panel icon={<Wallet size={18} />} title="Earnings and payouts">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="cx-muted" style={{ fontSize: '0.875rem' }}>Coming to you</span>
                <b style={{ color: 'var(--cx-amber)' }}>{inr(pending)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="cx-muted" style={{ fontSize: '0.875rem' }}>Paid so far</span>
                <b style={{ color: 'var(--cx-green)' }}>{inr(paid)}</b>
              </div>
            </div>
            <Button variant="ghost" small style={{ width: '100%', marginTop: 14 }} onClick={() => navigate('/creator/earnings')}>
              View earnings <ArrowRight size={15} />
            </Button>
          </Panel>

          <Panel icon={<TrendingUp size={18} />} title="Creator growth">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--cr-ink)' }}>72</span>
              <span className="cx-muted">/100 creator score</span>
            </div>
            <ProgressBar value={72} />
            <p className="cx-muted" style={{ fontSize: '0.8125rem', margin: '10px 0 0', lineHeight: 1.5 }}>
              28 points to <strong style={{ color: 'var(--cr-coral-ink)' }}>Established Creator</strong>. Delivering on time raises it fastest.
            </p>
          </Panel>

          <Panel icon={<Sparkles size={18} />} title="AI assistant" sub={`${fresh.length} new campaign${fresh.length === 1 ? '' : 's'} match your profile`}>
            <Button style={{ width: '100%' }} onClick={() => navigate('/creator/invitations')}>Review matches <Sparkles size={15} /></Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
