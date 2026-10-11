/**
 * Mobile campaign setup, step 2 — review the creator portfolio for the chosen strategy.
 * The creator profile lives in the URL (?creator=<id>) so hardware back returns to the list.
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Check,
  Database,
  Funnel,
  MapPin,
  Play,
  PlayCircle,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import MobileFlowHeader from '../../../components/mobile/MobileFlowHeader';
import PlatformMark from '../../../components/mobile/PlatformMark';
import {
  BUDGET_CAP,
  STRATEGY_META,
  formatMoney,
  getPortfolio,
  useCampaignDraft,
  type Creator,
  type Tier,
} from '../campaignDraft';
import { CREATOR_PHOTOS, creatorDisplayName, creatorInitials, unsplashPhoto } from './creatorPhotos';
import './campaign-creators-mobile.css';

const STYLE_IMAGES = {
  Lifestyle: '1517841905240-472988babdf9',
  Food: '1743615467204-8fdaa85ff2db',
  Trends: '1529139574466-a303027c1d8b',
  'Product Reviews': '1556228578-8c89e6adf883',
} as const;

type ContentStyle = keyof typeof STYLE_IMAGES;
type Split = [label: string, percent: number][];

interface CreatorExtras {
  styles: ContentStyle[];
  regions: Split;
  ages: Split;
}

/** Mobile presentation data until creator profiles come from the API. */
const EXTRAS: Record<string, CreatorExtras> = {
  'tamil-trends': {
    styles: ['Lifestyle', 'Food', 'Trends', 'Product Reviews'],
    regions: [['Tamil Nadu', 72], ['Bangalore', 18], ['Others', 10]],
    ages: [['18–24', 41], ['25–34', 39], ['35+', 20]],
  },
  'chennai-food-guide': {
    styles: ['Food', 'Lifestyle', 'Product Reviews', 'Trends'],
    regions: [['Chennai', 64], ['Rest of Tamil Nadu', 24], ['Others', 12]],
    ages: [['18–24', 33], ['25–34', 46], ['35+', 21]],
  },
  'madras-street-eats': {
    styles: ['Food', 'Trends', 'Lifestyle', 'Product Reviews'],
    regions: [['Chennai', 70], ['Rest of Tamil Nadu', 20], ['Others', 10]],
    ages: [['18–24', 44], ['25–34', 40], ['35+', 16]],
  },
  'marina-lifestyle': {
    styles: ['Lifestyle', 'Trends', 'Food', 'Product Reviews'],
    regions: [['Chennai', 61], ['Rest of Tamil Nadu', 27], ['Others', 12]],
    ages: [['18–24', 37], ['25–34', 43], ['35+', 20]],
  },
  'vignesh-tech': {
    styles: ['Product Reviews', 'Trends', 'Lifestyle', 'Food'],
    regions: [['Chennai', 58], ['Bangalore', 25], ['Others', 17]],
    ages: [['18–24', 48], ['25–34', 38], ['35+', 14]],
  },
  'kavitha-herbal': {
    styles: ['Product Reviews', 'Lifestyle', 'Trends', 'Food'],
    regions: [['Chennai', 66], ['Rest of Tamil Nadu', 22], ['Others', 12]],
    ages: [['18–24', 29], ['25–34', 47], ['35+', 24]],
  },
  'anna-nagar-eats': {
    styles: ['Food', 'Lifestyle', 'Trends', 'Product Reviews'],
    regions: [['Chennai', 78], ['Rest of Tamil Nadu', 15], ['Others', 7]],
    ages: [['18–24', 36], ['25–34', 45], ['35+', 19]],
  },
};

const TIER_FILTERS: ('ALL' | Tier)[] = ['ALL', 'MEGA', 'MACRO', 'NANO'];

const displayName = creatorDisplayName;
const unsplash = unsplashPhoto;

function CreatorPhoto({ creator, w, h, className }: { creator: Creator; w: number; h: number; className: string }) {
  const photo = CREATOR_PHOTOS[creator.id];
  if (photo) return <img className={className} src={unsplash(photo, w, h)} alt="" loading="lazy" />;
  return (
    <span className={`${className} mcr-initials`} aria-hidden="true">
      {creatorInitials(creator.name)}
    </span>
  );
}

function TierPill({ tier }: { tier: Tier }) {
  return <span className={`mcr-tier mcr-tier--${tier.toLowerCase()}`}>{tier}</span>;
}

interface CreatorRowProps {
  creator: Creator;
  selected: boolean;
  swapped: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onSwap: () => void;
}

