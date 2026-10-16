/**
 * CreatorLayout — the creator app shell, built on the same components as BusinessLayout:
 * - Floating sidebar (bsb): brand, main screens, passport + preferences at the foot.
 *   Collapses to an icon rail with tooltips (default on tablets, toggle remembered).
 * - Desktop header: breadcrumb, search bar, notification bell, profile chip.
 * - Mobile: sticky header with drawer + bottom tab bar.
 * Nested creator routes render through <Outlet />.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Mail, Briefcase, Wallet, TrendingUp, UserCircle, SlidersHorizontal,
  Star, Gift, Share2, Bell, Search, Menu, ChevronDown, ChevronLeft, Home, type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../app/AuthContext';
import LogoLight from '../../components/LogoLight';
import logoImg from '../../assets/logo.png';
import { useResponsive } from '../../hooks/useResponsive';
import { useViewportScale } from '../../hooks/useViewportScale';
import { useCreator } from './CreatorContext';
import '../../styles/web-responsive.css';
import '../business/business-sidebar.css';
import '../../components/mobile/mobile-app-header.css';
import '../../components/mobile/mobile-bottom-nav.css';
import './creator-ui.css';

/** Width the screens are designed at; wider viewports scale the whole shell up. */
const DESIGN_WIDTH = 1680;
const SCREEN_HEIGHT = 'calc(100dvh / var(--biz-zoom, 1))';
const COLLAPSE_KEY = 'influnz.creator.sidebarCollapsed';
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

const PRIMARY: Omit<NavItem, 'badge'>[] = [
  { key: 'dashboard',   label: 'Dashboard',   path: '/creator/dashboard',   icon: <LayoutDashboard size={18} /> },
  { key: 'invitations', label: 'Invitations', path: '/creator/invitations', icon: <Mail size={18} /> },
  { key: 'campaigns',   label: 'Campaigns',   path: '/creator/campaigns',   icon: <Briefcase size={18} /> },
  { key: 'earnings',    label: 'Earnings',    path: '/creator/earnings',    icon: <Wallet size={18} /> },
  { key: 'reputation',  label: 'Reputation',  path: '/creator/reputation',  icon: <Star size={18} /> },
  { key: 'growth',      label: 'Growth',      path: '/creator/growth',      icon: <TrendingUp size={18} /> },
  { key: 'referrals',   label: 'Referrals',   path: '/creator/referrals',   icon: <Share2 size={18} /> },
  { key: 'rewards',     label: 'Rewards',     path: '/creator/rewards',     icon: <Gift size={18} /> },
];

const PASSPORT_NAV: NavItem = { key: 'profile', label: 'Creator Passport', path: '/creator/profile', icon: <UserCircle size={18} /> };
const PREFS_NAV: NavItem = { key: 'preferences', label: 'Preferences', path: '/creator/preferences', icon: <SlidersHorizontal size={18} /> };

/** Pages reached from a list get their parent's breadcrumb. */
const CRUMBS: Array<{ prefix: string; label: string }> = [
  { prefix: '/creator/dashboard', label: 'Dashboard' },
  { prefix: '/creator/invitations', label: 'Invitations' },
  { prefix: '/creator/negotiation', label: 'Negotiation' },
  { prefix: '/creator/deal', label: 'Deal room' },
  { prefix: '/creator/contract', label: 'Contract' },
  { prefix: '/creator/campaigns', label: 'Campaigns' },
  { prefix: '/creator/earnings', label: 'Earnings' },
  { prefix: '/creator/reputation', label: 'Reputation' },
  { prefix: '/creator/growth', label: 'Growth' },
  { prefix: '/creator/referrals', label: 'Referrals' },
  { prefix: '/creator/rewards', label: 'Rewards' },
  { prefix: '/creator/profile', label: 'Creator Passport' },
  { prefix: '/creator/preferences', label: 'Preferences' },
];

