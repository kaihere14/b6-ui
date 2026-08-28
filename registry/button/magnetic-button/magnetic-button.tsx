"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI — Magnetic Button
 *
 * A button that leans toward the pointer while the pointer is over it, and
 * springs back to rest the moment it leaves. Pointer tracking drives motion
 * values rather than React state, so following the cursor never re-renders.
 *
 * Magnetism is an enhancement, never a requirement: it is switched off for
 * `prefers-reduced-motion` and for coarse pointers, where the button is an
 * ordinary B6 button.
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
 * in whatever colour it inherits — invisible on a solid button. Reading the
 * token directly lands the step in the font-size group for every cn(), extended
 * or not, and still loses to a consumer's own `text-lg`.
 */
const TYPE = {
  small: "text-(length:--text-small) leading-(--text-small--line-height)",
  body: "text-(length:--text-body) leading-(--text-body--line-height)",
} as const;

const magneticButtonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2",
    "font-medium whitespace-nowrap will-change-transform select-none",
    "transition-[background-color,color,border-color,box-shadow] duration-150 ease-b6",
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

/** Spring that carries the button. Slightly under-damped, so it settles with one soft overshoot. */
const BUTTON_SPRING = { stiffness: 260, damping: 22, mass: 0.6 } as const;

/** Spring that carries the label. Looser than the button's, which is what reads as parallax. */
const CONTENT_SPRING = { stiffness: 180, damping: 20, mass: 0.5 } as const;

/* -------------------------------------------------------------------------- */
/* Geometry                                                                    */
/* -------------------------------------------------------------------------- */

/** A pull expressed in pixels, relative to the element's resting position. */
export interface MagneticOffset {
  x: number;
  y: number;
}

/** Everything `magneticOffset` needs to decide how far the button moves. */
export interface MagneticInput {
  /** Live bounding box of the button at its resting position. */
  rect: DOMRect;
  /** Pointer position in viewport coordinates. */
  pointer: { x: number; y: number };
  /** Fraction of the pointer's offset from the centre that the button travels. */
  strength: number;
  /** Hard cap on travel in pixels, in any direction. */
  maxTravel: number;
}

/**
 * Compute the pull for one pointer position.
 *
 * Pure and synchronous — given the same input it returns the same offset, with
 * no reads or writes to the DOM. That keeps it trivially testable and lets the
 * caller decide when it runs.
 *
 * Only ever called while the pointer is over the button, so there is no falloff
 * to model: the button simply leans along the vector from its own centre to the
 * pointer. Travel is capped so a full-width `block` button does not swing wildly
 * just because its centre is far from its edges.
 */
export function magneticOffset({
  rect,
  pointer,
  strength,
  maxTravel,
}: MagneticInput): MagneticOffset {
  const rest = { x: 0, y: 0 };
  if (strength === 0 || maxTravel <= 0) return rest;

  const centreX = rect.left + rect.width / 2;
  const centreY = rect.top + rect.height / 2;

  let x = (pointer.x - centreX) * strength;
  let y = (pointer.y - centreY) * strength;

  const travel = Math.hypot(x, y);
  if (travel > maxTravel) {
    const scale = maxTravel / travel;
    x *= scale;
    y *= scale;
  }

  return { x, y };
}

/* -------------------------------------------------------------------------- */
/* Motion environment                                                          */
/* -------------------------------------------------------------------------- */

const FINE_POINTER = "(pointer: fine)";

