"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import {
  animate,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI: Cross Button
 *
 * A family of close/dismiss buttons built around the X icon. Three behaviours
 * are baked in:
 *
 * **default** — a plain close button.
 * **timed** — the border draws itself around the button over `duration` ms.
 *   The button is disabled until the border completes, at which point
 *   `onReady` fires and the button becomes pressable.
 * **confirm** — pressing once morphs the button into a confirmation state;
 *   pressing again fires the real action. Resets after `confirmTimeout` ms
 *   if the second press never comes.
 *
 * This file is standalone by design. It repeats the B6 button styling rather
 * than importing Button Base, because a registry item must work in a project
 * that installed nothing else.
 */

/* -------------------------------------------------------------------------- */
/* Styling                                                                     */
/* -------------------------------------------------------------------------- */

const crossButtonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center",
    "font-medium whitespace-nowrap select-none",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-b6",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        ghost: "hover:bg-muted text-muted-foreground hover:text-foreground",
        outline:
          "border border-input bg-background text-foreground shadow-b6-xs hover:bg-muted",
        solid:
          "bg-primary text-primary-foreground shadow-b6-sm hover:brightness-[1.06] active:brightness-[0.97]",
        soft: "bg-secondary text-secondary-foreground shadow-b6-xs hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-b6-sm hover:brightness-[1.06] active:brightness-[0.97]",
      },
      size: {
        sm: "size-6 rounded-sm [&_svg]:size-3",
        md: "size-8 rounded-md [&_svg]:size-4",
        lg: "size-10 rounded-md [&_svg]:size-5",
      },
      shape: {
        square: "",
        circle: "!rounded-full",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
      shape: "square",
    },
  },
);

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

/** The two interaction modes the cross button can operate in. */
export type CrossButtonMode = "default" | "timed";

/**
 * Native button props, minus the handlers Motion redefines and the `style`
 * this component owns.
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

export interface CrossButtonProps
  extends NativeButtonProps,
    VariantProps<typeof crossButtonVariants> {
  /** Interaction mode. @default "default" */
  mode?: CrossButtonMode;

  /**
   * **timed mode only.** Duration in milliseconds for the border to draw
   * itself around the button. The button is disabled until the border
   * completes. @default 3000
   */
  duration?: number;

  /**
   * **timed mode only.** Fired when the border countdown completes and the
   * button becomes pressable.
   */
  onReady?: () => void;

  /** Screen-reader label for the button. @default "Close" */
  label?: string;
}

const SPRING_CONFIG = { stiffness: 400, damping: 30, mass: 0.8 } as const;

/* -------------------------------------------------------------------------- */
/* Sub-components                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The timed border overlay. Uses a conic-gradient that sweeps from 0 to
 * 360 deg over `duration` ms, masked so only the border edge is visible.
 *
 * This avoids SVG entirely, sidestepping the attribute-vs-CSS precedence
 * issue that broke the stroke-dashoffset approach. Motion's `animate`
 * drives the angle value directly on the DOM node, costing zero React
 * renders during the sweep.
 */
function TimedBorder({
  duration,
  onComplete,
  size,
  shape,
}: {
  duration: number;
  onComplete: () => void;
  size: "sm" | "md" | "lg" | null | undefined;
  shape: "square" | "circle" | null | undefined;
}) {
  const reducedMotion = useReducedMotion();
  const borderRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const borderRadius =
    shape === "circle"
      ? "9999px"
      : size === "sm"
        ? "var(--radius-sm)"
        : size === "lg"
          ? "var(--radius-md)"
          : "var(--radius-md)";

  // The mask that cuts out the interior, leaving only the border visible.
  const borderMask = [
    "linear-gradient(#000 0 0) content-box",
    "linear-gradient(#000 0 0)",
  ].join(", ");

  React.useEffect(() => {
    const el = borderRef.current;
    if (!el) return;

    if (reducedMotion || duration <= 0) {
      el.style.background =
        "conic-gradient(from -90deg, currentColor 360deg, transparent 360deg)";
      onComplete();
      return;
    }

    const controls = animate(360, 0, {
      duration: duration / 1000,
      ease: "linear",
      onUpdate: (angle: number) => {
        el.style.background = `conic-gradient(from -90deg, currentColor ${angle}deg, transparent ${angle}deg)`;
      },
      onComplete,
    });

    return () => controls.stop();
  }, [duration, onComplete, reducedMotion]);

  return (
    <>
      {/* Faint track showing the full border path */}
      <div
        ref={trackRef}
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          padding: 2,
          background: "currentColor",
          opacity: 0.12,
          WebkitMask: borderMask,
          WebkitMaskComposite: "xor",
          mask: borderMask,
          maskComposite: "exclude",
        }}
      />
      {/* Animated border that sweeps from 0 to 360 deg */}
      <div
        ref={borderRef}
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          padding: 2,
          background: "transparent",
          WebkitMask: borderMask,
          WebkitMaskComposite: "xor",
          mask: borderMask,
          maskComposite: "exclude",
        }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

