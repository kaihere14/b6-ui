"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
  type Transition,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI: Water Loading
 *
 * A pull-to-refresh container with an infinite-scroll buffer. The user drags
 * the content down past a threshold and releases to reload; scrolling near the
 * end asks for the next page. Both moments show the same water indicator, at
 * the top strip and the bottom buffer respectively.
 *
 * A downward drag translates the content; a release past `threshold` opens the
 * top strip and shows the blob for `duration` (or until `onRefresh` resolves),
 * then it closes. An IntersectionObserver on a sentinel at the end of the
 * content fires `onLoadMore` `loadMoreOffset` px early and opens the bottom
 * buffer while the next page loads.
 *
 * The indicator is one gradient `<motion.path>` (`WaterBlob`). While the user
 * pulls it is a fluid teardrop breathing through three near-identical shapes;
 * when a refresh starts it keeps flexing at a quicker tempo for `MORPH_HOLD`,
 * then flows that same path into an oceanic wave and loops between wave
 * keyframes with a second faster wave behind it for depth. Every silhouette is
 * an 8-anchor spline, so all `d` strings share one command structure and Motion
 * tweens any shape into any other. The fill reads from `--water-from` /
 * `--water-to`.
 *
 * Standalone by design: it imports nothing from the rest of B6, because a
 * registry item has to work in a project that installed nothing else.
 */

/* -------------------------------------------------------------------------- */
/* Styling                                                                     */
/* -------------------------------------------------------------------------- */

