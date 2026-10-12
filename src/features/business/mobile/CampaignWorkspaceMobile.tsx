/**
 * Mobile campaign workspace: campaign summary, creators' content progress,
 * a creator's deliverables (?creator=id) and the content viewer (&content=id).
 * Served at /business/campaigns/:id(/content) and at the end of the setup flow.
 */
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  ChartLine,
  ChevronRight,
  Images,
  LayoutGrid,
  ListFilter,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Target,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import MobileBottomNav from '../../../components/mobile/MobileBottomNav';
import PlatformMark from '../../../components/mobile/PlatformMark';
import type { CreatorData } from '../campaignWorkspaceData';
import CreatorContentView, { type CreatorTab } from './WorkspaceCreatorView';
import ContentViewer from './WorkspaceContentViewer';
import { CreatorAvatar, StatusPill, WorkspaceTopBar } from './WorkspaceParts';
import { STATUS_LABEL } from './mobileCampaigns';
import {
  CONTENT_STATE_LABEL,
  EXTRA_CONTENT_PHOTOS,
  contentPhotoId,
  contentState,
  deliveredCounts,
  getWorkspaceCampaign,
  inr,
  photoUrl,
  rupees,
  type ContentState,
  type WorkspaceCampaign,
} from './workspaceUtils';
import './campaign-workspace-mobile.css';

const LAST_CREATOR_KEY = 'influnz.workspace.lastCreator';

type WorkspaceTab = 'overview' | 'creators' | 'content' | 'performance' | 'payments' | 'settings';
type Filter = 'all' | ContentState;
type SortKey = 'default' | 'progress' | 'name';

const TABS: { key: WorkspaceTab; label: string; icon: ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <LayoutGrid size={19} strokeWidth={1.9} /> },
  { key: 'creators', label: 'Creators', icon: <Users size={19} strokeWidth={1.9} /> },
  { key: 'content', label: 'Content', icon: <Images size={19} strokeWidth={1.9} /> },
  { key: 'performance', label: 'Performance', icon: <ChartLine size={19} strokeWidth={1.9} /> },
  { key: 'payments', label: 'Payments', icon: <Wallet size={19} strokeWidth={1.9} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={19} strokeWidth={1.9} /> },
];

const FILTERS: Filter[] = ['all', 'approved', 'in_review', 'pending', 'not-started'];

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'default', label: 'Default order' },
  { key: 'progress', label: 'Most delivered' },
  { key: 'name', label: 'Name (A–Z)' },
];

const STATE_TONE: Record<ContentState, 'green' | 'amber' | 'blue' | 'grey'> = {
  approved: 'green',
  in_review: 'amber',
  pending: 'blue',
  'not-started': 'grey',
};

const NEGOTIATION_LABEL: Record<CreatorData['status'], [string, 'green' | 'amber' | 'coral' | 'grey']> = {
  accepted: ['Accepted', 'green'],
  pending: ['Negotiating', 'amber'],
  intervene: ['Needs you', 'coral'],
  'not-started': ['Not started', 'grey'],
};

const PAYMENT_LABEL: Record<CreatorData['payments']['status'], [string, 'green' | 'amber' | 'grey']> = {
  released: ['Released', 'green'],
  escrow: ['In escrow', 'amber'],
  hold: ['On hold', 'grey'],
};

const GRADE_TONE = (grade: string) => (grade.startsWith('A') ? 'green' : grade.startsWith('B') ? 'amber' : 'grey');

const isTab = (v: string | null): v is WorkspaceTab => TABS.some((t) => t.key === v);
const isCreatorTab = (v: string | null): v is CreatorTab =>
  v === 'content' || v === 'performance' || v === 'payments' || v === 'communication';

