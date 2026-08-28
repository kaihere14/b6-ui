import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * B6 UI — Input
 *
 * A single-line text field. The native `size` attribute is deliberately not
 * forwarded: `size` here selects a B6 sizing token instead.
 */
const inputVariants = cva(
  [
    "flex w-full min-w-0 rounded-md border bg-background text-foreground",
    "placeholder:text-muted-foreground",
    "transition-[border-color,box-shadow,background-color] duration-150 ease-b6",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
    "file:mr-3 file:border-0 file:bg-transparent file:text-small file:font-medium",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-small",
        md: "h-10 px-3 text-body",
        lg: "h-12 px-4 text-body",
      },
      tone: {
        default: "border-input",
        subtle: "border-transparent bg-muted",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "default",
    },
  },
);

export interface InputProps
  extends
    Omit<React.ComponentPropsWithoutRef<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Marks the field invalid and wires up `aria-invalid` for screen readers. */
  invalid?: boolean;
  /** Icon rendered inside the leading edge of the field. */
  leftIcon?: React.ReactNode;
  /** Icon or affordance rendered inside the trailing edge of the field. */
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, tone, invalid, leftIcon, rightIcon, type = "text", ...props },
  ref,
) {
  const control = (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      aria-invalid={invalid || undefined}
      className={cn(
        inputVariants({ size, tone }),
        leftIcon && "pl-9",
        rightIcon && "pr-9",
        className,
      )}
      {...props}
    />
  );

  if (!leftIcon && !rightIcon) return control;

  return (
    <div className="relative w-full">
      {leftIcon ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground [&_svg]:size-4"
        >
          {leftIcon}
        </span>
      ) : null}
      {control}
      {rightIcon ? (
        <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground [&_svg]:size-4">
          {rightIcon}
        </span>
      ) : null}
    </div>
  );
});

export { inputVariants };
