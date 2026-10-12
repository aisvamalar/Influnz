/**
 * Approvals (/business/approvals).
 * Mobile keeps its approvals list; web reviews content inside the campaign workspace.
 */
import { Navigate } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import ApprovalsPageMobile from './mobile/ApprovalsPageMobile';

export default function ApprovalsPage() {
  const { isMobile } = useResponsive();
  if (isMobile) return <ApprovalsPageMobile />;
  return <Navigate to="/business/campaigns/1?tab=content&creator=pranav" replace />;
}