export default function CampaignWorkspaceMobile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: campaignId } = useParams<{ id?: string }>();
  const [params, setParams] = useSearchParams();
  const [toast, setToast] = useState<string | null>(null);

  const campaign = getWorkspaceCampaign(campaignId);
  const creatorId = params.get('creator');
  const contentId = params.get('content');
  const creator = campaign?.creators.find((c) => c.id === creatorId);
  const deliverable = creator?.contentDeliverables.find((d) => d.id === contentId);
  const creatorTabParam = params.get('ctab');
  const creatorTab: CreatorTab = isCreatorTab(creatorTabParam) ? creatorTabParam : 'content';
  const pushed = (location.state as { pushed?: boolean } | null)?.pushed === true;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [creatorId, contentId]);

  if (!campaign) {
    return (
      <div className="mws">
        <main className="mws-main mws-missing">
          <h1 className="mws-section__title">Campaign not found</h1>
          <p className="mws-empty">This campaign may have been removed.</p>
          <button type="button" className="mws-btn mws-btn--primary" onClick={() => navigate('/business/campaigns')}>
            <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
            Back to campaigns
          </button>
        </main>
        <MobileBottomNav activeItem="campaigns" />
      </div>
    );
  }

  const openCreator = (id: string, tab: CreatorTab = 'content') => {
    sessionStorage.setItem(LAST_CREATOR_KEY, id);
    const next: Record<string, string> = { creator: id };
    if (tab !== 'content') next.ctab = tab;
    setParams(next, { state: { pushed: true } });
  };

  const backToList = () => (pushed ? navigate(-1) : setParams({}, { replace: true }));

  let view: ReactNode;
  if (creator && deliverable) {
    view = (
      <ContentViewer
        key={deliverable.id}
        creator={creator}
        deliverable={deliverable}
        notify={setToast}
        onBack={() => (pushed ? navigate(-1) : setParams({ creator: creator.id }, { replace: true }))}
        onSelect={(id) => setParams({ creator: creator.id, content: id }, { replace: true, state: location.state })}
      />
    );
  } else if (creator) {
    view = (
      <CreatorContentView
        creator={creator}
        dueDate={campaign.dueDate}
        tab={creatorTab}
        notify={setToast}
        onBack={backToList}
        onTabChange={(tab) => {
          const next: Record<string, string> = { creator: creator.id };
          if (tab !== 'content') next.ctab = tab;
          setParams(next, { replace: true, state: location.state });
        }}
        onOpenContent={(id) => setParams({ creator: creator.id, content: id }, { state: { pushed: true } })}
      />
    );
  } else {
    view = <WorkspaceHome campaign={campaign} onOpenCreator={openCreator} />;
  }

  return (
    <div className={`mws${deliverable ? ' mws--viewer' : ''}`}>
      {view}
      <div className="mws-toast-region" role="status" aria-live="polite">
        {toast && <div className="mws-toast">{toast}</div>}
      </div>
      <MobileBottomNav activeItem="campaigns" />
    </div>
  );
}

interface PanelProps {
  campaign: WorkspaceCampaign;
  onOpenCreator: (id: string, tab?: CreatorTab) => void;
}

