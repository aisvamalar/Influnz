/**
 * Campaign setup, step 3 — negotiation guardrails and AI offer preview.
 * Renders the mobile or web layout based on the current device/viewport.
 */
import MobileBottomNav from '../../components/mobile/MobileBottomNav';
import { useResponsive } from '../../hooks/useResponsive';
import NegotiationParametersPageMobile from './mobile/NegotiationParametersPageMobile';
import NegotiationParametersPageWeb from './web/NegotiationParametersPageWeb';

export default function NegotiationParametersPage() {
  const { isMobile } = useResponsive();
  if (isMobile) {
    return (
      <>
        <NegotiationParametersPageMobile />
        <MobileBottomNav activeItem="campaigns" />
      </>
    );
  }
  return <NegotiationParametersPageWeb />;
}