/** A creator candidate tile: photo, identity, metrics and select actions. */
function CreatorRow({ creator, selected, swapped, onToggle, onOpen, onSwap }: CreatorRowProps) {
  return (
    <article className={`mcr-creator${selected ? '' : ' mcr-creator--off'}${swapped ? ' mcr-creator--swapped' : ''}`}>
      <div className="mcr-creator__main">
        <button type="button" className="mcr-creator__photo" aria-label={`Open ${displayName(creator.name)} profile`} onClick={onOpen}>
          <CreatorPhoto creator={creator} w={200} h={220} className="mcr-creator__img" />
          <span className="mcr-ig" aria-hidden="true">
            <PlatformMark id="instagram" size={16} />
          </span>
          <span className="mcr-open" aria-hidden="true">
            <ArrowUpRight size={13} strokeWidth={2.6} />
          </span>
        </button>

        <div className="mcr-creator__body">
          <div className="mcr-creator__top">
            <div className="mcr-creator__id">
              <h3>{displayName(creator.name)}</h3>
              <p>{creator.handle}</p>
            </div>
            <TierPill tier={creator.tier} />
            <button
              type="button"
              role="checkbox"
              aria-checked={selected}
              aria-label={`${selected ? 'Deselect' : 'Select'} ${displayName(creator.name)}`}
              className="mcr-check"
              onClick={onToggle}
            >
              <span className="mcr-check__box">{selected && <Check size={14} strokeWidth={3} />}</span>
            </button>
          </div>

          <dl className="mcr-metrics">
            <div>
              <dd><Users size={12} strokeWidth={2.2} />{creator.audience}</dd>
              <dt>Audience</dt>
            </div>
            <div>
              <dd><PlayCircle size={12} strokeWidth={2.2} />{creator.avgViews}</dd>
              <dt>Avg Views</dt>
            </div>
            <div>
              <dd><BarChart3 size={12} strokeWidth={2.2} />{creator.engagement}</dd>
              <dt>Eng. Rate</dt>
            </div>
            <div className="mcr-metrics__city">
              <dt><MapPin size={13} strokeWidth={2.2} aria-hidden="true" /><span className="mcr-sr">City</span></dt>
              <dd>{creator.city}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mcr-creator__actions">
        <button type="button" className="mcr-btn mcr-btn--outline" onClick={onOpen}>
          View Profile
        </button>
        <button
          type="button"
          className={`mcr-btn ${selected ? 'mcr-btn--solid' : 'mcr-btn--select'}`}
          aria-pressed={selected}
          onClick={onToggle}
        >
          {selected && <Check size={15} strokeWidth={2.6} />}
          {selected ? 'Selected' : 'Select'}
        </button>
        <button
          type="button"
          className="mcr-btn mcr-btn--swap"
          title="Swap for another match"
          aria-label={`Swap ${displayName(creator.name)} for another matched creator`}
          onClick={onSwap}
        >
          <ArrowLeftRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </article>
  );
}

interface CreatorProfileProps {
  creator: Creator;
  selected: boolean;
  onBack: () => void;
  onSelect: () => void;
  onRemove: () => void;
}