export default function CreatorLayout() {
  const { logout } = useAuth();
  const { profile, invitations } = useCreator();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const scale = useViewportScale(DESIGN_WIDTH);
  const { width } = useResponsive();
  const [collapsePref, setCollapsePref] = useState<boolean | null>(readCollapsePref);
  const collapsed = width > 768 && (collapsePref ?? width < RAIL_BELOW);
  const isMobile = width <= 768;

  const newInvites = invitations.filter(i => i.status === 'new').length;
  const primaryNav: NavItem[] = PRIMARY.map(item => (item.key === 'invitations' && newInvites > 0 ? { ...item, badge: newInvites } : item));
  const onCreator = (base: string) => location.pathname === base || location.pathname.startsWith(`${base}/`);
  const barActive = onCreator('/creator/campaigns')
    ? 'campaigns'
    : onCreator('/creator/earnings')
      ? 'earnings'
      : onCreator('/creator/growth')
        ? 'growth'
        : onCreator('/creator/dashboard') || location.pathname === '/creator'
          ? 'home'
          : '';

  const displayName = profile.displayName || 'Creator';
  const subtitle = `@${profile.username}`;
  const initial = displayName.trim()[0]?.toUpperCase() ?? 'C';
  const breadcrumb = CRUMBS.find(c => location.pathname.startsWith(c.prefix))?.label ?? 'Creator';

  const setCollapsed = (next: boolean) => {
    setCollapsePref(next);
    try { localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0'); } catch { /* storage unavailable */ }
  };
  const toggleCollapsed = () => setCollapsed(!collapsed);

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  useEffect(() => { setDrawerOpen(false); setProfileOpen(false); }, [location.pathname]);

  const isActive = (item: NavItem) => location.pathname.startsWith(item.path);

  const handleLogout = async () => {
    await logout();
    navigate('/login?type=creator', { replace: true });
  };

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
        {item.badge ? <span className="bsb__badge">{item.badge}</span> : null}
        <span className="bsb__tip" aria-hidden="true">{item.label}</span>
      </button>
    );
  };

  const renderSidebar = (railed: boolean, withToggle: boolean) => (
    <aside className={`bsb biz-aside${railed ? ' is-collapsed' : ''}`} aria-label="Creator navigation">
      <div className="bsb__panel">
        <div className="bsb__brand">
          <LogoLight height={34} className="bsb__logo" />
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
            <ChevronLeft size={12} strokeWidth={2.4} />
          </button>
        )}

        <nav className="bsb__nav" aria-label="Primary">
          {primaryNav.map(item => renderNavItem(item, railed))}
        </nav>

        <div className="bsb__foot">
          <div className="bsb__divider" />
          <button
            type="button"
            className={`bsb__profile${profile.verified ? '' : ' is-incomplete'}`}
            title={railed ? `${displayName} · ${subtitle}` : undefined}
            onClick={() => {
              if (railed) { setCollapsed(false); return; }
              navigate(PASSPORT_NAV.path);
              setDrawerOpen(false);
            }}
          >
            <span className="bsb__avatar" aria-hidden="true">{initial}</span>
            <span className="bsb__who">
              <strong>{displayName}</strong>
              <small>{subtitle}</small>
            </span>
          </button>
          {renderNavItem(PREFS_NAV, railed)}
        </div>
      </div>
    </aside>
  );

  /* Phone header — same top app bar the business mobile screens use (mah). */
  const mobileHeader = (
    <div className="mah" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="mah__brand">
        <img src={logoImg} alt="Influnz" className="mah__logo" />
        <span className="mah__badge">CREATOR</span>
      </div>
      <div className="mah__actions">
        <button type="button" className="mah__bell" aria-label={newInvites > 0 ? `${newInvites} new invitations` : 'Invitations'} onClick={() => navigate('/creator/invitations')}>
          <Bell size={22} strokeWidth={1.8} />
          {newInvites > 0 && <span className="mah__dot" />}
        </button>
        <div className="mah__account" ref={profileRef}>
          <button type="button" className="mah__account-btn" aria-label="Account menu" aria-haspopup="menu" aria-expanded={profileOpen} onClick={() => setProfileOpen(v => !v)}>
            <span className="mah__avatar">{initial}</span>
          </button>
          {profileOpen && (
            <div className="mah__menu" role="menu">
              <button type="button" role="menuitem" className="mah__menu-item" onClick={() => { setProfileOpen(false); navigate('/creator/profile'); }}>Creator Passport</button>
              <button type="button" role="menuitem" className="mah__menu-item" onClick={() => { setProfileOpen(false); navigate('/creator/preferences'); }}>Preferences</button>
              <button type="button" role="menuitem" className="mah__menu-item mah__menu-item--danger" onClick={handleLogout}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{ display: 'flex', minHeight: SCREEN_HEIGHT, background: '#faf8f5', zoom: scale, '--biz-zoom': scale } as React.CSSProperties}
      className="business-layout creator-layout"
    >
      {/* Sidebar stays on desktop. Phones use the bottom bar only. */}
      {!isMobile && (
        <div className={`biz-sidebar-slot${collapsed ? ' is-collapsed' : ''}`}>{renderSidebar(collapsed, true)}</div>
      )}

      {drawerOpen && !isMobile && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
          onClick={() => setDrawerOpen(false)}
          role="presentation"
        >
          <div
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 280, animation: 'slideInLeft 0.22s ease' }}
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
                background: '#f6f3f1', border: 'none', color: '#5b6472', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700,
              }}
            >✕</button>
            {renderSidebar(false, false)}
          </div>
        </div>
      )}

      {/* ── Main body ── */}
      <div className="biz-main-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: SCREEN_HEIGHT }}>
        {isMobile ? mobileHeader : (
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          height: 56,
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 20px',
          background: '#fdfaf8',
          borderBottom: '1px solid var(--in-border)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <button
            className="biz-header__menu mobile-only"
            onClick={() => setDrawerOpen(v => !v)}
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            style={{ flexShrink: 0 }}
          >
            <Menu size={18} />
          </button>

          <nav className="biz-crumb desktop-only" aria-label="Breadcrumb">
            <span style={{ color: '#a8a8a8', fontSize: '0.875rem', fontWeight: 500 }}>Influnz</span>
            <span style={{ color: '#a8a8a8', margin: '0 6px', fontSize: '0.875rem' }}>›</span>
            <span style={{ fontWeight: 700, color: '#2d2d2d', fontSize: '0.875rem' }}>{breadcrumb}</span>
          </nav>

          <span className="biz-header__page-title mobile-only">{breadcrumb}</span>

          <div style={{ flex: 1 }} />

          <div
            className="biz-header-search desktop-only"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 36, padding: '0 14px',
              background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 10,
              width: 'min(520px, 46vw)',
            }}
          >
            <span style={{ color: '#a8a8a8', display: 'flex', flexShrink: 0 }}><Search size={16} /></span>
            <input
              placeholder="Search invitations, campaigns, brands..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.8125rem', color: '#2d2d2d', fontFamily: 'inherit', width: '100%' }}
              aria-label="Search invitations and campaigns"
            />
          </div>

          <button
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 9, background: 'none', border: 'none', cursor: 'pointer',
              color: '#6b6b6b', transition: 'background 0.15s', flexShrink: 0,
            }}
            aria-label={newInvites > 0 ? `${newInvites} new invitations` : 'Invitations'}
            onClick={() => navigate('/creator/invitations')}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(242,132,107,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Bell size={18} />
            {newInvites > 0 && (
              <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: 'var(--in-coral)', border: '1.5px solid white' }} aria-hidden="true" />
            )}
          </button>

          <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setProfileOpen(v => !v)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 10px 4px 4px',
                background: 'rgba(242,132,107,0.06)', border: '1px solid var(--in-border)',
                borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
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
                <span style={{ fontSize: '0.625rem', color: '#a8a8a8' }}>Creator</span>
              </div>
              <span style={{ color: '#a8a8a8', display: 'flex' }}><ChevronDown size={12} strokeWidth={2.2} /></span>
            </button>

            {profileOpen && (
              <div
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  minWidth: 190, background: 'white',
                  border: '1px solid var(--in-border)', borderRadius: 14,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 200,
                  animation: 'fadeInScale 0.2s ease',
                }}
                role="menu"
              >
                {[
                  { label: 'Creator Passport', onClick: () => navigate('/creator/profile') },
                  { label: 'Dashboard', onClick: () => navigate('/creator/dashboard') },
                  { label: 'Preferences', onClick: () => navigate('/creator/preferences') },
                ].map(m => (
                  <button
                    key={m.label}
                    role="menuitem"
                    onClick={() => { setProfileOpen(false); m.onClick(); }}
                    style={{
                      display: 'block', width: '100%', padding: '11px 16px', textAlign: 'left',
                      fontSize: '0.875rem', fontWeight: 500, color: '#2d2d2d',
                      background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
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
                    display: 'block', width: '100%', padding: '11px 16px', textAlign: 'left',
                    fontSize: '0.875rem', fontWeight: 500, color: 'var(--in-danger)',
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
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
        )}

        <main
          id="main-content"
          className="biz-canvas"
          style={{ flex: 1, padding: 'clamp(16px, 2vw, 28px)', maxWidth: 1600, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}
        >
          <Outlet />
        </main>
      </div>

      {isMobile && (
        <CreatorTabBar
          active={barActive}
          invites={newInvites}
          onNavigate={navigate}
        />
      )}
    </div>
  );
}

function CreatorTabBar({
  active,
  invites,
  onNavigate,
}: {
  active: string;
  invites: number;
  onNavigate: (path: string) => void;
}) {
  const item = (key: string, label: string, path: string, Icon: LucideIcon) => {
    const on = active === key;
    return (
      <button
        type="button"
        className={`mbn__item${on ? ' mbn__item--active' : ''}`}
        aria-current={on ? 'page' : undefined}
        onClick={() => onNavigate(path)}
      >
        <Icon
          size={24}
          strokeWidth={on ? 2.2 : 1.8}
          fill={on && key === 'home' ? 'currentColor' : 'none'}
          fillOpacity={on && key === 'home' ? 0.9 : 0}
        />
        {label}
      </button>
    );
  };

  return (
    <nav className="mbn" aria-label="Main navigation">
      {item('home', 'Home', '/creator/dashboard', Home)}
      {item('campaigns', 'Campaigns', '/creator/campaigns', Briefcase)}
      <div className="mbn__fab-slot">
        <button
          type="button"
          className="mbn__fab"
          aria-label={invites > 0 ? `${invites} new invitations` : 'Invitations'}
          onClick={() => onNavigate('/creator/invitations')}
        >
          <Mail size={26} strokeWidth={2.2} />
          {invites > 0 && <span className="mbn__fab-badge">{invites}</span>}
        </button>
      </div>
      {item('earnings', 'Earnings', '/creator/earnings', Wallet)}
      {item('growth', 'Growth', '/creator/growth', TrendingUp)}
    </nav>
  );
}
