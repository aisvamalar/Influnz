import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../app/AuthContext';
import logoImg from '../../assets/logo.png';
import './mobile-app-header.css';

/**
 * Top app bar for the main mobile business tabs:
 * logo + BUSINESS badge, notifications bell and account menu.
 */
interface MobileAppHeaderProps {
  showChevron?: boolean;
  hasUnread?: boolean;
}

export default function MobileAppHeader({ showChevron = false, hasUnread = true }: MobileAppHeaderProps) {
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const businessName = state.user?.businessName ?? 'Demo Business';
  const initial = (state.user?.avatarInitials ?? businessName).charAt(0).toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const go = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const signOut = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="mah">
      <div className="mah__brand">
        <img src={logoImg} alt="Influnz" className="mah__logo" />
        <span className="mah__badge">BUSINESS</span>
      </div>
      <div className="mah__actions">
        <button
          type="button"
          className="mah__bell"
          aria-label={hasUnread ? 'Notifications, new updates' : 'Notifications'}
          onClick={() => navigate('/business/notifications')}
        >
          <Bell size={22} strokeWidth={1.8} />
          {hasUnread && <span className="mah__dot" />}
        </button>
        <div className="mah__account" ref={accountRef}>
          <button
            type="button"
            className="mah__account-btn"
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="mah__avatar">{initial}</span>
            {showChevron && <ChevronDown size={16} />}
          </button>
          {menuOpen && (
            <div className="mah__menu" role="menu">
              <button type="button" role="menuitem" className="mah__menu-item" onClick={() => go('/business/settings')}>
                My profile
              </button>
              <button type="button" role="menuitem" className="mah__menu-item" onClick={() => go('/business/payments')}>
                Payments
              </button>
              <button
                type="button"
                role="menuitem"
                className="mah__menu-item mah__menu-item--danger"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
