'use client';

import { useEffect, useRef } from 'react';

// The Capital Flow mark: an open C with the gold signal dot in its mouth, wearing a thin ring.
// The ring spins once on its vertical axis on load and again on hover (half turns: the ring is
// symmetric, so 180 degrees looks like a full revolution). Still for reduced motion.
export const GOLD = '#f3c754';

export default function Logo({ size = 30 }) {
  const svg = useRef(null);
  const spin = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      svg.current?.pauseAnimations?.();
      svg.current?.setCurrentTime?.(0);
      return;
    }
    const link = svg.current?.closest('a');
    const replay = () => spin.current?.beginElement?.();
    link?.addEventListener('mouseenter', replay);
    link?.addEventListener('focus', replay);
    return () => {
      link?.removeEventListener('mouseenter', replay);
      link?.removeEventListener('focus', replay);
    };
  }, []);

  return (
    <svg ref={svg} className="cf-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ flex: 'none', display: 'block' }}>
      <path d="M42.2 14 A22 22 0 1 0 42.2 50" fill="none" stroke={GOLD} strokeWidth="4.4" strokeLinecap="round" />
      <ellipse cx="48.1" cy="32" rx="9" ry="9" fill="none" stroke={GOLD} strokeWidth="2.6">
        <animate
          ref={spin}
          attributeName="rx"
          values="9;0.05;9"
          keyTimes="0;0.5;1"
          calcMode="spline"
          keySplines="0.12 0 0.39 0; 0.61 1 0.88 1"
          dur="0.8s"
          begin="0.5s"
          repeatCount="2"
        />
      </ellipse>
      <circle cx="48.1" cy="32" r="4.6" fill={GOLD} />
    </svg>
  );
}