/** Full creator passport opened from the candidate list. */
function CreatorProfile({ creator, selected, onBack, onSelect, onRemove }: CreatorProfileProps) {
  const [showAges, setShowAges] = useState(false);
  const extras = EXTRAS[creator.id];
  const split = showAges ? extras?.ages : extras?.regions;
  const highFit = creator.fit >= 85;

  return (
    <div className="mcr mcr--profile">
      <MobileFlowHeader step={1} showSteps={false} onBack={onBack} />

      <main className="mcr-main" key={creator.id}>
        <div className="mcr-hero">
          <CreatorPhoto creator={creator} w={800} h={500} className="mcr-hero__img" />
          <span className="mcr-ig mcr-ig--lg" aria-hidden="true">
            <PlatformMark id="instagram" size={22} />
          </span>
          <span className="mcr-hero__play" aria-hidden="true">
            <Play size={18} strokeWidth={2.4} fill="currentColor" />
          </span>
        </div>

        <div className="mcr-profile__head">
          <div className="mcr-profile__id">
            <h1>
              {displayName(creator.name)}
              <BadgeCheck size={20} strokeWidth={2.2} className="mcr-verified" aria-hidden="true" />
              <span className="mcr-sr">Verified</span>
            </h1>
            <p>{creator.handle}</p>
          </div>
          <TierPill tier={creator.tier} />
        </div>

        <ul className="mcr-panel mcr-panel--profile">
          <li>
            <Users size={18} strokeWidth={2} />
            <strong>{creator.audience}</strong>
            <small>Audience</small>
          </li>
          <li>
            <PlayCircle size={18} strokeWidth={2} />
            <strong>{creator.avgViews}</strong>
            <small>Avg Views</small>
          </li>
          <li>
            <BarChart3 size={18} strokeWidth={2} />
            <strong>{creator.engagement}</strong>
            <small>Eng. Rate</small>
          </li>
          <li>
            <MapPin size={18} strokeWidth={2} />
            <strong>{creator.city}</strong>
            <small>Location</small>
          </li>
        </ul>

        {extras && (
          <>
            <h2 className="mcr-h2">Content Style</h2>
            <ul className="mcr-styles">
              {extras.styles.map((style) => (
                <li key={style}>
                  <img src={unsplash(STYLE_IMAGES[style], 240, 200)} alt="" loading="lazy" />
                  <span>{style}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mcr-fit">
          <div className="mcr-fit__row">
            <span className="mcr-fit__score">
              <Sparkles size={15} strokeWidth={2.4} />
              AI Campaign Fit: {creator.fit}/100
            </span>
            {highFit && (
              <span className="mcr-fit__badge">
                <Check size={13} strokeWidth={2.8} />
                High Fit
              </span>
            )}
          </div>
          <p>{creator.insight}</p>
        </div>

        {split && (
          <section className="mcr-split" aria-labelledby="mcr-split-title">
            <div className="mcr-split__head">
              <h2 id="mcr-split-title" className="mcr-h2">
                {showAges ? 'Audience Age' : 'Audience Breakdown'}
              </h2>
              <button type="button" className="mcr-link" onClick={() => setShowAges((v) => !v)}>
                {showAges ? 'Show regions' : 'View more'}
              </button>
            </div>
            <ul>
              {split.map(([label, pct]) => (
                <li key={label}>
                  <span className="mcr-split__label">
                    <strong>{pct}%</strong> {label}
                  </span>
                  <span className="mcr-split__track">
                    <span className="mcr-split__fill" style={{ width: `${pct}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="mcr-footer">
        <button type="button" className="mcr-primary mcr-primary--coral" onClick={onSelect}>
          Select this creator
          <ArrowRight size={18} strokeWidth={2.2} />
        </button>
        {selected && (
          <button type="button" className="mcr-remove" onClick={onRemove}>
            Remove from campaign
          </button>
        )}
      </footer>
    </div>
  );
}

export default function CampaignCreatorsPageMobile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const { draft, setCreatorSelected, swapCreator } = useCampaignDraft();
  const strategy = STRATEGY_META[draft.strategy];
  const [swapNote, setSwapNote] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    if (!swapNote) return undefined;
    const timer = window.setTimeout(() => setSwapNote(null), 2600);
    return () => window.clearTimeout(timer);
  }, [swapNote]);

  const handleSwap = (creator: Creator) => {
    const next = swapCreator(creator.id);
    setSwapNote(
      next
        ? { id: next.id, text: `Swapped in ${displayName(next.name)} · ${next.fit}/100 fit` }
        : { id: creator.id, text: 'No other matched creators available right now' },
    );
  };

  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<'ALL' | Tier>('ALL');

  const removed = useMemo(() => new Set(draft.removed[draft.strategy] ?? []), [draft]);
  const portfolio = getPortfolio(draft);
  const selected = portfolio.filter((c) => !removed.has(c.id));

  const committed = selected.reduce((sum, c) => sum + c.rate, 0);
  const reserve = Math.max(BUDGET_CAP - committed, 0);
  const over = committed > BUDGET_CAP;
  const canContinue = selected.length > 0 && !over;

  const q = query.trim().toLowerCase();
  const visible = portfolio.filter(
    (c) =>
      (tier === 'ALL' || c.tier === tier) &&
      (!q || c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q)),
  );

  const profile = portfolio.find((c) => c.id === params.get('creator'));
  const pushedFromList = (location.state as { fromList?: boolean } | null)?.fromList === true;
  const openProfile = (id: string) => setParams({ creator: id }, { state: { fromList: true } });
  const closeProfile = () => (pushedFromList ? navigate(-1) : setParams({}, { replace: true }));

  if (profile) {
    const isSelected = !removed.has(profile.id);
    return (
      <CreatorProfile
        creator={profile}
        selected={isSelected}
        onBack={closeProfile}
        onSelect={() => {
          if (!isSelected) setCreatorSelected([profile.id], true);
          closeProfile();
        }}
        onRemove={() => {
          setCreatorSelected([profile.id], false);
          closeProfile();
        }}
      />
    );
  }

  return (
    <div className="mcr">
      <MobileFlowHeader step={1} />

      <main className="mcr-main">
        <div className="mcr-strategy__top">
          <span className="mcr-badge">Active Strategy</span>
          <button type="button" className="mcr-switch" onClick={() => navigate('/business/campaigns/strategy')}>
            <RefreshCw size={14} strokeWidth={2.4} />
            Switch Strategy
          </button>
        </div>
        <h1 className="mcr-strategy__name">{strategy.name}</h1>
        <p className="mcr-strategy__meta">
          {strategy.mix} <span aria-hidden="true">•</span> {strategy.tagline}
        </p>

        <ul className="mcr-panel">
          <li>
            <span className="mcr-panel__icon mcr-panel__icon--green"><Wallet size={17} strokeWidth={2.1} /></span>
            <strong className={over ? 'mcr-red' : 'mcr-green'}>{formatMoney(committed)}</strong>
            <small>of {formatMoney(BUDGET_CAP)}</small>
          </li>
          <li>
            <span className="mcr-panel__icon mcr-panel__icon--blue"><Database size={17} strokeWidth={2.1} /></span>
            <strong className="mcr-blue">{formatMoney(reserve)}</strong>
            <small>Available</small>
          </li>
          <li>
            <span className="mcr-panel__icon mcr-panel__icon--coral"><Users size={17} strokeWidth={2.1} /></span>
            <strong>{selected.length} of {portfolio.length}</strong>
            <small>Selected</small>
          </li>
          <li>
            <span className="mcr-panel__icon mcr-panel__icon--purple"><Target size={17} strokeWidth={2.1} /></span>
            <strong className="mcr-purple">{strategy.audienceFit}/100</strong>
            <small>Audience Fit</small>
          </li>
        </ul>

        {over && (
          <p className="mcr-alert" role="alert">
            Committed spend exceeds your {formatMoney(BUDGET_CAP)} cap. Deselect a creator to continue.
          </p>
        )}

        <div className="mcr-list-head">
          <h2 className="mcr-h2">Creator Candidates</h2>
          <button
            type="button"
            className={`mcr-round${searchOpen ? ' mcr-round--on' : ''}`}
            aria-label="Search creators"
            aria-expanded={searchOpen}
            onClick={() => {
              if (searchOpen) setQuery('');
              setSearchOpen((v) => !v);
            }}
          >
            {searchOpen ? <X size={18} strokeWidth={2.2} /> : <Search size={18} strokeWidth={2.2} />}
          </button>
          <button
            type="button"
            className={`mcr-round${filterOpen || tier !== 'ALL' ? ' mcr-round--on' : ''}`}
            aria-label="Filter by tier"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((v) => !v)}
          >
            <Funnel size={17} strokeWidth={2.2} />
          </button>
        </div>

        {searchOpen && (
          <div className="mcr-search">
            <Search size={16} strokeWidth={2.2} aria-hidden="true" />
            <input
              type="search"
              autoFocus
              placeholder="Search by name or handle"
              aria-label="Search creators"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}

        {filterOpen && (
          <div className="mcr-filters" role="radiogroup" aria-label="Creator tier">
            {TIER_FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={tier === t}
                className={`mcr-filter${tier === t ? ' mcr-filter--on' : ''}`}
                onClick={() => setTier(t)}
              >
                {t === 'ALL' ? 'All tiers' : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}

        <div className="mcr-list">
          {visible.map((c) => (
            <CreatorRow
              key={c.id}
              creator={c}
              selected={!removed.has(c.id)}
              swapped={swapNote?.id === c.id}
              onToggle={() => setCreatorSelected([c.id], removed.has(c.id))}
              onOpen={() => openProfile(c.id)}
              onSwap={() => handleSwap(c)}
            />
          ))}
          {visible.length === 0 && <p className="mcr-empty">No creators match your search.</p>}
        </div>
      </main>

      {swapNote && (
        <p className="mcr-toast" role="status" key={swapNote.text}>
          <ArrowLeftRight size={15} strokeWidth={2.4} />
          {swapNote.text}
        </p>
      )}

      <footer className="mcr-footer">
        <button
          type="button"
          className="mcr-primary"
          disabled={!canContinue}
          onClick={() => navigate('/business/campaigns/guardrails')}
        >
          Continue to negotiation
          <ArrowRight size={18} strokeWidth={2.2} />
        </button>
      </footer>
    </div>
  );
}
