import { useNavigate } from 'react-router-dom';
import { Home, BarChart3, Wallet, TrendingUp } from 'lucide-react';

interface MobileBottomNavigationProps {
  active?: 'home' | 'campaigns' | 'payments' | 'analytics';
}

/**
 * Mobile Bottom Navigation Bar
 * Fixed bottom navigation for main screens
 */
export default function MobileBottomNavigation({ active }: MobileBottomNavigationProps) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/business' },
    { id: 'campaigns', label: 'Campaigns', icon: BarChart3, path: '/business/campaigns' },
    { id: 'payments', label: 'Payments', icon: Wallet, path: '/business/payments' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/business/analytics' }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '8px 0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.08)'
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              color: isActive ? '#dc2626' : '#6b7280',
              minWidth: '64px'
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? '700' : '600'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
