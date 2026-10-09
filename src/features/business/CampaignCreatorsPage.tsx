/**
 * Campaign setup, step 2 — review and confirm the creator portfolio
 * for the strategy chosen in step 1.
 */
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';
import CampaignStepper from './CampaignStepper';
import {
  BUDGET_CAP, CREATORS, STRATEGY_META, formatMoney, useCampaignDraft,
  type Creator,
} from './campaignDraft';
import './campaign-creators.css';

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const Icon = {
  wallet: <svg width="22" height="22" viewBox="0 0 22 22" {...stroke} aria-hidden="true"><rect x="3" y="5.500" width="16" height="12" rx="2.500" /><path d="M3 9h16M14 13.500h2.500" /></svg>,
  coins: <svg width="22" height="22" viewBox="0 0 22 22" {...stroke} aria-hidden="true"><ellipse cx="11" cy="5.500" rx="6.500" ry="2.500" /><path d="M4.500 5.500v5c0 1.400 2.900 2.500 6.500 2.500s6.500-1.100 6.500-2.500v-5M4.500 10.500v5c0 1.400 2.900 2.500 6.500 2.500s6.500-1.100 6.500-2.500v-5" /></svg>,
  users: <svg width="22" height="22" viewBox="0 0 22 22" {...stroke} aria-hidden="true"><circle cx="8.500" cy="8" r="3" /><path d="M2.500 18c0-3 2.700-5 6-5s6 2 6 5M15 5.500a3 3 0 010 5.500M17.500 13.500c1.300.8 2 2.100 2 3.500" /></svg>,
  target: <svg width="22" height="22" viewBox="0 0 22 22" {...stroke} aria-hidden="true"><circle cx="11" cy="11" r="7.500" /><circle cx="11" cy="11" r="4" /><circle cx="11" cy="11" r="1" fill="currentColor" /></svg>,
  audience: <svg width="18" height="18" viewBox="0 0 18 18" {...stroke} aria-hidden="true"><circle cx="7" cy="6.500" r="2.500" /><path d="M2 15c0-2.500 2.200-4 5-4s5 1.500 5 4M12.500 4.500a2.500 2.500 0 010 4.500M14.500 12c1 .6 1.500 1.700 1.500 3" /></svg>,
  play: <svg width="18" height="18" viewBox="0 0 18 18" {...stroke} aria-hidden="true"><rect x="2.500" y="3" width="13" height="12" rx="2.500" /><path d="M7.500 6.500v5l4-2.500-4-2.500z" /></svg>,
  bars: <svg width="18" height="18" viewBox="0 0 18 18" {...stroke} aria-hidden="true"><path d="M4 15V9.500M9 15V4M14 15v-4.500" /></svg>,
  pin: <svg width="18" height="18" viewBox="0 0 18 18" {...stroke} aria-hidden="true"><path d="M9 16s5-4.200 5-8.500a5 5 0 00-10 0C4 11.800 9 16 9 16z" /><circle cx="9" cy="7.500" r="1.800" /></svg>,
  swap: <svg width="16" height="16" viewBox="0 0 16 16" {...stroke} aria-hidden="true"><path d="M2.500 6.500A5.500 5.500 0 0112 4.300L13.500 6M13.500 2.500V6H10M13.500 9.500A5.500 5.500 0 014 11.700L2.500 10M2.500 13.500V10H6" /></svg>,
  external: <svg width="14" height="14" viewBox="0 0 14 14" {...stroke} aria-hidden="true"><path d="M8 2.500h3.500V6M11.500 2.500L6.500 7.500M10 8.500v2a1 1 0 01-1 1H3.500a1 1 0 01-1-1V5a1 1 0 011-1h2" /></svg>,
  check: <svg width="14" height="14" viewBox="0 0 14 14" {...stroke} strokeWidth={2} aria-hidden="true"><path d="M3 7.300l2.600 2.600L11 4.300" /></svg>,
  spark: <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1l1.500 3.800L12.500 6 8.500 7.400 7 11.500 5.500 7.400 1.500 6l4-1.200L7 1z" fill="#f59e0b" /></svg>,
  shield: <svg width="14" height="14" viewBox="0 0 14 14" {...stroke} strokeWidth={1.700} aria-hidden="true"><path d="M2.500 7.500l3 3 6-6.500" /></svg>,
};

function Stat({ icon, label, value, note, accent }: { icon: React.ReactNode; label: string; value: string; note: string; accent?: string }) {
  return (
    <div className="cc-stat">
      <span className="cc-stat__icon">{icon}</span>
      <div>
        <div className="cc-stat__label">{label}</div>
        <div className="cc-stat__value" style={accent ? { color: accent } : undefined}>{value}</div>
        <div className="cc-stat__note">{note}</div>
      </div>
    </div>
  );
}

function Avatar({ creator }: { creator: Creator }) {
  if (creator.avatar) return <img className="cc-avatar" src={creator.avatar} alt="" />;
  const initials = creator.name.split(/\s+/).slice(0, 2).map(w => w[0]).join('');
  return <span className="cc-avatar cc-avatar--fallback" aria-hidden="true">{initials}</span>;
}

