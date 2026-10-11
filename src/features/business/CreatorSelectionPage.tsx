import { useResponsive } from '../../hooks/useResponsive';
import CreatorsListMobile from './mobile/CreatorsListMobile';
import CreatorSelectionWeb from './web/CreatorSelectionWeb';

/**
 * Responsive wrapper for Creator Selection/List
 * Renders completely differ../BusinessLayoutor mobile vs desktop
 */
export default function CreatorSelectionPage() {
  const { isMobile } = useResponsive();

  return isMobile ? <CreatorsListMobile /> : <CreatorSelectionWeb />;
}
