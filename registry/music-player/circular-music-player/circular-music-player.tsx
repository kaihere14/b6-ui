"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useAnimationFrame, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI: Circular Music Player
 *
 * A round dot-matrix display in the shape of a phone-back glyph panel: a dark
 * disc filled with a square pixel grid, clipped to the circle, with a spectrum
 * rising from the bottom. Unlit pixels stay faintly visible, so the grid reads
 * as a physical panel rather than as bars floating in space.
 *
 * Compose it as:
 *
 * ```tsx
 * <CircularMusicPlayer label="Now playing">
 *   <CircularMusicPlayerMatrix />
 * </CircularMusicPlayer>
 * ```
 *
 * The matrix is drawn on a `<canvas>` on Motion's frame loop, so a running
 * spectrum never re-renders React. Under `prefers-reduced-motion`, or with
 * `active={false}`, it paints one still frame and stops.
 *
 * This file is standalone by design. It carries its own type-step reads and
 * imports nothing from the rest of B6, because a registry item has to work in a
 * project that installed nothing else.
 */

/* -------------------------------------------------------------------------- */
/* Type steps                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * B6 type steps, written as direct token reads. A registry component cannot
 * name a step (`text-small`): tailwind-merge only sorts the B6 scale into the
 * font-size group when cn() has been extended, which a stock shadcn project has
 * not, so the step would be mistaken for a colour and a later size utility
 * would delete an earlier colour.
 */
const TYPE = {
  caption:
    "text-(length:--text-caption) leading-(--text-caption--line-height) tracking-(--text-caption--letter-spacing) font-(weight:--text-caption--font-weight)",
  small: "text-(length:--text-small) leading-(--text-small--line-height)",
} as const;

/* -------------------------------------------------------------------------- */
/* Root                                                                        */
/* -------------------------------------------------------------------------- */

