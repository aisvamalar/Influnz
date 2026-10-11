import { useResponsive } from '../../hooks/useResponsive';
import CampaignListPageMobile from './mobile/CampaignListPageMobile';
import CampaignListPageWeb from './web/CampaignListPageWeb';

/**
 * Responsive wrapper for Campaign List Page
 * Renders completely different components for mobile vs desktop
 */
export default function CampaignListPage() {
  const { isMobile } = useResponsive();

  // Mobile view (< 768px)
  if (isMobile) {
    return <CampaignListPageMobile />;
  }

  // Desktop view (>= 768px)
  return <CampaignListPageWeb />;
}