const waterLoadingVariants = cva(
  [
    "relative isolate w-full overflow-hidden",
    // Oceanic default for the droplet fill. Both are plain custom properties, so
    // a consumer overrides them from `className` (`[--water-from:...]`) or an
    // ancestor without touching the component.
    "[--water-from:oklch(0.82_0.11_205)] [--water-to:oklch(0.52_0.16_244)]",
  ],
  {
    variants: {
      size: {
        sm: "[--water-zone:2.5rem]",
        md: "[--water-zone:3.5rem]",
        lg: "[--water-zone:4.5rem]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type Phase = "idle" | "pulling" | "refreshing";

type NativeDivProps = Omit<React.ComponentPropsWithoutRef<"div">, "onDrag">;

export interface WaterLoadingProps
  extends NativeDivProps, VariantProps<typeof waterLoadingVariants> {
  /**
   * Controlled refresh state. While true the strip is held open and the droplet
   * shows. Leave it undefined to let the component run its own timer.
   */
  refreshing?: boolean;

  /**
   * Called once the pull passes the threshold and the pointer is released.
   * Return a promise to keep the strip open until the reload settles.
   */
  onRefresh?: () => void | Promise<void>;

  /**
   * How long the strip stays open when the component runs its own timer, in
   * milliseconds. Ignored when `refreshing` is controlled or `onRefresh`
   * returns a promise. @default 4200
   */
  duration?: number;

  /** Pull distance in pixels that arms a refresh on release. @default 64 */
  threshold?: number;

  /** Turn the pull-to-refresh gesture off while keeping the content rendered. @default false */
  disabled?: boolean;

  /**
   * Called as the feed nears its end, for infinite scroll. Return a promise to
   * hold the bottom loader open until the next page has been appended.
   */
  onLoadMore?: () => void | Promise<void>;

  /**
   * Controlled bottom-loader state. Leave undefined to let the component manage
   * it from `onLoadMore` (its own timer, or the promise it returns).
   */
  loadingMore?: boolean;

  /**
   * Whether more pages exist. When false the bottom loader never shows and
   * `onLoadMore` stops firing. @default true
   */
  hasMore?: boolean;

  /**
   * How far in pixels from the end of the content `onLoadMore` fires, so the
   * next page starts loading before the reader reaches the bottom. @default 160
   */
  loadMoreOffset?: number;
}

/* -------------------------------------------------------------------------- */
/* Water blob: one path, teardrop <-> waves                                    */
/* -------------------------------------------------------------------------- */

const VIEW_W = 48;
const VIEW_H = 24;
/** One wavelength: the depth layer slides left by exactly this and repeats. */
const WAVE_SHIFT = 24;

type Point = readonly [number, number];

/**
 * A closed Catmull-Rom spline through `pts`, emitted as `M` + one cubic `C` per
 * point + `Z`. Every silhouette in this file is built from an 8-point array, so
 * every `d` string has the identical command structure and Motion can tween any
 * shape straight into any other, no flubber, no path-splitting.
 */
function spline(pts: readonly Point[]): string {
  const n = pts.length;
  const at = (i: number) => pts[((i % n) + n) % n];
  const f = (v: number) => Math.round(v * 100) / 100;
  let d = `M${f(at(0)[0])} ${f(at(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = at(i - 1);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    const [x3, y3] = at(i + 2);
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(x2)} ${f(y2)}`;
  }
  return `${d}Z`;
}

/**
 * Eight anchors per silhouette, same winding order throughout: anchors 0-4 ride
 * the top edge left to right, 5-7 close the bottom right to left. In a teardrop
 * they bunch into a bead near the middle; in a wave they spread to the full
 * width with the bottom pinned to `VIEW_H`, so morphing one into the other
 * reads as the drop spreading out and flattening into surf.
 */
const WATER_POINTS = {
  drop: [
    [24, 4],
    [29, 9],
    [31, 14],
    [28, 18.5],
    [24, 20.5],
    [20, 18.5],
    [17, 14],
    [19, 9],
  ],
  dropWobble: [
    [24, 4],
    [30, 8.5],
    [32, 14],
    [27, 19],
    [24, 20.5],
    [21, 17.5],
    [16, 13],
    [18, 10],
  ],
  dropSway: [
    [24, 4.5],
    [28.5, 9],
    [31.5, 13.5],
    [28.5, 18],
    [24, 20],
    [19.5, 18.5],
    [16.5, 14.5],
    [19.5, 9.5],
  ],
  taut: [
    [24, 2.5],
    [29, 8],
    [30.5, 14],
    [27, 19],
    [24, 21.5],
    [21, 19],
    [17.5, 14],
    [19, 8],
  ],
  waveA: [
    [0, 10],
    [12, 6.5],
    [24, 12],
    [36, 6.5],
    [48, 10],
    [48, 24],
    [24, 24],
    [0, 24],
  ],
  waveB: [
    [0, 7],
    [12, 12],
    [24, 7],
    [36, 12],
    [48, 7.5],
    [48, 24],
    [24, 24],
    [0, 24],
  ],
  waveC: [
    [0, 11.5],
    [12, 7],
    [24, 11],
    [36, 6.5],
    [48, 11],
    [48, 24],
    [24, 24],
    [0, 24],
  ],
} satisfies Record<string, Point[]>;

/** Path strings, all `M` + eight `C` + `Z`. Exported so a consumer can drive
 *  the same shapes from their own animation. */
export const WATER_SHAPES = Object.fromEntries(
  Object.entries(WATER_POINTS).map(([key, pts]) => [key, spline(pts)]),
) as Record<keyof typeof WATER_POINTS, string>;

/**
 * Keyframe lists, defined once at module scope so their array identity is
 * stable across renders. Motion restarts a keyframe animation whenever the
 * `animate` value changes by reference, so a fresh `[...]` every render is what
 * makes a looping morph stutter while React re-renders around it.
 */
const DROP_LOOP = [WATER_SHAPES.drop, WATER_SHAPES.dropSway, WATER_SHAPES.dropWobble];
const ARM_LOOP = [WATER_SHAPES.taut, WATER_SHAPES.dropWobble, WATER_SHAPES.dropSway];
const HOLD_LOOP = [WATER_SHAPES.drop, WATER_SHAPES.dropWobble, WATER_SHAPES.dropSway];
const WAVE_LOOP = [WATER_SHAPES.waveA, WATER_SHAPES.waveB, WATER_SHAPES.waveC];
const SVG_SCALE = [1, 1.035, 0.975, 1];
const SVG_ROTATE = [0, 2, -1.6, 0];
const DEPTH_SLIDE = [0, -WAVE_SHIFT];

export type WaterBlobMode = "rest" | "arming" | "refreshing";

interface WaterBlobProps {
  /** rest / arming track the pull; refreshing morphs the blob into the swell. */
  mode: WaterBlobMode;
  /** 0..1 fade for the whole blob, a number or a MotionValue. @default 1 */
  opacity?: number | MotionValue<number>;
  className?: string;
}

/**
 * One gradient-filled path that is a wobbling teardrop while the user pulls and,
 * the moment a refresh starts, morphs its `d` straight into an oceanic wave and
 * then loops between wave keyframes. A second faster wave fades in underneath
 * once the morph lands, for depth. Reduced motion holds a single still frame.
 */
/** After a refresh starts, the teardrop keeps flexing this long before it flows
 *  into the waves, so the droplet reads as alive rather than a freeze-frame. */
const MORPH_HOLD = 1.1;

const WaterBlob = React.memo(function WaterBlob({
  mode,
  opacity = 1,
  className,
}: WaterBlobProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const gradientId = React.useId();
  const clipId = React.useId();

  const refreshing = mode === "refreshing";
  const [morphed, setMorphed] = React.useState(false);
  const [holdDone, setHoldDone] = React.useState(false);

  React.useEffect(() => {
    if (!refreshing) return;
    const id = setTimeout(() => setHoldDone(true), MORPH_HOLD * 1000);
    return () => clearTimeout(id);
  }, [refreshing]);

  let pathAnimate: TargetAndTransition;
  let pathTransition: Transition;
  if (reducedMotion) {
    pathAnimate = { d: refreshing ? WATER_SHAPES.waveA : WATER_SHAPES.drop };
    pathTransition = { duration: 0 };
  } else if (!refreshing || !holdDone) {
    // Rest, arming, and the pre-morph hold all run the same fluid loop through
    // three near-identical teardrops; only the tempo changes.
    pathAnimate = {
      d: refreshing ? HOLD_LOOP : mode === "arming" ? ARM_LOOP : DROP_LOOP,
    };
    pathTransition = {
      duration: refreshing ? 1.5 : mode === "arming" ? 3 : 4.6,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    };
  } else if (!morphed) {
    // The teardrop flows into the first wave, once.
    pathAnimate = { d: WATER_SHAPES.waveA };
    pathTransition = { duration: 0.9, ease: [0.65, 0, 0.35, 1] };
  } else {
    pathAnimate = { d: WAVE_LOOP };
    pathTransition = {
      duration: 2.6,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    };
  }

  const drifting = !reducedMotion && !morphed;

  return (
    <motion.svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={cn("h-full w-12", className)}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      initial={false}
      // Opacity rides `style` (it can be a MotionValue driven by the pull), so
      // changing it never interrupts the looping `d` / scale / rotate below.
      style={{ opacity }}
      animate={drifting ? { scale: SVG_SCALE, rotate: SVG_ROTATE } : { scale: 1, rotate: 0 }}
      transition={
        drifting
          ? {
              scale: { duration: 5.4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5.4, repeat: Infinity, ease: "easeInOut" },
            }
          : { scale: { duration: 0.5 }, rotate: { duration: 0.5 } }
      }
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--water-from, oklch(0.82 0.11 205))" />
          <stop offset="1" stopColor="var(--water-to, oklch(0.52 0.16 244))" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} rx="10" ry="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* Depth layer: a second wave, faster, fades in after the morph lands. */}
        <motion.path
          d={WATER_SHAPES.waveB}
          fill={`url(#${gradientId})`}
          initial={false}
          animate={{
            opacity: morphed && !reducedMotion ? 0.4 : 0,
            x: reducedMotion ? 0 : DEPTH_SLIDE,
          }}
          transition={{
            opacity: { duration: 0.45 },
            x: { duration: 2.1, repeat: Infinity, ease: "linear" },
          }}
        />
        <motion.path
          fill={`url(#${gradientId})`}
          initial={false}
          animate={pathAnimate}
          transition={pathTransition}
          onAnimationComplete={() => {
            if (refreshing && !morphed) setMorphed(true);
          }}
        />
      </g>
    </motion.svg>
  );
});

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

/** Downward drag past this multiple of `threshold` stops adding travel. */
const MAX_PULL_FACTOR = 1.8;
/** Fraction of finger travel that becomes pull, so the sheet feels weighted. */
const PULL_RESISTANCE = 0.5;
/** Spring that snaps the content back or opens it to the strip. */
const SETTLE: Transition = { type: "spring", stiffness: 260, damping: 30 };
/** Fallback strip height in px if it cannot be measured yet. */
const ZONE_FALLBACK = 56;

/**
 * The track itself never scrolls (its content is only translated via `y`), so
 * a scrolled-down pull must be judged against whichever ancestor the consumer
 * actually made scrollable (e.g. wrapping the track in `overflow-y-auto`, as
 * the infinite-scroll example does). Walk up from the real pointerdown target
 * to find it.
 */
function nearestScrollable(el: Element | null, boundary: Element | null): HTMLElement | null {
  let node = el instanceof HTMLElement ? el : (el?.parentElement ?? null);
  while (node && node !== boundary) {
    const style = getComputedStyle(node);
    if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

const WaterLoading = React.forwardRef<HTMLDivElement, WaterLoadingProps>(function WaterLoading(
  {
    className,
    size,
    children,
    refreshing: refreshingProp,
    onRefresh,
    duration = 4200,
    threshold = 64,
    disabled = false,
    onLoadMore,
    loadingMore: loadingMoreProp,
    hasMore = true,
    loadMoreOffset = 160,
    ...props
  },
  forwardedRef,
) {
  const controlled = refreshingProp !== undefined;
  const controlledMore = loadingMoreProp !== undefined;

  // `phase` and `armed` change only at gesture boundaries, so React re-renders
  // a handful of times per pull. The pull distance itself lives in a
  // MotionValue: setting it every pointermove drives the translate and the
  // blob's fade with no React render, so the looping morph never stutters.
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [armed, setArmed] = React.useState(false);
  const [selfMore, setSelfMore] = React.useState(false);

  const y = useMotionValue(0);
  const pull = useMotionValue(0);
  const blobOpacity = useTransform(pull, [0, Math.max(1, threshold)], [0, 1], {
    clamp: true,
  });

  const trackRef = React.useRef<HTMLDivElement>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const startYRef = React.useRef<number | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreBusyRef = React.useRef(false);

  const refreshing = controlled ? Boolean(refreshingProp) : phase === "refreshing";
  const loadingMore = controlledMore ? Boolean(loadingMoreProp) : selfMore;
  const displayPhase: Phase = refreshing ? "refreshing" : phase;
  const maxPull = threshold * MAX_PULL_FACTOR;

  const zonePx = React.useCallback(() => stripRef.current?.offsetHeight ?? ZONE_FALLBACK, []);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (moreTimerRef.current) clearTimeout(moreTimerRef.current);
    };
  }, []);

  // A parent that controls `loadingMore` clears the re-entry guard when it
  // flips the flag back off.
  React.useEffect(() => {
    if (controlledMore && !loadingMoreProp) moreBusyRef.current = false;
  }, [controlledMore, loadingMoreProp]);

  // Drive the open/closed translate from a controlled `refreshing` prop.
  React.useEffect(() => {
    if (!controlled) return;
    const controls = animate(y, refreshingProp ? zonePx() : 0, SETTLE);
    return () => controls.stop();
  }, [controlled, refreshingProp, y, zonePx]);

  const endRefresh = React.useCallback(() => {
    setPhase("idle");
    animate(y, 0, SETTLE);
  }, [y]);

  const beginRefresh = React.useCallback(() => {
    setPhase("refreshing");
    setArmed(false);
    animate(y, zonePx(), SETTLE);

    const result = onRefresh?.();
    if (result && typeof result.then === "function") {
      result.finally(() => {
        if (!controlled) endRefresh();
      });
      return;
    }
    // No promise to wait on: run the built-in timer, unless a parent controls
    // `refreshing` and will close the strip itself.
    if (controlled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(endRefresh, duration);
  }, [controlled, duration, endRefresh, onRefresh, y, zonePx]);

  const triggerLoadMore = React.useCallback(() => {
    if (moreBusyRef.current || refreshing || !hasMore || !onLoadMore) return;
    moreBusyRef.current = true;
    if (!controlledMore) setSelfMore(true);

    const result = onLoadMore();
    if (result && typeof result.then === "function") {
      result.finally(() => {
        moreBusyRef.current = false;
        if (!controlledMore) setSelfMore(false);
      });
      return;
    }
    // A controlled parent flips `loadingMore` itself; otherwise show the
    // loader for `duration` to stand in for the fetch.
    if (controlledMore) {
      moreBusyRef.current = false;
      return;
    }
    if (moreTimerRef.current) clearTimeout(moreTimerRef.current);
    moreTimerRef.current = setTimeout(() => {
      moreBusyRef.current = false;
      setSelfMore(false);
    }, duration);
  }, [controlledMore, duration, hasMore, onLoadMore, refreshing]);

  // Fire `onLoadMore` as the end of the content nears the viewport.
  React.useEffect(() => {
    if (!hasMore || !onLoadMore) return;
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) triggerLoadMore();
      },
      { rootMargin: `0px 0px ${Math.max(0, loadMoreOffset)}px 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, onLoadMore, loadMoreOffset, triggerLoadMore]);

  const canPull = !disabled && !refreshing;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canPull) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const scrollParent = nearestScrollable(
      event.target as Element | null,
      trackRef.current?.parentElement ?? null,
    );
    if (scrollParent && scrollParent.scrollTop > 0) return;
    startYRef.current = event.clientY;
    // Claim the pointer stream immediately so a fast/hard pull can't hand the
    // gesture to a scrollable ancestor before the first move is processed.
    trackRef.current?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const startY = startYRef.current;
    if (startY === null) return;
    event.preventDefault();
    const delta = (event.clientY - startY) * PULL_RESISTANCE;
    if (delta <= 0) {
      pull.set(0);
      y.set(0);
      if (phase === "pulling") setPhase("idle");
      if (armed) setArmed(false);
      return;
    }
    const next = Math.min(delta, maxPull);
    pull.set(next);
    y.set(next);
    if (phase !== "pulling") setPhase("pulling");
    const nextArmed = next >= threshold;
    if (nextArmed !== armed) setArmed(nextArmed);
  };

  const finishGesture = () => {
    if (startYRef.current === null) return;
    startYRef.current = null;
    const reached = pull.get() >= threshold;
    pull.set(0);
    if (reached && !disabled) {
      beginRefresh();
    } else {
      setPhase("idle");
      setArmed(false);
      animate(y, 0, SETTLE);
    }
  };

  const blobMode: WaterBlobMode = refreshing ? "refreshing" : armed ? "arming" : "rest";

  return (
    <div
      ref={forwardedRef}
      data-phase={displayPhase}
      data-refreshing={refreshing || undefined}
      data-loading-more={loadingMore || undefined}
      data-disabled={disabled || undefined}
      className={cn(waterLoadingVariants({ size }), className)}
      {...props}
    >
      {/* Indicator strip. One blob: a teardrop that tracks the pull and morphs
            into the wave swell the moment a refresh starts. */}
      <div
        ref={stripRef}
        aria-hidden={!refreshing}
        data-state={displayPhase}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 flex h-(--water-zone) items-center justify-center overflow-hidden"
      >
        {(refreshing || phase === "pulling") && (
          <WaterBlob mode={blobMode} opacity={refreshing ? 1 : blobOpacity} />
        )}
      </div>

      {/* Content track. A downward drag translates it to reveal the strip. */}
      <motion.div
        ref={trackRef}
        role="region"
        aria-live="polite"
        aria-busy={refreshing || undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishGesture}
        onPointerCancel={finishGesture}
        style={{ y, touchAction: canPull ? "pan-x" : undefined }}
        className={cn(
          "relative z-10 bg-inherit",
          disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing",
          phase === "pulling" && "select-none",
        )}
      >
        {children}
        {/* Sits at the end of the content; when it nears the viewport the
              observer above asks for the next page. */}
        {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />}
      </motion.div>

      {/* Bottom buffer. Same blob as the pull-to-refresh strip, shown while
            the next page loads on infinite scroll. */}
      {hasMore && (
        <div
          aria-hidden={!loadingMore}
          data-state={loadingMore ? "loading" : "idle"}
          className="pointer-events-none flex items-center justify-center overflow-hidden"
          style={{
            height: loadingMore ? "var(--water-zone)" : 0,
            transition: "height 220ms var(--ease-b6, ease)",
          }}
        >
          {loadingMore && <WaterBlob mode="refreshing" />}
        </div>
      )}
    </div>
  );
});

export { WaterLoading, waterLoadingVariants };
