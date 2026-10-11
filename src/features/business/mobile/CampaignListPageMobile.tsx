import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Calendar, Check, Filter, MapPin, Plus, Search, Tag, Target } from 'lucide-react';
import MobileAppHeader from '../../../components/mobile/MobileAppHeader';
import MobileBottomNav from '../../../components/mobile/MobileBottomNav';
import MobileRowMenu from '../../../components/mobile/MobileRowMenu';
import { CAMPAIGNS, type Platform, type Status } from './mobileCampaigns';
import './campaign-list-mobile.css';

type StatusFilter = 'all' | Status;
type PlatformFilter = 'all' | Platform;
type SortKey = 'recent' | 'budget' | 'name';

const STATUS_TABS: { key: StatusFilter; label: string; dot?: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active', dot: '#2fb463' },
  { key: 'pending', label: 'Pending', dot: '#f5b324' },
  { key: 'draft', label: 'Draft', dot: '#6d4fd8' },
  { key: 'completed', label: 'Completed', dot: '#4f6ef0' },
];

const STATUS_STYLE: Record<Status, { label: string; bg: string; color: string; bar: string }> = {
  active: { label: 'Active', bg: '#e9f8ef', color: '#1f9d55', bar: '#3cb55e' },
  pending: { label: 'Pending', bg: '#fff5d9', color: '#b7791f', bar: '#f6c343' },
  draft: { label: 'Draft', bg: '#eeecfe', color: '#5a4fcf', bar: '#c7c2f5' },
  completed: { label: 'Completed', bg: '#e8edfe', color: '#3b5bdb', bar: '#5b7cf0' },
};

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Most recent' },
  { key: 'budget', label: 'Budget: high to low' },
  { key: 'name', label: 'Name: A to Z' },
];

const PLATFORMS: PlatformFilter[] = ['all', 'Instagram', 'YouTube'];

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1.5" y="4.5" width="21" height="15" rx="4.5" fill="#ff0000" />
      <path d="M10 9l5.2 3L10 15V9z" fill="#ffffff" />
    </svg>
  );
}

function HeroArt() {
  return (
    <svg className="mcl-hero__art" viewBox="0 0 140 92" fill="none" aria-hidden="true">
      <path d="M14 70 C 34 92, 64 84, 72 62" stroke="#f3a493" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M100 44 C 116 52, 122 66, 118 78" stroke="#f3a493" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
      <circle cx="30" cy="38" r="13" fill="#ffffff" opacity="0.9" />
      <circle cx="30" cy="34.5" r="4" fill="#f6a594" />
      <path d="M22.5 45c1.4-4 4.4-6 7.5-6s6.1 2 7.5 6" fill="#f6a594" />
      <circle cx="118" cy="80" r="11" fill="#ffffff" opacity="0.9" />
      <circle cx="118" cy="77" r="3.4" fill="#f6a594" />
      <path d="M111.6 86.5c1.2-3.4 3.7-5 6.4-5s5.2 1.6 6.4 5" fill="#f6a594" />
      <path d="M56 40 L124 10 L106 70 L88 52 Z" fill="#f6836b" />
      <path d="M56 40 L124 10 L88 52 Z" fill="#fbb4a3" />
      <path d="M88 52 L92 68 L98 58 Z" fill="#e5573d" />
      <path d="M124 10 L88 52" stroke="#e5573d" strokeWidth="1.2" />
      <path d="M128 26 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" fill="#f08a73" />
      <path d="M44 66 l1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5 z" fill="#f08a73" />
    </svg>
  );
}

/**
 * Mobile Campaigns list
 * Create-campaign hero, status chips, search + filter sheet and campaign tiles.
 */
