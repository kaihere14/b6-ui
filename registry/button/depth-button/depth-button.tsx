"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * B6 UI — Depth Button
 *
 * A button that sits on a hard, unblurred ledge and travels down into it when
 * pressed. Hovering sinks it halfway (4px ledge → 2px), pressing takes it all
 * the way down to a flush 0px, so the surface finishes level with the page. The
 * travel and the ledge always add up to the same 4px, which is what makes it
 * read as one physical key rather than a shadow that moves.
 *
 * Both heights are tokens (`--shadow-b6-depth`, `--shadow-b6-depth-sm`) reading
 * a single depth colour, so the ledge follows the theme.
 */
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
  body: "text-(length:--text-body) leading-(--text-body--line-height)",
} as const;

const depthButtonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2",
    "border font-medium whitespace-nowrap select-none",
    "shadow-b6-depth",
    // The ledge collapses to a zero-offset shadow, never to `none`: CSS cannot
    // interpolate a shadow to `none`, so `shadow-none` would snap the ledge
    // away while the button was still travelling into it.
    //
    // `ease-b6`, not `ease-b6-out`. The out curve spends four fifths of its
    // distance in its first fifth of time, which over 4px of travel is not read
    // as a fast movement — it is read as a jump followed by a crawl. The
    // in-out curve keeps the whole 4px visible. The press is a little quicker
    // than the release, the way a key gives way faster than it returns, but
    // both are long enough to be seen.
    //
    // Promoted to its own layer, so the label slides as a texture instead of
    // being re-rasterised against the moving ledge on every frame.
    "transform-gpu will-change-transform",
    "transition-[transform,box-shadow,background-color,border-color,opacity] duration-200 ease-b6",
    "hover:translate-y-0.5 hover:shadow-b6-depth-sm",
    "active:translate-y-1 active:shadow-b6-depth-flush active:duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    // A control that cannot be pressed keeps its full ledge and never moves —
    // the depth is an affordance, so offering it would be a lie.
    "disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 disabled:shadow-b6-depth",
    "aria-disabled:pointer-events-none aria-disabled:translate-y-0 aria-disabled:opacity-50 aria-disabled:shadow-b6-depth",
    // The press is the feedback, not the animation. Under reduced motion the
    // button still travels — it just arrives instantly.
    "motion-reduce:transition-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        // A ledge is the same material as the face it carries, in shade, so
        // every filled variant brings its own and only `outline` keeps the base
        // one. `disabled:` repeats the resting ledge because the base rule sets
        // the neutral one, and the last shadow in the merged class list is the
        // one that lands.
        primary: [
          "border-primary bg-primary text-primary-foreground",
          "hover:bg-primary-hover active:bg-primary-active",
          "shadow-b6-depth-primary hover:shadow-b6-depth-primary-sm active:shadow-b6-depth-primary-flush",
          "disabled:shadow-b6-depth-primary aria-disabled:shadow-b6-depth-primary",
        ],
        secondary: [
          "border-border bg-secondary text-secondary-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "shadow-b6-depth-secondary hover:shadow-b6-depth-secondary-sm active:shadow-b6-depth-secondary-flush",
          "disabled:shadow-b6-depth-secondary aria-disabled:shadow-b6-depth-secondary",
        ],
        // The only variant on the base ledge: an outline button has no fill to
        // take a shade of, so its depth follows its line instead.
        outline: "border-border bg-background text-foreground hover:bg-muted",
        destructive: [
          "border-destructive bg-destructive text-destructive-foreground",
          "hover:bg-destructive-hover active:bg-destructive-active",
          "shadow-b6-depth-destructive hover:shadow-b6-depth-destructive-sm active:shadow-b6-depth-destructive-flush",
          "disabled:shadow-b6-depth-destructive aria-disabled:shadow-b6-depth-destructive",
        ],
      },
      size: {
        sm: `h-8 rounded-sm px-3 ${TYPE.small}`,
        md: `h-10 rounded-md px-4 ${TYPE.body}`,
        lg: `h-12 rounded-md px-6 ${TYPE.body}`,
        icon: "size-10 rounded-md p-0",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false,
    },
  },
);

export interface DepthButtonProps
  extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof depthButtonVariants> {
  /** Render the child element instead of a `<button>`, keeping all styling. */
  asChild?: boolean;
  /** Show a spinner, block interaction and mark the control busy. */
  loading?: boolean;
  /** Accessible label announced while `loading` is true. */
  loadingLabel?: string;
  /** Icon rendered before the label. Replaced by the spinner while loading. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
}

export const DepthButton = React.forwardRef<HTMLButtonElement, DepthButtonProps>(
  function DepthButton(
    {
      className,
      variant,
      size,
      block,
      asChild = false,
      loading = false,
      loadingLabel = "Loading",
      leftIcon,
      rightIcon,
      disabled,
      children,
      type,
      ...props
    },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        className={cn(depthButtonVariants({ variant, size, block }), className)}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        data-loading={loading ? "" : undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 aria-hidden className="animate-spin" />
            <span className="sr-only">{loadingLabel}</span>
          </>
        ) : (
          leftIcon
        )}
        <Slottable>{children}</Slottable>
        {rightIcon}
      </Comp>
    );
  },
);

export { depthButtonVariants };
