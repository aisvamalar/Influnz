/**
 * Campaigns list page — hero banner, status filters and campaign cards.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';
import './campaigns.css';
import cafeImg from '../../assets/campaigns/chennai-cafe.png';
import fashionImg from '../../assets/campaigns/mumbai-fashion.png';
import techImg from '../../assets/campaigns/bangalore-tech.png';
import festiveImg from '../../assets/campaigns/delhi-festive.png';

type Status = 'active' | 'pending' | 'draft' | 'completed';
type Platform = 'Instagram' | 'YouTube';

interface Campaign {
  id: number;
  name: string;
  status: Status;
  description: string;
  platform: Platform;
  dates: string;
  location: string;
  category: string;
  budget: number;
  spent: number;
  image: string;
}

const CAMPAIGNS: Campaign[] = [
  { id: 1, name: 'Chennai Café Launch', status: 'active', description: 'Drive local store visits through Tamil-speaking food creators', platform: 'Instagram', dates: '30 Sep 2026 – 15 Oct 2026', location: 'Chennai (15 km)', category: 'Food & Beverage', budget: 150000, spent: 102000, image: cafeImg },
  { id: 2, name: 'Mumbai Fashion Drop', status: 'pending', description: 'Promote the new collection through fashion creators', platform: 'Instagram', dates: '10 Oct 2026 – 25 Oct 2026', location: 'Mumbai', category: 'Fashion', budget: 80000, spent: 20000, image: fashionImg },
  { id: 3, name: 'Bangalore Tech Event', status: 'draft', description: 'Event coverage and product showcases', platform: 'YouTube', dates: '20 Oct 2026 – 05 Nov 2026', location: 'Bangalore', category: 'Tech', budget: 60000, spent: 0, image: techImg },
  { id: 4, name: 'Delhi Festive Campaign', status: 'completed', description: 'Festive campaign with lifestyle creators', platform: 'Instagram', dates: '15 Sep 2026 – 30 Sep 2026', location: 'Delhi', category: 'Lifestyle', budget: 200000, spent: 194000, image: festiveImg },
];

const STATUS_TABS: { key: 'all' | Status; label: string; dot?: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active', dot: '#2fb463' },
  { key: 'pending', label: 'Pending', dot: '#f5a623' },
  { key: 'draft', label: 'Draft', dot: '#2563eb' },
  { key: 'completed', label: 'Completed', dot: '#8b2fd6' },
];

const SORTS = [
  { key: 'recent', label: 'Most recent' },
  { key: 'budget', label: 'Budget: high to low' },
  { key: 'name', label: 'Name: A to Z' },
] as const;
type SortKey = (typeof SORTS)[number]['key'];

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

const barColor = (pct: number) => (pct >= 90 ? '#f43f5e' : pct >= 50 ? '#2fb463' : '#f7b733');

// ── Icons ────────────────────────────────────────────────────────────────────
const RED = '#ef4444';
const CORAL = '#e8573f';

const InstagramIcon = ({ size = 16, outline = false }: { size?: number; outline?: boolean }) => {
  const stroke = outline ? RED : 'url(#igGrad)';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {!outline && (
        <defs>
          <linearGradient id="igGrad" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fdb437" /><stop offset=".4" stopColor="#f0345c" /><stop offset=".75" stopColor="#c02cb4" /><stop offset="1" stopColor="#6a3cdb" />
          </linearGradient>
        </defs>
      )}
      <rect x="3" y="3" width="18" height="18" rx="5.2" stroke={stroke} strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4.1" stroke={stroke} strokeWidth="2.2" />
      <circle cx="17.3" cy="6.7" r="1.3" fill={outline ? RED : '#c02cb4'} />
    </svg>
  );
};

const YouTubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="1.5" y="4.5" width="21" height="15" rx="4.5" fill="#ff0000" />
    <path d="M10 9l5.2 3L10 15V9z" fill="#fff" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.8" y="3" width="12.4" height="11" rx="2" stroke={RED} strokeWidth="1.3" />
    <path d="M1.8 6.6h12.4M5 1.6v2.6M11 1.6v2.6" stroke={RED} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 14.4s4.8-4.1 4.8-8A4.8 4.8 0 003.2 6.4c0 3.9 4.8 8 4.8 8z" stroke={RED} strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="8" cy="6.4" r="1.7" stroke={RED} strokeWidth="1.3" />
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8.4V3.2A1.2 1.2 0 013.2 2h5.2a1.2 1.2 0 01.85.35l5 5a1.2 1.2 0 010 1.7l-4.2 4.2a1.2 1.2 0 01-1.7 0l-5-5A1.2 1.2 0 012 8.4z" stroke={RED} strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="5.4" cy="5.4" r="1" fill={RED} />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="4.7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10.6 10.6L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 3h12l-4.6 5.4v4.1L6.6 14V8.4L2 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const heroIcons = {
  plane: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path d="M8 26.5L48 9 38.5 47 27 33 8 26.5z" fill="#f6836b" stroke={CORAL} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M8 26.5L48 9 27 33z" fill="#fbb4a3" />
      <path d="M27 33l21-24M27 33l-1.5 12.5L32 38" stroke={CORAL} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  wallet: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="17" height="13" rx="2.5" fill="#f4856d" />
      <path d="M2.5 8h17" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" />
      <rect x="13.5" y="10.8" width="6" height="3.4" rx="1.2" fill="#fff" fillOpacity=".8" />
    </svg>
  ),
  chart: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3" y="12" width="4" height="7" rx="1" fill={CORAL} />
      <rect x="9" y="8" width="4" height="11" rx="1" fill={CORAL} />
      <rect x="15" y="3" width="4" height="16" rx="1" fill={CORAL} />
    </svg>
  ),
  sparkle: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8L10 3z" stroke={CORAL} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M17 3.5v3M15.5 5h3M17.5 14v3M16 15.5h3" stroke={CORAL} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  users: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="8" r="2.8" stroke={CORAL} strokeWidth="1.4" />
      <circle cx="4.8" cy="9.4" r="2" stroke={CORAL} strokeWidth="1.3" />
      <circle cx="17.2" cy="9.4" r="2" stroke={CORAL} strokeWidth="1.3" />
      <path d="M5.8 17.5c0-2.7 2.3-4.4 5.2-4.4s5.2 1.7 5.2 4.4M1.5 16.5c0-1.8 1.2-3 3.3-3M20.5 16.5c0-1.8-1.2-3-3.3-3" stroke={CORAL} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  bolt: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M9 1.5L3.5 9h4L6.8 14.5 12.5 7h-4L9 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  target: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
  ),
  bars: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 13.5V9M6 13.5V4M9.5 13.5V7M13 13.5V2.5M1.5 13.5h13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
};

interface Floater { label: string; left: string; top: number; icon: ReactNode }
const FLOATERS: Floater[] = [
  { label: 'Instagram', left: '32.9%', top: 104, icon: <InstagramIcon size={22} /> },
  { label: 'Set budget', left: '61.7%', top: 90, icon: heroIcons.wallet },
  { label: 'YouTube', left: '23%', top: 155, icon: <YouTubeIcon size={22} /> },
  { label: 'Track results', left: '72.3%', top: 154, icon: heroIcons.chart },
  { label: 'Find creators', left: '20.1%', top: 244, icon: heroIcons.users },
  { label: 'Drive real growth', left: '75.8%', top: 244, icon: heroIcons.sparkle },
];

function Hero({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="cl-hero" aria-labelledby="cl-title">
      <svg className="cl-hero__wave" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 150 C 150 110 280 170 440 150 S 740 90 1000 70 L1000 200 L0 200 Z" fill="#fbe9e1" fillOpacity=".55" />
        <path d="M0 180 C 200 150 330 200 520 180 S 800 140 1000 130 L1000 200 L0 200 Z" fill="#fbe2d8" fillOpacity=".45" />
      </svg>

      <svg className="cl-hero__orbit" viewBox="0 0 1000 375" preserveAspectRatio="none" aria-hidden="true">
        <g fill="none" stroke="#f2846b" strokeOpacity=".16" strokeDasharray="3 5">
          <ellipse cx="470" cy="185" rx="260" ry="100" />
          <ellipse cx="470" cy="185" rx="150" ry="62" strokeOpacity=".12" />
          <path d="M300 255 C 220 215 220 135 330 120" />
          <path d="M610 110 C 740 120 780 200 720 260" />
        </g>
      </svg>

      <div className="cl-hero__head">
        <h1 className="cl-hero__title" id="cl-title">Campaigns</h1>
        <p className="cl-hero__sub">Create, manage and track all your influencer campaigns.</p>
      </div>

      {FLOATERS.map(f => (
        <div key={f.label} className="cl-float" style={{ left: f.left, top: f.top }} aria-hidden="true">
          <span className="cl-float__dot">{f.icon}</span>
          {f.label}
        </div>
      ))}

      <div className="cl-hero__center">
        <div className="cl-hero__plane" aria-hidden="true">{heroIcons.plane}</div>
        <h2 className="cl-hero__h2">Create your next campaign</h2>
        <p className="cl-hero__p">Turn your ideas into real results with the right creators.</p>
        <button type="button" className="cl-hero__cta" onClick={onCreate}>
          <span aria-hidden="true">+</span> New campaign <span aria-hidden="true">→</span>
        </button>
        <div className="cl-hero__perks">
          <span className="cl-hero__perk">{heroIcons.bolt} Quick setup</span>
          <span className="cl-hero__perk">{heroIcons.target} AI creator match</span>
          <span className="cl-hero__perk">{heroIcons.bars} Track performance</span>
        </div>
      </div>
    </section>
  );
}

function useOutsideClose(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closeRef.current();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return ref;
}

function KebabMenu({ onView, onEdit, name }: { onView: () => void; onEdit: () => void; name: string }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button
        type="button"
        className="cl-kebab"
        aria-label={`More actions for ${name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor" aria-hidden="true">
          <circle cx="2" cy="2" r="1.5" /><circle cx="2" cy="8" r="1.5" /><circle cx="2" cy="14" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="cl-menu" role="menu">
          <button type="button" role="menuitem" className="cl-menu__item" onClick={onView}>View details</button>
          <button type="button" role="menuitem" className="cl-menu__item" onClick={onEdit}>Edit campaign</button>
        </div>
      )}
    </div>
  );
}

function CampaignCard({ c, onOpen, onEdit }: { c: Campaign; onOpen: () => void; onEdit: () => void }) {
  const pct = c.budget ? Math.round((c.spent / c.budget) * 100) : 0;
  return (
    <article
      className="cl-card"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onOpen(); }
      }}
    >
      <img className="cl-card__thumb" src={c.image} alt="" loading="lazy" />

      <div className="cl-card__main">
        <div className="cl-card__top">
          <h3 className="cl-card__name">{c.name}</h3>
          <span className={`cl-pill cl-pill--${c.status}`}>{c.status[0].toUpperCase() + c.status.slice(1)}</span>
        </div>
        <p className="cl-card__desc">{c.description}</p>
        <div className="cl-card__meta">
          <span>{c.platform === 'YouTube' ? <YouTubeIcon /> : <InstagramIcon outline />}{c.platform}</span>
          <span><CalendarIcon />{c.dates}</span>
          <span><PinIcon />{c.location}</span>
          <span><TagIcon />{c.category}</span>
        </div>
        <div className="cl-budget">
          <div className="cl-budget__row">
            <span>Budget used</span>
            <span className="cl-budget__pct">{pct}%</span>
          </div>
          <div className="cl-budget__track" role="progressbar" aria-label="Budget used" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="cl-budget__fill" style={{ width: `${pct}%`, background: barColor(pct) }} />
          </div>
        </div>
      </div>

      <div className="cl-card__side">
        <div className="cl-card__amount">
          <div className="cl-card__total">{inr(c.budget)}</div>
          <div className="cl-card__spent">Spent: {inr(c.spent)}</div>
        </div>
        <KebabMenu name={c.name} onView={onOpen} onEdit={onEdit} />
      </div>
    </article>
  );
}

export default function CampaignListPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'all' | Status>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('recent');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useOutsideClose(filterOpen, () => setFilterOpen(false));

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: CAMPAIGNS.length };
    CAMPAIGNS.forEach(c => { m[c.status] = (m[c.status] ?? 0) + 1; });
    return m;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = CAMPAIGNS.filter(c =>
      (status === 'all' || c.status === status) &&
      (!q || [c.name, c.description, c.location, c.category, c.platform].some(v => v.toLowerCase().includes(q))),
    );
    if (sort === 'budget') list.sort((a, b) => b.budget - a.budget);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [status, query, sort]);

  const create = () => navigate('/business/campaigns/new');

  return (
    <BusinessLayout breadcrumb="Campaigns" flush>
      <div className="cl-page">
        <Hero onCreate={create} />

        <div className="cl-toolbar" role="group" aria-label="Filter campaigns by status">
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              type="button"
              aria-pressed={status === t.key}
              className={`cl-tab${status === t.key ? ' cl-tab--active' : ''}`}
              onClick={() => setStatus(t.key)}
            >
              {t.dot && <span className="cl-tab__dot" style={{ background: t.dot }} aria-hidden="true" />}
              {t.label} ({counts[t.key] ?? 0})
            </button>
          ))}

          <div className="cl-toolbar__spacer" />

          <label className="cl-search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search campaigns..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search campaigns"
            />
          </label>

          <div className="cl-filter" ref={filterRef}>
            <button
              type="button"
              className="cl-filter__btn"
              aria-haspopup="menu"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen(v => !v)}
            >
              <FilterIcon /> Filter <ChevronIcon />
            </button>
            {filterOpen && (
              <div className="cl-menu" role="menu">
                {SORTS.map(s => (
                  <button
                    key={s.key}
                    type="button"
                    role="menuitemradio"
                    aria-checked={sort === s.key}
                    className={`cl-menu__item${sort === s.key ? ' cl-menu__item--on' : ''}`}
                    onClick={() => { setSort(s.key); setFilterOpen(false); }}
                  >
                    {s.label}{sort === s.key && <span aria-hidden="true">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="cl-list">
            {visible.map(c => (
              <CampaignCard
                key={c.id}
                c={c}
                onOpen={() => navigate(`/business/campaigns/${c.id}`)}
                onEdit={() => navigate('/business/campaigns/new')}
              />
            ))}
          </div>
        ) : (
          <div className="cl-empty">
            <h3>No campaigns found</h3>
            <p>Try adjusting your search or filters, or create a new campaign.</p>
            <button type="button" onClick={create}>+ New campaign</button>
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}
