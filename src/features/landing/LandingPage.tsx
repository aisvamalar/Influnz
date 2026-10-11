import { useResponsive } from '../../hooks/useResponsive';
import LandingPageMobile from './mobile/LandingPageMobile';
import LandingPageWeb from './web/LandingPageWeb';

/**
 * Responsive wrapper for Landing Page
 * Renders completely different components for mobile vs desktop
 */
export default function LandingPage() {
  const { isMobile } = useResponsive();

  // Mobile view (< 768px)
  if (isMobile) {
    return <LandingPageMobile />;
  }

  // Desktop view (>= 768px)
  return <LandingPageWeb />;
}
