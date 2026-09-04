import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { GlowButton } from "@/components/ui/glow-button";

export function GlowButtonVariantsExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <GlowButton>Get started</GlowButton>
      <GlowButton variant="secondary">Learn more</GlowButton>
      <GlowButton variant="outline">Docs</GlowButton>
      <GlowButton variant="destructive">Delete</GlowButton>
    </div>
  );
}

export function GlowButtonSizesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <GlowButton size="sm">Small</GlowButton>
      <GlowButton size="md">Medium</GlowButton>
      <GlowButton size="lg">Large</GlowButton>
      <GlowButton size="icon" aria-label="Download">
        <Download />
      </GlowButton>
    </div>
  );
}

export function GlowButtonStatesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <GlowButton variant="outline" leftIcon={<Download />}>
        Install
      </GlowButton>
      <GlowButton loading loadingLabel="Saving changes">
        Saving
      </GlowButton>
      <GlowButton variant="secondary" disabled>
        Disabled
      </GlowButton>
    </div>
  );
}

export function GlowButtonAsLinkExample() {
  return (
    <GlowButton asChild rightIcon={<ArrowRight />}>
      <Link href="/components">Browse components</Link>
    </GlowButton>
  );
}