export default function CampaignListPageMobile() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('recent');
  const [platform, setPlatform] = useState<PlatformFilter>('all');
  const [sheetOpen, setSheetOpen] = useState(false);

  const counts = useMemo(() => {
    const m: Record<StatusFilter, number> = { all: CAMPAIGNS.length, active: 0, pending: 0, draft: 0, completed: 0 };
    CAMPAIGNS.forEach((c) => {
      m[c.status] += 1;
    });
    return m;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = CAMPAIGNS.filter(
      (c) =>
        (status === 'all' || c.status === status) &&
        (platform === 'all' || c.platform === platform) &&
        (!q || [c.name, c.description, c.location, c.category, c.platform].some((v) => v.toLowerCase().includes(q))),
    );
    if (sort === 'budget') list.sort((a, b) => b.budget - a.budget);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [status, platform, query, sort]);

  const activeFilterCount = (sort !== 'recent' ? 1 : 0) + (platform !== 'all' ? 1 : 0);

  useEffect(() => {
    if (!sheetOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [sheetOpen]);

  const create = () => navigate('/business/campaigns/new');

  const resetAll = () => {
    setStatus('all');
    setQuery('');
    setSort('recent');
    setPlatform('all');
  };

  return (
    <div className="mcl">
      <MobileAppHeader />

      <main id="main-content" aria-label="Campaigns">
        <section className="mcl-head">
          <h1 className="mcl-head__title">Campaigns</h1>
          <p className="mcl-head__sub">Create, manage and track all your influencer campaigns.</p>
        </section>

        <section className="mcl-hero" aria-labelledby="mcl-hero-title">
          <HeroArt />
          <div className="mcl-hero__copy">
            <h2 id="mcl-hero-title" className="mcl-hero__title">Create your next campaign</h2>
            <p className="mcl-hero__sub">Turn your ideas into real results with the right creators.</p>
          </div>
          <button type="button" className="mcl-hero__cta" onClick={create}>
            <Plus size={18} strokeWidth={2.4} /> New campaign <ArrowRight size={18} />
          </button>
          <div className="mcl-hero__features">
            <div className="mcl-feature">
              <span className="mcl-feature__icon"><Target size={18} /></span>
              <div>
                <p className="mcl-feature__title">AI creator match</p>
                <p className="mcl-feature__sub">Find the right creators faster</p>
              </div>
            </div>
            <span className="mcl-hero__divider" aria-hidden="true" />
            <div className="mcl-feature">
              <span className="mcl-feature__icon"><BarChart3 size={18} /></span>
              <div>
                <p className="mcl-feature__title">Track results</p>
                <p className="mcl-feature__sub">Measure and drive growth</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mcl-chips" role="group" aria-label="Filter campaigns by status">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={status === t.key}
              className={`mcl-chip${status === t.key ? ' mcl-chip--on' : ''}`}
              onClick={() => setStatus(t.key)}
            >
              {t.dot && <span className="mcl-chip__dot" style={{ background: t.dot }} aria-hidden="true" />}
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>

        <div className="mcl-tools">
          <label className="mcl-search">
            <Search size={18} className="mcl-search__icon" />
            <input
              type="search"
              className="mcl-search__input"
              placeholder="Search campaigns..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search campaigns"
              enterKeyHint="search"
            />
          </label>
          <button
            type="button"
            className="mcl-filter-btn"
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen(true)}
          >
            <Filter size={17} /> Filter
            {activeFilterCount > 0 && <span className="mcl-filter-btn__badge">{activeFilterCount}</span>}
          </button>
        </div>

        {visible.length > 0 ? (
          <div className="mcl-list">
            {visible.map((c) => {
              const s = STATUS_STYLE[c.status];
              const pct = c.budget ? Math.round((c.spent / c.budget) * 100) : 0;
              const open = () => navigate(`/business/campaigns/${c.id}`);
              return (
                <article
                  key={c.id}
                  className="mcl-tile"
                  role="link"
                  tabIndex={0}
                  aria-label={`${c.name}, ${s.label}`}
                  onClick={open}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') open();
                  }}
                >
                  <div className="mcl-tile__main">
                    <img src={c.image} alt="" className="mcl-tile__thumb" loading="lazy" />
                    <div>
                      <div className="mcl-tile__top">
                        <div className="mcl-tile__title">
                          <h3 className="mcl-tile__name">{c.name}</h3>
                          <span className="mcl-pill" style={{ background: s.bg, color: s.color }}>
                            <span className="mcl-pill__dot" />
                            {s.label}
                          </span>
                        </div>
                        <MobileRowMenu
                          label={`More actions for ${c.name}`}
                          items={[
                            { label: 'View details', onSelect: open },
                            { label: 'View content', onSelect: () => navigate(`/business/campaigns/${c.id}/content`) },
                            { label: 'Edit campaign', onSelect: create },
                          ]}
                        />
                      </div>
                      <p className="mcl-tile__desc">{c.description}</p>
                      <ul className="mcl-meta">
                        <li>{c.platform === 'YouTube' ? <YouTubeIcon /> : <InstagramIcon />}{c.platform}</li>
                        <li><Calendar size={14} />{c.dates}</li>
                        <li><MapPin size={14} />{c.location}</li>
                        <li><Tag size={14} />{c.category}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mcl-tile__foot">
                    <div className="mcl-amount">
                      <span className="mcl-amount__value">{inr(c.budget)}</span>
                      <span className="mcl-amount__label">Total Budget</span>
                    </div>
                    <div className="mcl-progress">
                      <div
                        className="mcl-bar"
                        role="progressbar"
                        aria-label="Budget used"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="mcl-bar__fill" style={{ width: `${pct}%`, background: s.bar }} />
                      </div>
                      <span className="mcl-progress__pct">{pct}%</span>
                    </div>
                    <div className="mcl-amount mcl-amount--spent">
                      <span className="mcl-amount__value">{inr(c.spent)}</span>
                      <span className="mcl-amount__label">Spent</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mcl-empty">
            <h3 className="mcl-empty__title">No campaigns found</h3>
            <p className="mcl-empty__text">Try a different search or filter, or start a new campaign.</p>
            <button type="button" className="mcl-empty__btn" onClick={resetAll}>
              Clear filters
            </button>
          </div>
        )}
      </main>

      {sheetOpen && (
        <>
          <div className="mcl-scrim" onClick={() => setSheetOpen(false)} />
          <div className="mcl-sheet" role="dialog" aria-modal="true" aria-labelledby="mcl-sheet-title">
            <div className="mcl-sheet__grip" />
            <div className="mcl-sheet__head">
              <h2 id="mcl-sheet-title" className="mcl-sheet__title">Sort &amp; filter</h2>
              <button
                type="button"
                className="mcl-sheet__reset"
                onClick={() => {
                  setSort('recent');
                  setPlatform('all');
                }}
              >
                Reset
              </button>
            </div>

            <p className="mcl-sheet__label">Sort by</p>
            <div role="radiogroup" aria-label="Sort by">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  role="radio"
                  aria-checked={sort === s.key}
                  className="mcl-option"
                  onClick={() => setSort(s.key)}
                >
                  {s.label}
                  {sort === s.key && <Check size={18} />}
                </button>
              ))}
            </div>

            <p className="mcl-sheet__label">Platform</p>
            <div className="mcl-sheet__chips" role="group" aria-label="Platform">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={platform === p}
                  className={`mcl-chip${platform === p ? ' mcl-chip--on' : ''}`}
                  onClick={() => setPlatform(p)}
                >
                  {p === 'all' ? 'All platforms' : p}
                </button>
              ))}
            </div>

            <button type="button" className="mcl-sheet__done" onClick={() => setSheetOpen(false)}>
              Show {visible.length} {visible.length === 1 ? 'campaign' : 'campaigns'}
            </button>
          </div>
        </>
      )}

      <MobileBottomNav activeItem="campaigns" />
    </div>
  );
}
