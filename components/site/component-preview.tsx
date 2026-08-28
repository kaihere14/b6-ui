import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ComponentPreviewProps {
  children: ReactNode;
  className?: string;
}

/** The framed canvas every component preview renders inside. */
export function ComponentPreview({ children, className }: ComponentPreviewProps) {
  return (
    <div
      className={cn(
        "flex min-h-56 w-full items-center justify-center rounded-lg border border-border bg-card p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
