import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * B6 UI — Card Base
 *
 * A composable surface. Compose it as
 * `CardBase > CardBaseHeader > CardBaseTitle / CardBaseDescription`, followed by
 * `CardBaseContent` and optionally `CardBaseFooter`.
 */
const cardBaseVariants = cva(
  "flex flex-col rounded-lg text-card-foreground transition-[box-shadow,border-color,transform] duration-200 ease-b6",
  {
    variants: {
      variant: {
        outline: "border border-border bg-card",
        elevated: "border border-border bg-card shadow-b6-md",
        muted: "border border-transparent bg-muted",
      },
      padding: {
        none: "",
        sm: "gap-3 p-4",
        md: "gap-4 p-6",
        lg: "gap-5 p-8",
      },
      interactive: {
        true: "cursor-pointer hover:-translate-y-0.5 hover:shadow-b6-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      padding: "md",
      interactive: false,
    },
  },
);

export interface CardBaseProps
  extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof cardBaseVariants> {
  /** Render the child element instead of a `<div>`, keeping all styling. */
  asChild?: boolean;
}

/**
 * B6 type steps, written as direct token reads.
 *
 * `text-body` and `text-primary-foreground` fall into the same tailwind-merge
 * class group unless cn() has been told the B6 scale is a font size, so under a
 * stock shadcn cn() the size silently deletes the colour and the label renders
 * in whatever colour it inherits — invisible on a solid button. Reading the
 * token directly lands the step in the font-size group for every cn(), extended
 * or not, and still loses to a consumer's own `text-lg`.
 */
const TYPE = {
  small: "text-(length:--text-small) leading-(--text-small--line-height)",
  h3: "text-(length:--text-h3) leading-(--text-h3--line-height) tracking-(--text-h3--letter-spacing) font-(weight:--text-h3--font-weight)",
} as const;

export const CardBase = React.forwardRef<HTMLDivElement, CardBaseProps>(function CardBase(
  { className, variant, padding, interactive, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="card"
      className={cn(cardBaseVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  );
});

export const CardBaseHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function CardBaseHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
});

export interface CardBaseTitleProps extends React.ComponentPropsWithoutRef<"h3"> {
  /** Heading level to render. Pick the one that fits the page outline. */
  as?: "h2" | "h3" | "h4";
}

export const CardBaseTitle = React.forwardRef<HTMLHeadingElement, CardBaseTitleProps>(
  function CardBaseTitle({ className, as: Comp = "h3", ...props }, ref) {
    return (
      <Comp ref={ref} data-slot="card-title" className={cn(TYPE.h3, className)} {...props} />
    );
  },
);

export const CardBaseDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(function CardBaseDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn(TYPE.small, "text-muted-foreground", className)}
      {...props}
    />
  );
});

export const CardBaseContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function CardBaseContent({ className, ...props }, ref) {
  return (
    <div ref={ref} data-slot="card-content" className={cn("flex-1", className)} {...props} />
  );
});

export const CardBaseFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function CardBaseFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
});

export { cardBaseVariants };
