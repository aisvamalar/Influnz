/**
 * CreatorLayout — the creator app shell, built on the same components as BusinessLayout:
 * - Desktop sidebar (bsb): flush light-peach panel with the brand, every creator screen,
 *   and an opportunities promo on tall screens. Collapses to an icon rail with tooltips
 *   (default on tablets, toggle remembered).
 * - Desktop header (cr-topbar): search, notifications, profile menu.
 * - Mobile: sticky app header + bottom tab bar. Detail screens (an invitation) bring
 *   their own back bar and action bar, so both step aside there.
 * Nested creator routes render through <Outlet />.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  House, Mail, Megaphone, Wallet, TrendingUp, IdCard, SlidersHorizontal, Award, Gift, UserPlus,
  Bell, Search, ChevronDown, ChevronLeft, ChevronRight, Home, Briefcase, LogOut, type LucideIcon,
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
  icon: LucideIcon;
  badge?: number;
}

const NAV: NavItem[] = [
  { key: 'dashboard',   label: 'Dashboard',        path: '/creator/dashboard',   icon: House },
  { key: 'campaigns',   label: 'Campaigns',        path: '/creator/campaigns',   icon: Megaphone },
  { key: 'invitations', label: 'Invitations',      path: '/creator/invitations', icon: Mail },
  { key: 'earnings',    label: 'Earnings',         path: '/creator/earnings',    icon: Wallet },
  { key: 'profile',     label: 'Creator Passport', path: '/creator/profile',     icon: IdCard },
  { key: 'reputation',  label: 'Reputation',       path: '/creator/reputation',  icon: Award },
  { key: 'growth',      label: 'Growth',           path: '/creator/growth',      icon: TrendingUp },
  { key: 'referrals',   label: 'Referrals',        path: '/creator/referrals',   icon: UserPlus },
  { key: 'rewards',     label: 'Rewards',          path: '/creator/rewards',     icon: Gift },
  { key: 'preferences', label: 'Preferences',      path: '/creator/preferences', icon: SlidersHorizontal },
];

export default function CreatorLayout() {
  const { logout } = useAuth();
  const { profile, invitations, getInvitation } = useCreator();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const scale = useViewportScale(DESIGN_WIDTH);
  const { width } = useResponsive();
  const [collapsePref, setCollapsePref] = useState<boolean | null>(readCollapsePref);
  const collapsed = width > 768 && (collapsePref ?? width < RAIL_BELOW);
  const isMobile = width <= 768;
  /** Detail screens that bring their own top bar and action bar on phones. */
  const immersive = isMobile && /^\/creator\/invitations\/[^/]+\/?$/.test(location.pathname);

  // A new screen starts at the top (a filter or tab change in the query string does not).
  useEffect(() => {
    if (location.hash) return;
    // Instant: the page sets smooth scrolling, which would animate the jump.
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector('.creator-layout .biz-main-content')?.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);

  const newInvites = invitations.filter(i => i.status === 'new').length;
  const nav = NAV.map(item => (item.key === 'invitations' && newInvites > 0 ? { ...item, badge: newInvites } : item));
  // An open campaign opened from Browse shares the invitation route but belongs to Campaigns.
  const detailId = /^\/creator\/invitations\/([^/]+)\/?$/.exec(location.pathname)?.[1];
  const fromBrowse = Boolean(detailId && getInvitation(detailId)?.invited === false);
  const onCreator = (base: string) => (fromBrowse && base === '/creator/campaigns')
    || (!(fromBrowse && base === '/creator/invitations') && (location.pathname === base || location.pathname.startsWith(`${base}/`)));
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
  const initial = displayName.trim()[0]?.toUpperCase() ?? 'C';
  const city = profile.location.split(',')[0].trim();

  const setCollapsed = (next: boolean) => {
    setCollapsePref(next);
    try { localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0'); } catch { /* storage unavailable */ }
  };

  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setProfileOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen]);

  useEffect(() => { setProfileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login?type=creator', { replace: true });
  };

  const go = (path: string) => { setProfileOpen(false); navigate(path); };

  const sidebar = (
    <aside className={`bsb biz-aside${collapsed ? ' is-collapsed' : ''}`} aria-label="Creator navigation">
      <div className="bsb__panel">
        <div className="bsb__brand">
          <Wordmark height={32} />
          <button type="button" className="bsb__mark" onClick={() => setCollapsed(false)} aria-label="Expand sidebar">
            <LogoLight variant="mark" height={32} title="" />
          </button>
        </div>

        <button
          type="button"
          className="bsb__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <ChevronLeft size={12} strokeWidth={2.4} />
        </button>

        <nav className="bsb__nav" aria-label="Primary">
          {nav.map(item => {
            const active = onCreator(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                className={`bsb__item${active ? ' is-active' : ''}`}
                onClick={() => navigate(item.path)}
                aria-current={active ? 'page' : undefined}
                aria-label={collapsed ? item.label : undefined}
              >
                <span className="bsb__icon"><Icon size={21} strokeWidth={1.75} /></span>
                <span className="bsb__label">{item.label}</span>
                {item.badge ? <span className="bsb__badge">{item.badge}</span> : null}
                <span className="bsb__tip" aria-hidden="true">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <button type="button" className="cr-promo" onClick={() => navigate('/creator/invitations')}>
            <svg className="cr-promo__waves" viewBox="0 0 220 120" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 58 C 42 18, 88 96, 136 54 S 206 6, 220 26 L 220 0 L 0 0 Z" fill="#f9b59c" opacity="0.55" />
              <path d="M0 86 C 50 40, 96 112, 150 70 S 204 40, 220 58 L 220 0 L 0 0 Z" fill="#fbc8b5" opacity="0.5" />
            </svg>
            <strong>Create<br />Collaborate<br />Grow</strong>
            <small>AI-matched opportunities for Indian creators.</small>
            <span className="cr-promo__go" aria-hidden="true"><ChevronRight size={18} strokeWidth={2.2} /></span>
          </button>
        )}
      </div>
    </aside>
  );

  /* Desktop header — search, notifications and the profile menu. */
  const desktopHeader = (
    <header className="cr-topbar">
      <label className="cr-search">
        <Search size={18} strokeWidth={1.9} aria-hidden="true" />
        <input type="search" placeholder="Search campaigns, brands, messages..." aria-label="Search campaigns, brands and messages" />
      </label>

      <div className="cr-topbar__end">
        <button
          type="button"
          className="cr-bell"
          aria-label={newInvites > 0 ? `${newInvites} new invitations` : 'Invitations'}
          onClick={() => navigate('/creator/invitations')}
        >
          <Bell size={22} strokeWidth={1.7} />
          {newInvites > 0 && <span className="cr-bell__dot">{newInvites > 9 ? '9+' : newInvites}</span>}
        </button>

        <span className="cr-topbar__divider" aria-hidden="true" />

        <div className="cr-profile" ref={profileRef}>
          <button
            type="button"
            className="cr-profile__btn"
            onClick={() => setProfileOpen(v => !v)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            <span className="cr-profile__avatar" aria-hidden="true">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : initial}
              {profile.verified && <i />}
            </span>
            <span className="cr-profile__who">
              <strong>{displayName}</strong>
              <small>{city ? `Creator · ${city}` : 'Creator'}</small>
            </span>
            <ChevronDown size={18} strokeWidth={2} className="cr-profile__chev" aria-hidden="true" />
          </button>

          {profileOpen && (
            <div className="cr-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => go('/creator/profile')}><IdCard size={16} /> Creator Passport</button>
              <button type="button" role="menuitem" onClick={() => go('/creator/preferences')}><SlidersHorizontal size={16} /> Preferences</button>
              <span className="cr-menu__line" />
              <button type="button" role="menuitem" className="is-danger" onClick={handleLogout}><LogOut size={16} /> Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
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
              <button type="button" role="menuitem" className="mah__menu-item" onClick={() => go('/creator/profile')}>Creator Passport</button>
              <button type="button" role="menuitem" className="mah__menu-item" onClick={() => go('/creator/preferences')}>Preferences</button>
              <button type="button" role="menuitem" className="mah__menu-item mah__menu-item--danger" onClick={handleLogout}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{ display: 'flex', minHeight: SCREEN_HEIGHT, background: '#fdf8f5', zoom: scale, '--biz-zoom': scale } as React.CSSProperties}
      className={`business-layout creator-layout${immersive ? ' is-immersive' : ''}`}
    >
      {/* Sidebar stays on desktop. Phones use the bottom bar only. */}
      {!isMobile && (
        <div className={`biz-sidebar-slot${collapsed ? ' is-collapsed' : ''}`}>{sidebar}</div>
      )}

      <div className="biz-main-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: SCREEN_HEIGHT }}>
        {isMobile ? (immersive ? null : mobileHeader) : desktopHeader}

        <main
          id="main-content"
          className="biz-canvas"
          style={{ flex: 1, padding: 'clamp(16px, 1.8vw, 28px)', maxWidth: 1640, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}
        >
          <Outlet />
        </main>
      </div>

      {isMobile && !immersive && (
        <CreatorTabBar
          active={barActive}
          invites={newInvites}
          onNavigate={navigate}
        />
      )}
    </div>
  );
}

/** logo.png cropped to the mark and wordmark, for the light sidebar (LogoLight is for dark panels). */
function Wordmark({ height }: { height: number }) {
  const box = { x: 300, y: 172, w: 1380, h: 428 };
  return (
    <svg
      className="bsb__logo cr-wordmark"
      width={Math.round((height * box.w) / box.h)}
      height={height}
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      role="img"
      aria-label="Influnz"
    >
      <image href={logoImg} width={1983} height={793} />
    </svg>
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
