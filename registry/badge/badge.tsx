import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * B6 UI — Badge
 *
 * A compact status marker. Badges are labels, not controls: render an
 * interactive element inside a badge only when it is genuinely clickable.
 */
const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
  ],
  {
    variants: {
      variant: {
        primary: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border bg-transparent text-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "h-5 px-2 text-caption uppercase",
        md: "h-6 px-2.5 text-small",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<"span">, VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, size, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
});

export { badgeVariants };
