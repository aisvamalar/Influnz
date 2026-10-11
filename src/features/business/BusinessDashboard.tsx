import { useResponsive } from '../../hooks/useResponsive';
import BusinessDashboardMobile from './mobile/BusinessDashboardMobile';
import BusinessDashboardWeb from './web/BusinessDashboardWeb';

/**
 * Responsive wrapper for Business Dashboard
 * Renders completely different components for mobile vs desktop
 */
export default function BusinessDashboard() {
  const { isMobile } = useResponsive();

  // Mobile view (< 768px)
  if (isMobile) {
    return <BusinessDashboardMobile />;
  }

  // Desktop view (>= 768px)
  return <BusinessDashboardWeb />;
}
