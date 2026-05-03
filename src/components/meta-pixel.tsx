'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Script from 'next/script';

const PIXEL_ID = '1490294812727730';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function initPixel() {
  if (window.fbq) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fbq: any = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      (fbq.queue ??= []).push(args);
    }
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
}

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return (
    <Script
      src="https://connect.facebook.net/en_US/fbevents.js"
      strategy="afterInteractive"
      onLoad={initPixel}
    />
  );
}
