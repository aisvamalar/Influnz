import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck, Calendar, ChevronDown, ChevronLeft, ChevronRight, Crown, Heart,
  Info, Layers, Mail, MapPin, RefreshCw, Search, Shield, X,
} from 'lucide-react';
import PlatformMark from '../../../components/mobile/PlatformMark';
import { useResponsive } from '../../../hooks/useResponsive';
import { dateRange, inr } from '../format';
import type { Invitation } from '../types';
import InvitationsPageMobile from './InvitationsPageMobile';
import {
  FILTERS, SORTS, STATUS,
  FitRing, pieceBlurb, pieceCount, platformId, rateOf, usageSplit, useInvitationList,
} from './invitationBits';
import './creator-invitations.css';

export default function InvitationsPage() {
  const { isMobile } = useResponsive();
  return isMobile ? <InvitationsPageMobile /> : <InvitationsWeb />;
}

function InvitationsWeb() {
  const navigate = useNavigate();
  const rail = useRef<HTMLUListElement>(null);
  const { invitations, filter, setFilter, query, setQuery, sort, setSort, counts, shown } = useInvitationList();
  const rest = shown.slice(1);
  const nudge = (dir: number) => rail.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });

  return (
    <div className="iv">
      <header className="iv-head">
        <div>
          <p className="iv-kicker">Private</p>
          <h1>Invitations</h1>
          <p>A brand chose you. Nothing is confirmed until you accept.</p>
        </div>
        {counts.new > 0 && (
          <button type="button" className="iv-crown" onClick={() => setFilter('new')}>
            <span className="iv-crown__mark" aria-hidden><Crown size={16} /></span>
            <span>
              <strong>{counts.new} new invitation{counts.new === 1 ? '' : 's'}</strong>
              <small>from brands you'll love</small>
            </span>
            <ChevronRight size={16} />
          </button>
        )}
      </header>

      <div className="iv-tools">
        <div className="iv-filters" role="tablist" aria-label="Filter invitations">
          {FILTERS.map(tab => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={filter === tab.key}
              className={`iv-chip${filter === tab.key ? ' is-on' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              <span className="iv-count">{counts[tab.key]}</span>
            </button>
          ))}
        </div>
        <div className="iv-tools__end">
          <label className="iv-search">
            <Search size={15} />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search brand or campaign..."
              aria-label="Search invitations"
            />
            {query && (
              <button type="button" className="iv-clear" aria-label="Clear search" onClick={() => setQuery('')}>
                <X size={14} />
              </button>
            )}
          </label>
          <label className="iv-sort">
            <select value={sort} onChange={event => setSort(event.target.value as typeof sort)} aria-label="Sort invitations">
              {SORTS.map(option => <option key={option.key} value={option.key}>{option.label}</option>)}
            </select>
            <ChevronDown size={14} />
          </label>
        </div>
      </div>

      {shown.length === 0 ? (
        <section className="iv-empty">
          <span className="iv-empty__icon" aria-hidden><Mail size={22} /></span>
          <h2>{invitations.length === 0 ? 'No invitations yet' : 'Nothing in this view'}</h2>
          <p>
            {invitations.length === 0
              ? 'When a brand sends you a private invitation, it shows up here. This is not a public job board.'
              : 'Try another filter, or clear the search.'}
          </p>
          {(query || filter !== 'all') && (
            <button type="button" className="iv-text" onClick={() => { setQuery(''); setFilter('all'); }}>Show all</button>
          )}
        </section>
      ) : (
        <>
          <Spotlight inv={shown[0]!} onOpen={() => navigate(`/creator/invitations/${shown[0]!.id}`)} />
          {rest.length > 0 && (
            <section className="iv-more">
              <div className="iv-section">
                <h2>More for you</h2>
                <div className="iv-section__nav">
                  <button type="button" className="iv-viewall" onClick={() => { setQuery(''); setFilter('all'); }}>View all</button>
                  <button type="button" className="iv-arrow" aria-label="Previous invitations" onClick={() => nudge(-1)}><ChevronLeft size={16} /></button>
                  <button type="button" className="iv-arrow" aria-label="Next invitations" onClick={() => nudge(1)}><ChevronRight size={16} /></button>
                </div>
              </div>
              <ul className="iv-rail" ref={rail}>
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

function Spotlight({ inv, onOpen }: { inv: Invitation; onOpen: () => void }) {
  const status = STATUS[inv.status];
  const platform = inv.brief.platforms[0] ?? '';
  const mark = platformId(platform);
  const pieces = pieceCount(inv);
  const usage = usageSplit(inv.usageRights);
  const food = /food|cafe|café|beverage/i.test(`${inv.category} ${inv.brief.title}`);
  return (
    <button type="button" className="iv-spot" onClick={onOpen}>
      <span className="iv-spot__copy">
        <span className="iv-spot__brand">
          {inv.brand}
          {inv.brandVerified && <BadgeCheck size={15} aria-label="Verified brand" />}
          <span className={`iv-badge iv-badge--${status.tone}`}>{status.label}</span>
        </span>
        <strong>{inv.brief.title}</strong>
        <span className="iv-spot__sum">{inv.brief.summary}</span>
        <span className="iv-pills">
          <span>{mark && <PlatformMark id={mark} size={14} />} {platform || 'Any platform'}</span>
          <span><Calendar size={13} /> {dateRange(inv.brief.startDate, inv.brief.endDate)}</span>
          <span><MapPin size={13} /> {inv.location}</span>
          <span className="iv-cat">{inv.category}</span>
        </span>
        <span className="iv-stats">
          <span><Layers size={16} /><b>{pieces}</b><small>Deliverables</small><em>{pieceBlurb(inv)}</em></span>
          <span><Calendar size={16} /><b>{usage.value}</b><small>Usage rights</small><em>{usage.note}</em></span>
          <span><Shield size={16} /><b>{inv.exclusivityDays} days</b><small>Exclusivity</small><em>From first publish</em></span>
          <span><RefreshCw size={16} /><b>{inv.revisions}</b><small>Revisions</small><em>Included</em></span>
        </span>
        <span className="iv-spot__pay">
          <span>
            <b>{inr(rateOf(inv))}</b>
            <small>Your payout · {pieces} piece{pieces === 1 ? '' : 's'}</small>
          </span>
          <span className="iv-spot__cta">Open invitation <ChevronRight size={16} /></span>
        </span>
      </span>
      <span className="iv-spot__art">
        {inv.image ? <img src={inv.image} alt="" /> : <span className="iv-spot__letter">{inv.brand.slice(0, 1)}</span>}
        {food && (
          <span className="iv-quote">Good<br />Food<br />Great<br />Stories</span>
        )}
        <span className="iv-score">
          <b>{inv.matchPct}</b>
          <span>The score <Info size={12} /></span>
        </span>
      </span>
    </button>
  );
}

function MiniCard({ inv, onOpen }: { inv: Invitation; onOpen: () => void }) {
  const status = STATUS[inv.status];
  const quiet = inv.status === 'declined' || inv.status === 'expired';
  return (
    <button type="button" className={`iv-mini${quiet ? ' is-quiet' : ''}`} onClick={onOpen}>
      <span className="iv-mini__media">
        {inv.image ? <img src={inv.image} alt="" /> : <span>{inv.brand.slice(0, 1)}</span>}
        <span className={`iv-badge iv-badge--${status.tone}`}>{status.label}</span>
        <span className="iv-heart" aria-hidden><Heart size={14} /></span>
      </span>
      <span className="iv-mini__body">
        <strong>{inv.brief.title}</strong>
        <small>{inv.brand}</small>
        <span className="iv-mini__meta">
          <em>{inv.category}</em>
          <em><MapPin size={12} /> {inv.location}</em>
        </span>
        <span className="iv-mini__pay">
          <span>
            <b>{inr(rateOf(inv))}</b>
            <small>{pieceCount(inv)} piece{pieceCount(inv) === 1 ? '' : 's'}</small>
          </span>
          <FitRing value={inv.matchPct} size={46} />
        </span>
      </span>
    </button>
  );
}
