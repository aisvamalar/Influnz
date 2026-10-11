/**
 * Screen 16 — Performance Intelligence (Analytics)
 * Renders the mobile or web layout based on the current device/viewport.
 */
import { useResponsive } from '../../hooks/useResponsive';
import AnalyticsPageMobile from './mobile/AnalyticsPageMobile';
import AnalyticsPageWeb from './web/AnalyticsPageWeb';

export default function AnalyticsPage() {
  const { isMobile } = useResponsive();
  if (isMobile) return <AnalyticsPageMobile />;
  return <AnalyticsPageWeb />;
}
