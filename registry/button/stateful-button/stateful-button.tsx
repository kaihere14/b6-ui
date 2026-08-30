"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Loader2, X } from "lucide-react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI: Stateful Button
 *
 * A button that progresses through four visual states (idle, loading, success
 * and error) with animated content transitions. The consumer drives the state
 * via the `status` prop; the button handles all motion internally.
 *
 * Entering the `error` state triggers a horizontal shake. Icons cross-fade
 * between states via AnimatePresence, and the button auto-resets to `idle`
 * after `resetDelay` milliseconds.
 *
 * Because the swap runs in `mode="wait"`, the old label is gone before the new
 * one mounts. Left alone the button would collapse to its padding and snap
 * back out. So the content sits in a wrapper whose width is measured and
 * animated, and the button grows into a longer label instead of jumping.
 *
 * The content swap is a per-character stagger with a blur, and both halves are
 * opt-out: `stagger={false}` moves the label as one block, `blur={false}` drops
 * the blur filter, and turning both off leaves a plain fade-scale.
 *
 * All motion honours `useReducedMotion()`. On reduced-motion systems the icons
 * swap instantly and the shake is suppressed.
 *
 * This file is standalone by design. It repeats the B6 button styling rather
 * than importing Button Base, because a registry item has to work in a project
 * that installed nothing else.
 */

/* -------------------------------------------------------------------------- */
/* Styling                                                                     */
/* -------------------------------------------------------------------------- */

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

const statefulButtonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2",
    "font-medium whitespace-nowrap will-change-transform select-none",
    "transition-[background-color,color,border-color,box-shadow] duration-200 ease-b6",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
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
        link: "text-primary underline-offset-4 hover:underline",
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

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

/** Blur-scale-fade for the content swap. Quick enough to read as a ticker, not a morph. */
const CONTENT_TRANSITION = { duration: 0.35, ease: [0.2, 0, 0, 1] as const };

/**
 * Width easing for the content wrapper. Shares the content curve so the box and
 * the label it holds settle together rather than racing each other.
 */
const WIDTH_TRANSITION = CONTENT_TRANSITION;

/** Error shake: a quick horizontal rattle that decays. */
const SHAKE_KEYFRAMES = [0, -6, 6, -4, 4, -2, 2, 0];
const SHAKE_DURATION = 0.4;

/** Default time before auto-resetting from success/error to idle, in ms. */
const DEFAULT_RESET_DELAY = 2000;

/**
 * Slot, driven by Motion. `asChild` still has to animate a transform, and the
 * only element Motion can reach is the one Slot renders, so Motion wraps Slot
 * rather than the other way round, and follows Slot's ref down to the real DOM
 * node.
 */
const MotionSlot = motion.create(Slot);

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

/** The four lifecycle states the button progresses through. */
export type ButtonStatus = "idle" | "loading" | "success" | "error";

/**
 * Native button props, minus the handlers Motion redefines and the `style` this
 * component owns.
 */
type NativeButtonProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  | "style"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

