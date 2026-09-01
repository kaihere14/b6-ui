"use client";

import { CrossButton } from "@/components/ui/cross-button";

export function CrossButtonPreview() {
  return (
    <div className="flex items-center justify-center gap-6 py-8">
      <CrossButton variant="ghost" aria-label="Close" />
      <CrossButton mode="timed" variant="outline" duration={3000} />
    </div>
  );
}
