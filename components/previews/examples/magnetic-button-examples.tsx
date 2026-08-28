"use client";

import { MagneticButton } from "@/components/ui/magnetic-button";

export function MagneticButtonDefaultExample() {
  return <MagneticButton>Get started</MagneticButton>;
}

export function MagneticButtonStrengthExample() {
  return (
    <MagneticButton variant="outline" strength={0.5} maxTravel={40}>
      Stronger pull
    </MagneticButton>
  );
}

export function MagneticButtonOptOutExample() {
  return <MagneticButton magnetic={false}>Magnet off</MagneticButton>;
}
