/**
 * Mobile campaign setup, step 1 — choose a strategy.
 * Views live in the URL (?view=detail&s=<key> | ?view=recommend) so hardware back works.
 */
import { useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Eye,
  Heart,
  List,
  MapPin,
  MessageCircle,
  Network,
  Plus,
  Rocket,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import MobileFlowHeader from '../../../components/mobile/MobileFlowHeader';
import PlatformMark, { type PlatformId } from '../../../components/mobile/PlatformMark';
import { useCampaignDraft, type StrategyKey } from '../campaignDraft';
import './campaign-strategy-mobile.css';

const unsplash = (id: string, w: number, h: number, crop = 'crop=faces,center') =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&${crop}&w=${w}&h=${h}&q=70`;

const avatar = (id: string) => unsplash(id, 96, 96);

interface Feature {
  label: string;
  Icon: LucideIcon;
}

interface IdealFor {
  label: string;
  Icon: LucideIcon;
}

interface MobileStrategy {
  key: StrategyKey;
  name: string;
  summary: string;
  description: string;
  why: string;
  Icon: LucideIcon;
  photo: string;
  /** imgix crop params, for photos whose subject isn't a face. */
  photoCrop?: string;
  reach: string;
  avatars: string[];
  platforms?: PlatformId[];
  features: Feature[];
  idealFor: IdealFor[];
}

const STRATEGIES: MobileStrategy[] = [
  {
    key: 'reach',
    name: 'Maximum Reach',
    summary: 'Reach the largest audience and create strong awareness.',
    description: 'Create broad awareness and reach the highest number of potential customers across creator tiers.',
    why: 'Your goal is all about visibility, so we prioritise creators with the widest audiences.',
    Icon: TrendingUp,
    photo: '1747716796889-b973cae4d028',
    reach: '5.4L+',
    avatars: ['1438761681033-6461ffad8d80', '1507003211169-0a1dd7228f2d', '1534528741775-53994a69daeb'],
    features: [
      { label: 'Wider reach', Icon: Users },
      { label: 'High visibility', Icon: Eye },
      { label: 'Works across creator tiers', Icon: Zap },
    ],
    idealFor: [
      { label: 'New product launch', Icon: Rocket },
      { label: 'Brand awareness', Icon: Sparkles },
    ],
  },
  {
    key: 'performance',
    name: 'Performance & Conversion',
    summary: 'Drive measurable results with high-engagement creators.',
    description: 'Drive measurable sales and leads with high-engagement creators who have a strong conversion history.',
    why: 'Your goal is focused on sales, so we prioritise creators who convert their audience.',
    Icon: BarChart3,
    photo: '1608571423902-eed4a5ad8108',
    reach: '3.3L+',
    avatars: ['1500648767791-00dcc994a43e', '1544005313-94ddf0286df2', '1573496359142-b8d87734a5a2'],
    features: [
      { label: 'Higher conversions', Icon: Target },
      { label: 'Engaged niche audiences', Icon: Heart },
      { label: 'Trackable ROI', Icon: BarChart3 },
    ],
    idealFor: [
      { label: 'Sales & conversions', Icon: ShoppingBag },
      { label: 'Lead generation', Icon: Target },
    ],
  },
  {
    key: 'community',
    name: 'Community & Local',
    summary: 'Build trust with local creators and nearby audiences.',
    description: 'Build trust with local creators and reach highly relevant audiences in your city and neighbourhood.',
    why: 'Your campaign is local, so we prioritise trusted creators close to your customers.',
    Icon: MapPin,
    photo: '1600093463592-8e36ae95ef56',
    reach: '2.1L+',
    avatars: ['1580489944761-15a19d654956', '1472099645785-5658abf4ff4e', '1438761681033-6461ffad8d80'],
    features: [
      { label: 'Local trust', Icon: ShieldCheck },
      { label: 'Nearby audiences', Icon: MapPin },
      { label: 'Authentic voices', Icon: MessageCircle },
    ],
    idealFor: [
      { label: 'Store visits', Icon: Store },
      { label: 'Local events', Icon: MapPin },
    ],
  },
  {
    key: 'hybrid',
    name: 'Hybrid Balanced',
    summary: 'Blend reach and performance across creator tiers.',
    description: 'Blend reach and performance across multiple creator tiers and platforms for sustainable growth.',
    why: 'Based on your goal and budget, this strategy gives you the best balance of reach and conversions.',
    Icon: Scale,
    photo: '1725982121620-e4106d911c1b',
    photoCrop: 'crop=focalpoint&fp-x=0.5&fp-y=0.66',
    reach: '5.4L+',
    avatars: ['1534528741775-53994a69daeb', '1507003211169-0a1dd7228f2d', '1544005313-94ddf0286df2'],
    platforms: ['instagram', 'youtube', 'tiktok'],
    features: [
      { label: 'Balanced reach', Icon: Network },
      { label: 'Better ROI', Icon: BarChart3 },
      { label: 'Diverse creators', Icon: Users },
    ],
    idealFor: [
      { label: 'Store visits', Icon: Store },
      { label: 'Product launch', Icon: Rocket },
      { label: 'Sales & conversions', Icon: ShoppingBag },
    ],
  },
];

const byKey = (key: string | null) => STRATEGIES.find((s) => s.key === key);

function parseBudget(raw: string): number {
  const n = parseFloat(raw.replace(/[^\d.]/g, ''));
  if (Number.isNaN(n)) return 0;
  if (/lakh|\bl\b/i.test(raw)) return n * 100000;
  if (/\bk\b/i.test(raw)) return n * 1000;
  return n;
}

/** Local heuristic from the chat brief until the recommendation API exists. */
function recommendFromBrief(): StrategyKey {
  try {
    const brief = JSON.parse(localStorage.getItem('campaign_brief') ?? '{}') as { goal?: string; budget?: string };
    const goal = (brief.goal ?? '').toLowerCase();
    const budget = parseBudget(brief.budget ?? '');
    if (/sale|conver|lead|order|purchase|sign ?up/.test(goal)) return 'performance';
    if (/aware|launch|visib|reach/.test(goal) && !/local|store|visit/.test(goal)) return 'reach';
    if (/local|store|visit|nearby|footfall/.test(goal) && budget > 0 && budget < 50000) return 'community';
  } catch {
    // Fall through to the balanced default when the brief is missing or malformed.
  }
  return 'hybrid';
}

function ReachBars() {
  return (
    <span className="mst-bars" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function AvatarStack({ ids }: { ids: string[] }) {
  return (
    <span className="mst-avatars" aria-hidden="true">
      {ids.map((id) => (
        <img key={id} src={avatar(id)} alt="" loading="lazy" />
      ))}
      <span className="mst-avatars__more">
        <Plus size={12} strokeWidth={2.6} />
      </span>
    </span>
  );
}

function PlatformFloat({ platforms }: { platforms: PlatformId[] }) {
  return (
    <span className="mst-float" aria-hidden="true">
      {platforms.map((p) => (
        <span key={p} className={`mst-float__item mst-float__item--${p}`}>
          <PlatformMark id={p} size={22} />
        </span>
      ))}
    </span>
  );
}

export default function CampaignStrategyPageMobile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const { draft, setStrategy } = useCampaignDraft();
  const recommendedKey = useMemo(recommendFromBrief, []);

  const view = params.get('view');
  const detail = view === 'detail' ? byKey(params.get('s')) : undefined;
  const recommended = view === 'recommend' ? byKey(recommendedKey) : undefined;
  const pushedFromList = (location.state as { fromList?: boolean } | null)?.fromList === true;

  const openView = (next: Record<string, string>) => setParams(next, { state: { fromList: true } });
  const backToList = () => (pushedFromList ? navigate(-1) : setParams({}, { replace: true }));

  const choose = (key: StrategyKey) => {
    setStrategy(key);
    navigate('/business/campaigns/creators');
  };

  if (detail) {
    const { Icon } = detail;
    return (
      <div className="mst mst--sub">
        <MobileFlowHeader step={0} onBack={backToList} />

        <main className="mst-main mst-fade" key={detail.key}>
          <div className={`mst-hero mst-tone--${detail.key}`}>
            <img className="mst-hero__img" src={unsplash(detail.photo, 800, 560, detail.photoCrop)} alt="" />
            <span className="mst-hero__icon">
              <Icon size={26} strokeWidth={2.2} />
            </span>
            {detail.platforms && <PlatformFloat platforms={detail.platforms} />}
            <span className="mst-hero__stat">
              <ReachBars />
              <span>
                <strong>{detail.reach}</strong>
                <small>Potential Reach</small>
              </span>
            </span>
          </div>

          <div className={`mst-detail__head mst-tone--${detail.key}`}>
            <span className="mst-icon">
              <Icon size={20} strokeWidth={2.2} />
            </span>
            <h1 className="mst-detail__title">{detail.name}</h1>
          </div>
          <p className="mst-detail__desc">{detail.description}</p>

          <ul className={`mst-features mst-tone--${detail.key}`}>
            {detail.features.map(({ label, Icon: FIcon }) => (
              <li key={label} className="mst-feature">
                <span className="mst-feature__icon">
                  <FIcon size={18} strokeWidth={2.1} />
                </span>
                <span className="mst-feature__label">{label}</span>
              </li>
            ))}
          </ul>

          <h2 className="mst-section">Ideal for</h2>
          <ul className={`mst-chips mst-tone--${detail.key}`}>
            {detail.idealFor.map(({ label, Icon: CIcon }) => (
              <li key={label} className="mst-chip">
                <CIcon size={14} strokeWidth={2.2} />
                {label}
              </li>
            ))}
          </ul>
        </main>

        <footer className="mst-footer">
          <button type="button" className="mst-primary" onClick={() => choose(detail.key)}>
            Select this strategy
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>
          <button type="button" className="mst-link" onClick={backToList}>
            <List size={16} strokeWidth={2.2} />
            View other strategies
          </button>
        </footer>
      </div>
    );
  }

  if (recommended) {
    const { Icon } = recommended;
    return (
      <div className="mst mst--sub">
        <MobileFlowHeader step={0} onBack={backToList} />

        <main className="mst-main mst-fade">
          <section className="mst-rec" aria-labelledby="mst-rec-title">
            <div className="mst-rec__top">
              <span className="mst-rec__spark">
                <Sparkles size={18} strokeWidth={2.2} />
              </span>
              <h1 id="mst-rec-title" className="mst-rec__title">
                Recommended for you
              </h1>
              <button type="button" className="mst-rec__close" aria-label="Close recommendation" onClick={backToList}>
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>
            <p className="mst-rec__why">{recommended.why}</p>

            <div className={`mst-rec__pick mst-tone--${recommended.key}`}>
              <div className="mst-rec__head">
                <span className="mst-icon">
                  <Icon size={20} strokeWidth={2.2} />
                </span>
                <div className="mst-rec__name">
                  <h2>{recommended.name}</h2>
                  <p>{recommended.summary}</p>
                </div>
                <span className="mst-radio" role="img" aria-label="Selected" />
              </div>

              <div className="mst-rec__media">
                <img src={unsplash(recommended.photo, 760, 400, recommended.photoCrop)} alt="" />
                {recommended.platforms && <PlatformFloat platforms={recommended.platforms.slice(0, 2)} />}
                <span className="mst-badge">
                  <Users size={12} strokeWidth={2.4} />
                  {recommended.reach} reach
                </span>
              </div>

              <ul className="mst-rec__features">
                {recommended.features.map(({ label, Icon: FIcon }) => (
                  <li key={label}>
                    <span className="mst-feature__icon">
                      <FIcon size={16} strokeWidth={2.1} />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>

              <h3 className="mst-section mst-section--sm">Ideal for</h3>
              <ul className="mst-chips">
                {recommended.idealFor.map(({ label, Icon: CIcon }) => (
                  <li key={label} className="mst-chip">
                    <CIcon size={13} strokeWidth={2.2} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <footer className="mst-footer">
          <button type="button" className="mst-primary" onClick={() => choose(recommended.key)}>
            Continue with this strategy
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>
          <button type="button" className="mst-outline" onClick={backToList}>
            <Sparkles size={16} strokeWidth={2.2} />
            Explore other strategies
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="mst">
      <MobileFlowHeader step={0} />

      <main className="mst-main mst-fade">
        <h1 className="mst-title">
          Choose a <em>strategy</em>
        </h1>
        <p className="mst-sub">Pick the approach that fits your goal.</p>

        <ul className="mst-list">
          {STRATEGIES.map((s) => {
            const selected = s.key === draft.strategy;
            const { Icon } = s;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  className={`mst-option mst-tone--${s.key}${selected ? ' mst-option--selected' : ''}`}
                  aria-label={`${s.name}${selected ? ', currently selected' : ''}. View details`}
                  onClick={() => openView({ view: 'detail', s: s.key })}
                >
                  <span className="mst-option__body">
                    <span className="mst-icon">
                      <Icon size={20} strokeWidth={2.2} />
                    </span>
                    <span className="mst-option__name">{s.name}</span>
                    <span className="mst-option__desc">{s.summary}</span>
                    <AvatarStack ids={s.avatars} />
                  </span>

                  <span className={`mst-option__media${s.platforms ? ' mst-option__media--platforms' : ''}`}>
                    {s.platforms ? (
                      <PlatformFloat platforms={s.platforms} />
                    ) : (
                      <img src={unsplash(s.photo, 320, 360)} alt="" loading="lazy" />
                    )}
                    <span className="mst-badge">
                      <Users size={12} strokeWidth={2.4} />
                      {s.reach} reach
                    </span>
                  </span>

                  <span className="mst-option__chev" aria-hidden="true">
                    <ChevronRight size={18} strokeWidth={2.4} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </main>

      <footer className="mst-footer mst-footer--plain">
        <button type="button" className="mst-ai" onClick={() => openView({ view: 'recommend' })}>
          <span className="mst-ai__spark">
            <Sparkles size={18} strokeWidth={2.2} />
          </span>
          <span className="mst-ai__text">
            <strong>Not sure?</strong>
            <span>Get an AI recommendation based on your goal.</span>
          </span>
          <span className="mst-ai__go">
            <ArrowRight size={18} strokeWidth={2.2} />
          </span>
        </button>
      </footer>
    </div>
  );
}
