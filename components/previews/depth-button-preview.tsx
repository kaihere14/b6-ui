import { ArrowRight, Download } from "lucide-react";

import { DepthButton } from "@/components/ui/depth-button";

export function DepthButtonPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-2">
      <DepthButton>Get started</DepthButton>
      <DepthButton variant="secondary">Learn more</DepthButton>
      <DepthButton variant="outline" leftIcon={<Download />}>
        Install
      </DepthButton>
      <DepthButton variant="destructive" rightIcon={<ArrowRight />}>
        Delete
      </DepthButton>
      <DepthButton loading>Saving</DepthButton>
      <DepthButton variant="outline" disabled>
        Disabled
      </DepthButton>
    </div>
  );
}
