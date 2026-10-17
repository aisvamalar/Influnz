/**
 * Creator dashboard — "Creator workspace" (prefix: chd).
 *
 * Desktop follows the workspace design: title and three quick stats, the campaign
 * workflow, live activity down the right, and four insight tiles underneath.
 * Phones get the same content in reading order, with the actions list inline (on
 * desktop it opens from the "Action needed" stat) and the workflow as a timeline.
 * Layout reflows on the content width (container queries on .biz-canvas), so it also
 * adapts when the sidebar is a rail.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, ArrowRight, ChevronRight, CircleAlert, CircleCheckBig, FilePen, FileText, IdCard,
  IndianRupee, Megaphone, MessagesSquare, Play, RotateCcw, Sparkles, TriangleAlert, Upload, Bot,
  type LucideIcon,
} from 'lucide-react';
import { dueLabel } from '../format';
import { Chip, EmptyNote, dueTone, type Tone } from './dashboardBits';
import { useDashboardData, type ActionKind, type ActivityKind, type ActivityItem, type DashboardAction } from './dashboardData';
import { DeadlineTile, EarningsTile, ScoreTile, UpdatesTile } from './dashboardTiles';
import DashboardWorkflow from './DashboardWorkflow';
import './creator-dashboard.css';

const ACTION_LOOK: Record<ActionKind, { icon: LucideIcon; tone: Tone }> = {
  revise: { icon: RotateCcw, tone: 'red' },
  payment: { icon: TriangleAlert, tone: 'red' },
  sign: { icon: FilePen, tone: 'violet' },
  submit: { icon: Upload, tone: 'amber' },
  negotiate: { icon: MessagesSquare, tone: 'blue' },
  passport: { icon: IdCard, tone: 'teal' },
};

const ACTIVITY_LOOK: Record<ActivityKind, { icon: LucideIcon; tone: Tone }> = {
  invite: { icon: Sparkles, tone: 'coral' },
  offer: { icon: MessagesSquare, tone: 'coral' },
  counter: { icon: Bot, tone: 'violet' },
  signed: { icon: FileText, tone: 'amber' },
  live: { icon: Play, tone: 'blue' },
  paid: { icon: IndianRupee, tone: 'pink' },
};

const FEED_SIZE = 6;

export default function DashboardPage() {
  const data = useDashboardData();
  const { profile, open, running, money, actions, activity } = data;
  const first = profile.displayName.trim().split(' ')[0] || 'there';

  return (
    <div className="chd">
      <div className="chd-head">
        <div className="chd-head__intro">
          <h1>
            Creator workspace
            <Sparkles className="chd-head__spark" size={24} strokeWidth={2} aria-hidden="true" />
          </h1>
          <p>Your campaigns, deliverables and AI activity in one place.</p>
          <p className="chd-head__hello">Hi {first}, {data.summary.charAt(0).toLowerCase() + data.summary.slice(1)}</p>
        </div>

        <div className="chd-stats" role="group" aria-label="At a glance">
          <Link to="/creator/campaigns" className="chd-stat">
            <span className="chd-stat__icon tone-green" aria-hidden="true"><Megaphone size={20} strokeWidth={2} /></span>
            <span className="chd-stat__text">
              <strong>{running.length}</strong>
              <small>{running.length === 1 ? 'Active campaign' : 'Active campaigns'}</small>
            </span>
          </Link>
          <ActionStat actions={actions} />
          <a href="#chd-feed" className="chd-stat">
            <span className="chd-stat__icon tone-violet" aria-hidden="true"><Activity size={20} strokeWidth={2} /></span>
            <span className="chd-stat__text">
              <strong>{data.recentCount}</strong>
              <small>Recent updates</small>
            </span>
          </a>
        </div>
      </div>

      <ActionsList actions={actions} />

      <DashboardWorkflow campaigns={running.map(r => r.inv)} invites={open} />

      <ActivityPanel items={activity} />

      <div className="chd-tiles">
        <EarningsTile money={money} months={data.months} />
        <ScoreTile profile={profile} />
        <DeadlineTile next={running.find(r => r.next)} />
        <UpdatesTile activity={activity} />
      </div>

      <Link to="/creator/invitations" className="chd-grow">
        <svg className="chd-grow__waves" viewBox="0 0 340 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M140 0 C 190 40, 230 -10, 270 40 S 330 90, 340 60 L 340 0 Z" fill="#f9b59c" opacity="0.5" />
          <path d="M180 0 C 220 60, 270 10, 300 70 S 335 110, 340 100 L 340 0 Z" fill="#fbc8b5" opacity="0.5" />
        </svg>
        <span className="chd-grow__copy">
          <strong>Create. Collaborate. Grow.</strong>
          <small>AI-matched opportunities for Indian creators.</small>
        </span>
        <span className="chd-grow__go" aria-hidden="true"><ChevronRight size={18} strokeWidth={2.2} /></span>
      </Link>
    </div>
  );
}

/** "Action needed" stat. Opens a popover on desktop; on phones the list is already on the page. */
function ActionStat({ actions }: { actions: DashboardAction[] }) {
  const [openPop, setOpenPop] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openPop) return;
    const onDown = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpenPop(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenPop(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openPop]);

  const onClick = () => {
    const inline = document.getElementById('chd-actions');
    if (inline && inline.offsetParent !== null) {
      inline.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setOpenPop(v => !v);
  };

  return (
    <div className="chd-stat-wrap" ref={wrap}>
      <button
        type="button"
        className={`chd-stat${actions.length ? ' is-alert' : ''}`}
        onClick={onClick}
        aria-expanded={openPop}
        aria-controls="chd-actions-pop"
      >
        <span className="chd-stat__icon chd-stat__icon--solid" aria-hidden="true"><CircleAlert size={21} strokeWidth={2.2} /></span>
        <span className="chd-stat__text">
          <strong>{actions.length}</strong>
          <small>Action needed</small>
        </span>
      </button>
      {openPop && (
        <div className="chd-pop" id="chd-actions-pop" role="group" aria-label="Action needed">
          <p className="chd-pop__title">Action needed</p>
          <ActionRows actions={actions} />
        </div>
      )}
    </div>
  );
}

