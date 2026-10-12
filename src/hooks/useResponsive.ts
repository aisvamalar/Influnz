import { useState, useEffect } from 'react';

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  /** True when the page is opened on a phone, regardless of orientation. */
  isPhoneDevice: boolean;
  isTouch: boolean;
  width: number;
  height: number;
}

const MOBILE_MAX = 768;
const TABLET_MAX = 1024;
const PHONE_UA = /Android.+Mobile|iPhone|iPod|Windows Phone|IEMobile|BlackBerry|Opera Mini/i;

interface NavigatorWithUAData extends Navigator {
  userAgentData?: { mobile?: boolean };
}

function detectPhoneDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as NavigatorWithUAData;
  if (nav.userAgentData?.mobile !== undefined) return nav.userAgentData.mobile;
  return PHONE_UA.test(nav.userAgent);
}

function detectTouch(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

function readState(): ResponsiveState {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const isPhoneDevice = detectPhoneDevice();

  // Phones in landscape can exceed 768px, so they stay on the mobile layout.
  const isMobile = width < MOBILE_MAX || (isPhoneDevice && width < TABLET_MAX);
  const isDesktop = !isMobile && width >= TABLET_MAX;

  return {
    isMobile,
    isTablet: !isMobile && !isDesktop,
    isDesktop,
    isPhoneDevice,
    isTouch: detectTouch(),
    width,
    height,
  };
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(readState);

  useEffect(() => {
    const update = () => setState(readState());

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    update();

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return state;
}
