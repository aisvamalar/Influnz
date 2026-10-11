/**
 * Campaign content (/business/campaigns/:id/content).
 * Mobile and web both open the campaign workspace on its Content tab.
 */
import { useParams } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import CampaignWorkspaceMobile from './mobile/CampaignWorkspaceMobile';
import NegotiationPreviewPageWeb from './web/NegotiationPreviewPageWeb';

export default function CampaignContentPage() {
  const { isMobile } = useResponsive();
  const { id } = useParams();
  if (isMobile) return <CampaignWorkspaceMobile />;
  return <NegotiationPreviewPageWeb key={id} />;
}
