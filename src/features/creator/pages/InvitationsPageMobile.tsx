import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck, Calendar, ChevronRight, Crown, Heart, Layers, Mail, MapPin,
  RefreshCw, Search, Shield, SlidersHorizontal, X,
} from 'lucide-react';
import PlatformMark from '../../../components/mobile/PlatformMark';
import { dateRange, inr } from '../format';
import type { Invitation } from '../types';
import {
  FILTERS, SORTS, STATUS,
  FitRing, pieceBlurb, pieceCount, platformId, rateOf, usageSplit, useInvitationList,
} from './invitationBits';
import './creator-invitations.css';
import './creator-invitations-mobile.css';

export default function InvitationsPageMobile() {
  const navigate = useNavigate();
  const { invitations, filter, setFilter, query, setQuery, sort, setSort, counts, shown } = useInvitationList();
  const rest = shown.slice(1);
  const sortLabel = SORTS.find(item => item.key === sort)?.label ?? 'Sort';
  const cycleSort = () => {
    const index = SORTS.findIndex(item => item.key === sort);
    setSort(SORTS[(index + 1) % SORTS.length].key);
  };

  return (
    <div className="ivm">
      <header className="ivm-head">
        <p className="ivm-kicker">Private</p>
        <div className="ivm-titleline">
          <h1>Invitations</h1>
          {counts.new > 0 && (
            <button type="button" className="ivm-crown" onClick={() => setFilter('new')}>
              <Crown size={13} />
              {counts.new} new
              <ChevronRight size={14} />
            </button>
          )}
        </div>
        <p>A brand chose you. Nothing is confirmed until you accept.</p>
      </header>

      <div className="ivm-filters" role="tablist" aria-label="Filter invitations">
        {FILTERS.map(tab => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={filter === tab.key}
            className={`ivm-chip${filter === tab.key ? ' is-on' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span>{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      <div className="ivm-tools">
        <label className="ivm-search">
          <Search size={16} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search brand or campaign..."
            aria-label="Search invitations"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery('')}>
              <X size={14} />
            </button>
          )}
        </label>
        <button type="button" className="ivm-sortbtn" aria-label={`Sort: ${sortLabel}`} onClick={cycleSort}>
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {shown.length === 0 ? (
        <section className="ivm-empty">
          <span aria-hidden><Mail size={22} /></span>
          <h2>{invitations.length === 0 ? 'No invitations yet' : 'Nothing in this view'}</h2>
          <p>
            {invitations.length === 0
              ? 'When a brand chooses you, the invitation lands here. This is not a public job board.'
              : 'Try another filter, or clear the search.'}
          </p>
          {(query || filter !== 'all') && (
            <button type="button" className="ivm-text" onClick={() => { setQuery(''); setFilter('all'); }}>Show all</button>
          )}
        </section>
      ) : (
        <>
          <LeadCard inv={shown[0]!} onOpen={() => navigate(`/creator/invitations/${shown[0]!.id}`)} />
          {rest.length > 0 && (
            <section className="ivm-more">
              <div className="ivm-more__head">
                <h2>More for you</h2>
                <button type="button" onClick={() => { setQuery(''); setFilter('all'); }}>View all</button>
              </div>
              <ul className="ivm-rail">
                {rest.map(inv => (
                  <li key={inv.id}>
                    <MiniCard inv={inv} onOpen={() => navigate(`/creator/invitations/${inv.id}`)} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function LeadCard({ inv, onOpen }: { inv: Invitation; onOpen: () => void }) {
  const status = STATUS[inv.status];
  const platform = inv.brief.platforms[0] ?? '';
  const mark = platformId(platform);
  const pieces = pieceCount(inv);
  const usage = usageSplit(inv.usageRights);
  const food = /food|cafe|café|beverage/i.test(`${inv.category} ${inv.brief.title}`);
  return (
    <button type="button" className="ivm-lead" onClick={onOpen}>
      <span className="ivm-lead__media">
        {inv.image ? <img src={inv.image} alt="" /> : <span className="ivm-fallback">{inv.brand.slice(0, 1)}</span>}
        <span className={`ivm-flag ivm-flag--${status.tone}`}>{status.label}</span>
        <span className="ivm-heart" aria-hidden><Heart size={15} /></span>
        {food && <span className="ivm-quote">Good food, great stories</span>}
        <span className="ivm-score">
          <b>{inv.matchPct}</b>
          <small>Fit score</small>
        </span>
      </span>
      <span className="ivm-sheet">
        <span className="ivm-brand">
          {inv.brand}
          {inv.brandVerified && <BadgeCheck size={14} aria-label="Verified brand" />}
          <span>· {inv.category}</span>
        </span>
        <strong>{inv.brief.title}</strong>
        <span className="ivm-sum">{inv.brief.summary}</span>
        <span className="ivm-pills">
          <span>{mark && <PlatformMark id={mark} size={13} />} {platform || 'Any platform'}</span>
          <span><Calendar size={12} /> {dateRange(inv.brief.startDate, inv.brief.endDate)}</span>
          <span><MapPin size={12} /> {inv.location}</span>
        </span>
        <span className="ivm-stats">
          <span><Layers size={14} /><b>{pieces}</b><small>Deliverables</small><em>{pieceBlurb(inv)}</em></span>
          <span><Calendar size={14} /><b>{usage.value}</b><small>Usage rights</small><em>{usage.note}</em></span>
          <span><Shield size={14} /><b>{inv.exclusivityDays}d</b><small>Exclusivity</small><em>From publish</em></span>
          <span><RefreshCw size={14} /><b>{inv.revisions}</b><small>Revisions</small><em>Included</em></span>
        </span>
        <span className="ivm-payrow">
          <span>
            <b>{inr(rateOf(inv))}</b>
            <small>Your payout · {pieces} piece{pieces === 1 ? '' : 's'}</small>
          </span>
          <span className="ivm-cta">Open invitation <ChevronRight size={16} /></span>
        </span>
      </span>
    </button>
  );
}

function MiniCard({ inv, onOpen }: { inv: Invitation; onOpen: () => void }) {
  const status = STATUS[inv.status];
  return (
    <button type="button" className="ivm-mini" onClick={onOpen}>
      <span className="ivm-mini__media">
        {inv.image ? <img src={inv.image} alt="" /> : <span className="ivm-fallback">{inv.brand.slice(0, 1)}</span>}
        <span className={`ivm-flag ivm-flag--${status.tone}`}>{status.label}</span>
        <span className="ivm-heart" aria-hidden><Heart size={13} /></span>
      </span>
      <span className="ivm-mini__body">
        <strong>{inv.brief.title}</strong>
        <small>{inv.brand}</small>
        <span className="ivm-mini__meta">{inv.category}</span>
        <span className="ivm-mini__pay">
          <span>
            <b>{inr(rateOf(inv))}</b>
            <em>{pieceCount(inv)} pieces</em>
          </span>
          <FitRing value={inv.matchPct} size={46} />
        </span>
      </span>
    </button>
  );
}