const CrossButton = React.forwardRef<HTMLButtonElement, CrossButtonProps>(
  function CrossButton(
    {
      className,
      variant,
      size,
      shape,
      mode = "default",
      duration = 3000,
      onReady,
      label = "Close",
      disabled,
      onClick,
      ...props
    },
    forwardedRef,
  ) {
    const reducedMotion = useReducedMotion();
    const scale = useSpring(1, SPRING_CONFIG);

    /* ---- Timed mode state ----------------------------------------------- */
    const [timedReady, setTimedReady] = React.useState(mode !== "timed");

    const handleTimedComplete = React.useCallback(() => {
      setTimedReady(true);
      onReady?.();
    }, [onReady]);

    /* ---- Click handler -------------------------------------------------- */
    const [clickPulse, setClickPulse] = React.useState(false);
    const [shake, setShake] = React.useState(false);

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (mode === "timed" && !timedReady) {
          e.preventDefault();
          if (!shake) {
            setShake(true);
            setTimeout(() => setShake(false), 400);
          }
          return;
        }

        if (mode === "timed" && timedReady) {
          if (!clickPulse) {
            setClickPulse(true);
            setTimeout(() => setClickPulse(false), 150);
          }
        }

        onClick?.(e);
      },
      [mode, timedReady, shake, clickPulse, onClick],
    );

    /* ---- Derived state -------------------------------------------------- */
    const isDisabled = disabled || (mode === "timed" && !timedReady);

    /* ---- Press animation ------------------------------------------------ */
    const handlePointerDown = React.useCallback(() => {
        if (isDisabled) return;
        if (!reducedMotion) scale.set(0.9);
      },
      [reducedMotion, scale, isDisabled],
    );

    const handlePointerUp = React.useCallback(() => {
      if (!reducedMotion) scale.set(1);
    }, [reducedMotion, scale]);

    return (
      <motion.button
        ref={forwardedRef}
        type="button"
        disabled={disabled} // Native disabled only for explicit disabled prop
        aria-disabled={isDisabled}
        aria-label={label}
        className={cn(
          crossButtonVariants({
            variant,
            size,
            shape,
          }),
          mode === "timed" && !timedReady && "cursor-wait opacity-70",
          className,
        )}
        style={{ scale }}
        animate={shake && !reducedMotion ? { x: [-6, 6, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={shake ? { duration: 0.4 } : undefined}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        data-mode={mode}
        {...props}
      >
        {mode === "timed" && !timedReady && (
          <TimedBorder
            duration={duration}
            onComplete={handleTimedComplete}
            size={size}
            shape={shape}
          />
        )}

        <motion.span
          initial={false}
          animate={{
            scale: clickPulse ? 0.6 : 1,
            opacity: clickPulse ? 0.4 : 1,
            filter: clickPulse ? "blur(2px)" : "blur(0px)",
          }}
          transition={{ type: "spring", stiffness: 600, damping: 20 }}
          className="inline-flex items-center justify-center"
        >
          <X aria-hidden="true" />
        </motion.span>

        <span className="sr-only">
          {label}
        </span>
      </motion.button>
    );
  },
);

export { CrossButton, crossButtonVariants };
