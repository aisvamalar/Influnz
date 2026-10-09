/**
 * BusinessLayout — matches the reference design image exactly
 * - White sidebar with logo + BUSINESS badge, nav items, promo card, sign-out, user chip
 * - Desktop header: breadcrumb, search bar, notification bell, profile chip
 * - Mobile: sticky header + bottom tab bar
 */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import Logo from '../../components/Logo';

interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="2" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="10" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="10" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  campaigns: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 9l3-5h6l3 5-3 5H6L3 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="9" cy="9" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  creators: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="6.5" cy="6" r="2.8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1.5 15c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12.5 4.5a2.5 2.5 0 010 4.5M14.5 15c0-1.6-.6-2.9-1.5-3.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 15V8.5M7.5 15V3.5M12 15v-4.5M16 15V6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  payments: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 8.5h14" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 11.5h2M8.5 11.5h1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  approvals: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 2.5h7.5L14.5 5.5V15a.9.9 0 01-.9.9H4.9A.9.9 0 014 15V3.4a.9.9 0 01.9-.9z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6.5 10l1.8 1.8L12 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  notifications: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2.5a4 4 0 00-4 4v2.6L3.8 11.4h10.4L13 9.1V6.5a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7.2 13.4a1.9 1.9 0 003.6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 2v1.8M9 14.2V16M2 9h1.8M14.2 9H16M4.1 4.1l1.3 1.3M12.6 12.6l1.3 1.3M13.9 4.1l-1.3 1.3M5.4 12.6l-1.3 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  signout: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 15H4a1 1 0 01-1-1V4a1 1 0 011-1h3M11 12.5l3.5-3.5L11 5.5M14.5 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  menu: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2.5 5h13M2.5 9h13M2.5 13h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2.5a4 4 0 00-4 4v2.6L3.8 11.4h10.4L13 9.1V6.5a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7.2 13.4a1.9 1.9 0 003.6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  chevronDown: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const PRIMARY_NAV: NavItem[] = [
  { key: 'dashboard',     label: 'Dashboard',     path: '/business',               icon: Icons.dashboard },
  { key: 'campaigns',     label: 'Campaigns',     path: '/business/campaigns',     icon: Icons.campaigns },
  { key: 'creators',      label: 'Creators',      path: '/business/creators',      icon: Icons.creators },
  { key: 'analytics',     label: 'Analytics',     path: '/business/analytics',     icon: Icons.analytics },
  { key: 'payments',      label: 'Payments',      path: '/business/payments',      icon: Icons.payments },
  { key: 'approvals',     label: 'Approvals',     path: '/business/approvals',     icon: Icons.approvals, badge: 3 },
  { key: 'notifications', label: 'Notifications', path: '/business/notifications', icon: Icons.notifications, badge: 5 },
  { key: 'settings',      label: 'Settings',      path: '/business/settings',      icon: Icons.settings },
];

const BOTTOM_NAV: NavItem[] = [
  { key: 'dashboard',  label: 'Home',      path: '/business',           icon: Icons.dashboard },
  { key: 'campaigns',  label: 'Campaigns', path: '/business/campaigns', icon: Icons.campaigns },
  { key: 'approvals',  label: 'Approvals', path: '/business/approvals', icon: Icons.approvals, badge: 3 },
  { key: 'analytics',  label: 'Analytics', path: '/business/analytics', icon: Icons.analytics },
  { key: 'payments',   label: 'Payments',  path: '/business/payments',  icon: Icons.payments },
];

