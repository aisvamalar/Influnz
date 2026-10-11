import MobileBottomNav from '../../components/mobile/MobileBottomNav';
import { useResponsive } from '../../hooks/useResponsive';
import CreateCampaignPageMobile from './mobile/CreateCampaignPageMobile';
import CreateCampaignPageWeb from './web/CreateCampaignPageWeb';

/**
 * Responsive wrapper for the Create Campaign (AI assistant) page
 * Renders completely different components for mobile vs desktop
 */
export default function CreateCampaignPage() {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <>
        <CreateCampaignPageMobile />
        <MobileBottomNav />
      </>
    );
  }

  return <CreateCampaignPageWeb />;
}
