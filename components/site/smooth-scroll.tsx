"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Subtle inertia scroll for the home page only. Mounts/unmounts with the
 * route, so every other page keeps native scrolling. `respectReducedMotion`
 * is Lenis's own reduced-motion handling, not a reimplementation.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        lerp: 0.1,
        wheelMultiplier: 0.9,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
