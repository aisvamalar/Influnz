import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';
import CampaignStepper from './CampaignStepper';
import {
  BUDGET_CAP,
  DEFAULT_NEGOTIATION,
  STRATEGY_META,
  formatMoney,
  getSelectedCreators,
  saveCampaignDraft,
  useCampaignDraft,
  type NegotiationParams,
  type Stance,
} from './campaignDraft';
import './negotiation.css';

const STANCES: { value: Stance; title: string; detail: string }[] = [
  { value: 'firm', title: 'Firm', detail: 'Prioritize your target price; fewer concessions.' },
  { value: 'balanced', title: 'Balanced', detail: 'Balance savings with creator fit and deliverables.' },
  { value: 'flexible', title: 'Flexible', detail: 'Allow more room when creator fit is exceptional.' },
];

const formatInput = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function NegotiationParametersPage() {
  const navigate = useNavigate();
  const { draft, setNegotiation } = useCampaignDraft();
  const [params, setParams] = useState<NegotiationParams>(draft.negotiation ?? DEFAULT_NEGOTIATION);
  const [attempted, setAttempted] = useState(false);
  const creators = useMemo(() => getSelectedCreators(draft), [draft]);
  const expectedSpend = creators.reduce((sum, creator) => sum + creator.rate, 0);

  const issues = [
    params.totalBudget < 1 ? 'Enter a campaign budget greater than zero.' : '',
    params.totalBudget > BUDGET_CAP ? `The approved campaign cap is ${formatMoney(BUDGET_CAP)}.` : '',
    params.maxPerCreator < 1 ? 'Enter a per-creator cap greater than zero.' : '',
    params.maxPerCreator > params.totalBudget ? 'The per-creator cap cannot exceed the campaign budget.' : '',
    params.approvalThreshold < 1 ? 'Enter a manual approval threshold greater than zero.' : '',
    params.targetDiscount < 0 || params.targetDiscount > 40 ? 'Set a target discount between 0% and 40%.' : '',
    params.deliverables < 1 || params.deliverables > 20 ? 'Choose between 1 and 20 deliverables.' : '',
    params.turnaroundDays < 1 || params.turnaroundDays > 90 ? 'Choose a turnaround between 1 and 90 days.' : '',
    creators.length === 0 ? 'Select at least one creator before setting negotiation limits.' : '',
  ].filter(Boolean);

  const update = <K extends keyof NegotiationParams>(key: K, value: NegotiationParams[K]) => {
    setParams(current => ({ ...current, [key]: value }));
  };

  const start = () => {
    setAttempted(true);
    if (issues.length > 0 || !params.enabled) return;
    const next = { ...draft, negotiation: params };
    saveCampaignDraft(next);
    setNegotiation(params);
    navigate('/business/campaigns/negotiate');
  };

  return (
    <BusinessLayout breadcrumb="Negotiation Parameters" flush>
      <div className="ng-page">
        <nav className="ng-crumb" aria-label="Breadcrumb">
          <Link to="/business/campaigns">Campaigns</Link>
          <span aria-hidden="true">›</span>
          <Link to="/business/campaigns/creators">New Campaign</Link>
          <span aria-hidden="true">›</span>
          <strong>Negotiation</strong>
        </nav>

        <CampaignStepper current={2} />

        <header className="ng-heading">
          <div>
            <p className="ng-eyebrow">Campaign setup · Step 3 of 6</p>
            <h1>Set your negotiation <em>parameters</em></h1>
            <p>Decide what the AI can propose, where it should ask for your approval, and how it should negotiate.</p>
          </div>
          <div className="ng-strategy">
            <span>Selected strategy</span>
            <strong>{STRATEGY_META[draft.strategy].name}</strong>
            <Link to="/business/campaigns/strategy">Change</Link>
          </div>
        </header>

        <div className="ng-summary" role="status">
          <span className="ng-summary__icon" aria-hidden="true">✦</span>
          <span><strong>{creators.length} selected creators</strong> · Current asking rates total {formatMoney(expectedSpend)} · Campaign cap {formatMoney(BUDGET_CAP)}</span>
        </div>

        <div className="ng-layout">
          <div className="ng-form">
            <section className="ng-card" aria-labelledby="ng-budget-title">
              <div className="ng-card__heading">
                <span className="ng-card__icon ng-card__icon--coral" aria-hidden="true">₹</span>
                <div>
                  <h2 id="ng-budget-title">Budget guardrails</h2>
                  <p>Offers are always constrained by your campaign's approved budget.</p>
                </div>
              </div>
              <div className="ng-fields ng-fields--3">
                <label className="ng-field">
                  <span>Total campaign budget</span>
                  <span className="ng-money"><b>₹</b><input type="number" min="1" max={BUDGET_CAP} step="1000" value={params.totalBudget} onChange={e => update('totalBudget', formatInput(e.target.value, 0))} /></span>
                  <small>Maximum approved spend</small>
                </label>
                <label className="ng-field">
                  <span>Maximum per creator</span>
                  <span className="ng-money"><b>₹</b><input type="number" min="1" max={params.totalBudget} step="500" value={params.maxPerCreator} onChange={e => update('maxPerCreator', formatInput(e.target.value, 0))} /></span>
                  <small>Hard limit for any one creator</small>
                </label>
                <label className="ng-field">
                  <span>Approval required above</span>
                  <span className="ng-money"><b>₹</b><input type="number" min="1" step="500" value={params.approvalThreshold} onChange={e => update('approvalThreshold', formatInput(e.target.value, 0))} /></span>
                  <small>Higher offers are flagged for review</small>
                </label>
              </div>
            </section>

            <section className="ng-card" aria-labelledby="ng-approach-title">
              <div className="ng-card__heading">
                <span className="ng-card__icon ng-card__icon--blue" aria-hidden="true">↔</span>
                <div>
                  <h2 id="ng-approach-title">Negotiation approach</h2>
                  <p>Set the target and the amount of flexibility the AI can use.</p>
                </div>
              </div>
              <label className="ng-field ng-discount">
                <span>Target discount</span>
                <span className="ng-range-value">{params.targetDiscount}%</span>
                <input type="range" min="0" max="40" step="1" value={params.targetDiscount} onChange={e => update('targetDiscount', Number(e.target.value))} aria-label="Target discount percentage" />
                <small>This is a goal for draft offers, not a guaranteed saving.</small>
              </label>
              <fieldset className="ng-stance">
                <legend>Negotiation style</legend>
                <div className="ng-stance__options">
                  {STANCES.map(stance => (
                    <label key={stance.value} className={`ng-stance__option${params.stance === stance.value ? ' ng-stance__option--selected' : ''}`}>
                      <input type="radio" name="stance" value={stance.value} checked={params.stance === stance.value} onChange={() => update('stance', stance.value)} />
                      <span className="ng-stance__radio" aria-hidden="true" />
                      <span><strong>{stance.title}</strong><small>{stance.detail}</small></span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </section>

            <section className="ng-card" aria-labelledby="ng-terms-title">
              <div className="ng-card__heading">
                <span className="ng-card__icon ng-card__icon--purple" aria-hidden="true">✓</span>
                <div>
                  <h2 id="ng-terms-title">Proposed collaboration terms</h2>
                  <p>These terms are included with each offer and can be reviewed before sending.</p>
                </div>
              </div>
              <div className="ng-fields ng-fields--2">
                <label className="ng-field">
                  <span>Content deliverables</span>
                  <span className="ng-select-wrap"><select value={params.deliverables} onChange={e => update('deliverables', Number(e.target.value))}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'piece' : 'pieces'} of content</option>)}</select></span>
                  <small>Final formats and platforms confirmed in contract.</small>
                </label>
                <label className="ng-field">
                  <span>Delivery timeline</span>
                  <span className="ng-select-wrap"><select value={params.turnaroundDays} onChange={e => update('turnaroundDays', Number(e.target.value))}>{[3, 5, 7, 10, 14, 21, 30].map(n => <option key={n} value={n}>{n} days after product / brief receipt</option>)}</select></span>
                  <small>Creator can counter this term.</small>
                </label>
              </div>
              <label className="ng-toggle">
                <input type="checkbox" checked={params.usageRights} onChange={e => update('usageRights', e.target.checked)} />
                <span className="ng-toggle__switch" aria-hidden="true" />
                <span><strong>Request paid usage rights</strong><small>Creators can accept or counter usage duration and channels.</small></span>
              </label>
            </section>

            <section className="ng-safety">
              <span aria-hidden="true">🛡️</span>
              <div><strong>Safe by design</strong><p>These settings create draft offers only. Nothing is sent, accepted, or paid until you review and explicitly approve it.</p></div>
            </section>
          </div>

          <aside className="ng-aside">
            <h2>AI negotiation</h2>
            <p>The AI prepares a draft offer for each selected creator and flags anything that needs your approval.</p>
            <label className="ng-enable">
              <input type="checkbox" checked={params.enabled} onChange={e => update('enabled', e.target.checked)} />
              <span className="ng-toggle__switch" aria-hidden="true" />
              <span><strong>Enable AI draft offers</strong><small>You stay in control of every offer.</small></span>
            </label>
            <div className="ng-aside__divider" />
            <h3>Your limits</h3>
            <dl>
              <div><dt>Campaign cap</dt><dd>{formatMoney(params.totalBudget)}</dd></div>
              <div><dt>Per-creator max</dt><dd>{formatMoney(params.maxPerCreator)}</dd></div>
              <div><dt>Approval threshold</dt><dd>{formatMoney(params.approvalThreshold)}</dd></div>
              <div><dt>Selected creators</dt><dd>{creators.length}</dd></div>
            </dl>
            <p className="ng-aside__disclaimer">Preview only · No creators are contacted from this demo.</p>
          </aside>
        </div>

        {attempted && issues.length > 0 && (
          <div className="ng-errors" role="alert">
            <strong>Please fix these items before continuing:</strong>
            <ul>{issues.map(issue => <li key={issue}>{issue}</li>)}</ul>
          </div>
        )}

        <footer className="ng-actions">
          <button type="button" className="ng-back" onClick={() => navigate('/business/campaigns/creators')}>← Back to creators</button>
          <button type="button" className="ng-start" disabled={!params.enabled} onClick={start}>
            Review negotiation preview <span aria-hidden="true">→</span>
          </button>
        </footer>
      </div>
    </BusinessLayout>
  );
}
