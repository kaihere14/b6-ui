"use client";

import { ThinkingOrb } from "@/components/ui/thinking-orb";

export function ThinkingOrbSizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ThinkingOrb size="sm" preset="searching" />
      <ThinkingOrb size="md" preset="searching" />
      <ThinkingOrb size="lg" preset="searching" />
    </div>
  );
}

export function ThinkingOrbTonesExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ThinkingOrb tone="surface" preset="working" />
      <ThinkingOrb tone="muted" preset="working" />
      <ThinkingOrb tone="ghost" preset="working" />
    </div>
  );
}

export function ThinkingOrbCustomExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ThinkingOrb preset="solving" label="Compiling project" speed={1.6} />
      <ThinkingOrb kind="wave" label="Streaming response" tone="muted" />
      <ThinkingOrb preset="idle" active={false} label="Paused" tone="ghost" />
    </div>
  );
}
