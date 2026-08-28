import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function InputPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-small font-medium" htmlFor="b6-preview-email">
          Email
        </label>
        <Input id="b6-preview-email" type="email" placeholder="you@example.com" />
      </div>
      <Input aria-label="Search components" leftIcon={<Search />} placeholder="Search…" />
      <Input aria-label="Subtle field" tone="subtle" size="sm" placeholder="Subtle, small" />
      <Input aria-label="Invalid field" invalid defaultValue="not-an-email" />
      <Input aria-label="Disabled field" disabled placeholder="Disabled" />
    </div>
  );
}
