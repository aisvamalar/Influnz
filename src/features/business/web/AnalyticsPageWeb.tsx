/**
 * Screen 16 — Performance Intelligence (Analytics)
 * Post-campaign reporting, creator performance, optimization recommendations
 */
import { useState } from 'react';
import BusinessLayout from './BusinessLayout';

const CREATOR_PERF = [
  { name: 'Foodie Tamilan', reach: '2.1L', views: '1.84L', engagements: '180K', enquiries: '310', spend: '₹10,000', cac: '₹32', perf: 94 },
  { name: 'Chennai Bites',  reach: '380K', views: '310K',  engagements: '38K',  enquiries: '142', spend: '₹11,500', cac: '₹81', perf: 78 },
  { name: 'Madras Food Trail', reach: '62K', views: '48K', engagements: '12K', enquiries: '88', spend: '₹6,200', cac: '₹70', perf: 82 },
];

const TREND = [
  { label: '1 Sep', views: 0 },
  { label: '8 Sep', views: 12000 },
  { label: '15 Sep', views: 58000 },
  { label: '22 Sep', views: 145000 },
  { label: '30 Sep', views: 184000 },
];

const AI_OPTS = [
  { icon: '📈', rec: 'Foodie Tamilan is driving 3× more enquiries per rupee spent. Consider allocating ₹8,000 more for Phase 2.' },
  { icon: '⚡', rec: 'Chennai Bites engagement rate dropped after Day 3. Content cadence may need review.' },
  { icon: '🎯', rec: 'Overall CAC of ₹52 is below the ₹80 target. Campaign is performing above expectations.' },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('This campaign');

  return (
    <BusinessLayout breadcrumb="Analytics">
      <div className="biz-page-head">
        <div>
          <h1 className="biz-page-head__title">Performance Analytics</h1>
          <p className="biz-page-head__sub">1 Sep – 30 Sep 2026 · Chennai Café Launch</p>
        </div>
        <div className="biz-page-head__actions">
          {['This campaign', 'All campaigns'].map(p => (
            <button key={p} className={`biz-chip${period === p ? ' biz-chip--active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="biz-kpi-grid">
        {[
          { label: 'Total views', value: '2.8M', delta: '+12%', dir: 'up' },
          { label: 'Engagements', value: '180K', delta: '+95%', dir: 'up' },
          { label: 'Enquiries', value: '302', delta: '+140%', dir: 'up' },
          { label: 'Story visits', value: '110', delta: '+145%', dir: 'up' },
          { label: 'Total spend', value: '₹27,700', delta: '', dir: '' },
          { label: 'Avg. CAC', value: '₹52', delta: '↓35%', dir: 'up' },
        ].map(k => (
          <div key={k.label} className="biz-kpi">
            <span className="biz-kpi__label">{k.label}</span>
            <span className="biz-kpi__value">{k.value}</span>
            {k.delta && <span className={`biz-kpi__delta biz-kpi__delta--${k.dir}`}>{k.delta}</span>}
          </div>
        ))}
      </div>

      {/* Trend chart (CSS-only sparkline) */}
      <div className="biz-card" style={{ marginBottom: 16 }}>
        <div className="biz-card__head">
          <p className="biz-card__title">Views Over Time</p>
          <span style={{ fontSize: '0.8125rem', color: 'var(--in-gray-light)' }}>Performance data from connected platforms</span>
        </div>
        <div style={{ position: 'relative', height: 140, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '0 8px' }}>
          {TREND.map((t, i) => {
            const max = Math.max(...TREND.map(x => x.views));
            const h = max > 0 ? (t.views / max) * 110 : 4;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%', borderRadius: '6px 6px 0 0',
                  height: h,
                  background: i === TREND.length - 1
                    ? 'linear-gradient(180deg, var(--in-coral), var(--in-coral-dark))'
                    : 'rgba(242,132,107,0.25)',
                  transition: 'height 0.6s ease',
                  position: 'relative',
                }}>
                  {h > 20 && (
                    <span style={{
                      position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                      fontSize: '0.625rem', fontWeight: 700, color: 'var(--in-charcoal)', whiteSpace: 'nowrap',
                    }}>
                      {t.views > 0 ? `${(t.views/1000).toFixed(0)}K` : ''}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--in-gray-light)', fontWeight: 600 }}>{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Creator performance — mobile cards + desktop table */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ padding: '0 0 12px' }}>
          <p className="biz-card__title">Creator Performance</p>
          <p className="biz-card__sub">Individual creator contributions</p>
        </div>

        {/* Mobile cards */}
        <div className="biz-cardlist">
          {CREATOR_PERF.map(c => (
            <div key={c.name} className="biz-cardlist-item">
              <div className="biz-cardlist-item__row">
                <div className="biz-creator-chip">
                  <div className="biz-creator-chip__avatar">{c.name[0]}</div>
                  <span className="biz-creator-chip__name">{c.name}</span>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: '50%',
                  background: `${c.perf >= 90 ? 'var(--in-success)' : 'var(--in-warn)'}15`,
                  border: `2px solid ${c.perf >= 90 ? 'var(--in-success)' : 'var(--in-warn)'}`,
                  fontWeight: 800, fontSize: '0.8125rem',
                  color: c.perf >= 90 ? 'var(--in-success)' : 'var(--in-warn)',
                }}>
                  {c.perf}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                {[['Reach', c.reach], ['Views', c.views], ['Engaged', c.engagements], ['Enquiries', c.enquiries], ['Spend', c.spend], ['CAC', c.cac]].map(([l, v]) => (
                  <div key={l as string}>
                    <p style={{ margin: 0, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--in-gray-light)' }}>{l}</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: l === 'CAC' ? 'var(--in-success)' : 'var(--in-charcoal)' }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="biz-card biz-table-desktop" style={{ padding: 0 }}>
          <div className="biz-table-wrap" style={{ borderRadius: 18, border: 'none' }}>
            <table className="biz-table">
              <thead>
                <tr><th>Creator</th><th>Reach</th><th>Views</th><th>Engagements</th><th>Enquiries</th><th>Spend</th><th>CAC</th><th>Score</th></tr>
              </thead>
              <tbody>
                {CREATOR_PERF.map(c => (
                  <tr key={c.name}>
                    <td>
                      <div className="biz-creator-chip">
                        <div className="biz-creator-chip__avatar">{c.name[0]}</div>
                        <span className="biz-creator-chip__name">{c.name}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.reach}</td>
                    <td style={{ fontWeight: 600 }}>{c.views}</td>
                    <td style={{ fontWeight: 600 }}>{c.engagements}</td>
                    <td style={{ fontWeight: 600 }}>{c.enquiries}</td>
                    <td style={{ fontWeight: 600 }}>{c.spend}</td>
                    <td style={{ fontWeight: 700, color: 'var(--in-success)' }}>{c.cac}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 36, height: 36, borderRadius: '50%',
                        background: `${c.perf >= 90 ? 'var(--in-success)' : 'var(--in-warn)'}15`,
                        border: `2px solid ${c.perf >= 90 ? 'var(--in-success)' : 'var(--in-warn)'}`,
                        fontWeight: 800, fontSize: '0.8125rem',
                        color: c.perf >= 90 ? 'var(--in-success)' : 'var(--in-warn)',
                      }}>
                        {c.perf}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Optimization recommendations */}
      <div className="biz-card">
        <div className="biz-card__head">
          <p className="biz-card__title">AI Optimization Recommendations</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)' }}>Based on campaign performance</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AI_OPTS.map((o, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '14px 16px', borderRadius: 12,
              background: 'rgba(242,132,107,0.04)', border: '1px solid rgba(242,132,107,0.12)',
            }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{o.icon}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--in-charcoal)', lineHeight: 1.55 }}>{o.rec}</span>
              <button className="biz-btn biz-btn--ghost" style={{ height: 30, fontSize: '0.75rem', flexShrink: 0, marginLeft: 'auto' }}>
                Apply
              </button>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', marginTop: 14 }}>
          ⚠️ Missing or incomplete analytics are labeled as such. Optimization changes require your approval unless automation is enabled.
        </p>
      </div>
    </BusinessLayout>
  );
}
