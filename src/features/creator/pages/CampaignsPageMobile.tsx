import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ChevronRight, Clock, Clapperboard, Search, X } from 'lucide-react';
import { nextDue } from '../campaignParts';
import { dateRange, dueLabel, inr, shortDate } from '../format';
import type { Deliverable, Invitation } from '../types';
import { CAMPAIGN_STATUS, CAMPAIGN_TABS, progressOf, useCampaignBoard } from './campaignListBits';
import './creator-campaigns.css';
import './creator-campaigns-mobile.css';

export default function CampaignsPageMobile() {
  const navigate = useNavigate();
  const { campaigns, filter, setFilter, query, setQuery, counts, shown, upNext, deliverables, stats } = useCampaignBoard();

  return (
    <div className="cgm">
      <header className="cgm-head">
        <p className="cgm-kicker">Your work</p>
        <h1>Campaigns</h1>
        <p>Work you have taken on. Open one to deliver and track pay.</p>
      </header>

      <div className="cgm-stats">
        <span><b>{stats.live}</b><small>Live</small></span>
        <span><b>{stats.pieces ? `${stats.delivered}/${stats.pieces}` : '0'}</b><small>Approved</small></span>
        <span><b>{inr(stats.upcoming)}</b><small>Coming</small></span>
      </div>

      {upNext && (
        <button type="button" className="cgm-next" onClick={() => navigate(`/creator/campaigns/${upNext.inv.id}`)}>
          {upNext.inv.image && <img src={upNext.inv.image} alt="" />}
          <span className="cgm-next__copy">
            <small>Up next</small>
            <strong>{upNext.item.label}</strong>
            <em>{upNext.inv.brief.title}</em>
          </span>
          <span className="cgm-next__due"><Clock size={14} /> {dueLabel(upNext.item.dueDate)}</span>
        </button>
      )}

      <div className="cgm-filters" role="tablist" aria-label="Filter campaigns">
        {CAMPAIGN_TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={filter === tab.key}
            className={`cgm-chip${filter === tab.key ? ' is-on' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.short}
            <b>{counts[tab.key]}</b>
          </button>
        ))}
      </div>

      <label className="cgm-search">
        <Search size={16} />
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search your campaigns" aria-label="Search campaigns" />
        {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={14} /></button>}
      </label>

      {shown.length === 0 ? (
        <section className="cgm-empty">
          <span aria-hidden><Clapperboard size={22} /></span>
          <h2>{campaigns.length === 0 ? 'No campaigns yet' : 'Nothing matches'}</h2>
          <p>{campaigns.length === 0 ? 'Accept an invitation to start your first campaign.' : 'Try another filter or clear the search.'}</p>
          {campaigns.length === 0
            ? <button type="button" className="cgm-go" onClick={() => navigate('/creator/invitations')}>See invitations</button>
            : <button type="button" className="cgm-go cgm-go--quiet" onClick={() => { setQuery(''); setFilter('all'); }}>Clear filters</button>}
        </section>
      ) : (
        <div className="cgm-list">
          {shown.map(inv => (
            <WorkTile key={inv.id} inv={inv} items={deliverables[inv.id]} onOpen={() => navigate(`/creator/campaigns/${inv.id}`)} />
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
    <button type="button" className="cgm-work" onClick={onOpen}>
      <span className="cgm-work__media">
        {inv.image ? <img src={inv.image} alt="" /> : <span>{inv.brand.slice(0, 1)}</span>}
        {status && <span className={`cgm-flag cgm-flag--${status.tone}`}>{status.label}</span>}
      </span>
      <span className="cgm-work__body">
        <span className="cgm-work__brand">
          {inv.brand}
          {inv.brandVerified && <BadgeCheck size={13} aria-label="Verified brand" />}
        </span>
        <strong>{inv.brief.title}</strong>
        <span className="cgm-work__sum">{inv.brief.summary}</span>
        <span className="cgm-work__facts">
          <em>{inv.deliverables.join(' · ')}</em>
          <em>{dateRange(inv.brief.startDate, inv.brief.endDate)}</em>
        </span>
        {items?.some(item => item.revisionNote) && <span className="cgm-rev">Revision requested</span>}
        <span className="cgm-progress">
          <span><em>Delivered</em><b>{done}/{total}</b></span>
          <i><b style={{ width: `${pct}%` }} /></i>
        </span>
        <span className="cgm-work__pay">
          <b>{inr(inv.agreedRate ?? inv.proposedRate)}</b>
          <em>{inv.status === 'completed' ? 'Processing' : 'Expected'}{due && inv.status !== 'completed' ? ` · ${dueLabel(due)} · ${shortDate(due)}` : ''}</em>
          <ChevronRight size={16} />
        </span>
      </span>
    </button>
  );
}
