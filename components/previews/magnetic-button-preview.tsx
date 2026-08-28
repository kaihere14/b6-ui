"use client";

import { ArrowUpRight } from "lucide-react";

import { MagneticButton } from "@/components/ui/magnetic-button";

export function MagneticButtonPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-6">
      <MagneticButton rightIcon={<ArrowUpRight />}>Hover me</MagneticButton>
      <MagneticButton variant="outline" strength={0.5} maxTravel={40}>
        Stronger pull
      </MagneticButton>
      <MagneticButton variant="secondary" magnetic={false}>
        Magnet off
      </MagneticButton>
    </div>
  );
}
