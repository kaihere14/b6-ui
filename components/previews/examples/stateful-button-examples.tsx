"use client";

import { StatefulButton } from "@/components/ui/stateful-button";

export function StatefulButtonDefaultExample() {
  return <StatefulButton>Get started</StatefulButton>;
}

export function StatefulButtonLoadingExample() {
  return (
    <StatefulButton loading loadingLabel="Saving changes">
      Save
    </StatefulButton>
  );
}
