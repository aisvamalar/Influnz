/**
 * Screen 11 & 07 — Invitations Sent + Track Responses & Negotiation
 * Shows invitation status, creator responses, AI negotiation progress
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessLayout from './BusinessLayout';

type InvStatus = 'accepted' | 'negotiating' | 'declined' | 'pending' | 'viewed';

const INVITATIONS = [
  {
    id: 1, name: 'Foodie Tamilan', handle: '@foodietamilan',
    status: 'accepted' as InvStatus,
    offered: '₹10,000', response: '₹10,000', final: '₹10,000',
    note: 'Accepted at offered price.',
    aiHandled: false,
  },
  {
    id: 2, name: 'Chennai Bites', handle: '@chennaibites',
    status: 'negotiating' as InvStatus,
    offered: '₹10,000', response: '₹14,500', final: null,
    note: 'Countered at ₹14,500. AI is negotiating within ₹12,000 limit.',
    aiHandled: true,
  },
  {
    id: 3, name: 'Local Food Guide', handle: '@localfoodguide',
    status: 'declined' as InvStatus,
    offered: '₹18,000', response: '—', final: null,
    note: 'Creator declined. 2 replacement candidates ready.',
    aiHandled: false,
  },
  {
    id: 4, name: 'Madras Food Trail', handle: '@madrasfoodtrail',
    status: 'viewed' as InvStatus,
    offered: '₹6,200', response: '—', final: null,
    note: 'Invitation viewed. Awaiting response.',
    aiHandled: false,
  },
  {
    id: 5, name: 'Madrasi Eats', handle: '@madrasieats',
    status: 'pending' as InvStatus,
    offered: '₹7,500', response: '—', final: null,
    note: 'Invitation not yet viewed.',
    aiHandled: false,
  },
];

const STATUS_STYLE: Record<InvStatus, string> = {
  accepted: 'biz-pill--active',
  negotiating: 'biz-pill--pending',
  declined: 'biz-pill--danger',
  pending: 'biz-pill--paused',
  viewed: 'biz-pill--draft',
};

const STATUS_LABEL: Record<InvStatus, string> = {
  accepted: '✓ Accepted',
  negotiating: '⚡ Negotiating',
  declined: '✕ Declined',
  pending: '⏳ Pending',
  viewed: '👁 Viewed',
};

export default function InvitationsPage() {
  const navigate = useNavigate();
  const [showNegLog, setShowNegLog] = useState(false);
  const accepted = INVITATIONS.filter(i => i.status === 'accepted').length;
  const negotiating = INVITATIONS.filter(i => i.status === 'negotiating').length;
  const declined = INVITATIONS.filter(i => i.status === 'declined').length;

  return (
    <BusinessLayout breadcrumb="Invitation Status">
      <div className="biz-page-head">
        <div>
          <h1 className="biz-page-head__title">Invitation Status</h1>
          <p className="biz-page-head__sub">Tracking responses from 5 invited creators in real time.</p>
        </div>
        <div className="biz-page-head__actions">
          <button className="biz-btn biz-btn--ghost" onClick={() => navigate('/business/campaigns/creators')}>
            + Add creators
          </button>
        </div>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: `${accepted} Accepted`,    color: 'var(--in-success)' },
          { label: `${negotiating} Negotiating`, color: 'var(--in-warn)' },
          { label: `${declined} Declined`,    color: 'var(--in-danger)' },
          { label: `${INVITATIONS.length - accepted - negotiating - declined} Pending`, color: 'var(--in-gray)' },
        ].map(s => (
          <span key={s.label} style={{
            padding: '5px 14px', borderRadius: 20,
            background: `${s.color}14`, color: s.color,
            fontSize: '0.8125rem', fontWeight: 700, border: `1px solid ${s.color}30`,
          }}>
            {s.label}
          </span>
        ))}
      </div>

      {/* AI negotiation banner */}
      <div className="biz-ai-banner">
        <span className="biz-ai-banner__dot"/>
        <span className="biz-ai-banner__text">
          AI negotiating with <strong>Chennai Bites</strong> — counter ₹14,500, limit ₹12,000.
        </span>
        <div className="biz-ai-banner__actions">
          <button
            className="biz-btn biz-btn--ghost"
            style={{ height: 30, fontSize: '0.75rem' }}
            onClick={() => setShowNegLog(v => !v)}
          >
            {showNegLog ? 'Hide' : 'View'} log
          </button>
          <button className="biz-btn biz-btn--primary" style={{ height: 30, fontSize: '0.75rem' }}>
            Intervene
          </button>
        </div>
      </div>

      {/* Negotiation log */}
      {showNegLog && (
        <div className="biz-card" style={{ marginBottom: 16, fontFamily: 'inherit' }}>
          <p className="biz-card__title" style={{ marginBottom: 14 }}>Negotiation Log — Chennai Bites</p>
          {[
            { from: 'Business AI', msg: 'Invited at ₹10,000 for 1 Reel + 2 Stories.', time: '09:14 AM' },
            { from: 'Chennai Bites', msg: 'Countered at ₹14,500.', time: '10:02 AM' },
            { from: 'Business AI', msg: 'Responding — our limit is ₹12,000. Offering ₹11,500 with usage rights for 30 days.', time: '10:03 AM' },
          ].map((e, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, paddingBottom: 12, marginBottom: 12,
              borderBottom: i < 2 ? '1px solid var(--in-border)' : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: e.from === 'Business AI' ? 'linear-gradient(135deg, var(--in-coral), var(--in-coral-dark))' : 'var(--in-peach)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700,
                color: e.from === 'Business AI' ? 'white' : 'var(--in-coral-text)',
              }}>
                {e.from === 'Business AI' ? 'AI' : 'CB'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-charcoal)' }}>{e.from}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)' }}>{e.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--in-charcoal)', lineHeight: 1.5 }}>{e.msg}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Mobile card list (< 700px) ── */}
      <div className="biz-cardlist">
        {INVITATIONS.map(inv => (
          <div key={inv.id} className="biz-cardlist-item">
            <div className="biz-cardlist-item__row">
              <div className="biz-creator-chip">
                <div className="biz-creator-chip__avatar">{inv.name[0]}</div>
                <div>
                  <p className="biz-creator-chip__name">{inv.name}</p>
                  <p className="biz-creator-chip__handle">{inv.handle}</p>
                </div>
              </div>
              <span className={`biz-pill ${STATUS_STYLE[inv.status]}`}>
                {STATUS_LABEL[inv.status]}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: '0.8125rem', color: 'var(--in-gray)', flexWrap: 'wrap' }}>
              <span>Offered: <strong style={{ color: 'var(--in-charcoal)' }}>{inv.offered}</strong></span>
              {inv.response !== '—' && (
                <span>Response: <strong style={{ color: inv.status === 'negotiating' ? 'var(--in-warn)' : 'var(--in-charcoal)' }}>{inv.response}</strong></span>
              )}
              {inv.final && (
                <span>Final: <strong style={{ color: 'var(--in-success)' }}>{inv.final}</strong></span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', margin: 0 }}>{inv.note}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {inv.status === 'accepted' && (
                <button className="biz-btn biz-btn--primary" style={{ height: 34, fontSize: '0.8125rem', flex: 1 }} onClick={() => navigate('/business/campaigns/1/deal')}>
                  View deal →
                </button>
              )}
              {inv.status === 'declined' && (
                <button className="biz-btn biz-btn--ghost" style={{ height: 34, fontSize: '0.8125rem', flex: 1 }}>
                  Find replacements
                </button>
              )}
              {inv.status === 'negotiating' && (
                <button className="biz-btn biz-btn--ghost" style={{ height: 34, fontSize: '0.8125rem', flex: 1 }}>
                  Intervene
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table (≥ 700px) ── */}
      <div className="biz-card biz-table-desktop" style={{ padding: 0 }}>
        <div className="biz-table-wrap" style={{ borderRadius: 18 }}>
          <table className="biz-table">
            <thead>
              <tr>
                <th>Creator</th>
                <th>Status</th>
                <th>Offered</th>
                <th>Response</th>
                <th>Final</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {INVITATIONS.map(inv => (
                <tr key={inv.id}>
                  <td>
                    <div className="biz-creator-chip">
                      <div className="biz-creator-chip__avatar">{inv.name[0]}</div>
                      <div>
                        <p className="biz-creator-chip__name">{inv.name}</p>
                        <p className="biz-creator-chip__handle">{inv.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`biz-pill ${STATUS_STYLE[inv.status]}`}>{STATUS_LABEL[inv.status]}</span>
                    {inv.aiHandled && <span style={{ marginLeft: 6, fontSize: '0.625rem', background: 'rgba(242,132,107,0.1)', color: 'var(--in-coral-text)', borderRadius: 20, padding: '1px 6px', fontWeight: 700 }}>AI</span>}
                  </td>
                  <td style={{ fontWeight: 600 }}>{inv.offered}</td>
                  <td style={{ fontWeight: 600, color: inv.status === 'negotiating' ? 'var(--in-warn)' : undefined }}>{inv.response}</td>
                  <td style={{ fontWeight: 600, color: 'var(--in-success)' }}>{inv.final ?? '—'}</td>
                  <td style={{ maxWidth: 200, color: 'var(--in-gray)', fontSize: '0.8125rem', whiteSpace: 'normal' }}>{inv.note}</td>
                  <td>
                    {inv.status === 'accepted' && (
                      <button className="biz-btn biz-btn--primary" style={{ height: 30, fontSize: '0.75rem' }} onClick={() => navigate('/business/campaigns/1/deal')}>View deal</button>
                    )}
                    {inv.status === 'declined' && (
                      <button className="biz-btn biz-btn--ghost" style={{ height: 30, fontSize: '0.75rem' }}>Replacements</button>
                    )}
                    {inv.status === 'negotiating' && (
                      <button className="biz-btn biz-btn--ghost" style={{ height: 30, fontSize: '0.75rem' }}>Intervene</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BusinessLayout>
  );
}