export interface StatefulButtonProps
  extends NativeButtonProps, VariantProps<typeof statefulButtonVariants> {
  /** Render the child element instead of a `<button>`, keeping all styling and motion. */
  asChild?: boolean;
  /** Current lifecycle state. @default "idle" */
  status?: ButtonStatus;
  /** Milliseconds before auto-resetting from `success` or `error` back to `idle`. Set `0` to disable. @default 2000 */
  resetDelay?: number;
  /** Fired when the auto-reset timer completes. Use it to set `status` back to `"idle"`. */
  onReset?: () => void;
  /** Visible label shown during loading. When set, replaces `children` in the loading state. */
  loadingText?: React.ReactNode;
  /** Visible label shown on success. When set, replaces `children` in the success state. */
  successText?: React.ReactNode;
  /** Visible label shown on error. When set, replaces `children` in the error state. */
  errorText?: React.ReactNode;
  /** Screen-reader-only label announced while loading. @default "Loading" */
  loadingLabel?: string;
  /** Screen-reader-only label announced on success. @default "Success" */
  successLabel?: string;
  /** Screen-reader-only label announced on error. @default "Error" */
  errorLabel?: string;
  /** Icon rendered before the label in idle state. Replaced by status icons during transitions. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. Visible in all states. */
  rightIcon?: React.ReactNode;
  /** Custom icon for the success state. @default Check from lucide-react */
  successIcon?: React.ReactNode;
  /** Custom icon for the error state. @default X from lucide-react */
  errorIcon?: React.ReactNode;
  /** Blur the content as it swaps between states. Set `false` for a plain fade-scale. @default true */
  blur?: boolean;
  /** Animate the label one character at a time. Set `false` to move the whole label as one block. @default true */
  stagger?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export const StatefulButton = React.forwardRef<HTMLButtonElement, StatefulButtonProps>(
  function StatefulButton(
    {
      className,
      variant,
      size,
      block,
      asChild = false,
      status = "idle",
      resetDelay = DEFAULT_RESET_DELAY,
      onReset,
      loadingText,
      successText,
      errorText,
      loadingLabel = "Loading",
      successLabel = "Success",
      errorLabel = "Error",
      leftIcon,
      rightIcon,
      successIcon,
      errorIcon,
      blur = true,
      stagger = true,
      disabled,
      children,
      type,
      onClick,
      ...props
    },
    forwardedRef,
  ) {
    const reducedMotion = useReducedMotion();
    const isIdle = status === "idle";
    const isDisabled = disabled || !isIdle;
    const shakeX = useMotionValue(0);
    const ref = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(forwardedRef, () => ref.current as HTMLButtonElement, [ref]);

    /* ---- Error shake ---------------------------------------------------- */
    React.useEffect(() => {
      if (status === "error" && !reducedMotion) {
        animate(shakeX, SHAKE_KEYFRAMES, {
          duration: SHAKE_DURATION,
          ease: "easeOut",
        });
      }
    }, [status, reducedMotion, shakeX]);

    /* ---- Content width --------------------------------------------------- */
    /**
     * `mode="wait"` means there is a frame with no content in the button at
     * all, so the wrapper cannot size itself off the flow. It is driven by a
     * motion value instead.
     *
     * The ref is a callback rather than an effect because the swap mounts a new
     * node per status, and a callback ref fires exactly when that node lands.
     * The observer on top of it catches the widths a mount cannot see: a font
     * finishing loading, or `children` changing without the status changing.
     */
    const width = useMotionValue<number | "auto">("auto");
    const contentObserver = React.useRef<ResizeObserver | null>(null);

    const measureContent = React.useCallback(
      (node: HTMLSpanElement | null) => {
        contentObserver.current?.disconnect();
        contentObserver.current = null;
        if (!node) return;

        const apply = () => {
          const next = node.offsetWidth;
          const current = width.get();
          if (!next || next === current) return;
          // The first measurement has no `auto` to animate from, so it lands flat.
          if (current === "auto" || reducedMotion) width.set(next);
          else animate(width, next, WIDTH_TRANSITION);
        };

        apply();
        const observer = new ResizeObserver(apply);
        observer.observe(node);
        contentObserver.current = observer;
      },
      [reducedMotion, width],
    );

    React.useEffect(() => () => contentObserver.current?.disconnect(), []);

    /* ---- Auto-reset timer ----------------------------------------------- */
    React.useEffect(() => {
      if ((status === "success" || status === "error") && resetDelay > 0 && onReset) {
        const timer = setTimeout(onReset, resetDelay);
        return () => clearTimeout(timer);
      }
    }, [status, resetDelay, onReset]);

    /* ---- Content resolution --------------------------------------------- */
    const contentTransition = reducedMotion ? { duration: 0 } : CONTENT_TRANSITION;

    /**
     * Resolve the icon for the current status.
     *
     * idle shows the consumer's `leftIcon` (if any), while the three active
     * states each show their own indicator.
     */
    const currentIcon =
      status === "loading" ? (
        <Loader2 aria-hidden className="animate-spin" />
      ) : status === "success" ? (
        (successIcon ?? <Check aria-hidden />)
      ) : status === "error" ? (
        (errorIcon ?? <X aria-hidden />)
      ) : (
        (leftIcon ?? null)
      );

    /**
     * Rendered content: the entire icon + label block animates as one unit so
     * the label can transition alongside the icon (e.g. "Save" → "Saving…" →
     * "Saved!"). A vertical slide-fade gives a ticker feel.
     *
     * When no `loadingText` / `successText` / `errorText` is provided the
     * consumer's `children` stay visible and only the icon swaps.
     */
    const layer = (label: React.ReactNode) => {
      const resolvedLabel =
        status === "loading"
          ? (loadingText ?? label)
          : status === "success"
            ? (successText ?? label)
            : status === "error"
              ? (errorText ?? label)
              : label;

      /**
       * Screen-reader-only status announcement. Only rendered when the visible
       * text does NOT already convey the state (i.e. when no status-specific
       * text was supplied), so readers never hear "Loading Saving…".
       */
      const srLabel =
        status === "loading" && loadingText == null
          ? loadingLabel
          : status === "success" && successText == null
            ? successLabel
            : status === "error" && errorText == null
              ? errorLabel
              : null;

      /**
       * Both halves of the swap are opt-out. `stagger` decides whether the
       * pieces leave and arrive one after another, `blur` whether they defocus
       * on the way. With both off the content is a plain fade-scale.
       *
       * The blur keys are added to all three states or to none of them,
       * a `filter` that appears in `animate` but not `initial` has nothing to
       * animate from, and Motion would snap it.
       */
      const staggered = stagger && !reducedMotion;
      const blurred = blur && !reducedMotion;

      const contentContainer = {
        initial: {},
        animate: {
          transition: { staggerChildren: staggered ? 0.02 : 0 },
        },
        exit: {
          transition: {
            staggerChildren: staggered ? 0.01 : 0,
            staggerDirection: -1 as const,
          },
        },
      };

      const contentItem = {
        initial: { opacity: 0, scale: 0.95, ...(blurred && { filter: "blur(4px)" }) },
        animate: {
          opacity: 1,
          scale: 1,
          ...(blurred && { filter: "blur(0px)" }),
          transition: contentTransition,
        },
        exit: {
          opacity: 0,
          scale: 0.95,
          ...(blurred && { filter: "blur(4px)" }),
          transition: contentTransition,
        },
      };

      return (
        <motion.span style={{ width }} className="inline-flex justify-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              ref={measureContent}
              key={status}
              variants={contentContainer}
              initial="initial"
              animate="animate"
              exit="exit"
              className="inline-flex shrink-0 items-center gap-2"
            >
              {currentIcon && (
                <motion.span variants={contentItem} className="inline-flex items-center">
                  {currentIcon}
                </motion.span>
              )}
              {srLabel && <span className="sr-only">{srLabel}</span>}
              <span className="inline-flex">
                {staggered && typeof resolvedLabel === "string" ? (
                  resolvedLabel.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      variants={contentItem}
                      className="inline-block whitespace-pre"
                    >
                      {char}
                    </motion.span>
                  ))
                ) : (
                  <motion.span variants={contentItem}>{resolvedLabel}</motion.span>
                )}
              </span>
              {isIdle && rightIcon && (
                <motion.span variants={contentItem} className="inline-flex items-center">
                  {rightIcon}
                </motion.span>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      );
    };

    /** Props shared across both render paths. */
    const shared = {
      className: cn(statefulButtonVariants({ variant, size, block }), className),
      style: { x: shakeX },
      "aria-busy": status === "loading" || undefined,
      "data-status": status,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isIdle) return;
        onClick?.(event);
      },
    };

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        children?: React.ReactNode;
      }>;

      return (
        <MotionSlot ref={ref} aria-disabled={isDisabled || undefined} {...shared} {...props}>
          {React.cloneElement(child, undefined, layer(child.props.children))}
        </MotionSlot>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type ?? "button"}
        disabled={isDisabled}
        {...shared}
        {...props}
      >
        {layer(children)}
      </motion.button>
    );
  },
);

export { statefulButtonVariants };
