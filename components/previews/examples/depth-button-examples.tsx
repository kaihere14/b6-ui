import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { DepthButton } from "@/components/ui/depth-button";

export function DepthButtonVariantsExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <DepthButton>Get started</DepthButton>
      <DepthButton variant="secondary">Learn more</DepthButton>
      <DepthButton variant="outline">Docs</DepthButton>
      <DepthButton variant="destructive">Delete</DepthButton>
    </div>
  );
}

export function DepthButtonSizesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <DepthButton size="sm">Small</DepthButton>
      <DepthButton size="md">Medium</DepthButton>
      <DepthButton size="lg">Large</DepthButton>
      <DepthButton size="icon" aria-label="Download">
        <Download />
      </DepthButton>
    </div>
  );
}

export function DepthButtonStatesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <DepthButton variant="outline" leftIcon={<Download />}>
        Install
      </DepthButton>
      <DepthButton loading loadingLabel="Saving changes">
        Saving
      </DepthButton>
      <DepthButton variant="secondary" disabled>
        Disabled
      </DepthButton>
    </div>
  );
}

export function DepthButtonAsLinkExample() {
  return (
    <DepthButton asChild rightIcon={<ArrowRight />}>
      <Link href="/components">Browse components</Link>
    </DepthButton>
  );
}
