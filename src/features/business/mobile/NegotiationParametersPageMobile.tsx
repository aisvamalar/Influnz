/**
 * Mobile campaign setup, step 3 — AI negotiation preview and guardrails.
 * The settings editor lives in the URL (?view=edit) so hardware back closes it.
 */
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  ClipboardCheck,
  Copyright,
  FileText,
  Lightbulb,
  Minus,
  Pencil,
  Percent,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  UserRound,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import SendingRequestOverlay from '../../../components/SendingRequestOverlay';
import MobileFlowHeader from '../../../components/mobile/MobileFlowHeader';
import RobotMark from '../../../components/mobile/RobotMark';
import {
  BUDGET_CAP,
  formatMoney,
  getSelectedCreators,
  simulateNegotiation,
  useCampaignDraft,
  type Creator,
  type DealStatus,
  type NegotiationParams,
  type Stance,
} from '../campaignDraft';
import { CREATOR_PHOTOS, creatorDisplayName, creatorInitials, unsplashPhoto } from './creatorPhotos';
import './negotiation-mobile.css';

const STANCES: { value: Stance; title: string; detail: string }[] = [
  { value: 'firm', title: 'Firm', detail: 'Fewer concessions' },
  { value: 'balanced', title: 'Balanced', detail: 'Savings + fit' },
  { value: 'flexible', title: 'Flexible', detail: 'Room for top fit' },
];

const TIMELINES = [3, 5, 7, 10, 14, 21, 30];

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const compact = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : `₹${Math.round(n / 1000)}K`;

const STATUS_NOTE: Record<DealStatus, string | null> = {
  'within-guardrails': null,
  'approval-required': 'Needs approval',
  'over-cap': 'Capped at your limit',
};

function findIssues(p: NegotiationParams, creatorCount: number): string[] {
  return [
    p.totalBudget < 1 ? 'Enter a campaign budget greater than zero.' : '',
    p.totalBudget > BUDGET_CAP ? `The approved campaign cap is ${formatMoney(BUDGET_CAP)}.` : '',
    p.maxPerCreator < 1 ? 'Enter a per-creator cap greater than zero.' : '',
    p.maxPerCreator > p.totalBudget ? 'The per-creator cap cannot exceed the campaign budget.' : '',
    p.approvalThreshold < 1 ? 'Enter a manual approval threshold greater than zero.' : '',
    p.targetDiscount < 0 || p.targetDiscount > 40 ? 'Set a target discount between 0% and 40%.' : '',
    p.deliverables < 1 || p.deliverables > 20 ? 'Choose between 1 and 20 deliverables.' : '',
    p.turnaroundDays < 1 || p.turnaroundDays > 90 ? 'Choose a turnaround between 1 and 90 days.' : '',
    creatorCount === 0 ? 'Select at least one creator before setting negotiation limits.' : '',
    !p.enabled ? 'Turn on AI draft offers to continue.' : '',
  ].filter(Boolean);
}

function CreatorAvatar({ creator }: { creator: Creator }) {
  const photo = CREATOR_PHOTOS[creator.id];
  if (photo) return <img className="mng-avatar" src={unsplashPhoto(photo, 96, 96)} alt="" />;
  return (
    <span className="mng-avatar mng-avatar--initials" aria-hidden="true">
      {creatorInitials(creator.name)}
    </span>
  );
}

function SettingRow({ Icon, label, value }: { Icon: LucideIcon; label: string; value: ReactNode }) {
  return (
    <li className="mng-setting">
      <span className="mng-setting__icon">
        <Icon size={16} strokeWidth={2.1} />
      </span>
      <span className="mng-setting__label">{label}</span>
      <span className="mng-setting__value">{value}</span>
    </li>
  );
}

interface MoneyFieldProps {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
}

function MoneyField({ label, hint, value, onChange }: MoneyFieldProps) {
  return (
    <label className="mng-field">
      <span className="mng-field__label">{label}</span>
      <span className="mng-money">
        <b aria-hidden="true">₹</b>
        <input
          type="text"
          inputMode="numeric"
          value={value ? value.toLocaleString('en-IN') : ''}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
        />
      </span>
      <small>{hint}</small>
    </label>
  );
}

