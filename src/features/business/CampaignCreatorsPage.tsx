/**
 * Campaign setup, step 2 — review and confirm the creator portfolio.
 * Renders the mobile or web layout based on the current device/viewport.
 */
import MobileBottomNav from '../../components/mobile/MobileBottomNav';
import { useResponsive } from '../../hooks/useResponsive';
import CampaignCreatorsPageMobile from './mobile/CampaignCreatorsPageMobile';
import CampaignCreatorsPageWeb from './web/CampaignCreatorsPageWeb';

export default function CampaignCreatorsPage() {
  const { isMobile } = useResponsive();
  if (isMobile) {
    return (
      <>
        <CampaignCreatorsPageMobile />
        <MobileBottomNav activeItem="campaigns" />
      </>
    );
  }
  return <CampaignCreatorsPageWeb />;
}
