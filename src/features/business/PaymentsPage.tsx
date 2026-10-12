/**
 * Screen 19 — Payments
 * Renders the mobile or web layout based on the current device/viewport.
 */
import { useResponsive } from '../../hooks/useResponsive';
import PaymentsPageMobile from './mobile/PaymentsPageMobile';
import PaymentsPageWeb from './web/PaymentsPageWeb';

export default function PaymentsPage() {
  const { isMobile } = useResponsive();
  if (isMobile) return <PaymentsPageMobile />;
  return <PaymentsPageWeb />;
}
