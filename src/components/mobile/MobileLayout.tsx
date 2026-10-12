import { ReactNode } from 'react';
import MobileBottomNavigation from './MobileBottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  activeNavItem?: 'home' | 'campaigns' | 'payments' | 'analytics';
}

/**
 * Mobile Layout Wrapper
 * Provides consistent mobile container with optional bottom navigation
 */
export default function MobileLayout({ 
  children, 
  showBottomNav = false,
  activeNavItem 
}: MobileLayoutProps) {
  return (
    <div style={{
      background: '#fafafa',
      minHeight: '100vh',
      paddingBottom: showBottomNav ? '80px' : '0'
    }}>
      {children}
      {showBottomNav && <MobileBottomNavigation active={activeNavItem} />}
    </div>
  );
}
