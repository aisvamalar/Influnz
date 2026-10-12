import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, Plus, Wallet, BarChart3, type LucideIcon } from 'lucide-react';
import './mobile-bottom-nav.css';

/**
 * Reusable Mobile Bottom Navigation
 * 5-item navigation with a raised center button for creating a campaign
 */
type NavKey = 'home' | 'campaigns' | 'payments' | 'analytics';

interface MobileBottomNavProps {
  activeItem?: NavKey;
}

interface NavItem {
  key: NavKey;
  label: string;
  path: string;
  Icon: LucideIcon;
}

const LEFT_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', path: '/business', Icon: Home },
  { key: 'campaigns', label: 'Campaigns', path: '/business/campaigns', Icon: Briefcase },
];

const RIGHT_ITEMS: NavItem[] = [
  { key: 'payments', label: 'Payments', path: '/business/payments', Icon: Wallet },
  { key: 'analytics', label: 'Analytics', path: '/business/analytics', Icon: BarChart3 },
];

export default function MobileBottomNav({ activeItem }: MobileBottomNavProps) {
  const navigate = useNavigate();

  const renderItem = ({ key, label, path, Icon }: NavItem) => {
    const isActive = activeItem === key;
    return (
      <button
        key={key}
        type="button"
        className={`mbn__item${isActive ? ' mbn__item--active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => navigate(path)}
      >
        <Icon
          size={24}
          strokeWidth={isActive ? 2.2 : 1.8}
          fill={isActive && key === 'home' ? 'currentColor' : 'none'}
          fillOpacity={isActive && key === 'home' ? 0.9 : 0}
        />
        {label}
      </button>
    );
  };

  return (
    <nav className="mbn" aria-label="Primary">
      {LEFT_ITEMS.map(renderItem)}
      <div className="mbn__fab-slot">
        <button
          type="button"
          className="mbn__fab"
          aria-label="Create campaign"
          onClick={() => navigate('/business/campaigns/new')}
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>
      {RIGHT_ITEMS.map(renderItem)}
    </nav>
  );
}
