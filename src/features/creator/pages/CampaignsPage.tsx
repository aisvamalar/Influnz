import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ChevronRight, Clock, Clapperboard, Search, X } from 'lucide-react';
import { useResponsive } from '../../../hooks/useResponsive';
import { nextDue } from '../campaignParts';
import { dateRange, dueLabel, inr, shortDate } from '../format';
import type { Deliverable, Invitation } from '../types';
import CampaignsPageMobile from './CampaignsPageMobile';
import { CAMPAIGN_STATUS, CAMPAIGN_TABS, progressOf, useCampaignBoard } from './campaignListBits';
import './creator-campaigns.css';

export default function CampaignsPage() {
  const { isMobile } = useResponsive();
  return isMobile ? <CampaignsPageMobile /> : <CampaignsWeb />;
}

function CampaignsWeb() {
  const navigate = useNavigate();
  const board = useCampaignBoard();
  const { campaigns, filter, setFilter, query, setQuery, counts, shown, upNext, deliverables, stats } = board;

  return (
    <div className="cgn">
      <header className="cgn-head">
        <div>
          <p className="cgn-kicker">Your work</p>
          <h1>Campaigns</h1>
          <p>Work you have already taken on. Open one to deliver, revise, and track what is coming to you.</p>
        </div>
      </header>

      <div className="cgn-stats">
        <span><b>{stats.live}</b><small>In progress</small></span>
        <span><b>{stats.pieces ? `${stats.delivered}/${stats.pieces}` : '0'}</b><small>Pieces approved</small></span>
        <span><b>{inr(stats.upcoming)}</b><small>Coming to you</small></span>
      </div>

      {upNext && (
        <button type="button" className="cgn-next" onClick={() => navigate(`/creator/campaigns/${upNext.inv.id}`)}>
          <span className="cgn-next__mark" aria-hidden><Clapperboard size={18} /></span>
          <span className="cgn-next__copy">
            <small>Up next</small>
            <strong>{upNext.item.label}</strong>
            <em>{upNext.inv.brief.title} · {upNext.item.format}</em>
          </span>
          <span className="cgn-next__due"><Clock size={14} /> {dueLabel(upNext.item.dueDate)}</span>
          <span className="cgn-next__go">Open <ChevronRight size={16} /></span>
        </button>
      )}

      <div className="cgn-tools">
        <div className="cgn-filters" role="tablist" aria-label="Filter campaigns">
          {CAMPAIGN_TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={filter === tab.key}
              className={`cgn-chip${filter === tab.key ? ' is-on' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              <b>{counts[tab.key]}</b>
            </button>
          ))}
        </div>
        <label className="cgn-search">
          <Search size={15} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search your campaigns" aria-label="Search campaigns" />
          {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={14} /></button>}
        </label>
      </div>

      {shown.length === 0 ? (
        <EmptyBoard hasAny={campaigns.length > 0} onBrowse={() => navigate('/creator/invitations')} onClear={() => { setQuery(''); setFilter('all'); }} />
      ) : (
        <div className="cgn-grid">
          {shown.map(inv => (
            <WorkTile
              key={inv.id}
              inv={inv}
              items={deliverables[inv.id]}
              onOpen={() => navigate(`/creator/campaigns/${inv.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkTile({ inv, items, onOpen }: { inv: Invitation; items?: Deliverable[]; onOpen: () => void }) {
  const status = CAMPAIGN_STATUS[inv.status];
  const { done, total } = progressOf(inv, items);
  const due = nextDue(inv, items);
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <button type="button" className="cgn-work" onClick={onOpen}>
      <span className="cgn-work__media">
        {inv.image ? <img src={inv.image} alt="" /> : <span>{inv.brand.slice(0, 1)}</span>}
        {status && <span className={`cgn-flag cgn-flag--${status.tone}`}>{status.label}</span>}
      </span>
      <span className="cgn-work__body">
        <span className="cgn-work__brand">
          {inv.brand}
          {inv.brandVerified && <BadgeCheck size={14} aria-label="Verified brand" />}
        </span>
        <strong>{inv.brief.title}</strong>
        <span className="cgn-work__sum">{inv.brief.summary}</span>
        <span className="cgn-work__facts">
          <em>{inv.deliverables.join(' · ')}</em>
          <em>{dateRange(inv.brief.startDate, inv.brief.endDate)}</em>
        </span>
        {items?.some(item => item.revisionNote) && <span className="cgn-rev">Revision requested</span>}
        <span className="cgn-progress" aria-label={`${done} of ${total} pieces approved`}>
          <span><em>Delivered</em><b>{done}/{total}</b></span>
          <i><b style={{ width: `${pct}%` }} /></i>
        </span>
        <span className="cgn-work__pay">
          <span>
            <b>{inr(inv.agreedRate ?? inv.proposedRate)}</b>
            <em>{inv.status === 'completed' ? 'Processing' : 'Expected'}{due && inv.status !== 'completed' ? ` · ${dueLabel(due)} · ${shortDate(due)}` : ''}</em>
          </span>
          <ChevronRight size={18} />
        </span>
      </span>
    </button>
  );
}

function EmptyBoard({ hasAny, onBrowse, onClear }: { hasAny: boolean; onBrowse: () => void; onClear: () => void }) {
  return (
    <section className="cgn-empty">
      <span className="cgn-empty__mark" aria-hidden><Clapperboard size={22} /></span>
      <h2>{hasAny ? 'Nothing matches' : 'No campaigns yet'}</h2>
      <p>{hasAny ? 'Try another filter or clear the search.' : 'Accept an invitation to start your first campaign. Nothing here is confirmed until you do.'}</p>
      {hasAny
        ? <button type="button" className="cgn-go cgn-go--quiet" onClick={onClear}>Clear filters</button>
        : <button type="button" className="cgn-go" onClick={onBrowse}>See invitations</button>}
    </section>
  );
}
