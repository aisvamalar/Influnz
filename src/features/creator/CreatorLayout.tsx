import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Mail, Briefcase, Wallet, TrendingUp,
  UserCircle, SlidersHorizontal, Star, Gift, Share2, Menu, X, LogOut,
} from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../app/AuthContext';
import { useCreator } from './CreatorContext';
import { Avatar } from './ui';

const NAV = [
  { to: '/creator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/creator/invitations', label: 'Invitations', icon: Mail, badgeKey: 'newInvites' },
  { to: '/creator/campaigns', label: 'Campaigns', icon: Briefcase },
  { to: '/creator/earnings', label: 'Earnings', icon: Wallet },
  { to: '/creator/reputation', label: 'Reputation', icon: Star },
  { to: '/creator/growth', label: 'Growth', icon: TrendingUp },
  { to: '/creator/referrals', label: 'Referrals', icon: Share2 },
  { to: '/creator/rewards', label: 'Rewards', icon: Gift },
  { to: '/creator/profile', label: 'Creator Passport', icon: UserCircle },
  { to: '/creator/preferences', label: 'Preferences', icon: SlidersHorizontal },
] as const;

export default function CreatorLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile, invitations } = useCreator();

  const newInvites = invitations.filter(i => i.status === 'new').length;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="cr-shell">
      {open && <div className="cr-sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`cr-sidebar ${open ? 'cr-sidebar--open' : ''}`}>
        <div className="cr-sidebar__logo"><Logo size="md" /></div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `cr-nav-link ${isActive ? 'cr-nav-link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
              {'badgeKey' in item && item.badgeKey === 'newInvites' && newInvites > 0 && (
                <span className="cr-nav-link__badge">{newInvites}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--in-border)' }}>
          <button className="cr-nav-link" onClick={() => { navigate('/creator/profile'); setOpen(false); }}>
            <Avatar name={profile.displayName} size={34} />
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, textAlign: 'left' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--in-charcoal)' }}>{profile.displayName}</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--in-gray)' }}>@{profile.username}</span>
            </span>
          </button>
          <button className="cr-nav-link" onClick={handleLogout} style={{ color: 'var(--in-gray)' }}>
            <LogOut size={19} /> <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="cr-main">
        <header className="cr-topbar">
          <button className="cr-hamburger" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--in-coral-text)', background: 'rgba(242,132,107,0.1)', padding: '4px 10px', borderRadius: 20 }}>
              Rising Creator · {profile.reliability}/100
            </span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={profile.displayName} size={34} />
          </div>
        </header>

        <main id="main-content" className="cr-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
