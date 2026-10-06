/**
 * Screen 10 — Negotiation Guardrails
 * Business defines limits before AI negotiates with creators
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

export default function GuardrailsPage() {
  const navigate = useNavigate();
  const [totalBudget, setTotalBudget]         = useState('150000');
  const [maxPerCreator, setMaxPerCreator]      = useState('20000');
  const [minScore, setMinScore]               = useState('80');
  const [minAudience, setMinAudience]         = useState('70');
  const [approvalThreshold, setApprovalThreshold] = useState('15000');
  const [autoNegotiate, setAutoNegotiate]     = useState(true);

  const CATEGORIES = ['Food', 'Lifestyle', 'Fashion', 'Travel', 'Tech', 'Gaming'];
  const [allowed, setAllowed] = useState(['Food', 'Lifestyle']);

  const toggleCat = (cat: string) => {
    setAllowed(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  return (
    <BusinessLayout breadcrumb="Negotiation Guardrails">
      <div className="biz-page-head">
        <div>
          <h1 className="biz-page-head__title">Set Negotiation Guardrails</h1>
          <p className="biz-page-head__sub">Define limits the AI must stay within. Every action beyond these limits requires your approval.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16, maxWidth: 760 }}>

        {/* Budget limits */}
        <div className="biz-card">
          <p className="biz-card__title" style={{ marginBottom: 4 }}>💰 Budget Controls</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', marginBottom: 18 }}>These limits can never be exceeded by the AI without your explicit approval.</p>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {[
              { label: 'Total campaign budget (₹)', value: totalBudget, set: setTotalBudget, help: 'Maximum authorized campaign spend' },
              { label: 'Maximum price per creator (₹)', value: maxPerCreator, set: setMaxPerCreator, help: 'AI will not agree above this per creator' },
              { label: 'Manual approval threshold (₹)', value: approvalThreshold, set: setApprovalThreshold, help: 'Deals above this always need your OK' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-charcoal)', marginBottom: 5 }}>
                  {f.label}
                </label>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: '1.5px solid rgba(242,132,107,0.2)', borderRadius: 10,
                  background: '#fafafa', overflow: 'hidden',
                }}>
                  <span style={{ padding: '0 12px', fontWeight: 700, color: 'var(--in-gray)', borderRight: '1px solid rgba(242,132,107,0.15)', height: 44, display: 'flex', alignItems: 'center' }}>₹</span>
                  <input
                    type="number"
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    style={{ flex: 1, height: 44, padding: '0 12px', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: '0.9375rem', color: 'var(--in-charcoal)', outline: 'none' }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', marginTop: 4 }}>{f.help}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality thresholds */}
        <div className="biz-card">
          <p className="biz-card__title" style={{ marginBottom: 4 }}>🎯 Quality Thresholds</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', marginBottom: 18 }}>Minimum standards creators must meet to be considered.</p>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {[
              { label: 'Minimum creator score', value: minScore, set: setMinScore, suffix: '/ 100', help: 'AI will not invite below this score' },
              { label: 'Minimum audience match', value: minAudience, set: setMinAudience, suffix: '%', help: 'Minimum geographic/demographic match' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-charcoal)', marginBottom: 5 }}>
                  {f.label}
                </label>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: '1.5px solid rgba(242,132,107,0.2)', borderRadius: 10,
                  background: '#fafafa',
                }}>
                  <input
                    type="number"
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    style={{ flex: 1, height: 44, padding: '0 12px', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: '0.9375rem', color: 'var(--in-charcoal)', outline: 'none' }}
                    min={0} max={100}
                  />
                  <span style={{ padding: '0 12px', color: 'var(--in-gray)', fontWeight: 600, whiteSpace: 'nowrap' }}>{f.suffix}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', marginTop: 4 }}>{f.help}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Allowed categories */}
        <div className="biz-card">
          <p className="biz-card__title" style={{ marginBottom: 4 }}>🏷️ Allowed Categories</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', marginBottom: 14 }}>Only creators in these categories will be considered.</p>
          <div className="biz-chips">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`biz-chip${allowed.includes(cat) ? ' biz-chip--active' : ''}`}
                onClick={() => toggleCat(cat)}
              >
                {allowed.includes(cat) ? '✓ ' : ''}{cat}
              </button>
            ))}
          </div>
        </div>

        {/* AI negotiation */}
        <div className="biz-card">
          <p className="biz-card__title" style={{ marginBottom: 4 }}>🤖 AI Negotiation</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--in-gray)', marginBottom: 16 }}>Control how the AI handles creator counteroffers within your guardrails.</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoNegotiate}
              onChange={e => setAutoNegotiate(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--in-coral)' }}
            />
            <div>
              <p style={{ fontWeight: 700, color: 'var(--in-charcoal)', margin: 0, fontSize: '0.9375rem' }}>Enable AI negotiation</p>
              <p style={{ color: 'var(--in-gray)', margin: 0, fontSize: '0.8125rem' }}>AI will respond to counteroffers within your budget limits. Every action is logged and auditable.</p>
            </div>
          </label>
          {autoNegotiate && (
            <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 12, background: 'rgba(242,132,107,0.05)', border: '1px solid rgba(242,132,107,0.15)', fontSize: '0.8125rem', color: 'var(--in-charcoal)', lineHeight: 1.55 }}>
              ⚠️ The AI will never exceed ₹{parseInt(maxPerCreator).toLocaleString('en-IN')} per creator or the ₹{parseInt(totalBudget).toLocaleString('en-IN')} total budget. Any deal above ₹{parseInt(approvalThreshold).toLocaleString('en-IN')} will be paused for your approval.
            </div>
          )}
        </div>

        {/* Guardrail summary */}
        <div style={{ padding: '16px 20px', borderRadius: 16, background: 'var(--in-cream)', border: '1px solid var(--in-border)' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-charcoal)', marginBottom: 8 }}>Guardrail Summary</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
            {[
              `Total budget: ₹${parseInt(totalBudget).toLocaleString('en-IN')}`,
              `Max per creator: ₹${parseInt(maxPerCreator).toLocaleString('en-IN')}`,
              `Min score: ${minScore}`,
              `Min audience: ${minAudience}%`,
              `Manual approval above: ₹${parseInt(approvalThreshold).toLocaleString('en-IN')}`,
              `AI negotiation: ${autoNegotiate ? 'On' : 'Off'}`,
              `Allowed: ${allowed.join(', ')}`,
            ].map(s => (
              <span key={s} style={{ fontSize: '0.8125rem', color: 'var(--in-gray)' }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="biz-btn biz-btn--ghost" onClick={() => navigate(-1)}>← Back</button>
          <button className="biz-btn biz-btn--primary biz-btn--lg" onClick={() => navigate('/business/campaigns/invitations')}>
            Confirm & Send Invitations →
          </button>
        </div>
      </div>
    </BusinessLayout>
  );
}