function ActionRows({ actions }: { actions: DashboardAction[] }) {
  if (actions.length === 0) {
    return <EmptyNote icon={CircleCheckBig} title="You are all caught up">Nothing needs you right now.</EmptyNote>;
  }
  return (
    <ul className="chd-todo__list">
      {actions.map(a => {
        const look = ACTION_LOOK[a.kind];
        return (
          <li key={a.key}>
            <Link to={a.to} className="chd-todo__item">
              <span className={`chd-todo__icon tone-${look.tone}`} aria-hidden="true"><look.icon size={17} /></span>
              <span className="chd-todo__text">
                <strong>{a.title}</strong>
                <small>{a.detail}</small>
              </span>
              {a.due && <Chip tone={dueTone(a.due)}>{dueLabel(a.due)}</Chip>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActionsList({ actions }: { actions: DashboardAction[] }) {
  return (
    <section className="chd-panel chd-todo" id="chd-actions" aria-labelledby="chd-todo-title">
      <div className="chd-panel__head">
        <h2 id="chd-todo-title">Action needed{actions.length > 0 && <span className="chd-count">{actions.length}</span>}</h2>
      </div>
      <ActionRows actions={actions.slice(0, 4)} />
      {actions.length > 4 && (
        <Link to="/creator/campaigns" className="chd-link chd-todo__more">
          {actions.length - 4} more in campaigns <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}

function ActivityPanel({ items }: { items: ActivityItem[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? items : items.slice(0, FEED_SIZE);
  return (
    <section className="chd-panel chd-feed" id="chd-feed" aria-labelledby="chd-feed-title">
      <div className="chd-panel__head">
        <h2 id="chd-feed-title">Live activity</h2>
        {items.length > FEED_SIZE && (
          <button type="button" className="chd-link" onClick={() => setAll(v => !v)} aria-expanded={all}>
            {all ? 'Show less' : 'All activity'} <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </button>
        )}
      </div>
      {shown.length === 0 ? (
        <EmptyNote icon={Activity} title="No activity yet">Invitations, offers and payments will show up here.</EmptyNote>
      ) : (
        <ol className="chd-feed__list">
          {shown.map(a => {
            const look = ACTIVITY_LOOK[a.kind];
            return (
              <li key={a.key} className={`tone-${look.tone}`}>
                <Link to={a.to} className="chd-feed__item">
                  <span className="chd-feed__icon" aria-hidden="true"><look.icon size={18} strokeWidth={2} /></span>
                  <span className="chd-feed__text">
                    <small>{a.when}</small>
                    <strong>{a.title}</strong>
                    <span>{a.detail}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
