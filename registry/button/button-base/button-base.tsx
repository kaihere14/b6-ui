"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * B6 UI: Button Base
 *
 * The foundation button of the B6 UI system. Solid variants carry a hairline
 * inset highlight along their top edge, which is the recurring B6 signature for
 * raised, pressable surfaces.
 */
/**
 * B6 type steps, written as direct token reads.
 *
 * `text-body` and `text-primary-foreground` fall into the same tailwind-merge
 * class group unless cn() has been told the B6 scale is a font size, so under a
 * stock shadcn cn() the size silently deletes the colour and the label renders
 * in whatever colour it inherits, invisible on a solid button. Reading the
 * token directly lands the step in the font-size group for every cn(), extended
 * or not, and still loses to a consumer's own `text-lg`.
 */
const TYPE = {
  small: "text-(length:--text-small) leading-(--text-small--line-height)",
  body: "text-(length:--text-body) leading-(--text-body--line-height)",
} as const;

const buttonBaseVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2",
    "font-medium whitespace-nowrap select-none",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-b6",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-y-px",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground shadow-b6-sm",
          "hover:brightness-[1.06] active:brightness-[0.97]",
        ],
        secondary:
          "bg-secondary text-secondary-foreground shadow-b6-xs hover:bg-accent hover:text-accent-foreground",
        outline:
          "border border-border bg-background text-foreground shadow-b6-xs hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        destructive: [
          "bg-destructive text-destructive-foreground shadow-b6-sm",
          "hover:brightness-[1.06] active:brightness-[0.97]",
        ],
        link: "text-primary underline-offset-4 hover:underline active:translate-y-0",
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

export interface ButtonBaseProps
  extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof buttonBaseVariants> {
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

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  function ButtonBase(
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
        className={cn(buttonBaseVariants({ variant, size, block }), className)}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={asChild ? isDisabled || undefined : undefined}
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

export { buttonBaseVariants };
