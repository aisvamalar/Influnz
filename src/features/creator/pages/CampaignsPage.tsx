/**
 * Campaigns (prefix: cmp). One responsive page for every screen size, two views:
 * - My campaigns: work the creator has accepted, as large cards with payout, delivery
 *   progress, next deadline, a five-stage track and the next action.
 * - Browse campaigns (?view=browse): open campaigns further from the creator, nearest
 *   first, filtered by region. The brand did not invite them, so the creator reaches out
 *   with Express interest, on the card or on the campaign page.
 * Layout reflows on the content width (container queries on .biz-canvas).
 */
import { useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Briefcase, CalendarDays, Clapperboard, CircleCheck, CircleCheckBig, Clock, Compass, FilePen,
  HandHeart, IndianRupee, Layers, Mail, MapPin, Navigation, Search, Sparkles, Tag, Upload, X, type LucideIcon,
} from 'lucide-react';
import PlatformMark from '../../../components/mobile/PlatformMark';
import { nextDue, stagesFor } from '../campaignParts';
import { distanceLabel } from '../geo';
import { dateRange, dueLabel, inr, shortDate } from '../format';
import { Toast } from '../ui';
import type { Deliverable, Invitation } from '../types';
import { dueTone } from './dashboardBits';
import {
  CAMPAIGN_STATUS, CAMPAIGN_TABS, REGION_TABS, progressOf, useCampaignBoard, type BrowseItem,
} from './campaignListBits';
import { pieceCount, platformId, rateOf } from './invitationBits';
import { BrandDot } from './invitationDetailParts';
import './creator-campaigns.css';

export default function CampaignsPage() {
  const board = useCampaignBoard();
  const [params, setParams] = useSearchParams();
  const browsing = params.get('view') === 'browse';
  const setView = (next: 'mine' | 'browse') => {
    const p = new URLSearchParams(params);
    if (next === 'browse') p.set('view', 'browse'); else p.delete('view');
    setParams(p, { replace: true });
    board.setQuery('');
  };

  return (
    <div className="cmp">
      <div className="cmp-head">
        <div>
          <p className="cmp-kicker">Your work</p>
          <h1>Campaigns</h1>
          <p>{browsing
            ? 'Open campaigns beyond your city. Express interest and the brand can invite you.'
            : 'Campaigns you have accepted. Open one to deliver, track progress and see what is coming to you.'}
          </p>
        </div>
      </div>

      <div className="cmp-switch" role="tablist" aria-label="Campaign views">
        <button type="button" role="tab" aria-selected={!browsing} className={!browsing ? 'is-on' : ''} onClick={() => setView('mine')}>
          <Briefcase size={16} aria-hidden="true" /> My campaigns <b>{board.campaigns.length}</b>
        </button>
        <button type="button" role="tab" aria-selected={browsing} className={browsing ? 'is-on' : ''} onClick={() => setView('browse')}>
          <Compass size={16} aria-hidden="true" /> Browse campaigns <b>{board.browseTotal}</b>
        </button>
      </div>

      {browsing ? <BrowseView board={board} /> : <MineView board={board} onBrowse={() => setView('browse')} />}
    </div>
  );
}

type Board = ReturnType<typeof useCampaignBoard>;

// ── My campaigns ─────────────────────────────────────────────────────────

