/**
 * Campaign workspace — offers, creator content, performance and payments.
 * Renders the mobile or web layout based on the current device/viewport.
 */
import { useResponsive } from '../../hooks/useResponsive';
import CampaignWorkspaceMobile from './mobile/CampaignWorkspaceMobile';
import NegotiationPreviewPageWeb from './web/NegotiationPreviewPageWeb';

export default function NegotiationPreviewPage() {
  const { isMobile } = useResponsive();
  if (isMobile) return <CampaignWorkspaceMobile />;
  return <NegotiationPreviewPageWeb />;
}