function CreatorCard({ creator, selected, onToggle }: { creator: Creator; selected: boolean; onToggle: () => void }) {
  return (
    <article className={`cc-card${selected ? '' : ' cc-card--off'}`}>
      <header className="cc-card__head">
        <Avatar creator={creator} />
        <div className="cc-card__id">
          <h3>{creator.name}</h3>
          <p>{creator.handle}</p>
        </div>
        <span className={`cc-tier cc-tier--${creator.tier.toLowerCase()}`}>{creator.tier}</span>
        <label className="cc-check">
          <input type="checkbox" checked={selected} onChange={onToggle} aria-label={`${selected ? 'Deselect' : 'Select'} ${creator.name}`} />
          <span aria-hidden="true">{selected && Icon.check}</span>
        </label>
      </header>

      <dl className="cc-metrics">
        <div><span className="cc-metrics__icon">{Icon.audience}</span><dt>Audience</dt><dd>{creator.audience}</dd></div>
        <div><span className="cc-metrics__icon">{Icon.play}</span><dt>Avg Views</dt><dd>{creator.avgViews}</dd></div>
        <div><span className="cc-metrics__icon">{Icon.bars}</span><dt>Engagement</dt><dd className="cc-green">{creator.engagement}</dd></div>
        <div><span className="cc-metrics__icon">{Icon.pin}</span><dt>City</dt><dd>{creator.city}</dd></div>
      </dl>

      <div className="cc-fit">
        <div className="cc-fit__row">
          <span className="cc-fit__score">{Icon.spark} AI Campaign Fit: {creator.fit}/100</span>
          <span className="cc-fit__rel">{Icon.shield} {creator.reliability} Reliability</span>
        </div>
        <p>{creator.insight}</p>
      </div>

      <footer className="cc-card__actions">
        <Link className="cc-btn cc-btn--ghost" to={`/business/creators?creator=${encodeURIComponent(creator.id)}`}>
          View Profile {Icon.external}
        </Link>
        <button type="button" className={`cc-btn ${selected ? 'cc-btn--solid' : 'cc-btn--outline'}`} aria-pressed={selected} onClick={onToggle}>
          {selected ? <>{Icon.check} Selected</> : 'Select'}
        </button>
      </footer>
    </article>
  );
}

export default function CampaignCreatorsPage() {
  const navigate = useNavigate();
  const { draft, setCreatorSelected } = useCampaignDraft();
  const strategy = STRATEGY_META[draft.strategy];

  const removed = useMemo(() => new Set(draft.removed[draft.strategy] ?? []), [draft]);
  const portfolio = strategy.creatorIds.map(id => CREATORS[id]).filter(Boolean);
  const selected = portfolio.filter(c => !removed.has(c.id));

  const committed = selected.reduce((sum, c) => sum + c.rate, 0);
  const reserve = Math.max(BUDGET_CAP - committed, 0);
  const capUsed = Math.round((committed / BUDGET_CAP) * 100);
  const over = committed > BUDGET_CAP;

  return (
    <BusinessLayout breadcrumb="New Campaign" flush>
      <div className="cc-page">
        <nav className="cc-crumbs" aria-label="Breadcrumb">
          <Link to="/business/campaigns">Campaigns</Link>
          <span aria-hidden="true">›</span>
          <strong>New Campaign</strong>
        </nav>

        <CampaignStepper current={1} />

        <section className="cc-panel" aria-labelledby="cc-title">
          <div className="cc-panel__head">
            <div>
              <span className="cc-badge">Active Strategy</span>
              <h1 id="cc-title">{strategy.name}</h1>
              <p>{strategy.mix} <span aria-hidden="true">•</span> {strategy.tagline}</p>
            </div>
            <button type="button" className="cc-switch" onClick={() => navigate('/business/campaigns/strategy')}>
              {Icon.swap} Switch Strategy
            </button>
          </div>

          <div className="cc-stats">
            <Stat icon={Icon.wallet} label="Committed Creator Spend" value={formatMoney(committed)} note={`${capUsed}% of ${formatMoney(BUDGET_CAP)} cap`} accent={over ? '#dc2626' : '#16a34a'} />
            <Stat icon={Icon.coins} label="Campaign Reserve" value={formatMoney(reserve)} note="Available for negotiations" accent="#2b7fd6" />
            <Stat icon={Icon.users} label="Selected Creators" value={`${selected.length} of ${portfolio.length}`} note="Verified candidates" />
            <Stat icon={Icon.target} label="Target Audience Fit" value={`${strategy.audienceFit}/100`} note={strategy.audienceNote} accent="#7c4ddb" />
          </div>
          {over && <p className="cc-alert" role="alert">Committed spend exceeds your {formatMoney(BUDGET_CAP)} budget cap. Deselect a creator to continue.</p>}

          <div className="cc-section-head">
            <h2>Creator Candidates in Selected Portfolio</h2>
            <p>You can inspect Creator Passports, deselect or replace individual influencers.</p>
          </div>

          <div className="cc-grid">
            {portfolio.map(c => (
              <CreatorCard
                key={c.id}
                creator={c}
                selected={!removed.has(c.id)}
                onToggle={() => setCreatorSelected([c.id], removed.has(c.id))}
              />
            ))}
          </div>

          <div className="cc-footer">
            <button type="button" className="cc-btn cc-btn--outline" onClick={() => navigate('/business/campaigns/strategy')}>← Back</button>
            <button
              type="button"
              className="cc-btn cc-btn--solid cc-footer__next"
              disabled={selected.length === 0 || over}
              onClick={() => navigate('/business/campaigns/guardrails')}
            >
              Continue to negotiation →
            </button>
          </div>
        </section>
      </div>
    </BusinessLayout>
  );
}