export default function BusinessLayout({
  breadcrumb,
  children,
  flush = false,
}: {
  breadcrumb: string;
  children: React.ReactNode;
  flush?: boolean;
}) {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = state.user?.businessName ?? state.user?.email ?? 'Business';
  const initial = displayName.trim()[0]?.toUpperCase() ?? 'B';

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  const isActive = (item: NavItem) => {
    if (item.path === '/business') return location.pathname === '/business';
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // ── Sidebar JSX ──────────────────────────────────────────────────────────────
  const sidebar = (
    <aside
      style={{
        width: 260,
        height: '100dvh',
        background: '#fcf8f5',
        borderRight: '1px solid var(--in-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      aria-label="Business navigation"
    >
      {/* Brand */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '18px 16px 14px',
        borderBottom: '1px solid var(--in-border)',
      }}>
        <Logo size="sm" />
        <span style={{
          fontSize: '0.5625rem', fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: '#b94a33',
          background: 'rgba(242,132,107,0.12)',
          padding: '2px 7px', borderRadius: 4,
        }}>
          BUSINESS
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 10px 0' }} aria-label="Primary">
        {PRIMARY_NAV.map(item => {
          const active = isActive(item);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => { navigate(item.path); setDrawerOpen(false); }}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', height: 38,
                padding: '0 10px',
                borderRadius: 8,
                background: active ? 'rgba(242,132,107,0.13)' : 'none',
                border: 'none',
                color: active ? '#e0412a' : '#5b6472',
                fontWeight: active ? 700 : 500,
                fontSize: '0.875rem', fontFamily: 'inherit',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
                position: 'relative',
                marginBottom: 2,
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(242,132,107,0.06)'; e.currentTarget.style.color = '#2d2d2d'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#5b6472'; } }}
            >
              <span style={{ display: 'flex', color: active ? 'var(--in-coral)' : 'currentColor', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? (
                <span style={{
                  minWidth: 18, height: 18, padding: '0 5px',
                  borderRadius: 9, background: 'var(--in-coral)',
                  color: 'white', fontSize: '0.625rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Bottom: promo card + sign out + user chip */}
      <div style={{ padding: '10px 12px 12px', borderTop: '1px solid var(--in-border)' }}>
        {/* Promo card */}
        <div style={{
          background: 'linear-gradient(145deg, #fef3ed 0%, #fde8d8 100%)',
          border: '1px solid rgba(242,132,107,0.2)',
          borderRadius: 12, padding: '14px 14px 12px',
          marginBottom: 10, position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative house illustration */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 64, height: 64, opacity: 0.18,
            fontSize: '2.5rem', display: 'flex',
            alignItems: 'flex-start', justifyContent: 'flex-end',
            padding: '4px 4px 0 0',
          }}>🏠</div>
          <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--in-charcoal)', lineHeight: 1.3, margin: '0 0 4px', position: 'relative', zIndex: 1 }}>
            Grow with<br />Influencer Marketing
          </p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--in-gray)', lineHeight: 1.45, margin: '0 0 10px', position: 'relative', zIndex: 1 }}>
            Create campaigns, collaborate with creators and drive real results.
          </p>
          <button
            onClick={() => navigate('/business/campaigns/new')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 32, padding: '0 12px',
              background: 'var(--in-coral)', color: 'white',
              border: 'none', borderRadius: 8,
              fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer', transition: 'background 0.15s',
              position: 'relative', zIndex: 1,
            }}
          >
            Create campaign →
          </button>
        </div>

        {/* Sign out */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', height: 34, padding: '0 8px',
            background: 'none', border: 'none',
            color: '#6b6b6b', fontSize: '0.875rem', fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer', borderRadius: 8,
            transition: 'background 0.15s, color 0.15s',
            marginBottom: 6,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
        >
          <span style={{ display: 'flex', color: 'var(--in-gray-light)' }}>{Icons.signout}</span>
          Sign out
        </button>

        {/* User chip */}
        <button
          onClick={() => navigate('/business/settings')}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            width: '100%', padding: '8px 8px',
            background: 'rgba(242,132,107,0.06)',
            border: '1px solid var(--in-border)',
            borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
            textAlign: 'left', transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(242,132,107,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(242,132,107,0.06)')}
        >
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--in-coral), var(--in-coral-dark))',
            color: 'white', fontSize: '0.8125rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {initial}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--in-gray-light)' }}>Business account</div>
          </div>
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{
      display: 'flex', minHeight: '100dvh',
      background: '#faf8f5',
    }}>
      {/* ── Desktop sidebar slot ── */}
      <div className="biz-sidebar-slot" style={{ width: 260 }}>{sidebar}</div>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)',
          }}
          onClick={() => setDrawerOpen(false)}
          role="presentation"
        >
          <div
            style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: 260,
              background: 'white',
              boxShadow: '4px 0 28px rgba(0,0,0,0.12)',
              animation: 'slideInLeft 0.22s ease',
            }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 28, height: 28, borderRadius: 6,
                background: 'rgba(242,132,107,0.1)', border: 'none',
                color: 'var(--in-coral-text)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: 700,
              }}
            >✕</button>
            {sidebar}
          </div>
        </div>
      )}

      {/* ── Main body ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>

        {/* ── Header ── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          height: 56,
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 20px',
          background: '#fdfaf8',
          borderBottom: '1px solid var(--in-border)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          {/* Hamburger — mobile only */}
          <button
            className="biz-header__menu"
            onClick={() => setDrawerOpen(v => !v)}
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            style={{ flexShrink: 0 }}
          >
            {Icons.menu}
          </button>

          {/* Breadcrumb — desktop */}
          <nav className="biz-crumb" aria-label="Breadcrumb">
            <span style={{ color: '#a8a8a8', fontSize: '0.875rem', fontWeight: 500 }}>Influnz</span>
            <span style={{ color: '#a8a8a8', margin: '0 6px', fontSize: '0.875rem' }}>›</span>
            <span style={{ fontWeight: 700, color: '#2d2d2d', fontSize: '0.875rem' }}>{breadcrumb}</span>
          </nav>

          {/* Page title — mobile */}
          <span className="biz-header__page-title">{breadcrumb}</span>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Search bar — desktop */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            height: 36, padding: '0 14px',
            background: '#f5f5f5',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: 10,
            width: 'clamp(160px, 22vw, 280px)',
          }} className="biz-header-search">
            <span style={{ color: '#a8a8a8', display: 'flex', flexShrink: 0 }}>{Icons.search}</span>
            <input
              placeholder="Search campaigns, creators..."
              style={{
                background: 'none', border: 'none', outline: 'none',
                fontSize: '0.8125rem', color: '#2d2d2d', fontFamily: 'inherit',
                width: '100%',
              }}
              aria-label="Search campaigns and creators"
            />
          </div>

          {/* Notification bell */}
          <button
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 9,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6b6b6b', transition: 'background 0.15s',
              flexShrink: 0,
            }}
            aria-label="Notifications"
            onClick={() => navigate('/business/notifications')}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(242,132,107,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {Icons.bell}
            <span style={{
              position: 'absolute', top: 7, right: 7,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--in-coral)',
              border: '1.5px solid white',
            }} aria-hidden="true" />
          </button>

          {/* Profile chip */}
          <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setProfileOpen(v => !v)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 10px 4px 4px',
                background: 'rgba(242,132,107,0.06)',
                border: '1px solid var(--in-border)',
                borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(242,132,107,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(242,132,107,0.06)')}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--in-coral), var(--in-coral-dark))',
                color: 'white', fontSize: '0.8125rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {initial}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} className="biz-profile__text">
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2d2d2d', maxWidth: 110, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </span>
                <span style={{ fontSize: '0.625rem', color: '#a8a8a8' }}>Business</span>
              </div>
              <span style={{ color: '#a8a8a8', display: 'flex' }}>{Icons.chevronDown}</span>
            </button>

            {profileOpen && (
              <div
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  minWidth: 180, background: 'white',
                  border: '1px solid var(--in-border)', borderRadius: 14,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  overflow: 'hidden', zIndex: 200,
                  animation: 'fadeInScale 0.2s ease',
                }}
                role="menu"
              >
                {[
                  { label: 'My profile', onClick: () => { setProfileOpen(false); navigate('/business/settings'); } },
                  { label: 'Dashboard',  onClick: () => { setProfileOpen(false); navigate('/business'); } },
                ].map(m => (
                  <button
                    key={m.label}
                    role="menuitem"
                    onClick={m.onClick}
                    style={{
                      display: 'block', width: '100%', padding: '11px 16px',
                      textAlign: 'left', fontSize: '0.875rem', fontWeight: 500,
                      color: '#2d2d2d', background: 'none', border: 'none',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(242,132,107,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    {m.label}
                  </button>
                ))}
                <div style={{ height: 1, background: 'var(--in-border)', margin: '4px 0' }} />
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  style={{
                    display: 'block', width: '100%', padding: '11px 16px',
                    textAlign: 'left', fontSize: '0.875rem', fontWeight: 500,
                    color: 'var(--in-danger)', background: 'none', border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(224,82,82,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── Page content ── */}
        <main
          id="main-content"
          style={{
            flex: 1,
            padding: flush ? 0 : 'clamp(16px, 2vw, 28px)',
            maxWidth: flush ? undefined : 1200,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="biz-bottom-nav" aria-label="Main navigation">
        {BOTTOM_NAV.map(item => {
          const active = isActive(item);
          return (
            <button
              key={item.key}
              className={`biz-bottom-nav__item${active ? ' biz-bottom-nav__item--active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              {item.badge ? (
                <span className="biz-bottom-nav__badge">{item.badge}</span>
              ) : null}
              <span className="biz-bottom-nav__icon-wrap" aria-hidden="true">{item.icon}</span>
              <span className="biz-bottom-nav__label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