function WorkspaceHome({ campaign, onOpenCreator }: PanelProps) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tabParam = params.get('tab');
  const tab: WorkspaceTab = isTab(tabParam) ? tabParam : 'content';
  const spentPct = campaign.budget ? Math.round((campaign.spent / campaign.budget) * 100) : 0;

  const setTab = (next: WorkspaceTab) => setParams(next === 'content' ? {} : { tab: next }, { replace: true });

  return (
    <>
      <WorkspaceTopBar
        onBack={() => navigate('/business/campaigns')}
        menu={[
          { label: 'All campaigns', onSelect: () => navigate('/business/campaigns') },
          { label: 'Campaign settings', onSelect: () => setTab('settings') },
        ]}
      />

      <main className="mws-main">
        <section className="mws-hero" aria-labelledby="mws-campaign-title">
          <div className="mws-hero__top">
            <div className="mws-hero__text">
              <div className="mws-hero__title-row">
                <h1 id="mws-campaign-title" className="mws-hero__title">
                  {campaign.name}
                </h1>
                <span className={`mws-hero__live mws-hero__live--${campaign.status}`}>
                  <span className="mws-hero__live-dot" aria-hidden="true" />
                  {STATUS_LABEL[campaign.status]}
                </span>
              </div>
              <span className="mws-hero__meta">
                <span className="mws-hero__meta-item">
                  <PlatformMark id={campaign.platform === 'YouTube' ? 'youtube' : 'instagram'} size={14} />
                  {campaign.platform}
                </span>
                <span className="mws-hero__meta-item">
                  <Users size={13} strokeWidth={2} aria-hidden="true" />
                  {campaign.creators.length} creators
                </span>
                <span className="mws-hero__meta-item">
                  <CalendarDays size={13} strokeWidth={2} aria-hidden="true" />
                  {campaign.dates}
                </span>
              </span>
              <p className="mws-hero__desc">{campaign.description}</p>
            </div>
            <span className="mws-hero__photo" aria-hidden="true">
              <img src={campaign.image} alt="" />
            </span>
            <button
              type="button"
              className="mws-hero__chev"
              aria-label="Open campaign overview"
              onClick={() => setTab('overview')}
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>
          </div>

          <div className="mws-budget">
            <div className="mws-budget__row">
              <span className="mws-budget__label">Total budget</span>
              <span className="mws-budget__spent">
                {inr(campaign.spent)} spent • {spentPct}%
              </span>
            </div>
            <strong className="mws-budget__value">{inr(campaign.budget)}</strong>
            <div
              className="mws-bar mws-bar--coral"
              role="progressbar"
              aria-label="Budget spent"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={spentPct}
              style={{ '--mws-fill': `${spentPct}%` } as CSSProperties}
            />
          </div>
        </section>

        <div className="mws-tabs" role="tablist" aria-label="Campaign sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`mws-tabs__item${tab === t.key ? ' is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              <span className="mws-tabs__icon">{t.icon}</span>
              <span className="mws-tabs__label">{t.label}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" aria-label={TABS.find((t) => t.key === tab)?.label}>
          {tab === 'content' && <ContentPanel campaign={campaign} onOpenCreator={onOpenCreator} />}
          {tab === 'overview' && <OverviewPanel campaign={campaign} />}
          {tab === 'creators' && <CreatorsPanel campaign={campaign} onOpenCreator={onOpenCreator} />}
          {tab === 'performance' && <PerformancePanel campaign={campaign} onOpenCreator={onOpenCreator} />}
          {tab === 'payments' && <PaymentsPanel campaign={campaign} onOpenCreator={onOpenCreator} />}
          {tab === 'settings' && <SettingsPanel campaign={campaign} />}
        </div>
      </main>
    </>
  );
}

/** Shown when a campaign has no creators yet (draft, pending) or its creator data is archived. */
function NoCreators({ campaign }: { campaign: WorkspaceCampaign }) {
  const navigate = useNavigate();
  const copy: Record<WorkspaceCampaign['status'], string> = {
    active: 'No creators have joined this campaign yet.',
    pending: 'Creator invitations are out. Their content will appear here once they accept.',
    draft: 'Finish setting up this campaign to start inviting creators.',
    completed: 'This campaign has ended. Creator content and payouts are archived.',
  };
  const completed = campaign.status === 'completed';

  return (
    <div className="mws-none">
      <span className="mws-none__icon">
        <Users size={22} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <p className="mws-none__title">No creators yet</p>
      <p className="mws-none__text">{copy[campaign.status]}</p>
      <button
        type="button"
        className="mws-btn mws-btn--primary"
        onClick={() => navigate(completed ? '/business/analytics' : '/business/campaigns/strategy')}
      >
        {completed ? 'View analytics' : 'Find creators'}
        <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </div>
  );
}

