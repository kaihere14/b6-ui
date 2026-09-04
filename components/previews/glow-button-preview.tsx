import { ArrowRight, Download } from "lucide-react";

import { GlowButton } from "@/components/ui/glow-button";

export function GlowButtonPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-2">
      <GlowButton>Get started</GlowButton>
      <GlowButton variant="secondary">Learn more</GlowButton>
      <GlowButton variant="outline" leftIcon={<Download />}>
        Install
      </GlowButton>
      <GlowButton variant="destructive" rightIcon={<ArrowRight />}>
        Delete
      </GlowButton>
      <GlowButton loading>Saving</GlowButton>
      <GlowButton variant="outline" disabled>
        Disabled
      </GlowButton>
    </div>
  );
}
