/**
 * Campaign setup, step 1 — choose a campaign strategy.
 * Renders the mobile or web layout based on the current device/viewport.
 */
import MobileBottomNav from '../../components/mobile/MobileBottomNav';
import { useResponsive } from '../../hooks/useResponsive';
import CampaignStrategyPageMobile from './mobile/CampaignStrategyPageMobile';
import CampaignStrategyPageWeb from './web/CampaignStrategyPageWeb';

export default function CampaignStrategyPage() {
  const { isMobile } = useResponsive();
  if (isMobile) {
    return (
      <>
        <CampaignStrategyPageMobile />
        <MobileBottomNav activeItem="campaigns" />
      </>
    );
  }
  return <CampaignStrategyPageWeb />;
}
