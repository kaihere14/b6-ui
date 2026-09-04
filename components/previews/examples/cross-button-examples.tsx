"use client";

import { useState } from "react";

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

export function CrossButtonAdExample() {
  const [dismissed, setDismissed] = useState(false);
  // Bumping the key remounts the ad so the countdown replays from the start.
  const [runId, setRunId] = useState(0);

  if (dismissed) {
    return (
      <button
        type="button"
        onClick={() => {
          setRunId((id) => id + 1);
          setDismissed(false);
        }}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-small text-muted-foreground shadow-b6-xs hover:bg-muted"
      >
        Show the ad again
      </button>
    );
  }

  return (
    <div
      key={runId}
      className="relative w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card p-5 text-card-foreground shadow-b6-sm"
    >
      <span className="absolute top-3 left-3 rounded-xs bg-muted px-1.5 py-0.5 text-caption font-medium tracking-wide text-muted-foreground uppercase">
        Ad
      </span>

      <div className="mt-6 flex flex-col gap-2">
        <p className="text-body font-semibold">Your product name here</p>
        <p className="text-small text-muted-foreground">
          The close control stays locked while the countdown traces its border. Once it
          finishes, you can dismiss the ad.
        </p>
        <span className="mt-2 inline-flex w-fit rounded-md bg-primary px-3 py-1.5 text-small font-medium text-primary-foreground">
          Learn more
        </span>
      </div>

      <CrossButton
        className="absolute top-2 right-2"
        mode="timed"
        variant="ghost"
        size="sm"
        duration={5000}
        label="Close ad"
        onClick={() => setDismissed(true)}
      />
    </div>
  );
}