function MineView({ board, onBrowse }: { board: Board; onBrowse: () => void }) {
  const { filter, setFilter, query, setQuery, counts, campaigns, shown, upNext, deliverables, stats } = board;
  return (
    <>
      <div className="cmp-stats" role="group" aria-label="At a glance">
        <Stat icon={Clapperboard} tone="green" value={String(stats.live)} label="In progress" />
        <Stat icon={FilePen} tone="violet" value={String(stats.signing)} label="Awaiting contract" />
        <Stat icon={CircleCheckBig} tone="coral" value={stats.pieces ? `${stats.delivered}/${stats.pieces}` : '0'} label="Pieces approved" />
        <Stat icon={IndianRupee} tone="amber" value={inr(stats.upcoming)} label="Coming to you" />
      </div>

      {upNext && <UpNext inv={upNext.inv} item={upNext.item} />}

      {campaigns.length > 0 && (
        <div className="cmp-tools">
          <div className="cmp-filters" role="tablist" aria-label="Filter campaigns">
            {CAMPAIGN_TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={filter === tab.key}
                className={`cmp-pill${filter === tab.key ? ' is-on' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                <span className="cmp-pill__long">{tab.label}</span>
                <span className="cmp-pill__short">{tab.short}</span>
                <b>{counts[tab.key]}</b>
              </button>
            ))}
          </div>
          <SearchBox value={query} onChange={setQuery} placeholder="Search your campaigns" />
        </div>
      )}

      {shown.length === 0 ? (
        <section className="cmp-empty">
          <span className="cmp-empty__icon" aria-hidden="true"><Clapperboard size={22} /></span>
          <h2>{campaigns.length ? 'Nothing matches' : 'No accepted campaigns yet'}</h2>
          <p>{campaigns.length
            ? 'Try another filter or clear the search.'
            : 'Accept an invitation and it moves here, with its brief, deadlines and payout in one place.'}
          </p>
          <div className="cmp-empty__actions">
            {campaigns.length
              ? <button type="button" className="cmp-btn cmp-btn--outline" onClick={() => { setQuery(''); setFilter('all'); }}>Clear filters</button>
              : (
                <>
                  <Link to="/creator/invitations" className="cmp-btn cmp-btn--primary">See invitations</Link>
                  <button type="button" className="cmp-btn cmp-btn--outline" onClick={onBrowse}>Browse campaigns</button>
                </>
              )}
          </div>
        </section>
      ) : (
        <div className="cmp-grid">
          {shown.map(inv => <CampaignTile key={inv.id} inv={inv} items={deliverables[inv.id]} />)}
        </div>
      )}

      {campaigns.length > 0 && (
        <button type="button" className="cmp-discover" onClick={onBrowse}>
          <span className="cmp-discover__icon" aria-hidden="true"><Compass size={22} /></span>
          <span className="cmp-discover__copy">
            <strong>Looking for more work?</strong>
            <small>Browse open campaigns near {board.city}.</small>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}
    </>
  );
}

// ── Browse campaigns ─────────────────────────────────────────────────────

function BrowseView({ board }: { board: Board }) {
  const { region, setRegion, regionCounts, browse, query, setQuery, city, interests, expressInterest, invitesOpen } = board;
  const [toast, setToast] = useState<string | null>(null);
  const reachOut = (inv: Invitation) => {
    expressInterest(inv.id);
    setToast(`Interest sent to ${inv.brand}`);
    window.setTimeout(() => setToast(null), 2200);
  };
  const sent = Object.keys(interests).length;

  return (
    <>
      <div className="cmp-browsebar">
        <div className="cmp-browsebar__row">
          <Link to="/creator/profile" className="cmp-browsebar__where" title="Change your location in your passport">
            <Navigation size={15} aria-hidden="true" />
            <span>From <b>{city}</b></span>
          </Link>
          <div className="cmp-filters" role="tablist" aria-label="Distance">
            {REGION_TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={region === tab.key}
                className={`cmp-pill${region === tab.key ? ' is-on' : ''}`}
                onClick={() => setRegion(tab.key)}
              >
                {tab.label}
                <b>{regionCounts[tab.key]}</b>
              </button>
            ))}
          </div>
        </div>
        <SearchBox value={query} onChange={setQuery} placeholder="Search brand, city or category" />
      </div>

      {(invitesOpen > 0 || sent > 0) && (
        <p className="cmp-hint">
          {sent > 0 && <span className="cmp-hint__sent"><CircleCheck size={15} aria-hidden="true" /> {sent} interest{sent === 1 ? '' : 's'} sent</span>}
          {invitesOpen > 0 && (
            <Link to="/creator/invitations">
              <Mail size={15} aria-hidden="true" /> {invitesOpen} brand{invitesOpen === 1 ? '' : 's'} near {city} invited you <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
        </p>
      )}

      {browse.length === 0 ? (
        <section className="cmp-empty">
          <span className="cmp-empty__icon" aria-hidden="true"><Compass size={22} /></span>
          <h2>{query ? 'Nothing matches' : region === 'region' ? 'No open campaigns in your region right now' : 'No open campaigns right now'}</h2>
          <p>{query ? 'Try another search.' : 'Brands publish new campaigns often. Widen the distance to see more.'}</p>
          {region !== 'all' && (
            <div className="cmp-empty__actions">
              <button type="button" className="cmp-btn cmp-btn--outline" onClick={() => setRegion('all')}>Show all India</button>
            </div>
          )}
        </section>
      ) : (
        <div className="cmp-grid cmp-grid--open">
          {browse.map(item => (
            <OpenTile key={item.inv.id} item={item} sentAt={interests[item.inv.id]} onInterest={() => reachOut(item.inv)} />
          ))}
        </div>
      )}

      {toast && <Toast message={toast} icon={CircleCheck} />}
    </>
  );
}

// ── Pieces ───────────────────────────────────────────────────────────────

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="cmp-search">
      <Search size={16} aria-hidden="true" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value && <button type="button" aria-label="Clear search" onClick={() => onChange('')}><X size={14} /></button>}
    </label>
  );
}

function Stat({ icon: Icon, tone, value, label }: { icon: LucideIcon; tone: string; value: string; label: string }) {
  return (
    <div className="cmp-stat">
      <span className={`cmp-stat__icon tone-${tone}`} aria-hidden="true"><Icon size={20} strokeWidth={2} /></span>
      <span className="cmp-stat__text">
        <strong>{value}</strong>
        <small>{label}</small>
      </span>
    </div>
  );
}

function UpNext({ inv, item }: { inv: Invitation; item: Deliverable }) {
  return (
    <section className="cmp-next" aria-label="Up next">
      <div className="cmp-next__media">
        {inv.image ? <img src={inv.image} alt="" /> : <span aria-hidden="true">{inv.brand[0]}</span>}
      </div>
      <div className="cmp-next__copy">
        <span className="cmp-next__kicker"><Clock size={14} aria-hidden="true" /> Up next</span>
        <strong>{item.label}</strong>
        <span>{inv.brief.title} · {item.format ?? 'Content'}{item.spec ? ` · ${item.spec.split('·')[0].trim()}` : ''}</span>
      </div>
      <div className="cmp-next__due">
        <span className={`cmp-chip tone-${dueTone(item.dueDate)}`}>{dueLabel(item.dueDate)}</span>
        <small>{shortDate(item.dueDate)}</small>
      </div>
      <Link to={`/creator/campaigns/${inv.id}`} className="cmp-btn cmp-btn--primary">
        <Upload size={16} aria-hidden="true" /> Upload / view
      </Link>
    </section>
  );
}

/** Shared photo header: flags, platforms, brand, title and where/when. */
function TileMedia({ inv, to, flags }: { inv: Invitation; to: string; flags: ReactNode }) {
  return (
    <Link to={to} className="cmp-tile__media">
      {inv.image ? <img src={inv.image} alt="" loading="lazy" /> : <span className="cmp-tile__ph" aria-hidden="true">{inv.brand[0]}</span>}
      <span className="cmp-tile__flags">{flags}</span>
      <span className="cmp-tile__platforms">
        {inv.brief.platforms.slice(0, 3).map(p => {
          const id = platformId(p);
          return id ? <span key={p} title={p}><PlatformMark id={id} size={16} /></span> : null;
        })}
      </span>
      <span className="cmp-tile__head">
        <span className="cmp-tile__brand">
          <BrandDot name={inv.brand} size={22} />
          {inv.brand}
          {inv.brandVerified && <BadgeCheck size={14} aria-label="Verified brand" />}
        </span>
        <strong className="cmp-tile__title">{inv.brief.title}</strong>
        <span className="cmp-tile__meta">
          <span><MapPin size={13} aria-hidden="true" />{inv.location}</span>
          <span><CalendarDays size={13} aria-hidden="true" />{dateRange(inv.brief.startDate, inv.brief.endDate)}</span>
        </span>
      </span>
    </Link>
  );
}

function CampaignTile({ inv, items }: { inv: Invitation; items?: Deliverable[] }) {
  const status = CAMPAIGN_STATUS[inv.status];
  const { done, total } = progressOf(inv, items);
  const due = inv.status === 'completed' ? null : nextDue(inv, items);
  const nextPiece = items?.filter(d => d.status !== 'approved').sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const revising = items?.some(d => d.status === 'changes_requested');
  const stages = stagesFor(inv, items);
  const signing = inv.status === 'accepted' || inv.status === 'contract_pending';

  const primary = signing
    ? { label: 'Sign contract', to: `/creator/contract/${inv.id}`, icon: FilePen }
    : inv.status === 'completed'
      ? { label: 'View campaign', to: `/creator/campaigns/${inv.id}`, icon: ArrowRight }
      : { label: revising ? 'Fix and resubmit' : 'Upload / view', to: `/creator/campaigns/${inv.id}`, icon: Upload };
  const secondary = signing
    ? { label: 'Brief', to: `/creator/invitations/${inv.id}` }
    : inv.status === 'completed'
      ? { label: 'Earnings', to: '/creator/earnings' }
      : { label: 'Contract', to: `/creator/contract/${inv.id}` };

  return (
    <article className="cmp-tile">
      <TileMedia
        inv={inv}
        to={`/creator/campaigns/${inv.id}`}
        flags={(
          <>
            {status && <span className={`cmp-flag is-${status.tone}`}>{status.label}</span>}
            {revising && <span className="cmp-flag is-red">Changes requested</span>}
          </>
        )}
      />
      <div className="cmp-tile__body">
        <dl className="cmp-figures">
          <div>
            <dt>Your payout</dt>
            <dd>{inr(rateOf(inv))}</dd>
            <small>{inv.status === 'completed' ? 'Processing' : 'Expected'}</small>
          </div>
          <div>
            <dt>Delivered</dt>
            <dd>{done}/{total}</dd>
            <small>approved</small>
          </div>
          <div>
            <dt>Next due</dt>
            <dd>{due ? shortDate(due) : '—'}</dd>
            <small className={due ? `is-${dueTone(due)}` : undefined}>{due ? dueLabel(due) : inv.status === 'completed' ? 'All done' : 'Not set'}</small>
          </div>
        </dl>

        <ol className="cmp-track" aria-label="Campaign stages">
          {stages.map(s => (
            <li key={s.key} className={`is-${s.state}`}>
              <i aria-hidden="true" />
              <span>{s.label.replace(/^\d+\.\s*/, '')}</span>
            </li>
          ))}
        </ol>

        {nextPiece && inv.status === 'active' && (
          <p className={`cmp-nextline${revising ? ' is-red' : ''}`}>
            <Clapperboard size={15} aria-hidden="true" />
            <span><b>{revising ? 'Revise' : 'Next'}:</b> {nextPiece.label}{nextPiece.format ? ` · ${nextPiece.format}` : ''}</span>
          </p>
        )}
        {signing && (
          <p className="cmp-nextline">
            <FilePen size={15} aria-hidden="true" />
            <span><b>Next:</b> confirm the terms, then sign the contract</span>
          </p>
        )}

        <div className="cmp-actions">
          <Link to={primary.to} className="cmp-btn cmp-btn--primary cmp-btn--grow">
            <primary.icon size={16} aria-hidden="true" /> {primary.label}
          </Link>
          <Link to={secondary.to} className="cmp-btn cmp-btn--outline">{secondary.label}</Link>
        </div>
      </div>
    </article>
  );
}

/** Fit as a coloured dot: green strong, amber good, grey partial. */
function fitTone(pct: number): string {
  return pct >= 85 ? 'green' : pct >= 65 ? 'amber' : 'grey';
}

/** An open campaign: compact card, the expected payout and one small action. */
function OpenTile({ item, sentAt, onInterest }: { item: BrowseItem; sentAt?: string; onInterest: () => void }) {
  const { inv, km, anywhere } = item;
  const pieces = pieceCount(inv);
  const to = `/creator/invitations/${inv.id}`;
  return (
    <article className="cmp-open">
      <Link to={to} className="cmp-open__media" tabIndex={-1} aria-hidden="true">
        {inv.image ? <img src={inv.image} alt="" loading="lazy" /> : <span className="cmp-tile__ph">{inv.brand[0]}</span>}
        <span className="cmp-open__dist"><Navigation size={12} />{distanceLabel(km, inv.location, anywhere)}</span>
        <span className={`cmp-open__fit tone-${fitTone(inv.matchPct)}`}><i />{inv.matchPct}% fit</span>
      </Link>
      <div className="cmp-open__body">
        <p className="cmp-open__brand">
          <BrandDot name={inv.brand} size={22} />
          <span>{inv.brand}</span>
          {inv.brandVerified && <BadgeCheck size={14} aria-label="Verified brand" />}
          <span className="cmp-open__platforms">
            {inv.brief.platforms.slice(0, 3).map(p => {
              const id = platformId(p);
              return id ? <PlatformMark key={p} id={id} size={16} /> : null;
            })}
          </span>
        </p>
        <h3 className="cmp-open__title"><Link to={to}>{inv.brief.title}</Link></h3>
        <p className="cmp-open__meta">
          <span><MapPin size={13} aria-hidden="true" />{inv.location}</span>
          <span><CalendarDays size={13} aria-hidden="true" />{dateRange(inv.brief.startDate, inv.brief.endDate)}</span>
        </p>
        <ul className="cmp-open__tags">
          <li><Layers size={13} aria-hidden="true" />{pieces} piece{pieces === 1 ? '' : 's'}</li>
          <li><Tag size={13} aria-hidden="true" />{inv.category}</li>
        </ul>
        {inv.whySelected[0] && <p className="cmp-open__why"><Sparkles size={13} aria-hidden="true" />{inv.whySelected[0]}</p>}
        <div className="cmp-open__foot">
          <div className="cmp-open__pay">
            <small>Expected</small>
            <strong>{inr(rateOf(inv))}</strong>
          </div>
          {sentAt ? (
            <Link to={to} className="cmp-open__sent"><CircleCheck size={15} aria-hidden="true" /> Interest sent</Link>
          ) : (
            <button type="button" className="cmp-btn cmp-btn--primary cmp-btn--sm" onClick={onInterest}>
              <HandHeart size={15} aria-hidden="true" /> Express interest
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
