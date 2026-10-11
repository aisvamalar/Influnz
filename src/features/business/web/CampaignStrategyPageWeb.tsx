/**
 * Campaign setup, step 1 — choose a campaign strategy.
 */
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';
import CampaignStepper from './CampaignStepper';
import { useCampaignDraft, type StrategyKey } from './campaignDraft';
import './campaign-strategy.css';
import reachImg from '../../assets/campaigns/strategy-reach.jpg';
import performanceImg from '../../assets/campaigns/strategy-performance.jpg';
import communityImg from '../../assets/campaigns/strategy-community.jpg';
import hybridImg from '../../assets/campaigns/strategy-hybrid.jpg';

const CORAL = '#e8573f';

interface Strategy {
  key: StrategyKey;
  name: string;
  description: string;
  image: string;
  icon: ReactNode;
  purple?: boolean;
  reach: string;
  engagements: string;
  mix: string[];
  points: string[];
}

const icon = (children: ReactNode) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">{children}</svg>
);

const STRATEGIES: Strategy[] = [
  {
    key: 'reach', name: 'Maximum Reach', image: reachImg,
    description: 'Create broad awareness and reach the highest number of potential customers.',
    icon: icon(<><path d="M4 22l7.5-7.5 5 4L26 8" stroke={CORAL} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 8h7v7" stroke={CORAL} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></>),
    reach: '5.4 Lakh', engagements: '50.1k', mix: ['1 Mega +', '1 Macro'],
    points: ['Best for new product launches', 'High top-of-funnel visibility', 'Works across multiple creator tiers'],
  },
  {
    key: 'performance', name: 'Performance & Conversion', image: performanceImg,
    description: 'Drive measurable results with high-engagement creators focused on conversions.',
    icon: icon(<><rect x="5" y="16" width="5" height="9" rx="1.2" fill="#f4a24c" /><rect x="12.5" y="11" width="5" height="14" rx="1.2" fill="#f4a24c" /><rect x="20" y="5" width="5" height="20" rx="1.2" fill="#f4a24c" /></>),
    reach: '3.3 Lakh', engagements: '39.8k', mix: ['3 Macro +', '2 Nano'],
    points: ['Ideal for sales and lead generation', 'Engaged niche audiences', 'Strong conversion history'],
  },
  {
    key: 'community', name: 'Community & Hyperlocal', image: communityImg,
    description: 'Build trust with local creators and reach highly relevant regional audiences.',
    icon: icon(<><path d="M15 27s8.5-7.2 8.5-14A8.5 8.5 0 006.5 13C6.5 19.800 15 27 15 27z" fill={CORAL} /><circle cx="15" cy="12.5" r="3.2" fill="#fdeee9" /></>),
    reach: '2.1 Lakh', engagements: '24.1k', mix: ['2 Macro +', '2 Nano'],
    points: ['Best for local store visits', 'High authenticity & local trust', 'Strong regional engagement'],
  },
  {
    key: 'hybrid', name: 'Hybrid Balanced', image: hybridImg, purple: true,
    description: 'Blend reach and performance across multiple creator tiers for sustainable growth.',
    icon: icon(<><path d="M15 5v19M7 25h16M15 8L6 10M15 8l9 2" stroke="#7a5bd6" strokeWidth="2" strokeLinecap="round" /><path d="M6 10l-3.500 8a4 4 0 007 0L6 10zM24 10l-3.500 8a4 4 0 007 0L24 10z" stroke="#7a5bd6" strokeWidth="2" strokeLinejoin="round" /></>),
    reach: '5.4 Lakh', engagements: '47.8k', mix: ['1 Mega +', '1 Macro + 1 Nano'],
    points: ['Balanced reach and ROI', 'Diverse creator mix', 'Works for most business goals'],
  },
];

const CheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="8" fill="#f1a062" />
    <path d="M4.6 8.2l2.3 2.3 4.5-4.7" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function CampaignStrategyPage() {
  const navigate = useNavigate();
  const { draft, setStrategy: setSelected } = useCampaignDraft();
  const selected = draft.strategy;

  const choose = (key: StrategyKey) => {
    if (key === selected) navigate('/business/campaigns/creators');
    else setSelected(key);
  };

  return (
    <BusinessLayout breadcrumb="Campaigns" flush>
      <div className="st-page">
        <CampaignStepper current={0} />

        <div className="st-head">
          <div>
            <p className="st-eyebrow">Campaign setup</p>
            <h1 className="st-title">Choose a campaign <em>strategy</em></h1>
            <p className="st-sub">
              Select the strategy that best matches your business goal. Each strategy unlocks a curated list of creators and a recommended budget range.
            </p>
          </div>

          <div className="st-context">
            <span className="st-context__pin" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 17s5.500-4.600 5.500-9.200a5.500 5.500 0 00-11 0C3.500 12.400 9 17 9 17z" fill={CORAL} />
                <circle cx="9" cy="7.800" r="2" fill="#fff" />
              </svg>
            </span>
            <div>
              <p className="st-context__title">Campaign Context</p>
              <p className="st-context__meta"><span>Chennai</span><span>₹1.5 Lakh Budget Cap</span><span>Instagram</span><span>Goal: Store Visits</span></p>
            </div>
            <button type="button" className="st-edit" onClick={() => navigate('/business/campaigns/new')}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1.500 10.500l.6-2.700L8.300 1.600a1 1 0 011.400 0l.7.7a1 1 0 010 1.400L4.200 9.900l-2.700.6zM7.500 2.400l2.100 2.100" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
              </svg>
              Edit
            </button>
          </div>
        </div>

        <div className="st-grid" role="radiogroup" aria-label="Campaign strategy">
          {STRATEGIES.map(s => {
            const on = s.key === selected;
            return (
              <article
                key={s.key}
                className={`st-card${on ? ' st-card--selected' : ''}`}
                role="radio"
                aria-checked={on}
                aria-label={s.name}
                tabIndex={0}
                onClick={() => setSelected(s.key)}
                onKeyDown={e => { if (e.key === ' ') { e.preventDefault(); setSelected(s.key); } }}
              >
                <div className="st-card__media">
                  <img src={s.image} alt="" loading="lazy" />
                  {on && (
                    <span className="st-card__check" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.500 6.300l2.300 2.300L9.500 3.700" stroke="#fff" strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  )}
                </div>

                <div className="st-card__body">
                  <span className={`st-card__icon${s.purple ? ' st-card__icon--purple' : ''}`}>{s.icon}</span>
                  <h2 className="st-card__name">{s.name}</h2>
                  <p className="st-card__desc">{s.description}</p>

                  <div className="st-stats">
                    <div className="st-stat"><div className="st-stat__v">{s.reach}</div><div className="st-stat__l">Est. Reach</div></div>
                    <div className="st-stat"><div className="st-stat__v">{s.engagements}</div><div className="st-stat__l">Est. Engagements</div></div>
                    <div className="st-stat">
                      <div className="st-stat__v st-stat__v--mix">{s.mix.map(m => <div key={m}>{m}</div>)}</div>
                      <div className="st-stat__l">Typical Mix</div>
                    </div>
                  </div>

                  <ul className="st-points">
                    {s.points.map(p => <li key={p}><CheckCircle />{p}</li>)}
                  </ul>

                  <button
                    type="button"
                    className={`st-select${on ? ' st-select--on' : ''}`}
                    onClick={e => { e.stopPropagation(); choose(s.key); }}
                  >
                    Select strategy →
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="st-help">
          <div>
            <h3>Need help choosing a strategy?</h3>
            <p>Get a personalized recommendation based on your goal and budget.</p>
          </div>
          <button type="button" onClick={() => setSelected('community')}>Get AI suggestion →</button>
        </div>
      </div>
    </BusinessLayout>
  );
}
