/**
 * Notifications Page — Business side
 */
import BusinessLayout from './BusinessLayout';

const NOTIFS = [
  { icon: '🎥', title: 'Content submitted', body: 'Foodie Tamilan submitted 1 Reel + 2 Stories for Chennai Café Launch.', time: '10 min ago', unread: true },
  { icon: '💬', title: 'Counter offer received', body: 'Chennai Bites countered at ₹14,500. AI is negotiating within your ₹12,000 limit.', time: '1 hr ago', unread: true },
  { icon: '✅', title: 'Creator accepted', body: 'Foodie Tamilan accepted the invitation at ₹10,000.', time: '3 hrs ago', unread: true },
  { icon: '🔄', title: 'Replacement ready', body: 'Local Food Guide declined. 2 replacement creators available for review.', time: '4 hrs ago', unread: false },
  { icon: '📊', title: 'Performance update', body: 'Chennai Café Launch has exceeded the engagement target. See optimization suggestions.', time: 'Yesterday', unread: false },
  { icon: '🤖', title: 'AI recommendation', body: 'Consider reallocating ₹8,000 to Foodie Tamilan based on their current ROI.', time: 'Yesterday', unread: false },
];

export default function NotificationsPage() {
  return (
    <BusinessLayout breadcrumb="Notifications">
      <div className="biz-page-head">
        <div>
          <h1 className="biz-page-head__title">Notifications</h1>
          <p className="biz-page-head__sub">3 unread notifications</p>
        </div>
        <button className="biz-btn biz-btn--ghost">Mark all read</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 720 }}>
        {NOTIFS.map((n, i) => (
          <div
            key={i}
            style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '14px 18px', borderRadius: 14,
              background: n.unread ? 'rgba(242,132,107,0.04)' : 'white',
              border: `1px solid ${n.unread ? 'rgba(242,132,107,0.2)' : 'var(--in-border)'}`,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(242,132,107,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = n.unread ? 'rgba(242,132,107,0.04)' : 'white')}
          >
            <span style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'rgba(242,132,107,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.125rem',
            }}>
              {n.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <p style={{ margin: 0, fontWeight: n.unread ? 700 : 600, color: 'var(--in-charcoal)', fontSize: '0.9375rem' }}>{n.title}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--in-gray-light)', flexShrink: 0 }}>{n.time}</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--in-gray)', lineHeight: 1.55 }}>{n.body}</p>
            </div>
            {n.unread && (
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--in-coral)', flexShrink: 0, marginTop: 6 }}/>
            )}
          </div>
        ))}
      </div>
    </BusinessLayout>
  );
}
