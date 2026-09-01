"use client";

import { CrossButton } from "@/components/ui/cross-button";

export function CrossButtonVariantsExample() {
  return (
    <div className="flex items-center gap-4">
      <CrossButton variant="ghost" aria-label="Close" />
      <CrossButton variant="outline" aria-label="Close" />
      <CrossButton variant="solid" aria-label="Close" />
      <CrossButton variant="soft" aria-label="Close" />
      <CrossButton variant="destructive" aria-label="Close" />
    </div>
  );
}

export function CrossButtonSizesExample() {
  return (
    <div className="flex items-center gap-4">
      <CrossButton size="sm" variant="outline" aria-label="Close" />
      <CrossButton size="md" variant="outline" aria-label="Close" />
      <CrossButton size="lg" variant="outline" aria-label="Close" />
    </div>
  );
}

export function CrossButtonShapesExample() {
  return (
    <div className="flex items-center gap-4">
      <CrossButton shape="square" variant="outline" size="md" aria-label="Close" />
      <CrossButton shape="circle" variant="outline" size="md" aria-label="Close" />
      <CrossButton shape="square" variant="solid" size="lg" aria-label="Close" />
      <CrossButton shape="circle" variant="solid" size="lg" aria-label="Close" />
    </div>
  );
}

export function CrossButtonTimedExample() {
  return (
    <div className="flex items-center gap-6">
      <CrossButton
        mode="timed"
        variant="outline"
        duration={3000}
        onReady={() => console.log("Ready!")}
      />
      <CrossButton
        mode="timed"
        variant="ghost"
        shape="circle"
        duration={5000}
      />
    </div>
  );
}


