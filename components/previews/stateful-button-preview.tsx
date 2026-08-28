"use client";

import { StatefulButton } from "@/components/ui/stateful-button";

export function StatefulButtonPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-6">
      <StatefulButton>Click me</StatefulButton>
      <StatefulButton variant="outline">Outline</StatefulButton>
      <StatefulButton variant="secondary">Secondary</StatefulButton>
    </div>
  );
}
