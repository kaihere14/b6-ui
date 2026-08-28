import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function BadgeTonesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge variant="primary">Stable</Badge>
      <Badge>Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Deprecated</Badge>
    </div>
  );
}

export function BadgeIconExample() {
  return (
    <Badge variant="primary">
      <Check aria-hidden />
      Verified
    </Badge>
  );
}