const circularMusicPlayerVariants = cva(
  [
    "relative isolate grid aspect-square shrink-0 place-items-center overflow-hidden rounded-full",
    "transition-[box-shadow,border-color] duration-200 ease-b6",
    // The rim is drawn as an overlay above every layer rather than as a border
    // on the box. A border sits under the content box, so a lit pixel reaching
    // the edge would paint over it and the disc would lose its outline exactly
    // where the panel is brightest.
    "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-full after:border after:content-['']",
  ],
  {
    variants: {
      size: {
        sm: "size-40",
        md: "size-56",
        lg: "size-72",
      },
      tone: {
        glyph: "bg-glyph text-glyph-foreground shadow-b6-md after:border-current/15",
        surface: "bg-card text-card-foreground shadow-b6-md after:border-border",
        muted: "bg-muted text-foreground after:border-transparent",
        ghost: "bg-transparent text-foreground after:border-border",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "glyph",
    },
  },
);

/**
 * Playback state, passed down to the parts.
 *
 * The player displays state, it never owns it: the track is playing somewhere
 * else, in an audio element or in Spotify, and both the spectrum and the ring
 * are describing that. So the root takes `playing` and `progress` as props and
 * hands them down, and a part used outside a root still works, because the
 * context is optional and every part takes the same value as a prop.
 */
interface PlayerContextValue {
  playing: boolean;
  progress: number;
}

const PlayerContext = React.createContext<PlayerContextValue | null>(null);

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export interface CircularMusicPlayerProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof circularMusicPlayerVariants> {
  /**
   * Name announced for the player as a whole. Every layer inside is decorative
   * or separately labelled, so this is what a screen reader reads on entry.
   */
  label?: string;

  /**
   * Whether the track is running. The spectrum animates while it is true and
   * freezes on a still frame while it is false. @default true
   */
  playing?: boolean;

  /** Position through the track, 0 to 1. Read by the progress ring. @default 0 */
  progress?: number;
}

export const CircularMusicPlayer = React.forwardRef<HTMLDivElement, CircularMusicPlayerProps>(
  function CircularMusicPlayer(
    {
      className,
      size,
      tone,
      label = "Music player",
      playing = true,
      progress = 0,
      children,
      ...props
    },
    ref,
  ) {
    const context = React.useMemo<PlayerContextValue>(
      () => ({ playing, progress: clamp01(progress) }),
      [playing, progress],
    );

    return (
      <PlayerContext.Provider value={context}>
        <div
          ref={ref}
          role="group"
          aria-label={label}
          data-slot="circular-music-player"
          data-playing={playing ? "" : undefined}
          className={cn(circularMusicPlayerVariants({ size, tone }), className)}
          {...props}
        >
          {children}
        </div>
      </PlayerContext.Provider>
    );
  },
);

/* -------------------------------------------------------------------------- */
/* Matrix                                                                      */
/* -------------------------------------------------------------------------- */

/** A shared 1x1 context that turns any CSS colour string into "r,g,b". */
let colorProbe: CanvasRenderingContext2D | null = null;

function resolveColor(css: string): string {
  if (typeof document === "undefined") return "255,255,255";
  if (!colorProbe) {
    const probe = document.createElement("canvas");
    probe.width = probe.height = 1;
    colorProbe = probe.getContext("2d", { willReadFrequently: true });
  }
  if (!colorProbe) return "255,255,255";
  colorProbe.clearRect(0, 0, 1, 1);
  colorProbe.fillStyle = "#000";
  colorProbe.fillStyle = css;
  colorProbe.fillRect(0, 0, 1, 1);
  const [r, g, b] = colorProbe.getImageData(0, 0, 1, 1).data;
  return `${r},${g},${b}`;
}

/** Deterministic 0..1 hash, so a column behaves the same on every load. */
function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const TAU = Math.PI * 2;

/** Alpha of a pixel that is off. Low enough to sit back, high enough to read. */
const PIXEL_OFF = 0.09;
/** Alpha of the peak marker floating above a bar. */
const PIXEL_PEAK = 0.7;

interface MatrixState {
  w: number;
  h: number;
  color: string;
  start: number;
  frame: number;
  /** Smoothed level per column, 0..1. */
  levels: number[];
  /** Decaying peak per column, 0..1. */
  peaks: number[];
}

/**
 * Synthetic spectrum for column `i` at time `t`.
 *
 * Three sines at unrelated rates, offset by a per-column hash, so neighbouring
 * columns move together without ever landing in step. The envelope leans on the
 * middle of the grid the way a real spectrum leans on the low end, which also
 * keeps the tall bars where the circle is widest.
 */
function spectrum(i: number, columns: number, t: number) {
  const seed = hash(i);
  const centre = (columns - 1) / 2;
  const spread = columns * 0.42;
  const envelope = 0.62 + 0.38 * Math.exp(-(((i - centre) / spread) ** 2) * 1.3);

  const a = Math.sin(t * 1.9 + i * 0.55);
  const b = Math.sin(t * 3.1 + seed * TAU);
  const c = Math.sin(t * 0.7 + seed * 6.3 + i * 0.21);
  const mixed = (a * 0.45 + b * 0.33 + c * 0.22 + 1) / 2;

  // Capped at two thirds of the grid: the spectrum sits in the lower part of
  // the disc, the way the bars on a phone-back glyph do, and never fills it.
  return Math.min(0.74, Math.max(0.08, mixed ** 1.05 * envelope * 0.78));
}

function paintMatrix(
  ctx: CanvasRenderingContext2D,
  state: MatrixState,
  columns: number,
  rows: number,
  showPeaks: boolean,
) {
  const { w, h, color, levels, peaks } = state;
  ctx.clearRect(0, 0, w, h);

  const cell = Math.min(w, h) / columns;
  const pixel = cell * 0.66;
  const originX = (w - cell * columns) / 2;
  const originY = (h - cell * rows) / 2;
  const cx = w / 2;
  const cy = h / 2;
  // The mask is measured to pixel centres, so it has to come in by half a pixel
  // plus a margin: without that, a cell whose centre is just inside the rim
  // still paints a square across it, the disc clips the overhang, and the
  // silhouette turns ragged wherever the panel is lit.
  const radius = Math.min(w, h) / 2 - cell * 0.32 - pixel / 2;

  const inside = (col: number, row: number) => {
    const x = originX + col * cell + cell / 2;
    const y = originY + row * cell + cell / 2;
    return Math.hypot(x - cx, y - cy) <= radius;
  };

  for (let col = 0; col < columns; col++) {
    // A bar grows from the lowest pixel the disc leaves in this column, not
    // from a flat baseline: on a circle the two are the same only in the
    // middle, and everywhere else a flat baseline hangs in space with an empty
    // crescent below it.
    let bottom = -1;
    let available = 0;
    for (let row = rows - 1; row >= 0; row--) {
      if (!inside(col, row)) continue;
      if (bottom < 0) bottom = row;
      available++;
    }
    if (bottom < 0) continue;

    const level = levels[col] ?? 0;
    const lit = level * available;
    const litRows = Math.floor(lit);
    const partial = lit - litRows;
    const peakRow = showPeaks ? Math.round((peaks[col] ?? 0) * available) : -1;

    for (let row = bottom; row >= 0; row--) {
      if (!inside(col, row)) continue;
      const x = originX + col * cell + cell / 2;
      const y = originY + row * cell + cell / 2;

      const height = bottom - row;
      let alpha = PIXEL_OFF;
      if (height < litRows) {
        alpha = 1;
      } else if (height === litRows && partial > 0.05) {
        // Fade the pixel at the top of a bar by how far the bar reaches into
        // it, so a rising level does not step a whole cell at a time.
        alpha = PIXEL_OFF + partial * (1 - PIXEL_OFF);
      } else if (height === peakRow) {
        alpha = PIXEL_PEAK;
      }

      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.fillRect(x - pixel / 2, y - pixel / 2, pixel, pixel);
    }
  }
}

const matrixVariants = cva("pointer-events-none absolute z-0", {
  variants: {
    inset: {
      none: "inset-0",
      sm: "inset-[6%]",
      md: "inset-[9%]",
      lg: "inset-[12%]",
    },
  },
  defaultVariants: {
    inset: "none",
  },
});

export interface CircularMusicPlayerMatrixProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof matrixVariants> {
  /** Pixels across the grid. Rows match, so the pixels stay square. @default 24 */
  columns?: number;

  /**
   * Bar heights, 0..1, one per column. Pass analyser data to drive the panel
   * from real audio; leave it out for the built-in synthetic spectrum.
   */
  levels?: number[];

  /**
   * Run the spectrum. False freezes the panel on a still frame. Defaults to the
   * play state of the surrounding player, so pausing stops the panel.
   */
  active?: boolean;

  /** Timing multiplier for the synthetic spectrum. @default 1 */
  speed?: number;

  /** Draw the decaying marker above each bar. @default true */
  peaks?: boolean;
}

/**
 * The dot-matrix panel: a square pixel grid clipped to the disc, with a
 * spectrum rising from the bottom.
 */
export const CircularMusicPlayerMatrix = React.forwardRef<
  HTMLDivElement,
  CircularMusicPlayerMatrixProps
>(function CircularMusicPlayerMatrix(
  { className, columns = 24, levels, active, speed = 1, peaks = true, inset, ...props },
  ref,
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const player = React.useContext(PlayerContext);
  const rows = columns;
  const driven = levels !== undefined;
  const isActive = active ?? player?.playing ?? true;
  const running = isActive && !reduced && !driven;

  const stateRef = React.useRef<MatrixState>({
    w: 0,
    h: 0,
    color: "255,255,255",
    start: 0,
    frame: 0,
    levels: [],
    peaks: [],
  });

  // Seed the columns so a still frame is a plausible spectrum, not a flat line.
  const seedLevels = React.useCallback(
    (t: number) => {
      const state = stateRef.current;
      state.levels = Array.from({ length: columns }, (_, i) =>
        driven ? (levels[i] ?? 0) : spectrum(i, columns, t),
      );
      state.peaks = [...state.levels];
    },
    [columns, driven, levels],
  );

  const repaint = React.useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    const state = stateRef.current;
    if (ctx && state.w) paintMatrix(ctx, state, columns, rows, peaks);
  }, [columns, rows, peaks]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    // Repainting here is what keeps a frozen panel correct: it has no next
    // frame to pick a new colour up on, so after a theme change the canvas
    // would still be holding pixels painted in the colour of the theme that
    // just went away, and on a dark disc those are invisible.
    const readColor = () => {
      stateRef.current.color = resolveColor(getComputedStyle(canvas).color);
      repaint();
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
      Object.assign(stateRef.current, { w, h });
      readColor();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    const theme = new MutationObserver(readColor);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    return () => {
      observer.disconnect();
      theme.disconnect();
    };
  }, [repaint]);

  // Everything that is not a running synthetic spectrum paints once: driven
  // levels, a frozen panel, and reduced motion all land here.
  React.useEffect(() => {
    if (running) return;
    stateRef.current.start = 0;
    seedLevels(driven ? 0 : 1.4);
    repaint();
  }, [running, driven, seedLevels, repaint]);

  useAnimationFrame((time) => {
    if (!running) return;
    const state = stateRef.current;
    if (!state.w) return;
    if (!state.start) state.start = time;
    if ((state.frame = (state.frame + 1) % 45) === 0) {
      const canvas = canvasRef.current;
      if (canvas) state.color = resolveColor(getComputedStyle(canvas).color);
    }

    const t = ((time - state.start) / 1000) * (speed > 0 ? speed : 1);
    for (let i = 0; i < columns; i++) {
      const target = spectrum(i, columns, t);
      const current = state.levels[i] ?? target;
      // Fast attack, slow release: a bar snaps up to a hit and falls back.
      state.levels[i] = current + (target - current) * (target > current ? 0.38 : 0.12);
      state.peaks[i] = Math.max(state.levels[i], (state.peaks[i] ?? 0) - 0.006);
    }
    repaint();
  });

  return (
    <div
      ref={ref}
      aria-hidden
      data-slot="circular-music-player-matrix"
      className={cn(matrixVariants({ inset }), className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* Progress ring                                                               */
/* -------------------------------------------------------------------------- */

/** Ring geometry, in the 100x100 user space the SVG is drawn in. */
const RING_RADIUS = 47;
const RING_WIDTH = 1.8;

/** A point on the ring, measured clockwise from the top. */
function ringPoint(angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: 50 + RING_RADIUS * Math.cos(radians),
    y: 50 + RING_RADIUS * Math.sin(radians),
  };
}

export interface CircularMusicPlayerProgressProps
  extends React.ComponentPropsWithoutRef<"div"> {
  /** Position through the track, 0 to 1. Defaults to the player's `progress`. */
  value?: number;

  /**
   * `dashed` cuts the ring into strips, matching the pixel grid inside it.
   * `solid` draws one unbroken line, for a player that wants the panel to be
   * the only pixelated thing on screen. @default "dashed"
   */
  variant?: "dashed" | "solid";

  /** Strips a dashed ring is cut into. Ignored when `variant` is solid. @default 44 */
  segments?: number;

  /** Thickness of the ring, in hundredths of the disc. @default 1.8 */
  thickness?: number;

  /** Name announced for the ring. @default "Playback progress" */
  label?: string;
}

/**
 * A ring around the rim, filling clockwise from the top.
 *
 * When it is dashed, the track and the fill are cut by the same pattern and
 * both start at twelve o'clock, so a lit strip always covers a track strip
 * exactly rather than straddling two of them.
 */
export const CircularMusicPlayerProgress = React.forwardRef<
  HTMLDivElement,
  CircularMusicPlayerProgressProps
>(function CircularMusicPlayerProgress(
  {
    className,
    value,
    variant = "dashed",
    segments = 44,
    thickness = RING_WIDTH,
    label = "Playback progress",
    ...props
  },
  ref,
) {
  const player = React.useContext(PlayerContext);
  const position = clamp01(value ?? player?.progress ?? 0);

  const circumference = 2 * Math.PI * RING_RADIUS;
  const step = circumference / Math.max(1, Math.round(segments));
  const dashes = variant === "dashed" ? `${step * 0.55} ${step * 0.45}` : undefined;
  const sweep = position * 360;
  const end = ringPoint(sweep);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position * 100)}
      data-slot="circular-music-player-progress"
      data-variant={variant}
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      {...props}
    >
      <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeDasharray={dashes}
          transform="rotate(-90 50 50)"
          className="opacity-20"
        />
        {position >= 0.999 ? (
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            strokeDasharray={dashes}
            transform="rotate(-90 50 50)"
          />
        ) : position > 0 ? (
          <path
            d={`M 50 ${50 - RING_RADIUS} A ${RING_RADIUS} ${RING_RADIUS} 0 ${
              sweep > 180 ? 1 : 0
            } 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            strokeDasharray={dashes}
          />
        ) : null}
      </svg>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* Layers                                                                      */
/* -------------------------------------------------------------------------- */

const dialVariants = cva("pointer-events-none absolute inset-0 rounded-full", {
  variants: {
    inset: {
      none: "",
      sm: "inset-2",
      md: "inset-4",
      lg: "inset-6",
    },
  },
  defaultVariants: {
    inset: "sm",
  },
});

export interface CircularMusicPlayerDialProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof dialVariants> {}

/**
 * A ring layer over the panel, for a progress track drawn around the rim. It
 * takes no pointer events, so a scrubber added later opts back in on its own
 * element.
 */
export const CircularMusicPlayerDial = React.forwardRef<
  HTMLDivElement,
  CircularMusicPlayerDialProps
>(function CircularMusicPlayerDial({ className, inset, ...props }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden
      data-slot="circular-music-player-dial"
      className={cn(dialVariants({ inset }), "border border-current/15", className)}
      {...props}
    />
  );
});

/**
 * The centre stack: track title, artist, elapsed time. It sits above the panel,
 * so keep it short: the matrix is the subject.
 */
export const CircularMusicPlayerCenter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function CircularMusicPlayerCenter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="circular-music-player-center"
      className={cn(
        "relative flex size-[62%] flex-col items-center justify-center gap-1 overflow-hidden rounded-full text-center",
        className,
      )}
      {...props}
    />
  );
});

/**
 * Transport row. It anchors to the bottom of the circle and shrink-wraps its
 * buttons, so a play, previous and next control can be dropped straight in.
 */
export const CircularMusicPlayerControls = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function CircularMusicPlayerControls({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="circular-music-player-controls"
      className={cn("absolute bottom-[8%] flex items-center justify-center gap-2", className)}
      {...props}
    />
  );
});

/** Track title inside the centre stack. */
export const CircularMusicPlayerTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(function CircularMusicPlayerTitle({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="circular-music-player-title"
      className={cn(TYPE.small, "max-w-full truncate font-medium", className)}
      {...props}
    />
  );
});

/** Secondary line inside the centre stack: artist, album, elapsed time. */
export const CircularMusicPlayerMeta = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(function CircularMusicPlayerMeta({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="circular-music-player-meta"
      className={cn(TYPE.caption, "max-w-full truncate opacity-70", className)}
      {...props}
    />
  );
});

export { circularMusicPlayerVariants };