function ContentPanel({ campaign, onOpenCreator }: PanelProps) {
  const creators = campaign.creators;
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('default');
  const lastOpened = sessionStorage.getItem(LAST_CREATOR_KEY) ?? creators[0]?.id;

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: creators.length, approved: 0, in_review: 0, pending: 0, 'not-started': 0 };
    creators.forEach((cr) => (c[contentState(cr)] += 1));
    return c;
  }, [creators]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = creators.filter(
      (c) =>
        (filter === 'all' || contentState(c) === filter) &&
        (!q || c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q)),
    );
    if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'progress') {
      const ratio = (c: CreatorData) => {
        const { done, total } = deliveredCounts(c);
        return total ? done / total : 0;
      };
      return [...list].sort((a, b) => ratio(b) - ratio(a));
    }
    return list;
  }, [creators, filter, query, sort]);

  if (creators.length === 0) {
    return (
      <section className="mws-section" aria-labelledby="mws-creators-title">
        <h2 id="mws-creators-title" className="mws-section__title">
          Creators (0)
        </h2>
        <NoCreators campaign={campaign} />
      </section>
    );
  }

  return (
    <section className="mws-section" aria-labelledby="mws-creators-title">
      <div className="mws-section__head">
        <h2 id="mws-creators-title" className="mws-section__title">
          Creators ({creators.length})
        </h2>
        <div className="mws-section__tools">
          <button
            type="button"
            className={`mws-tool${searchOpen ? ' is-active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Search creators'}
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((v) => !v);
              setQuery('');
            }}
          >
            {searchOpen ? <X size={18} strokeWidth={2} /> : <Search size={18} strokeWidth={2} />}
          </button>
          <div className="mws-menu-wrap">
            <button
              type="button"
              className={`mws-tool${sortOpen || sort !== 'default' ? ' is-active' : ''}`}
              aria-label="Sort creators"
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((v) => !v)}
            >
              <SlidersHorizontal size={18} strokeWidth={2} />
            </button>
            {sortOpen && (
              <div className="mws-menu" role="menu">
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    role="menuitemradio"
                    aria-checked={sort === s.key}
                    className={`mws-menu__item${sort === s.key ? ' is-active' : ''}`}
                    onClick={() => {
                      setSort(s.key);
                      setSortOpen(false);
                    }}
                  >
                    <ListFilter size={15} strokeWidth={2} aria-hidden="true" />
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <label className="mws-search">
          <Search size={16} strokeWidth={2} aria-hidden="true" />
          <span className="mws-sr">Search creators</span>
          <input
            type="search"
            className="mws-search__input"
            placeholder="Search by name or handle"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      )}

      <div className="mws-chips" role="radiogroup" aria-label="Filter by content status">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={filter === f}
            className={`mws-chip mws-chip--${f}${filter === f ? ' is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : CONTENT_STATE_LABEL[f]}
            <span className="mws-chip__count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mws-empty">No creators match this filter.</p>
      ) : (
        <ul className="mws-rows">
          {visible.map((c) => (
            <li key={c.id}>
              <CreatorProgressRow creator={c} selected={c.id === lastOpened} onOpen={() => onOpenCreator(c.id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface CreatorProgressRowProps {
  creator: CreatorData;
  selected: boolean;
  onOpen: () => void;
}

function CreatorProgressRow({ creator, selected, onOpen }: CreatorProgressRowProps) {
  const state = contentState(creator);
  const { done, total } = deliveredCounts(creator);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const thumbs = Array.from({ length: done }, (_, i) => {
    const d = creator.contentDeliverables[i];
    return d ? contentPhotoId(d, i) : EXTRA_CONTENT_PHOTOS[i % EXTRA_CONTENT_PHOTOS.length];
  });
  const shown = thumbs.length > 3 ? thumbs.slice(0, 2) : thumbs;
  const extra = thumbs.length - shown.length;

  return (
    <button type="button" className={`mws-row${selected ? ' is-selected' : ''}`} onClick={onOpen}>
      <CreatorAvatar creator={creator} size={46} className="mws-row__avatar" />
      <span className="mws-row__info">
        <span className="mws-row__name">
          <span className="mws-row__name-text">{creator.name}</span>
          {creator.verified && (
            <>
              <BadgeCheck className="mws-verified" size={15} strokeWidth={2.2} aria-hidden="true" />
              <span className="mws-sr">Verified</span>
            </>
          )}
        </span>
        <span className="mws-row__handle">{creator.handle}</span>
        <StatusPill tone={STATE_TONE[state]}>{CONTENT_STATE_LABEL[state]}</StatusPill>
      </span>
      <span className="mws-row__progress">
        <span className="mws-row__count">
          <strong>
            {done} / {total}
          </strong>{' '}
          delivered
        </span>
        <span
          className={`mws-bar mws-bar--thin ${pct === 100 ? 'mws-bar--green' : 'mws-bar--coral'}`}
          style={{ '--mws-fill': `${pct}%` } as CSSProperties}
          aria-hidden="true"
        />
        <span className="mws-row__media" aria-hidden="true">
          {done === 0 ? (
            <>
              <span className="mws-row__platforms">
                <PlatformMark id="instagram" size={18} />
                <PlatformMark id="youtube" size={18} />
                <PlatformMark id="tiktok" size={18} />
              </span>
              <span className="mws-row__thumb mws-row__thumb--add">
                <Plus size={14} strokeWidth={2.4} />
              </span>
            </>
          ) : (
            <>
              {shown.map((id, i) => (
                <img key={`${id}-${i}`} className="mws-row__thumb" src={photoUrl(id, 64, 80, 'entropy')} alt="" loading="lazy" />
              ))}
              {extra > 0 && <span className="mws-row__thumb mws-row__thumb--more">+{extra}</span>}
            </>
          )}
        </span>
      </span>
      <ChevronRight className="mws-row__chev" size={18} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

function OverviewPanel({ campaign }: { campaign: WorkspaceCampaign }) {
  const totals = campaign.creators.reduce(
    (acc, c) => {
      const { done, total } = deliveredCounts(c);
      acc.done += done;
      acc.total += total;
      if (contentState(c) === 'approved') acc.approved += 1;
      return acc;
    },
    { done: 0, total: 0, approved: 0 },
  );
  const spentPct = campaign.budget ? Math.round((campaign.spent / campaign.budget) * 100) : 0;
  const [start, end] = campaign.dates.split('–').map((s) => s.trim());
  const stats = [
    { label: 'Creators', value: String(campaign.creators.length) },
    { label: 'Content delivered', value: `${totals.done}/${totals.total}` },
    { label: 'Creators approved', value: String(totals.approved) },
    { label: 'Budget used', value: `${spentPct}%` },
  ];
  const timeline = [
    { date: start, label: 'Campaign start', done: campaign.status === 'active' || campaign.status === 'completed' },
    { date: campaign.dueDate, label: 'Content due from creators', done: campaign.status === 'completed' },
    { date: end ?? campaign.dueDate, label: 'Campaign ends', done: campaign.status === 'completed' },
  ];

  return (
    <section className="mws-section" aria-labelledby="mws-overview-title">
      <h2 id="mws-overview-title" className="mws-section__title">
        Overview
      </h2>
      <div className="mws-goal">
        <span className="mws-goal__icon">
          <Target size={18} strokeWidth={2} aria-hidden="true" />
        </span>
        <span>
          <span className="mws-goal__label">Campaign goal</span>
          <span className="mws-goal__text">{campaign.goal}</span>
        </span>
      </div>
      <dl className="mws-stats">
        {stats.map((s) => (
          <div key={s.label} className="mws-stats__item">
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="mws-subtitle">Timeline</h3>
      <ol className="mws-timeline">
        {timeline.map((t) => (
          <li key={t.label} className={`mws-timeline__item${t.done ? ' is-done' : ''}`}>
            <span className="mws-timeline__date">{t.date}</span>
            <span className="mws-timeline__label">{t.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function CreatorsPanel({ campaign, onOpenCreator }: PanelProps) {
  return (
    <section className="mws-section" aria-labelledby="mws-neg-title">
      <h2 id="mws-neg-title" className="mws-section__title">
        Creator deals
      </h2>
      {campaign.creators.length === 0 ? (
        <NoCreators campaign={campaign} />
      ) : (
        <ul className="mws-list">
          {campaign.creators.map((c) => {
            const [label, tone] = NEGOTIATION_LABEL[c.status];
            return (
              <li key={c.id}>
                <button type="button" className="mws-list__row" onClick={() => onOpenCreator(c.id, 'communication')}>
                  <CreatorAvatar creator={c} size={40} />
                  <span className="mws-list__main">
                    <span className="mws-list__name">{c.name}</span>
                    <span className="mws-list__sub">{c.deliverables}</span>
                  </span>
                  <span className="mws-list__end">
                    <strong className="mws-list__value">{c.finalOffer}</strong>
                    <StatusPill tone={tone}>{label}</StatusPill>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function PerformancePanel({ campaign, onOpenCreator }: PanelProps) {
  return (
    <section className="mws-section" aria-labelledby="mws-perf-title">
      <h2 id="mws-perf-title" className="mws-section__title">
        Performance by creator
      </h2>
      {campaign.creators.length === 0 ? (
        <NoCreators campaign={campaign} />
      ) : (
        <ul className="mws-list">
          {campaign.creators.map((c) => (
            <li key={c.id}>
              <button type="button" className="mws-list__row" onClick={() => onOpenCreator(c.id, 'performance')}>
                <CreatorAvatar creator={c} size={40} />
                <span className="mws-list__main">
                  <span className="mws-list__name">{c.name}</span>
                  <span className="mws-list__sub">
                    {c.performance.views} views • {c.performance.engagement} engagement
                  </span>
                </span>
                <span className="mws-list__end">
                  <StatusPill tone={GRADE_TONE(c.performance.grade)}>Grade {c.performance.grade}</StatusPill>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PaymentsPanel({ campaign, onOpenCreator }: PanelProps) {
  const committed = campaign.creators.reduce((sum, c) => sum + rupees(c.payments.totalFee), 0);
  const released = campaign.creators.reduce((sum, c) => sum + rupees(c.payments.released), 0);

  return (
    <section className="mws-section" aria-labelledby="mws-pay-title">
      <h2 id="mws-pay-title" className="mws-section__title">
        Payments
      </h2>
      <dl className="mws-stats">
        <div className="mws-stats__item">
          <dt>Committed</dt>
          <dd>{inr(committed)}</dd>
        </div>
        <div className="mws-stats__item">
          <dt>Released</dt>
          <dd>{inr(released)}</dd>
        </div>
      </dl>
      {campaign.creators.length === 0 ? (
        <NoCreators campaign={campaign} />
      ) : (
        <ul className="mws-list">
          {campaign.creators.map((c) => {
            const [label, tone] = PAYMENT_LABEL[c.payments.status];
            return (
              <li key={c.id}>
                <button type="button" className="mws-list__row" onClick={() => onOpenCreator(c.id, 'payments')}>
                  <CreatorAvatar creator={c} size={40} />
                  <span className="mws-list__main">
                    <span className="mws-list__name">{c.name}</span>
                    <span className="mws-list__sub">{c.payments.invoiceId}</span>
                  </span>
                  <span className="mws-list__end">
                    <strong className="mws-list__value">{c.payments.totalFee.split(' (')[0]}</strong>
                    <StatusPill tone={tone}>{label}</StatusPill>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function SettingsPanel({ campaign }: { campaign: WorkspaceCampaign }) {
  const navigate = useNavigate();
  const rows = [
    { label: 'Campaign name', value: campaign.name },
    { label: 'Status', value: STATUS_LABEL[campaign.status] },
    { label: 'Goal', value: campaign.goal },
    { label: 'Platform', value: campaign.platform },
    { label: 'Budget cap', value: inr(campaign.budget) },
    { label: 'Timeline', value: campaign.dates },
    { label: 'Content due', value: campaign.dueDate },
  ];

  return (
    <section className="mws-section" aria-labelledby="mws-settings-title">
      <h2 id="mws-settings-title" className="mws-section__title">
        Campaign settings
      </h2>
      <dl className="mws-kv">
        {rows.map((r) => (
          <div key={r.label} className="mws-kv__row">
            <dt>{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        className="mws-btn mws-btn--outline mws-btn--block"
        onClick={() => navigate('/business/campaigns/guardrails?view=edit')}
      >
        Edit negotiation settings
      </button>
    </section>
  );
}