interface SettingsEditorProps {
  initial: NegotiationParams;
  creatorCount: number;
  onCancel: () => void;
  onSave: (p: NegotiationParams) => void;
}

/** Full-screen editor for the negotiation guardrails. */
function SettingsEditor({ initial, creatorCount, onCancel, onSave }: SettingsEditorProps) {
  const [p, setP] = useState<NegotiationParams>(initial);
  const [attempted, setAttempted] = useState(false);
  const issues = findIssues(p, creatorCount);
  const update = <K extends keyof NegotiationParams>(key: K, value: NegotiationParams[K]) =>
    setP((current) => ({ ...current, [key]: value }));

  const save = () => {
    setAttempted(true);
    if (issues.length === 0) onSave(p);
  };

  return (
    <div className="mng mng--edit">
      <MobileFlowHeader step={2} showSteps={false} showClose={false} onBack={onCancel} />

      <main className="mng-main">
        <h1 className="mng-edit__title">Negotiation settings</h1>
        <p className="mng-edit__sub">Decide what the AI can propose and when it needs your approval.</p>

        <section className="mng-block" aria-labelledby="mng-budget">
          <h2 id="mng-budget" className="mng-block__title">Budget guardrails</h2>
          <MoneyField label="Campaign budget" hint={`Approved cap ${inr(BUDGET_CAP)}`} value={p.totalBudget} onChange={(n) => update('totalBudget', n)} />
          <MoneyField label="Max per creator" hint="Hard limit for any one creator" value={p.maxPerCreator} onChange={(n) => update('maxPerCreator', n)} />
          <MoneyField label="Approval threshold" hint="Higher offers are flagged for you" value={p.approvalThreshold} onChange={(n) => update('approvalThreshold', n)} />
        </section>

        <section className="mng-block" aria-labelledby="mng-approach">
          <h2 id="mng-approach" className="mng-block__title">Negotiation approach</h2>
          <div className="mng-field">
            <span className="mng-field__label">
              Target discount <strong>{p.targetDiscount}%</strong>
            </span>
            <input
              className="mng-range"
              type="range"
              min={0}
              max={40}
              step={1}
              value={p.targetDiscount}
              aria-label="Target discount percentage"
              style={{ '--mng-fill': `${(p.targetDiscount / 40) * 100}%` } as CSSProperties}
              onChange={(e) => update('targetDiscount', Number(e.target.value))}
            />
            <small>A goal for draft offers, not a guaranteed saving.</small>
          </div>
          <div className="mng-field">
            <span className="mng-field__label">Negotiation style</span>
            <div className="mng-segment" role="radiogroup" aria-label="Negotiation style">
              {STANCES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={p.stance === s.value}
                  className={`mng-segment__opt${p.stance === s.value ? ' mng-segment__opt--on' : ''}`}
                  onClick={() => update('stance', s.value)}
                >
                  <strong>{s.title}</strong>
                  <small>{s.detail}</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mng-block" aria-labelledby="mng-terms">
          <h2 id="mng-terms" className="mng-block__title">Collaboration terms</h2>
          <div className="mng-field mng-field--row">
            <span className="mng-field__label">Content deliverables</span>
            <div className="mng-stepper">
              <button
                type="button"
                aria-label="Fewer deliverables"
                disabled={p.deliverables <= 1}
                onClick={() => update('deliverables', p.deliverables - 1)}
              >
                <Minus size={16} strokeWidth={2.4} />
              </button>
              <output aria-live="polite">{p.deliverables}</output>
              <button
                type="button"
                aria-label="More deliverables"
                disabled={p.deliverables >= 10}
                onClick={() => update('deliverables', p.deliverables + 1)}
              >
                <Plus size={16} strokeWidth={2.4} />
              </button>
            </div>
          </div>
          <div className="mng-field">
            <span className="mng-field__label">Delivery timeline (days after brief)</span>
            <div className="mng-chips" role="radiogroup" aria-label="Delivery timeline">
              {TIMELINES.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={p.turnaroundDays === d}
                  className={`mng-chip${p.turnaroundDays === d ? ' mng-chip--on' : ''}`}
                  onClick={() => update('turnaroundDays', d)}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={p.usageRights}
            className="mng-switch-row"
            onClick={() => update('usageRights', !p.usageRights)}
          >
            <span>
              <strong>Paid usage rights</strong>
              <small>Creators can accept or counter usage terms.</small>
            </span>
            <span className={`mng-switch${p.usageRights ? ' mng-switch--on' : ''}`} aria-hidden="true" />
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={p.enabled}
            className="mng-switch-row"
            onClick={() => update('enabled', !p.enabled)}
          >
            <span>
              <strong>AI draft offers</strong>
              <small>You still approve every offer before it is sent.</small>
            </span>
            <span className={`mng-switch${p.enabled ? ' mng-switch--on' : ''}`} aria-hidden="true" />
          </button>
        </section>

        {attempted && issues.length > 0 && (
          <div className="mng-errors" role="alert">
            <strong>Please fix these before saving:</strong>
            <ul>
              {issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="mng-footer">
        <button type="button" className="mng-primary" onClick={save}>
          Save settings
        </button>
      </footer>
    </div>
  );
}

export default function NegotiationParametersPageMobile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const { draft, setNegotiation } = useCampaignDraft();
  const [sending, setSending] = useState(false);

  const settings = draft.negotiation;
  const creators = useMemo(() => getSelectedCreators(draft), [draft]);
  const deals = useMemo(() => simulateNegotiation(creators, settings), [creators, settings]);
  const total = deals.reduce((sum, d) => sum + d.agreed, 0);
  const issues = findIssues(settings, creators.length);
  const withinBudget = total <= settings.totalBudget;
  const needsApproval = deals.some((d) => d.status === 'approval-required');

  const pushedFromPreview = (location.state as { fromPreview?: boolean } | null)?.fromPreview === true;
  const openEditor = () => setParams({ view: 'edit' }, { state: { fromPreview: true } });
  const closeEditor = () => (pushedFromPreview ? navigate(-1) : setParams({}, { replace: true }));

  if (params.get('view') === 'edit') {
    return (
      <SettingsEditor
        initial={settings}
        creatorCount={creators.length}
        onCancel={closeEditor}
        onSave={(next) => {
          setNegotiation(next);
          closeEditor();
        }}
      />
    );
  }

  const stanceLabel = STANCES.find((s) => s.value === settings.stance)?.title ?? settings.stance;

  return (
    <div className="mng">
      <MobileFlowHeader step={2} showClose={false} onBack={() => navigate('/business/campaigns/creators')} />

      <main className="mng-main">
        <section className="mng-preview" aria-labelledby="mng-preview-title">
          <div className="mng-hero">
            <span className="mng-hero__chip">
              <span className="mng-hero__chip-icon">
                <Sparkles size={13} strokeWidth={2.4} />
              </span>
              AI Negotiation Preview
            </span>
            <h1 id="mng-preview-title" className="mng-hero__title">
              AI will create personalized offers for {creators.length} creator{creators.length === 1 ? '' : 's'}
            </h1>
            <p className="mng-hero__sub">Based on your budget and preferences, here’s what the offers may look like.</p>
            <span className="mng-hero__robot" aria-hidden="true">
              <RobotMark size={92} />
            </span>
            <Sparkles className="mng-hero__spark mng-hero__spark--a" size={18} aria-hidden="true" />
            <Sparkles className="mng-hero__spark mng-hero__spark--b" size={12} aria-hidden="true" />
          </div>

          {deals.length > 0 ? (
            <ul className="mng-offers">
              {deals.map(({ creator, ask, agreed, status }) => (
                <li key={creator.id} className="mng-offer">
                  <CreatorAvatar creator={creator} />
                  <span className="mng-offer__id">
                    <strong>{creatorDisplayName(creator.name)}</strong>
                    <small>{creator.handle}</small>
                    {STATUS_NOTE[status] && <em className="mng-offer__note">{STATUS_NOTE[status]}</em>}
                  </span>
                  <span className={`mng-tier mng-tier--${creator.tier.toLowerCase()}`}>{creator.tier}</span>
                  <span className="mng-offer__price">
                    <strong>~ {compact(agreed)}</strong>
                    {agreed < ask && <s>{compact(ask)}</s>}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mng-offers mng-offers--empty">No creators selected yet.</p>
          )}
        </section>

        <div className="mng-total" role="status">
          <Zap size={20} strokeWidth={2} className="mng-total__icon" aria-hidden="true" />
          <span className="mng-total__text">
            Estimated total: <strong>~ {compact(total)}</strong>
          </span>
          {withinBudget ? (
            <span className={`mng-pill ${needsApproval ? 'mng-pill--amber' : 'mng-pill--green'}`}>
              {needsApproval ? <TriangleAlert size={13} strokeWidth={2.4} /> : <CircleCheck size={14} strokeWidth={2.4} />}
              {needsApproval ? 'Needs approval' : 'Within budget'}
            </span>
          ) : (
            <span className="mng-pill mng-pill--red">
              <TriangleAlert size={13} strokeWidth={2.4} />
              Over budget
            </span>
          )}
        </div>

        <div className="mng-note">
          <span className="mng-note__icon">
            <ShieldCheck size={20} strokeWidth={2} />
          </span>
          <div>
            <strong>You’re in control</strong>
            <p>You can review, edit or negotiate each offer before sending. Nothing will be sent without your approval.</p>
          </div>
        </div>

        <section className="mng-settings" aria-labelledby="mng-settings-title">
          <div className="mng-settings__head">
            <h2 id="mng-settings-title">Selected settings</h2>
            <button type="button" className="mng-edit" onClick={openEditor}>
              <Pencil size={14} strokeWidth={2.2} />
              Edit
            </button>
          </div>
          <ul>
            <SettingRow Icon={Wallet} label="Campaign budget" value={inr(settings.totalBudget)} />
            <SettingRow Icon={UserRound} label="Max per creator" value={inr(settings.maxPerCreator)} />
            <SettingRow Icon={ClipboardCheck} label="Approval threshold" value={inr(settings.approvalThreshold)} />
            <SettingRow Icon={Percent} label="Target discount" value={`${settings.targetDiscount}%`} />
            <SettingRow Icon={SlidersHorizontal} label="Negotiation style" value={stanceLabel} />
            <SettingRow
              Icon={FileText}
              label="Content deliverables"
              value={`${settings.deliverables} piece${settings.deliverables === 1 ? '' : 's'}`}
            />
            <SettingRow Icon={CalendarDays} label="Delivery timeline" value={`${settings.turnaroundDays} days after brief`} />
            <SettingRow Icon={Copyright} label="Paid usage rights" value={settings.usageRights ? 'Enabled' : 'Off'} />
          </ul>

          <div className="mng-tip">
            <Lightbulb size={22} strokeWidth={1.8} className="mng-tip__icon" aria-hidden="true" />
            <div>
              <strong>Tip</strong>
              <p>You can adjust these settings anytime before sending the offers.</p>
            </div>
          </div>
        </section>

        {issues.length > 0 && (
          <div className="mng-errors" role="alert">
            <strong>Fix these settings to continue:</strong>
            <ul>
              {issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="mng-footer">
        <button
          type="button"
          className="mng-primary"
          disabled={issues.length > 0 || sending}
          onClick={() => setSending(true)}
        >
          Continue to review offers
          <ArrowRight size={18} strokeWidth={2.2} />
        </button>
      </footer>

      {sending && <SendingRequestOverlay onDone={() => navigate('/business/campaigns/negotiate')} />}
    </div>
  );
}
