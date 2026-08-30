"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI — Writing Text
 *
 * Text that writes itself in, one character at a time, behind a blinking
 * caret. The written characters are the only thing that moves; the element
 * reserves no width of its own, so it sits inline in a sentence.
 *
 * This file is standalone by design. It repeats shared styling rather than
 * importing another B6 component, because a registry item has to work in a
 * project that installed nothing else.
 */

/* -------------------------------------------------------------------------- */
/* Styling                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * B6 type steps, written as direct token reads.
 *
 * A named step like `text-body` lands in tailwind-merge's `text-color` group
 * under a stock `cn()`, where it silently deletes an earlier colour utility.
 * Reading the token directly files it under `font-size` for every `cn()`,
 * extended or not, and still loses to a consumer's own `text-lg`.
 */
const TYPE = {
  body: "text-(length:--text-body) leading-(--text-body--line-height)",
  h3: "text-(length:--text-h3) leading-(--text-h3--line-height) tracking-(--text-h3--letter-spacing)",
  h1: "text-(length:--text-h1) leading-(--text-h1--line-height) tracking-(--text-h1--letter-spacing)",
} as const;

const writingTextVariants = cva("inline-flex items-baseline whitespace-pre-wrap", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
    },
    size: {
      sm: TYPE.body,
      md: TYPE.h3,
      lg: TYPE.h1,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

/** Characters written per second when `speed` is left unset. */
const DEFAULT_SPEED = 24;

/** One blink of the caret, in seconds. */
const CARET_PERIOD = 1.1;

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface WritingTextProps
  extends
    Omit<React.ComponentPropsWithoutRef<"span">, "children">,
    VariantProps<typeof writingTextVariants> {
  /** The string to write out. */
  text: string;
  /** Characters written per second. */
  speed?: number;
  /** Seconds to wait before the first character. */
  startDelay?: number;
  /** Show the caret while writing. */
  cursor?: boolean;
  /** Keep the caret after the last character is written. */
  keepCursor?: boolean;
  /** Fires once the last character has been written. */
  onWritten?: () => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export const WritingText = React.forwardRef<HTMLSpanElement, WritingTextProps>(
  function WritingText(
    {
      className,
      variant,
      size,
      text,
      speed = DEFAULT_SPEED,
      startDelay = 0,
      cursor = true,
      keepCursor = false,
      onWritten,
      ...props
    },
    ref,
  ) {
    const shouldReduceMotion = useReducedMotion();

    const progress = useMotionValue(0);
    const written = useTransform(progress, (value) => Math.round(value));
    const [count, setCount] = React.useState(0);

    useMotionValueEvent(written, "change", setCount);

    // Reduced motion gets the finished sentence — the writing is decoration,
    // and the text it carries has to arrive either way.
    const target = shouldReduceMotion ? text.length : count;
    const isDone = target >= text.length;

    const onWrittenRef = React.useRef(onWritten);
    onWrittenRef.current = onWritten;

    React.useEffect(() => {
      if (shouldReduceMotion) {
        progress.set(text.length);
        onWrittenRef.current?.();
        return;
      }

      progress.set(0);
      const controls = animate(progress, text.length, {
        duration: text.length / Math.max(1, speed),
        delay: startDelay,
        ease: "linear",
        onComplete: () => onWrittenRef.current?.(),
      });

      return () => controls.stop();
    }, [progress, shouldReduceMotion, speed, startDelay, text]);

    return (
      <span
        ref={ref}
        data-slot="writing-text"
        className={cn(writingTextVariants({ variant, size }), className)}
        {...props}
      >
        {/* The whole sentence is announced once. The characters arriving one
            by one are a visual effect and stay out of the accessibility tree. */}
        <span className="sr-only">{text}</span>
        <span aria-hidden>{text.slice(0, target)}</span>

        {cursor && (!isDone || keepCursor) && (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-[1em] w-[0.08em] translate-y-[0.12em] rounded-xs bg-current"
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: CARET_PERIOD, repeat: Infinity, ease: "linear" }
            }
          />
        )}
      </span>
    );
  },
);

/* -------------------------------------------------------------------------- */
/* Exports                                                                     */
/* -------------------------------------------------------------------------- */

export default WritingText;
export { writingTextVariants };
