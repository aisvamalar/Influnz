import { useResponsive } from './useResponsive';

/**
 * Scale factor for screens wider than the layout's design width (large monitors or a
 * zoomed-out browser), so the layout grows with the viewport instead of floating in a
 * fixed-width column. Never shrinks below 1, so zooming in still reaches the
 * tablet and mobile breakpoints.
 */
export function useViewportScale(designWidth: number, maxScale = 2.4): number {
  const { width } = useResponsive();
  const scale = width / designWidth;
  if (scale <= 1) return 1;
  return Math.round(Math.min(scale, maxScale) * 1000) / 1000;
}
