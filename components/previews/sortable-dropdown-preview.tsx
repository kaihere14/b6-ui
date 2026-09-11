"use client";

import * as React from "react";
import { Bell, Mail, MessageSquare, SlidersHorizontal } from "lucide-react";

import { SortableDropdown, type SortableDropdownItem } from "@/components/ui/sortable-dropdown";

function ChannelIcon({ icon: Icon }: { icon: typeof Mail }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground">
      <Icon aria-hidden size={13} />
    </span>
  );
}

const items: SortableDropdownItem[] = [
  { id: "push", label: "Push", icon: <ChannelIcon icon={Bell} /> },
  { id: "email", label: "Email", icon: <ChannelIcon icon={Mail} /> },
  { id: "sms", label: "SMS", icon: <ChannelIcon icon={MessageSquare} /> },
];

export function SortableDropdownPreview() {
  const [order, setOrder] = React.useState(items.map((item) => item.id));

  // A fake network round trip, so the apply button's loading state is
  // visible instead of jumping straight to success.
  const handleApply = async (next: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setOrder(next);
  };

  return (
    <SortableDropdown
      items={items}
      order={order}
      onOrderChange={setOrder}
      label="Notify me by"
      triggerIcon={
        <SlidersHorizontal aria-hidden size={16} className="shrink-0 text-muted-foreground" />
      }
      eyebrow="Notification priority"
      description="Drag to rank. The top channel fires first, the rest are fallbacks in order."
      onApply={handleApply}
    />
  );
}
