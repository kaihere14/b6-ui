"use client";

import { ThinkingOrb } from "@/components/ui/thinking-orb";

export function ThinkingOrbPreview() {
  return (
    <div className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-2">
      <ThinkingOrb preset="idle" />
      <ThinkingOrb preset="thinking" />
      <ThinkingOrb preset="listening" />
      <ThinkingOrb preset="working" />
      <ThinkingOrb preset="searching" />
      <ThinkingOrb preset="solving" />
    </div>
  );
}
