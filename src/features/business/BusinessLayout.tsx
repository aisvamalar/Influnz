/**
 * BusinessLayout
 * - Floating sidebar: brand, four main screens centred, profile + settings at the foot.
 *   Collapses to an icon rail with tooltips (default on tablets, toggle remembered).
 * - Desktop header: breadcrumb, search bar, notification bell, profile chip
 * - Mobile: sticky header + bottom tab bar
 */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import LogoLight from '../../components/LogoLight';
import { useResponsive } from '../../hooks/useResponsive';
import { useViewportScale } from '../../hooks/useViewportScale';
import { profileProgress, useBusinessProfile } from './businessProfile';
import '../../styles/web-responsive.css';
import './business-sidebar.css';

/** Width the business screens are designed at; wider viewports scale the whole shell up. */
const DESIGN_WIDTH = 1680;
const SCREEN_HEIGHT = 'calc(100dvh / var(--biz-zoom, 1))';
const COLLAPSE_KEY = 'influnz.biz.sidebarCollapsed';
/** Below this width the sidebar starts as an icon rail unless the user expanded it. */
const RAIL_BELOW = 1200;

function readCollapsePref(): boolean | null {
  try {
    const v = localStorage.getItem(COLLAPSE_KEY);
    return v === null ? null : v === '1';
  } catch {
    return null;
  }
}

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
  create: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.5v11M3.5 9h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 2v1.8M9 14.2V16M2 9h1.8M14.2 9H16M4.1 4.1l1.3 1.3M12.6 12.6l1.3 1.3M13.9 4.1l-1.3 1.3M5.4 12.6l-1.3 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  chevronLeft: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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

/** Create-flow routes. They stay under New Campaign, not the campaign list. */
const CREATE_PATHS = [
  '/business/campaigns/new',
  '/business/campaigns/ai-strategy',
  '/business/campaigns/parameters',
  '/business/campaigns/strategy',
  '/business/campaigns/creators',
  '/business/campaigns/guardrails',
  '/business/campaigns/negotiate',
  '/business/campaigns/invitations',
];

const PRIMARY_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard',     path: '/business',           icon: Icons.dashboard },
  { key: 'create',    label: 'New Campaign',  path: '/business/campaigns/new', icon: Icons.create },
  { key: 'campaigns', label: 'Campaigns',     path: '/business/campaigns', icon: Icons.campaigns },
  { key: 'payments',  label: 'Payments',      path: '/business/payments',  icon: Icons.payments },
  { key: 'analytics', label: 'Analytics',     path: '/business/analytics', icon: Icons.analytics },
];

const SETTINGS_NAV: NavItem = { key: 'settings', label: 'Settings', path: '/business/settings', icon: Icons.settings };

const BOTTOM_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Home',      path: '/business',           icon: Icons.dashboard },
  { key: 'campaigns', label: 'Campaigns', path: '/business/campaigns', icon: Icons.campaigns },
  { key: 'payments',  label: 'Payments',  path: '/business/payments',  icon: Icons.payments },
  { key: 'analytics', label: 'Analytics', path: '/business/analytics', icon: Icons.analytics },
  SETTINGS_NAV,
];