function subscribeToPointer(onChange: () => void) {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * True only where a fine pointer exists. Server-rendered as `false`, so the
 * first paint is the resting button and hydration cannot mismatch.
 */
function useFinePointer() {
  return React.useSyncExternalStore(
    subscribeToPointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                        */
/* -------------------------------------------------------------------------- */

export interface UseMagneticOptions {
  /** Fraction of the pointer's offset from the centre that the element travels. */
  strength?: number;
  /** Hard cap on travel in pixels, in any direction. */
  maxTravel?: number;
  /** Extra fraction the label travels on top of the element's own pull. */
  contentStrength?: number;
  /** Set to false to hold the element at rest without unmounting the hook. */
  enabled?: boolean;
}

export interface UseMagneticResult<T extends HTMLElement> {
  /** Attach to the element that moves. */
  ref: React.RefObject<T | null>;
  /** Spring-backed `x`/`y` for the element itself. */
  style: { x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring> };
  /** Spring-backed `x`/`y` for the label, pulled further for parallax. */
  contentStyle: { x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring> };
}

/**
 * Lean an element toward the pointer while the pointer is over it.
 *
 * Listeners sit on the element, not on `window`: the pull begins on enter and
 * ends on leave, so nothing is tracked while the pointer is elsewhere on the
 * page. Because the element always moves *toward* the pointer, it can never
 * slide out from under it and flicker between enter and leave.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.3,
  maxTravel = 24,
  contentStrength = 0.4,
  enabled = true,
}: UseMagneticOptions = {}): UseMagneticResult<T> {
  const ref = React.useRef<T>(null);

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const contentTargetX = useMotionValue(0);
  const contentTargetY = useMotionValue(0);

  const x = useSpring(targetX, BUTTON_SPRING);
  const y = useSpring(targetY, BUTTON_SPRING);
  const contentX = useSpring(contentTargetX, CONTENT_SPRING);
  const contentY = useSpring(contentTargetY, CONTENT_SPRING);

  React.useEffect(() => {
    const element = ref.current;

    const set = (offset: MagneticOffset) => {
      targetX.set(offset.x);
      targetY.set(offset.y);
      contentTargetX.set(offset.x * contentStrength);
      contentTargetY.set(offset.y * contentStrength);
    };

    const rest = () => set({ x: 0, y: 0 });

    if (!element || !enabled) {
      rest();
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      set(
        magneticOffset({
          // Read per move: the resting box shifts with scroll and layout.
          rect: element.getBoundingClientRect(),
          pointer: { x: event.clientX, y: event.clientY },
          strength,
          maxTravel,
        }),
      );
    };

    element.addEventListener("pointermove", handlePointerMove, { passive: true });
    element.addEventListener("pointerleave", rest);
    element.addEventListener("pointercancel", rest);
    window.addEventListener("blur", rest);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", rest);
      element.removeEventListener("pointercancel", rest);
      window.removeEventListener("blur", rest);
      rest();
    };
  }, [
    enabled,
    strength,
    maxTravel,
    contentStrength,
    targetX,
    targetY,
    contentTargetX,
    contentTargetY,
  ]);

  return { ref, style: { x, y }, contentStyle: { x: contentX, y: contentY } };
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

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

export interface MagneticButtonProps
  extends NativeButtonProps, VariantProps<typeof magneticButtonVariants> {
  /** Show a spinner, block interaction and mark the control busy. */
  loading?: boolean;
  /** Accessible label announced while `loading` is true. */
  loadingLabel?: string;
  /** Icon rendered before the label. Replaced by the spinner while loading. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Fraction of the pointer's offset from the centre that the button travels. */
  strength?: number;
  /** Hard cap on travel in pixels, in any direction. */
  maxTravel?: number;
  /** Extra fraction the label travels on top of the button's own pull. */
  contentStrength?: number;
  /** Hold the button at rest without removing it from the layout. */
  magnetic?: boolean;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    {
      className,
      variant,
      size,
      block,
      strength,
      maxTravel,
      contentStrength,
      magnetic = true,
      loading = false,
      loadingLabel = "Loading",
      leftIcon,
      rightIcon,
      disabled,
      children,
      type,
      ...props
    },
    forwardedRef,
  ) {
    const finePointer = useFinePointer();
    const reducedMotion = useReducedMotion();
    const isDisabled = disabled || loading;

    // A disabled or busy control must not chase the pointer: it would invite a
    // click it will not honour.
    const { ref, style, contentStyle } = useMagnetic<HTMLButtonElement>({
      strength,
      maxTravel,
      contentStrength,
      enabled: magnetic && finePointer && !reducedMotion && !isDisabled,
    });

    React.useImperativeHandle(forwardedRef, () => ref.current as HTMLButtonElement, [ref]);

    return (
      <motion.button
        ref={ref}
        type={type ?? "button"}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-loading={loading ? "" : undefined}
        style={style}
        className={cn(magneticButtonVariants({ variant, size, block }), className)}
        {...props}
      >
        <motion.span style={contentStyle} className="inline-flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 aria-hidden className="animate-spin" />
              <span className="sr-only">{loadingLabel}</span>
            </>
          ) : (
            leftIcon
          )}
          {children}
          {rightIcon}
        </motion.span>
      </motion.button>
    );
  },
);

export { magneticButtonVariants };
