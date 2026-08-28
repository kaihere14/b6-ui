import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function BadgePreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge variant="primary">Stable</Badge>
      <Badge>Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="destructive">Deprecated</Badge>
      <Badge size="sm" variant="outline">
        v0.1.0
      </Badge>
      <Badge variant="primary">
        <Check aria-hidden />
        Verified
      </Badge>
    </div>
  );
}