function fallbackParent(pathname: string): string {
  const flow: Record<string, string> = {
    '/business/campaigns/new': '/business/campaigns',
    '/business/campaigns/ai-strategy': '/business/campaigns/new',
    '/business/campaigns/parameters': '/business/campaigns/new',
    '/business/campaigns/strategy': '/business/campaigns/new',
    '/business/campaigns/creators': '/business/campaigns/strategy',
    '/business/campaigns/guardrails': '/business/campaigns/creators',
    '/business/campaigns/negotiate': '/business/campaigns/guardrails',
    '/business/campaigns/invitations': '/business/campaigns/negotiate',
    '/business/campaigns': '/business',
    '/business/payments': '/business',
    '/business/analytics': '/business',
    '/business/settings': '/business',
    '/business/notifications': '/business',
    '/business/approvals': '/business',
  };
  if (flow[pathname]) return flow[pathname];
  if (/^\/business\/campaigns\/[^/]+\/content$/.test(pathname)) return pathname.replace(/\/content$/, '');
  if (/^\/business\/campaigns\/[^/]+$/.test(pathname)) return '/business/campaigns';
  return '/business';
}

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const scale = useViewportScale(DESIGN_WIDTH);
  const { width } = useResponsive();
  const [collapsePref, setCollapsePref] = useState<boolean | null>(readCollapsePref);
  const collapsed = width > 768 && (collapsePref ?? width < RAIL_BELOW);

  const displayName = state.user?.businessName ?? state.user?.email ?? 'Business';
  const { profileComplete } = profileProgress(useBusinessProfile());
  const contact = state.user?.email || (state.user?.phone ? `+91 ${state.user.phone}` : 'Business account');
  const subtitle = profileComplete ? contact : 'Complete your profile';
  const initial = displayName.trim()[0]?.toUpperCase() ?? 'B';

  const setCollapsed = (next: boolean) => {
    setCollapsePref(next);
    try { localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0'); } catch { /* storage unavailable */ }
  };
  const toggleCollapsed = () => setCollapsed(!collapsed);

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

  useEffect(() => { setDrawerOpen(false); setMobileMenuOpen(false); }, [location.pathname]);

  const isActive = (item: NavItem) => {
    const path = location.pathname;
    const onPath = (base: string) => path === base || path.startsWith(`${base}/`);
    const creating = CREATE_PATHS.some((base) => onPath(base));
    if (item.key === 'dashboard') return path === '/business';
    if (item.key === 'create') return creating;
    if (item.key === 'campaigns') return !creating && onPath('/business/campaigns');
    return onPath(item.path);
  };

  const showBack = location.pathname !== '/business' || location.key !== 'default';
  const goBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
      return;
    }
    navigate(fallbackParent(location.pathname));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // ── Sidebar JSX ──────────────────────────────────────────────────────────────
  const renderNavItem = (item: NavItem, railed: boolean) => {
    const active = isActive(item);
    return (
      <button
        key={item.key}
        type="button"
        className={`bsb__item${active ? ' is-active' : ''}`}
        onClick={() => {
          if (railed) setCollapsed(false);
          navigate(item.path);
          setDrawerOpen(false);
        }}
        aria-current={active ? 'page' : undefined}
        aria-label={railed ? item.label : undefined}
      >
        <span className="bsb__icon">{item.icon}</span>
        <span className="bsb__label">{item.label}</span>
        <span className="bsb__tip" aria-hidden="true">{item.label}</span>
      </button>
    );
  };

  const renderSidebar = (railed: boolean, withToggle: boolean) => (
    <aside
      className={`bsb biz-aside${railed ? ' is-collapsed' : ''}${mobileMenuOpen ? ' mobile-sidebar-open' : ''}`}
      aria-label="Business navigation"
    >
      <div className="bsb__panel">
        <div className="bsb__brand">
          <LogoLight className="bsb__logo" height={40} />
          <button type="button" className="bsb__mark" onClick={() => setCollapsed(false)} aria-label="Expand sidebar">
            <LogoLight variant="mark" height={34} title="" />
          </button>
        </div>

        {withToggle && (
          <button
            type="button"
            className="bsb__toggle"
            onClick={toggleCollapsed}
            aria-label={railed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!railed}
          >
            {Icons.chevronLeft}
          </button>
        )}

        <nav className="bsb__nav" aria-label="Primary">
          {PRIMARY_NAV.map(item => renderNavItem(item, railed))}
        </nav>

        <div className="bsb__foot">
          <div className="bsb__divider" />
          <button
            type="button"
            className={`bsb__profile${profileComplete ? '' : ' is-incomplete'}`}
            title={railed ? `${displayName} · ${subtitle}` : undefined}
            onClick={() => {
              if (railed) { setCollapsed(false); return; }
              navigate(profileComplete ? '/business/settings' : '/business/settings#verification');
              setDrawerOpen(false);
            }}
          >
            <span className="bsb__avatar" aria-hidden="true">{initial}</span>
            <span className="bsb__who">
              <strong>{displayName}</strong>
              <small>{subtitle}</small>
            </span>
          </button>
          {renderNavItem(SETTINGS_NAV, railed)}
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{
      display: 'flex', minHeight: SCREEN_HEIGHT,
      background: '#faf8f5',
      zoom: scale,
      '--biz-zoom': scale,
    } as React.CSSProperties} className={`business-layout ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
      {/* ── Mobile Menu Toggle Button ── */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1002,
          padding: '8px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        {Icons.menu}
      </button>

      {/* ── Mobile overlay ── */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* ── Desktop sidebar slot ── */}
      <div className={`biz-sidebar-slot${collapsed ? ' is-collapsed' : ''}`}>{renderSidebar(collapsed, width > 768)}</div>

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
              width: 280,
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
                position: 'absolute', top: 30, right: 22, zIndex: 3,
                width: 28, height: 28, borderRadius: 8,
                background: '#f6f3f1', border: 'none',
                color: '#5b6472', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: 700,
              }}
            >✕</button>
            {renderSidebar(false, false)}
          </div>
        </div>
      )}

      {/* ── Main body ── */}
      <div className="biz-main-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: SCREEN_HEIGHT }}>

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
            className="biz-header__menu mobile-only"
            onClick={() => setDrawerOpen(v => !v)}
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            style={{ flexShrink: 0 }}
          >
            {Icons.menu}
          </button>

          {/* Back — every screen except the dashboard landing */}
          {showBack && (
            <button type="button" className="biz-back" onClick={goBack}>
              {Icons.chevronLeft}
              <span className="biz-back__label">Back</span>
            </button>
          )}

          {/* Breadcrumb — desktop */}
          <nav className="biz-crumb desktop-only" aria-label="Breadcrumb">
            <span style={{ color: '#a8a8a8', fontSize: '0.875rem', fontWeight: 500 }}>Influnz</span>
            <span style={{ color: '#a8a8a8', margin: '0 6px', fontSize: '0.875rem' }}>›</span>
            <span style={{ fontWeight: 700, color: '#2d2d2d', fontSize: '0.875rem' }}>{breadcrumb}</span>
          </nav>

          {/* Page title — mobile */}
          <span className="biz-header__page-title mobile-only">{breadcrumb}</span>

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
          }} className="biz-header-search desktop-only">
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
          className="biz-canvas"
          style={{
            flex: 1,
            padding: flush ? 0 : 'clamp(16px, 2vw, 28px)',
            maxWidth: flush ? undefined : 1600,
            width: '100%',
            margin: '0 auto',
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
