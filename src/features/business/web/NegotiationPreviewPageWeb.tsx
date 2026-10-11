import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import BusinessLayout from '../BusinessLayout';
import ContentReviewDrawer, { initialReview, type ReviewMap, type ReviewRecord } from './ContentReviewDrawer';
import '../negotiation-preview.css';
import {
  INITIAL_CREATORS,
  chennaiThumb,
  complianceCert,
  type ContentDeliverable,
  type CreatorData,
} from '../campaignWorkspaceData';

const CAMPAIGN_NAMES: Record<string, string> = {
  '1': 'Chennai Café Launch',
  '2': 'Mumbai Fashion Drop',
  '3': 'Bangalore Tech Event',
  '4': 'Delhi Festive Campaign',
};

import UiIcon from '../../../components/UiIcon';

export default function NegotiationPreviewPageWeb() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: campaignId } = useParams();

  // Only the negotiation flow (/business/campaigns/negotiate without ?tab) plays the loader
  const [loading, setLoading] = useState<boolean>(() => !campaignId && !searchParams.has('tab'));
  const [loadStep, setLoadStep] = useState<number>(0);
  const [loadProgress, setLoadProgress] = useState<number>(10);

  // Active campaign header tab: 'overview' | 'creators' | 'content' | 'performance' | 'payments' | 'settings'
  const initialTab = (searchParams.get('tab') as any) || 'content'; // Default to content tab per user request
  const [activeHeaderTab, setActiveHeaderTab] = useState<'overview' | 'creators' | 'content' | 'performance' | 'payments' | 'settings'>(initialTab);

  // Master-Detail State per user prompt:
  // selectedCreator (id), selectedContent (id), activeCreatorTab ('content' | 'performance' | 'payments')
  const linkedCreator = INITIAL_CREATORS.find((c) => c.id === searchParams.get('creator')) ?? INITIAL_CREATORS[0];
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>(linkedCreator.id);
  const [selectedContentId, setSelectedContentId] = useState<string>(linkedCreator.contentDeliverables[0]?.id ?? '');
  const [activeCreatorTab, setActiveCreatorTab] = useState<'content' | 'performance' | 'payments'>('content');

  // Search filter query on Left Creators list
  const [searchCreatorQuery, setSearchCreatorQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'pending' | 'intervene'>('all');

  // Right Workspace sub-states
  const [creators, setCreators] = useState<CreatorData[]>(INITIAL_CREATORS);
  // Settings State (Sec 6.10, 6.13, 6.17, 6.18)
  const [campaignName, setCampaignName] = useState(CAMPAIGN_NAMES[campaignId ?? '1'] ?? CAMPAIGN_NAMES['1']);
  const [campaignGoal, setCampaignGoal] = useState('Drive local store visits and footfall');
  const [campaignRadius, setCampaignRadius] = useState('Chennai (15 km radius)');
  const [totalBudgetInput, setTotalBudgetInput] = useState('150000');
  const [maxPerCreatorInput, setMaxPerCreatorInput] = useState('40000');
  const [approvalThresholdInput, setApprovalThresholdInput] = useState('30000');
  const [targetDiscountInput, setTargetDiscountInput] = useState('12');
  const [stanceInput, setStanceInput] = useState<'firm' | 'balanced' | 'flexible'>('balanced');
  const [aiNegotiateToggle, setAiNegotiateToggle] = useState(true);
  const [autoLockToggle, setAutoLockToggle] = useState(true);
  const [humanReallocToggle, setHumanReallocToggle] = useState(true);
  const [autoReplacementToggle, setAutoReplacementToggle] = useState(true);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Drawer state for content detail view
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDeliverableIndex, setSelectedDeliverableIndex] = useState(0);

  const loaderMessages = [
    'Initializing AI negotiation engine with backend model...',
    'Analyzing creator profiles and rate benchmarks...',
    'Dispatching initial offers within your discount target...',
    'Evaluating counter-offers and negotiating usage rights...',
    'Finalizing deals and compiling negotiation transcripts...',
  ];

  // Animated Loader progression
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        const next = prev + 18;
        if (next > 30 && next <= 55) setLoadStep(1);
        else if (next > 55 && next <= 75) setLoadStep(2);
        else if (next > 75 && next <= 90) setLoadStep(3);
        else if (next > 90) setLoadStep(4);
        return next > 100 ? 100 : next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [loading]);

  const selectedCreator = creators.find((c) => c.id === selectedCreatorId) || creators[0];

  // Selected Content Deliverable
  const selectedContent =
    selectedCreator.contentDeliverables.find((d) => d.id === selectedContentId) ||
    selectedCreator.contentDeliverables[0] ||
    null;
  // Review records per deliverable; approval and change requests also update the list badges
  const [reviews, setReviews] = useState<ReviewMap>({});
  const handleReviewChange = (deliverableId: string, change: (record: ReviewRecord) => ReviewRecord) => {
    const owner = creators.find((c) => c.contentDeliverables.some((d) => d.id === deliverableId));
    const deliv = owner?.contentDeliverables.find((d) => d.id === deliverableId);
    if (!owner || !deliv) return;
    setReviews((prev) => ({ ...prev, [deliverableId]: change(prev[deliverableId] ?? initialReview(owner, deliv)) }));

    const { stage } = change(reviews[deliverableId] ?? initialReview(owner, deliv));
    const status: ContentDeliverable['status'] =
      stage === 'approved' ? 'approved' : stage === 'changes_requested' ? 'revision' : stage === 'business_review' ? 'in_review' : deliv.status;
    if (status !== deliv.status) {
      setCreators((list) =>
        list.map((c) =>
          c.id !== owner.id
            ? c
            : { ...c, contentDeliverables: c.contentDeliverables.map((d) => (d.id === deliverableId ? { ...d, status } : d)) },
        ),
      );
    }
  };

  // Filter creators by search and status
  const filteredCreators = creators.filter((c) => {
    if (searchCreatorQuery.trim()) {
      const q = searchCreatorQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.handle.toLowerCase().includes(q)) return false;
    }
    if (activeHeaderTab === 'creators' && statusFilter !== 'all') {
      return c.status === statusFilter;
    }
    return true;
  });

  // Master-Detail selection handler
  const handleSelectCreator = (creator: CreatorData) => {
    setSelectedCreatorId(creator.id);
    if (creator.contentDeliverables.length > 0) {
      setSelectedContentId(creator.contentDeliverables[0].id);
    }
  };

  // Master-Detail content deliverable selection handler
  const handleSelectContent = (content: ContentDeliverable) => {
    setSelectedContentId(content.id);
  };

  // Handler to negotiate single creator
  const handleNegotiateCreator = (creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id === creatorId) {
          const negotiatedPrice = c.id === 'madras' ? '₹22,000' : '₹19,000';
          const wasPrice = c.id === 'madras' ? '(was ₹28,000)' : '(was ₹24,000)';
          return {
            ...c,
            status: 'accepted',
            finalOffer: negotiatedPrice,
            wasPrice: wasPrice,
            steps: [
              {
                sender: 'ai',
                time: '11:00 AM',
                message: `Initiated automated negotiation for ${c.name}.`,
                offer: {
                  type: 'initial',
                  title: 'Initial Offer',
                  amount: c.initialOffer,
                  deliverables: c.deliverables,
                },
              },
              {
                sender: 'ai',
                time: '11:02 AM',
                message: `Creator asked ${c.creatorAsk}. AI countered with volume guarantee.`,
                offer: {
                  type: 'creator-counter',
                  title: 'Creator Counter',
                  amount: c.creatorAsk,
                  deliverables: c.deliverables,
                },
              },
              {
                sender: 'ai',
                time: '11:05 AM',
                message: `Final agreed rate settled at ${negotiatedPrice}.`,
                offer: {
                  type: 'our-counter',
                  title: 'Our Counter',
                  amount: negotiatedPrice,
                  deliverables: c.deliverables,
                  extra: `+ ${c.usageRights} usage rights`,
                },
              },
              {
                sender: 'creator',
                time: '11:08 AM',
                message: `Happy to confirm! ${negotiatedPrice} works for ${c.deliverables}.`,
              },
            ],
          };
        }
        return c;
      })
    );
  };

  const handleNegotiateAll = () => {
    creators.forEach((c) => {
      if (c.status === 'not-started' || c.status === 'pending') {
        handleNegotiateCreator(c.id);
      }
    });
  };

  const handleSaveSettings = () => {
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  return (
    <BusinessLayout breadcrumb="Campaign Content & Workspace" flush>
      {/* ── Animated Concentric Orbital Glowing Loader ──────────────────────── */}
      {loading && (
        <div className="nr-loader-overlay">
          <div className="nr-loader-container">
            <div className="nr-loader-rings">
              <div className="nr-ring-outer" />
              <div className="nr-ring-middle" />
              <div className="nr-ring-inner" />
              <div className="nr-ring-core">AI</div>
              <div className="nr-orbit-dot nr-orbit-dot--1" />
              <div className="nr-orbit-dot nr-orbit-dot--2" />
            </div>

            <h2 className="nr-loader-title">SENDING REQUEST.....</h2>
            <div className="nr-loader-backend-tag">FOR MODEL RUNNING BACKEND</div>

            <div className="nr-loader-status-msg">
              {loaderMessages[loadStep] || 'Simulating AI negotiation models...'}
            </div>

            <div className="nr-loader-progress-track">
              <div
                className="nr-loader-progress-bar"
                style={{ width: `${loadProgress}%` }}
              />
            </div>

            <button
              onClick={() => setLoading(false)}
              style={{
                marginTop: '22px',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Skip to results →
            </button>
          </div>
        </div>
      )}

      {/* ── Main Campaign Workspace ─────────────────────────────────────────── */}
      <div className="nr-page">
        {/* Breadcrumb */}
        <div className="nr-breadcrumb">
          <Link to="/business/campaigns">Campaigns</Link>
          <span className="sep">&gt;</span>
          <Link to="/business/campaigns">{campaignName}</Link>
          <span className="sep">&gt;</span>
          <strong>
            {activeHeaderTab === 'creators' && 'Negotiation Results'}
            {activeHeaderTab === 'settings' && 'Campaign Settings & Guardrails'}
            {activeHeaderTab === 'content' && 'Content'}
            {activeHeaderTab === 'performance' && 'Performance Intelligence'}
            {activeHeaderTab === 'payments' && 'Payments & Milestones'}
            {activeHeaderTab === 'overview' && 'Campaign Operations'}
          </strong>
        </div>

        {/* Campaign Header Banner Card */}
        <div className="nr-header-card">
          <div className="nr-header-card__top">
            <div className="nr-header-card__left">
              <img
                src={chennaiThumb}
                alt=""
                className="nr-header-card__thumb"
              />
              <div>
                <div className="nr-header-card__title-row">
                  <h1 className="nr-header-card__title">{campaignName}</h1>
                  <span className="nr-badge-active">Active</span>
                </div>
                <div className="nr-header-card__meta">
                  <span className="nr-header-card__meta-item">
                    <span><UiIcon name="camera" /></span> Instagram
                  </span>
                  <span className="nr-header-card__meta-item">
                    <span><UiIcon name="users" /></span> 8 creators
                  </span>
                  <span className="nr-header-card__meta-item">
                    <span><UiIcon name="calendar" /></span> Oct 24 - Nov 15
                  </span>
                </div>
              </div>
            </div>

            <div className="nr-header-card__right">
              <div className="nr-header-card__budget">₹1,50,000</div>
              <div className="nr-header-card__budget-sub">
                <span>₹1,02,000 spent</span>
                <span>68%</span>
              </div>
              <div className="nr-progress-track">
                <div className="nr-progress-fill" style={{ width: '68%' }} />
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="nr-header-card__tabs">
            {(
              [
                ['overview', 'Overview'],
                ['creators', 'Creators'],
                ['content', 'Content'],
                ['performance', 'Performance'],
                ['payments', 'Payments'],
                ['settings', 'Settings'],
              ] as const
            ).map(([tabKey, label]) => (
              <button
                key={tabKey}
                className={`nr-tab-btn ${
                  activeHeaderTab === tabKey ? 'nr-tab-btn--active' : ''
                }`}
                onClick={() => {
                  setActiveHeaderTab(tabKey);
                  setSearchParams({ tab: tabKey });
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
           MASTER-DETAIL VIEW: LIST ON THE LEFT, DETAILS ON THE RIGHT
           Left: Creators list is ALWAYS visible, unchanged, and sticky
           Right: Selected Creator Workspace updating dynamically
           ══════════════════════════════════════════════════════════════════════ */}
        {(activeHeaderTab === 'content' ||
          activeHeaderTab === 'creators' ||
          activeHeaderTab === 'performance' ||
          activeHeaderTab === 'payments') && (
          <div className="nr-master-detail-grid">
            {/* ── LEFT COLUMN: CREATORS MASTER LIST (PRESERVED ACROSS CLICKS) ── */}
            <div className="nr-col-list">
              <div className="nr-list-header">
                <div>
                  <h3 className="nr-list-header__title">Creators ({creators.length})</h3>
                  {activeHeaderTab === 'creators' && (
                    <p className="nr-list-header__sub">Negotiation status</p>
                  )}
                </div>
                {activeHeaderTab === 'creators' && (
                  <button
                    className="nr-negotiate-all-btn"
                    onClick={handleNegotiateAll}
                    title="Negotiate remaining creators"
                  >
                    <UiIcon name="sparkles" /> AI Negotiate All
                  </button>
                )}
              </div>

              {/* Search box for Content/Performance/Payments */}
              {activeHeaderTab !== 'creators' ? (
                <div className="nr-search-box">
                  <span style={{ color: '#9ca3af' }}><UiIcon name="search" /></span>
                  <input
                    type="text"
                    placeholder="Search creators..."
                    value={searchCreatorQuery}
                    onChange={(e) => setSearchCreatorQuery(e.target.value)}
                  />
                  <button className="nr-filter-icon-btn" title="Filter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                  </button>
                </div>
              ) : (
                /* Filter Pills on Creators Tab */
                <div className="nr-filter-pills">
                  <button
                    className={`nr-filter-pill ${
                      statusFilter === 'all' ? 'nr-filter-pill--active' : ''
                    }`}
                    onClick={() => setStatusFilter('all')}
                  >
                    All ({creators.length})
                  </button>
                  <button
                    className={`nr-filter-pill ${
                      statusFilter === 'accepted' ? 'nr-filter-pill--active' : ''
                    }`}
                    onClick={() => setStatusFilter('accepted')}
                  >
                    <span className="nr-dot nr-dot--green" />
                    Accepted ({creators.filter((c) => c.status === 'accepted').length})
                  </button>
                  <button
                    className={`nr-filter-pill ${
                      statusFilter === 'pending' ? 'nr-filter-pill--active' : ''
                    }`}
                    onClick={() => setStatusFilter('pending')}
                  >
                    <span className="nr-dot nr-dot--amber" />
                    Pending ({creators.filter((c) => c.status === 'pending').length})
                  </button>
                  <button
                    className={`nr-filter-pill ${
                      statusFilter === 'intervene' ? 'nr-filter-pill--active' : ''
                    }`}
                    onClick={() => setStatusFilter('intervene')}
                  >
                    <span className="nr-dot nr-dot--blue" />
                    Intervene ({creators.filter((c) => c.status === 'intervene').length})
                  </button>
                </div>
              )}

              {/* Creator Cards */}
              <div className="nr-creator-cards">
                {filteredCreators.map((creator) => {
                  const isSelected = creator.id === selectedCreator.id;
                  return (
                    <div
                      key={creator.id}
                      className={`nr-creator-card ${
                        isSelected ? 'nr-creator-card--selected' : ''
                      }`}
                      onClick={() => handleSelectCreator(creator)}
                    >
                      <div className="nr-creator-card__info">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="nr-creator-card__avatar"
                        />
                        <div className="nr-creator-card__meta">
                          <h4 className="nr-creator-card__name">{creator.name}</h4>
                          <p className="nr-creator-card__handle">{creator.handle}</p>
                        </div>
                      </div>

                      {/* Right badge in creator card */}
                      <div className="nr-creator-card__pricing">
                        {activeHeaderTab === 'creators' ? (
                          <>
                            <span className="nr-creator-card__offer">{creator.finalOffer}</span>
                            {creator.wasPrice && (
                              <span className="nr-creator-card__was">{creator.wasPrice}</span>
                            )}
                            <span className={`nr-badge nr-badge--${creator.status}`} style={{ marginTop: '2px' }}>
                              {creator.status === 'accepted' && '✓ Accepted'}
                              {creator.status === 'pending' && 'Pending'}
                              {creator.status === 'intervene' && 'Intervene'}
                              {creator.status === 'not-started' && '• Not started'}
                            </span>
                          </>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <span
                                className={`nr-badge ${
                                  creator.contentStatus === 'approved'
                                    ? 'nr-badge--accepted'
                                    : creator.contentStatus === 'in_review'
                                    ? 'nr-badge--pending'
                                    : creator.contentStatus === 'completed'
                                    ? 'nr-badge--accepted'
                                    : creator.contentStatus === 'pending'
                                    ? 'nr-badge--pending'
                                    : 'nr-badge--not-started'
                                }`}
                              >
                                {creator.contentStatus === 'approved' && '● Approved'}
                                {creator.contentStatus === 'in_review' && '● In Review'}
                                {creator.contentStatus === 'completed' && '● Completed'}
                                {creator.contentStatus === 'pending' && '● Pending'}
                                {creator.contentStatus === 'not-started' && '● Not started'}
                              </span>
                              <div style={{ fontSize: '10.5px', color: '#9ca3af', marginTop: '2px' }}>
                                {creator.contentDeliveredText}
                              </div>
                            </div>
                            <span style={{ color: isSelected ? '#e0553b' : '#9ca3af', fontSize: '13px' }}>›</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT COLUMN: SELECTED CREATOR WORKSPACE (DYNAMICALLY UPDATED) ── */}
            <div className="nr-workspace">
              {/* Creator Header */}
              <div className="nr-content-header-card" style={{ marginBottom: 0 }}>
                <div className="nr-content-header-card__top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="nr-avatar-ig-wrap">
                      <img
                        src={selectedCreator.largeAvatar || selectedCreator.avatar}
                        alt={selectedCreator.name}
                      />
                      <div className="nr-ig-badge-small"><UiIcon name="camera" /></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#111827' }}>
                          {selectedCreator.name}
                        </h2>
                        {selectedCreator.verified && (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="#2563eb">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 4px 0' }}>
                        {selectedCreator.handle}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#4b5563' }}>
                        <span><strong>{selectedCreator.followers}</strong> Followers</span>
                        <span>•</span>
                        <span><strong>{selectedCreator.engagement}</strong> Engagement</span>
                        <span>•</span>
                        <span><UiIcon name="pin" /> {selectedCreator.location}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="nr-badge-contract-signed"><UiIcon name="file" /> Contract Signed</span>
                    <button
                      className="nr-btn-send-reminder"
                      onClick={() => alert(`Reminder sent to ${selectedCreator.name}!`)}
                    >
                      <span><UiIcon name="send" /></span> Send Reminder
                    </button>
                    <button className="nr-icon-kebab" style={{ fontSize: '18px' }}>⋮</button>
                  </div>
                </div>

                {/* Subtabs: Content | Performance | Payments */}
                <div className="nr-creator-subtabs">
                  <button
                    className={`nr-creator-subtab ${activeCreatorTab === 'content' ? 'nr-creator-subtab--active' : ''}`}
                    onClick={() => setActiveCreatorTab('content')}
                  >
                    <span><UiIcon name="clipboard" /></span> Content
                  </button>
                  <button
                    className={`nr-creator-subtab ${activeCreatorTab === 'performance' ? 'nr-creator-subtab--active' : ''}`}
                    onClick={() => setActiveCreatorTab('performance')}
                  >
                    <span><UiIcon name="chart" /></span> Performance
                  </button>
                  <button
                    className={`nr-creator-subtab ${activeCreatorTab === 'payments' ? 'nr-creator-subtab--active' : ''}`}
                    onClick={() => setActiveCreatorTab('payments')}
                  >
                    <span><UiIcon name="card" /></span> Payments
                  </button>
                </div>
              </div>

              {/* ── WHEN CONTENT TAB IS ACTIVE: DELIVERABLES + SELECTED CONTENT DETAILS ── */}
              {activeCreatorTab === 'content' && (
                <>
                  {/* Content Deliverables Cards Selector */}
                  <div className="nr-deliverables-sec">
                    <div className="nr-deliverables-sec__head">
                      <h3 className="nr-deliverables-sec__title">
                        Content Deliverables ({selectedCreator.contentDeliverables.length}/{selectedCreator.contentDeliverables.length || 3})
                      </h3>
                      <button className="nr-btn-view-brief" onClick={() => alert('Opening Campaign Content Brief PDF...')}>
                        View Brief ↗
                      </button>
                    </div>

                    {selectedCreator.contentDeliverables.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                        No deliverables submitted yet for {selectedCreator.name}.
                      </div>
                    ) : (
                      selectedCreator.contentDeliverables.map((deliv) => {
                        const isDelivSelected = selectedContent && selectedContent.id === deliv.id;
                        return (
                          <div
                            key={deliv.id}
                            className={`nr-deliverable-item-row ${
                              isDelivSelected ? 'nr-deliverable-item-row--selected' : ''
                            }`}
                            onClick={() => handleSelectContent(deliv)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                              <div className="nr-deliverable-thumb-wrap">
                                <img src={deliv.thumbnail} alt={deliv.title} />
                                <span className="nr-deliverable-duration">{deliv.duration}</span>
                              </div>
                              <div className="nr-deliverable-main-meta">
                                <h4>{deliv.title}</h4>
                                <div className="nr-deliverable-subline">
                                  <span>{deliv.type}</span>
                                  <span className="submitted-green"><UiIcon name="check" /> {deliv.submittedDate}</span>
                                </div>
                              </div>
                            </div>

                            <div className="nr-deliverable-action-group">
                              <span className="nr-badge nr-badge--accepted">● Approved</span>
                              {/* Clicking View selects and displays this deliverable in workspace right below */}
                              <button
                                className={`nr-btn-view-deliverable ${
                                  isDelivSelected ? 'nr-btn-view-deliverable--active' : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDeliverableIndex(selectedCreator.contentDeliverables.indexOf(deliv)); setIsDrawerOpen(true);
                                }}
                              >
                                {isDelivSelected ? 'Viewing ✓' : '▷ View'}
                              </button>
                              <button className="nr-icon-kebab">⋮</button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Summary / Performance Graphs for this Creator */}
                  <div className="nr-content-bottom-grid">
                    {/* Left: AI Compliance Certificate */}
                    <div className="nr-compliance-box-card">
                      <div>
                        <div className="nr-compliance-head-row">
                          <h4>AI Compliance Check</h4>
                          <span className="nr-badge-all-met"><UiIcon name="check" /> All requirements met</span>
                        </div>

                        <div className="nr-compliance-body-row">
                          <ul className="nr-compliance-checklist-v2">
                            <li><span className="green-check"><UiIcon name="check" /></span> Brand tag (@ChennaiCafe)</li>
                            <li><span className="green-check"><UiIcon name="check" /></span> Paid disclosure (#ad)</li>
                            <li><span className="green-check"><UiIcon name="check" /></span> Product shown clearly</li>
                            <li><span className="green-check"><UiIcon name="check" /></span> No misleading claims</li>
                            <li><span className="green-check"><UiIcon name="check" /></span> Format & duration correct</li>
                          </ul>
                          <img src={complianceCert} alt="Verified Certificate" className="nr-cert-graphic" />
                        </div>
                      </div>

                      <a
                        href="#detailed-report"
                        className="nr-link-view-report"
                        onClick={(e) => {
                          e.preventDefault();
                          if (selectedCreator.contentDeliverables.length > 0) {
                            handleSelectContent(selectedCreator.contentDeliverables[0]);
                          }
                        }}
                      >
                        View detailed report →
                      </a>
                    </div>

                    {/* Right: Content Performance Chart */}
                    <div className="nr-performance-box-card">
                      <div className="nr-perf-head-row">
                        <h4>Content Performance</h4>
                        <select className="nr-perf-dropdown">
                          <option>Last 7 days ∨</option>
                          <option>Last 30 days</option>
                          <option>All time</option>
                        </select>
                      </div>

                      <div className="nr-perf-metric-tiles">
                        <div className="nr-perf-tile">
                          <div className="nr-perf-tile-top"><UiIcon name="eye" /> 325K</div>
                          <div className="nr-perf-tile-label">Views</div>
                          <div className="nr-perf-tile-growth">↑ 28%</div>
                        </div>
                        <div className="nr-perf-tile">
                          <div className="nr-perf-tile-top"><UiIcon name="heart" /> 18.4K</div>
                          <div className="nr-perf-tile-label">Likes</div>
                          <div className="nr-perf-tile-growth">↑ 16%</div>
                        </div>
                        <div className="nr-perf-tile">
                          <div className="nr-perf-tile-top"><UiIcon name="message" /> 742</div>
                          <div className="nr-perf-tile-label">Comments</div>
                          <div className="nr-perf-tile-growth">↑ 32%</div>
                        </div>
                        <div className="nr-perf-tile">
                          <div className="nr-perf-tile-top">↗ 1.2K</div>
                          <div className="nr-perf-tile-label">Shares</div>
                          <div className="nr-perf-tile-growth">↑ 21%</div>
                        </div>
                      </div>

                      {/* Interactive SVG Area Chart */}
                      <div className="nr-chart-wrap">
                        <div className="nr-chart-tooltip">
                          <div><strong>125K views</strong></div>
                          <div style={{ fontSize: '8.5px', color: '#9ca3af' }}>Oct 30</div>
                        </div>

                        <svg width="100%" height="70" viewBox="0 0 380 70" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="coralAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f87171" stopOpacity="0.45" />
                              <stop offset="100%" stopColor="#fee2e2" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 0 55 C 30 52, 60 40, 90 28 C 120 18, 150 25, 180 18 C 210 12, 230 4, 250 8 C 275 12, 310 24, 340 32 C 365 38, 380 42, 380 42 L 380 70 L 0 70 Z"
                            fill="url(#coralAreaGrad)"
                          />
                          <path
                            d="M 0 55 C 30 52, 60 40, 90 28 C 120 18, 150 25, 180 18 C 210 12, 230 4, 250 8 C 275 12, 310 24, 340 32 C 365 38, 380 42, 380 42"
                            fill="none"
                            stroke="#e0553b"
                            strokeWidth="2.2"
                          />
                          <circle cx="250" cy="8" r="4.5" fill="#e0553b" stroke="#ffffff" strokeWidth="2" />
                        </svg>

                        <div className="nr-chart-dates-row">
                          <span>Oct 24</span>
                          <span>Oct 26</span>
                          <span>Oct 28</span>
                          <span>Oct 30</span>
                          <span>Nov 1</span>
                          <span>Nov 3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── WHEN PERFORMANCE TAB IS ACTIVE IN CREATOR WORKSPACE ── */}
              {activeCreatorTab === 'performance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="nr-perf-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="nr-perf-kpi-card">
                      <div className="nr-perf-kpi-label">Reel Views</div>
                      <div className="nr-perf-kpi-val" style={{ fontSize: '18px' }}>{selectedCreator.performance.views}</div>
                      <div className="nr-perf-kpi-trend">↑ 88% Chennai local</div>
                    </div>
                    <div className="nr-perf-kpi-card">
                      <div className="nr-perf-kpi-label">Verified Reach</div>
                      <div className="nr-perf-kpi-val" style={{ fontSize: '18px' }}>{selectedCreator.performance.reach}</div>
                      <div className="nr-perf-kpi-trend">Impressions</div>
                    </div>
                    <div className="nr-perf-kpi-card">
                      <div className="nr-perf-kpi-label">Store Visits</div>
                      <div className="nr-perf-kpi-val" style={{ fontSize: '18px', color: '#16a34a' }}>
                        {selectedCreator.performance.visits}
                      </div>
                      <div className="nr-perf-kpi-trend">{selectedCreator.performance.couponsUsed} coupon uses</div>
                    </div>
                    <div className="nr-perf-kpi-card">
                      <div className="nr-perf-kpi-label">Cost / Visit (CAC)</div>
                      <div className="nr-perf-kpi-val" style={{ fontSize: '18px', color: '#e0553b' }}>
                        {selectedCreator.performance.cac}
                      </div>
                      <div className="nr-perf-kpi-trend">ROI: {selectedCreator.performance.sales}</div>
                    </div>
                  </div>

                  <div className="nr-ai-reallocation-card">
                    <div className="nr-ai-realloc-text">
                      <h4><UiIcon name="idea" /> AI Intelligence Summary for {selectedCreator.name}</h4>
                      <p>{selectedCreator.performance.aiNote}</p>
                    </div>
                  </div>

                  <div className="nr-agreement-card">
                    <h4 className="nr-card-title">Audience Demographics & Footfall Match</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', fontSize: '12px' }}>
                      <div style={{ background: '#faf8f5', padding: '10px 12px', borderRadius: '8px' }}>
                        <div style={{ color: '#6b7280' }}>Top Geography</div>
                        <div style={{ fontWeight: '700', color: '#111827', marginTop: '2px' }}>Chennai (78%)</div>
                        <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>Anna Nagar, Alwarpet</div>
                      </div>
                      <div style={{ background: '#faf8f5', padding: '10px 12px', borderRadius: '8px' }}>
                        <div style={{ color: '#6b7280' }}>Gender Breakdown</div>
                        <div style={{ fontWeight: '700', color: '#111827', marginTop: '2px' }}>58% Female / 42% Male</div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Prime café demo</div>
                      </div>
                      <div style={{ background: '#faf8f5', padding: '10px 12px', borderRadius: '8px' }}>
                        <div style={{ color: '#6b7280' }}>Engagement Quality</div>
                        <div style={{ fontWeight: '700', color: '#111827', marginTop: '2px' }}>{selectedCreator.engagement} ER</div>
                        <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>Above benchmark</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── WHEN PAYMENTS TAB IS ACTIVE IN CREATOR WORKSPACE ── */}
              {activeCreatorTab === 'payments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Total Contract Value</div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginTop: '2px' }}>
                        {selectedCreator.payments.totalFee}
                      </div>
                    </div>
                    <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '11px', color: '#166534' }}>Released Payouts</div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#166534', marginTop: '2px' }}>
                        {selectedCreator.payments.released}
                      </div>
                    </div>
                    <div style={{ background: '#fff7f4', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fed7aa' }}>
                      <div style={{ fontSize: '11px', color: '#ea580c' }}>In Protected Escrow</div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#ea580c', marginTop: '2px' }}>
                        {selectedCreator.payments.escrow}
                      </div>
                    </div>
                  </div>

                  <div className="nr-table-card" style={{ padding: '0', border: 'none' }}>
                    <h4 className="nr-card-title" style={{ marginBottom: '10px' }}>Milestone Payment Breakdown</h4>
                    <table className="nr-data-table">
                      <thead>
                        <tr>
                          <th>Milestone</th>
                          <th>Deliverable</th>
                          <th>Amount</th>
                          <th>Protected State</th>
                          <th>Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Milestone 1</strong> (50%)</td>
                          <td>Agreement & Advance Booking</td>
                          <td>₹16,000</td>
                          <td><span className="nr-badge nr-badge--accepted">Released</span></td>
                          <td>
                            <a
                              href="#inv"
                              style={{ color: '#e0553b', textDecoration: 'none' }}
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Downloading GST Invoice ${selectedCreator.payments.invoiceId}...`);
                              }}
                            >
                              <UiIcon name="file" /> {selectedCreator.payments.invoiceId}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Milestone 2</strong> (50%)</td>
                          <td>Content Approval & Video Live</td>
                          <td>₹16,000</td>
                          <td><span className="nr-badge nr-badge--pending"><UiIcon name="lock" /> In Protected Escrow</span></td>
                          <td>Releases on Content Sign-off</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
           TAB 5: SETTINGS TAB (Campaign Settings & Guardrails Specification)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeHeaderTab === 'settings' && (
          <div className="nr-settings-view">
            {settingsSavedToast && (
              <div
                style={{
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  color: '#166534',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                ✓ Campaign guardrails and settings saved successfully!
              </div>
            )}

            <div className="nr-settings-grid">
              <div className="nr-settings-col">
                <div className="nr-settings-card">
                  <div className="nr-settings-card__header">
                    <div className="nr-settings-card__icon"><UiIcon name="settings" /></div>
                    <div>
                      <h3 className="nr-settings-card__title">Campaign Details & Objective</h3>
                      <p className="nr-settings-card__subtitle">Core campaign scope and local business targeting rules</p>
                    </div>
                  </div>
                  <div className="nr-form-grid">
                    <div className="nr-form-group">
                      <label className="nr-form-label">Campaign Name</label>
                      <input
                        type="text"
                        className="nr-form-input"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                      />
                    </div>
                    <div className="nr-form-group">
                      <label className="nr-form-label">Primary Objective</label>
                      <input
                        type="text"
                        className="nr-form-input"
                        value={campaignGoal}
                        onChange={(e) => setCampaignGoal(e.target.value)}
                      />
                    </div>
                    <div className="nr-form-group">
                      <label className="nr-form-label">Target Geography</label>
                      <input
                        type="text"
                        className="nr-form-input"
                        value={campaignRadius}
                        onChange={(e) => setCampaignRadius(e.target.value)}
                      />
                    </div>
                    <div className="nr-form-group">
                      <label className="nr-form-label">Primary Platform</label>
                      <select className="nr-form-select">
                        <option>Instagram Reels & Stories</option>
                        <option>YouTube Shorts</option>
                        <option>Cross-Platform</option>
                      </select>
                    </div>
                    <div className="nr-form-group--full nr-form-group">
                      <label className="nr-form-label">Target Audience Criteria</label>
                      <input
                        type="text"
                        className="nr-form-input"
                        defaultValue="Foodies & Café visitors in Chennai, 18-34, Tamil & Tanglish speaking"
                      />
                      <span className="nr-form-hint">AI uses this criteria to match Creator Passport audience overlap</span>
                    </div>
                  </div>
                </div>

                <div className="nr-settings-card">
                  <div className="nr-settings-card__header">
                    <div className="nr-settings-card__icon"><UiIcon name="money" /></div>
                    <div>
                      <h3 className="nr-settings-card__title">Budget & Negotiation Guardrails</h3>
                      <p className="nr-settings-card__subtitle">Strict limits that the AI agent can never exceed without authorization</p>
                    </div>
                  </div>
                  <div className="nr-form-grid">
                    <div className="nr-form-group">
                      <label className="nr-form-label">Total Campaign Budget (₹)</label>
                      <input
                        type="number"
                        className="nr-form-input"
                        value={totalBudgetInput}
                        onChange={(e) => setTotalBudgetInput(e.target.value)}
                      />
                      <span className="nr-form-hint">Authorized cap (₹1,50,000 maximum commitment)</span>
                    </div>
                    <div className="nr-form-group">
                      <label className="nr-form-label">Max Price Per Creator Cap (₹)</label>
                      <input
                        type="number"
                        className="nr-form-input"
                        value={maxPerCreatorInput}
                        onChange={(e) => setMaxPerCreatorInput(e.target.value)}
                      />
                      <span className="nr-form-hint">AI stops and alerts if creator asks above this cap</span>
                    </div>
                    <div className="nr-form-group">
                      <label className="nr-form-label">Manual Approval Threshold (₹)</label>
                      <input
                        type="number"
                        className="nr-form-input"
                        value={approvalThresholdInput}
                        onChange={(e) => setApprovalThresholdInput(e.target.value)}
                      />
                      <span className="nr-form-hint">Offers above ₹30,000 require your explicit click</span>
                    </div>
                    <div className="nr-form-group">
                      <label className="nr-form-label">Target Negotiation Discount (%)</label>
                      <input
                        type="number"
                        className="nr-form-input"
                        value={targetDiscountInput}
                        onChange={(e) => setTargetDiscountInput(e.target.value)}
                      />
                      <span className="nr-form-hint">Discount target based on creator benchmarks</span>
                    </div>
                    <div className="nr-form-group">
                      <label className="nr-form-label">AI Negotiation Stance</label>
                      <select
                        className="nr-form-select"
                        value={stanceInput}
                        onChange={(e) => setStanceInput(e.target.value as any)}
                      >
                        <option value="firm">Firm (Strict price targets)</option>
                        <option value="balanced">Balanced (Recommended)</option>
                        <option value="flexible">Flexible (Deliverable trade-offs)</option>
                      </select>
                      <span className="nr-form-hint">Controls AI flexibility during counter-offers</span>
                    </div>
                  </div>

                  <div className="nr-policy-box">
                    <span><UiIcon name="shield" /></span>
                    <div>
                      <strong>Document Enforcement Rule (Sec 6.18):</strong> If a creator price exceeds your guardrail, the AI halts negotiation and requests business approval or seeks a qualified replacement without restarting discovery.
                    </div>
                  </div>
                </div>

                <div className="nr-settings-card">
                  <div className="nr-settings-card__header">
                    <div className="nr-settings-card__icon"><UiIcon name="bot" /></div>
                    <div>
                      <h3 className="nr-settings-card__title">AI Agent Autonomy & Automation</h3>
                      <p className="nr-settings-card__subtitle">Configure permissions for automated negotiations and operations</p>
                    </div>
                  </div>

                  <div className="nr-toggle-row">
                    <div className="nr-toggle-info">
                      <div className="nr-toggle-title">Autonomous AI Negotiation</div>
                      <div className="nr-toggle-desc">Enable AI to respond to creator counter-offers within approved guardrails with full auditable transcripts.</div>
                    </div>
                    <label className="nr-switch">
                      <input
                        type="checkbox"
                        checked={aiNegotiateToggle}
                        onChange={(e) => setAiNegotiateToggle(e.target.checked)}
                      />
                      <span className="nr-slider" />
                    </label>
                  </div>

                  <div className="nr-toggle-row">
                    <div className="nr-toggle-info">
                      <div className="nr-toggle-title">Auto-Lock Compliant Deals</div>
                      <div className="nr-toggle-desc">Automatically confirm deals when final price is below the approval threshold and deliverable matches the brief.</div>
                    </div>
                    <label className="nr-switch">
                      <input
                        type="checkbox"
                        checked={autoLockToggle}
                        onChange={(e) => setAutoLockToggle(e.target.checked)}
                      />
                      <span className="nr-slider" />
                    </label>
                  </div>

                  <div className="nr-toggle-row">
                    <div className="nr-toggle-info">
                      <div className="nr-toggle-title">Autonomous Creator Replacement (Sec 6.17)</div>
                      <div className="nr-toggle-desc">If a creator declines, cancels, or misses a deadline, AI finds and suggests similar candidates preserving campaign context.</div>
                    </div>
                    <label className="nr-switch">
                      <input
                        type="checkbox"
                        checked={autoReplacementToggle}
                        onChange={(e) => setAutoReplacementToggle(e.target.checked)}
                      />
                      <span className="nr-slider" />
                    </label>
                  </div>

                  <div className="nr-toggle-row">
                    <div className="nr-toggle-info">
                      <div className="nr-toggle-title">Human Sign-off for Budget Reallocations (Sec 6.15)</div>
                      <div className="nr-toggle-desc">Require manual business approval before moving budget from low-performing creators to stronger performers.</div>
                    </div>
                    <label className="nr-switch">
                      <input
                        type="checkbox"
                        checked={humanReallocToggle}
                        onChange={(e) => setHumanReallocToggle(e.target.checked)}
                      />
                      <span className="nr-slider" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="nr-settings-col">
                <div className="nr-settings-card">
                  <h4 className="nr-card-title">Creator Quality Filters</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Min Creator Score</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>80 / 100 Verified</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Min Audience Geography</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>70% Chennai Match</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Allowed Categories</div>
                      <div className="nr-tags-list">
                        <span className="nr-tag-chip">Food & Café</span>
                        <span className="nr-tag-chip">Dining</span>
                        <span className="nr-tag-chip">Chennai Lifestyle</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="nr-settings-card">
                  <h4 className="nr-card-title">Content Compliance Rules</h4>
                  <ul className="nr-compliance-checklist">
                    <li className="nr-check-row">
                      <span className="nr-check-circle">✓</span>
                      <span>Mandatory Brand Tag: <strong>@ChennaiCafe</strong></span>
                    </li>
                    <li className="nr-check-row">
                      <span className="nr-check-circle">✓</span>
                      <span>Paid Disclosure: <strong>#ad / Partnership</strong></span>
                    </li>
                    <li className="nr-check-row">
                      <span className="nr-check-circle">✓</span>
                      <span>Clear Call to Action: Store visit code</span>
                    </li>
                    <li className="nr-check-row">
                      <span className="nr-check-circle">✓</span>
                      <span>Aspect Ratio: 9:16 vertical reels</span>
                    </li>
                  </ul>
                </div>

                <div className="nr-settings-card">
                  <h4 className="nr-card-title">Protected Escrow & Contracts</h4>
                  <p style={{ fontSize: '11.5px', color: '#6b7280', lineHeight: '1.45', margin: '0 0 10px 0' }}>
                    Funds remain in protected funding state and release only upon verified milestone completion and human content sign-off.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#166534' }}>
                    <span><UiIcon name="lock" /></span> Standard Milestone Escrow Active
                  </div>
                </div>

                <div className="nr-settings-card">
                  <button className="nr-btn-primary" onClick={handleSaveSettings}>
                    Save Campaign Settings
                  </button>
                  <button
                    className="nr-btn-outline"
                    style={{ marginTop: '8px' }}
                    onClick={() => setActiveHeaderTab('content')}
                  >
                    Back to Content Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
           TAB 6: OVERVIEW TAB (Section 6.13)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeHeaderTab === 'overview' && (
          <div className="nr-settings-view">
            <div className="nr-settings-card">
              <div className="nr-settings-card__header">
                <div className="nr-settings-card__icon"><UiIcon name="map" /></div>
                <div>
                  <h3 className="nr-settings-card__title">Campaign Operations Overview (Sec 6.13)</h3>
                  <p className="nr-settings-card__subtitle">Full campaign lifecycle state machine from goal to footfall results</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#166534', fontWeight: '700' }}>1. STRATEGY</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '4px' }}>Hyperlocal Reach</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>✓ Approved</div>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#166534', fontWeight: '700' }}>2. CREATORS</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '4px' }}>8 Candidates</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>✓ Shortlisted</div>
                </div>
                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '700' }}>3. NEGOTIATION</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '4px' }}>5 / 8 Agreed</div>
                  <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px' }}><UiIcon name="zap" /> In Progress</div>
                </div>
                <div style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700' }}>4. CONTENT</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '4px' }}>3 Approved</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Upcoming</div>
                </div>
                <div style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700' }}>5. RESULTS</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '4px' }}>1,420 Visits</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Tracking Live</div>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                <button className="nr-btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => setActiveHeaderTab('content')}>
                  Go to Content Workspace →
                </button>
                <button className="nr-btn-outline" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => setActiveHeaderTab('settings')}>
                  Configure Campaign Guardrails →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
      {/* ── EXTRA POPUP FROM RIGHT: DELIVERABLE REVIEW DRAWER (Pasted Image 2.png) ── */}
      {isDrawerOpen && (
        <ContentReviewDrawer
          creator={selectedCreator}
          initialIndex={selectedDeliverableIndex}
          photoOffset={creators.indexOf(selectedCreator) * 2}
          reviews={reviews}
          onReviewChange={handleReviewChange}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}

    </BusinessLayout>
  );
}
