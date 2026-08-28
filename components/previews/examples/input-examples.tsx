import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function InputLabelledExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <label className="text-small font-medium" htmlFor="email">
        Email
      </label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  );
}

export function InputSearchExample() {
  // `leftIcon` wraps the field in a full-width positioning element, so the width
  // has to be capped on a wrapper rather than through the input's `className`.
  return (
    <div className="w-full max-w-sm">
      <Input aria-label="Search" leftIcon={<Search />} placeholder="Search…" />
    </div>
  );
}

export function InputInvalidExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Input invalid aria-describedby="email-error" defaultValue="not-an-email" />
      <p id="email-error" className="text-small text-destructive">
        Enter a valid email.
      </p>
    </div>
  );
}
