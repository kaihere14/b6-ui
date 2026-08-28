import * as React from "react";

import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical";
  /**
   * Purely visual separators are hidden from assistive technology. Set this to
   * `false` when the rule genuinely divides two groups of content.
   */
  decorative?: boolean;
  /** Optional label rendered inside a horizontal rule. */
  label?: React.ReactNode;
}

/**
 * B6 UI — Separator
 *
 * A one-pixel rule in the shared border colour, optionally captioned.
 */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { className, orientation = "horizontal", decorative = true, label, ...props },
  ref,
) {
  const semantics = decorative
    ? ({ role: "none" } as const)
    : ({ role: "separator", "aria-orientation": orientation } as const);

  if (label && orientation === "horizontal") {
    return (
      <div
        ref={ref}
        data-slot="separator"
        className={cn("flex w-full items-center gap-3", className)}
        {...semantics}
        {...props}
      >
        <span className="h-px flex-1 bg-border" />
        <span className="text-caption text-muted-foreground uppercase">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-slot="separator"
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px self-stretch",
        className,
      )}
      {...semantics}
      {...props}
    />
  );
});
