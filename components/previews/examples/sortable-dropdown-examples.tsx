"use client";

import * as React from "react";
import { Layers } from "lucide-react";

import {
  SortableDropdown,
  SortableDropdownAvatar,
  type SortableDropdownItem,
} from "@/components/ui/sortable-dropdown";

const regions: SortableDropdownItem[] = [
  { id: "us", label: "US East", icon: <SortableDropdownAvatar alt="US East" /> },
  { id: "eu", label: "EU West", icon: <SortableDropdownAvatar alt="EU West" /> },
  { id: "ap", label: "AP South", icon: <SortableDropdownAvatar alt="AP South" /> },
];

export function SortableDropdownVariantsExample() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <SortableDropdown items={regions} label="Failover order" variant="outline" size="sm" />
      <SortableDropdown items={regions} label="Failover order" variant="ghost" size="md" />
    </div>
  );
}

const providers: SortableDropdownItem[] = [
  {
    id: "gemini",
    label: "Gemini",
    icon: <SortableDropdownAvatar alt="Gemini" />,
  },
  {
    id: "sarvam",
    label: "Sarvam",
    icon: <SortableDropdownAvatar alt="Sarvam" />,
    badge: (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted px-1.5 py-0.5 text-caption font-black tracking-wider text-muted-foreground uppercase">
        <Layers size={9} strokeWidth={2.75} aria-hidden />
        Low context
      </span>
    ),
  },
];

export function SortableDropdownAsyncExample() {
  const [order, setOrder] = React.useState(providers.map((item) => item.id));

  // The apply button tracks this itself: loading while it runs, then success
  // or error depending on whether it resolves or throws. Drag Sarvam to the
  // top and apply to see the error state and its shake.
  const handleApply = async (next: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    if (next[0] === "sarvam") throw new Error("Sarvam can't be primary");
    setOrder(next);
  };

  return (
    <SortableDropdown
      items={providers}
      order={order}
      onOrderChange={setOrder}
      label="AI Priority"
      eyebrow="AI provider priority"
      description="Top is primary, the rest are fallbacks in order."
      note="Sarvam has a small context window: the pipeline trims context to fit before calling it. Drag it to the top and apply to see the error state."
      applyErrorLabel="Can't be primary"
      onApply={handleApply}
    />
  );
}

// A fake network round trip, so the loading state is visible instead of
// flashing straight through to success.
const fakeApiCall = () => new Promise<void>((resolve) => setTimeout(resolve, 1200));

export function SortableDropdownApplyVariantsExample() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <SortableDropdown
        items={regions}
        label="Failover order"
        applyVariant="primary"
        onApply={fakeApiCall}
      />
      <SortableDropdown
        items={regions}
        label="Failover order"
        applyVariant="secondary"
        onApply={fakeApiCall}
      />
      <SortableDropdown
        items={regions}
        label="Failover order"
        applyVariant="outline"
        onApply={fakeApiCall}
      />
      <SortableDropdown
        items={regions}
        label="Failover order"
        applyVariant="destructive"
        onApply={fakeApiCall}
      />
    </div>
  );
}
