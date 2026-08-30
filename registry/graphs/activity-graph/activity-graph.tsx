"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI: Activity Graph
 *
 * A configurable stacked-bar chart card for any seven-day activity series.
 * Each bar is a column of stacked segments with solid or hatched pattern
 * fills, a colour legend, derived summary stats, and segment details on hover.
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
 * See the type-step rule in AGENTS.md §5 for the rationale: a named step
 * like `text-body` collides with colour utilities in a stock `cn()`.
 */
const TYPE = {
  small: "text-(length:--text-small) leading-(--text-small--line-height)",
  caption:
    "text-(length:--text-caption) leading-(--text-caption--line-height) tracking-(--text-caption--letter-spacing) font-(--text-caption--font-weight)",
  body: "text-(length:--text-body) leading-(--text-body--line-height)",
} as const;

const activityGraphVariants = cva(
  [
    "relative border border-border bg-card text-card-foreground",
    "overflow-visible shadow-b6-sm select-none",
  ],
  {
    variants: {
      variant: {
        default: "p-4",
        compact: "p-3",
        detailed: "p-4",
      },
      size: {
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

type PatternVariant = "solid" | "hatched";

export type SegmentId = string;
export type ChartConfig = Record<SegmentId, SegmentStyle>;

export interface SegmentStyle {
  fill: string;
  pattern: PatternVariant;
  label: string;
}

/** Opacity applied to every segment that is not the active one. */
const DIMMED_OPACITY = 0.22;

/**
 * Chart height per size, as `clamp(floor, container-relative, ceiling)`.
 *
 * The middle term is `cqw`, a share of the chart row's width, so the bars keep a
 * readable aspect ratio at any card width. The floor keeps a narrow card usable;
 * the ceiling stops a full-width card from turning into a wall.
 *
 * The `@container` sits on a wrapper *inside* the card, never on the card
 * itself: `container-type: inline-size` zeroes an element's min-content width,
 * which collapses the card whenever a parent lets it shrink to fit.
 */
const SIZE_HEIGHT_MAP: Record<"sm" | "md" | "lg", string> = {
  sm: "h-[clamp(3rem,14cqw,7rem)]",
  md: "h-[clamp(4rem,20cqw,10rem)]",
  lg: "h-[clamp(6rem,28cqw,14rem)]",
};

/** Cap on a single column so bars stay bars, not slabs, on a wide card. */
const BAR_MAX_WIDTH = "max-w-24";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface BarData {
  [segment: string]: number | string | undefined;
  label?: string;
}

export interface StatItem {
  segment: SegmentId;
  /** Optional override. When omitted, the value is summed from `data`. */
  value?: string;
}

export interface ActivityGraphProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "title">,
    VariantProps<typeof activityGraphVariants> {
  data: BarData[];
  /** Series to render. The object keys must match numeric keys in `data`. */
  config: ChartConfig;
  stats?: StatItem[];
  title?: string;
  showLegend?: boolean;
  animated?: boolean;
  segmentStyles?: Partial<Record<SegmentId, Partial<SegmentStyle>>>;
}

/** The segment currently hovered or focused, identified across the whole chart. */
export interface ActiveSegment {
  barIndex: number;
  segmentId: SegmentId;
}

export interface BarColumnProps {
  bar: BarData;
  styles: Record<SegmentId, SegmentStyle>;
  animated?: boolean;
  /** Position of this column in the chart. Part of the active-segment identity. */
  barIndex?: number;
  /**
   * Largest bar total in the chart. The column is drawn as a share of it, so
   * a quiet day is visibly shorter than a busy one. Defaults to this bar's own
   * total, which draws the column at full height.
   */
  maxTotal?: number;
  /**
   * Controlled active segment. When set, every other segment in the chart dims
   * so the active one stands out. Pass `onActiveSegmentChange` to control it;
   * left uncontrolled, the column tracks its own hover state.
   */
  activeSegment?: ActiveSegment | null;
  onActiveSegmentChange?: (segment: ActiveSegment | null) => void;
}

export interface ChartLegendProps {
  styles: Record<SegmentId, SegmentStyle>;
  data: BarData[];
  stats?: StatItem[];
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** Build a CSS background for a segment based on its pattern. */
function segmentBackground(style: SegmentStyle): React.CSSProperties {
  if (style.pattern === "hatched") {
    return {
      background: `repeating-linear-gradient(
        -45deg,
        ${style.fill},
        ${style.fill} 1px,
        transparent 1px,
        transparent 3px
      )`,
    };
  }
  return { backgroundColor: style.fill };
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                              */
/* -------------------------------------------------------------------------- */

/** A single stacked bar column. */
export const BarColumn = React.forwardRef<
  HTMLDivElement,
  BarColumnProps & React.ComponentPropsWithoutRef<"div">
>(function BarColumn(
  {
    bar,
    styles,
    animated = true,
    barIndex = 0,
    maxTotal,
    activeSegment,
    onActiveSegmentChange,
    className,
    ...props
  },
  ref,
) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = animated && !shouldReduceMotion;

  // Uncontrolled fallback so a standalone `BarColumn` still dims its own stack.
  const [internalActive, setInternalActive] = React.useState<ActiveSegment | null>(null);
  const isControlled = activeSegment !== undefined;
  const active = isControlled ? (activeSegment ?? null) : internalActive;

  const setActive = React.useCallback(
    (next: ActiveSegment | null) => {
      if (!isControlled) setInternalActive(next);
      onActiveSegmentChange?.(next);
    },
    [isControlled, onActiveSegmentChange],
  );

  const total = React.useMemo(
    () =>
      Object.keys(styles).reduce((sum, segmentId) => {
        const segmentValue = bar[segmentId];
        return sum + (typeof segmentValue === "number" ? Math.max(0, segmentValue) : 0);
      }, 0),
    [bar, styles],
  );

  // Column height is this bar's total against the chart's biggest bar; segment
  // heights then split that column. Scaling segments against their own bar
  // instead would draw every day at full height and hide the volume entirely.
  const scale = maxTotal && maxTotal > 0 ? total / maxTotal : 1;

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex h-full min-h-0 flex-1 flex-col justify-end",
        BAR_MAX_WIDTH,
        className,
      )}
      {...props}
    >
      <div
        className="flex min-h-0 w-full flex-col justify-end gap-0.5"
        style={{ height: `${Math.min(1, scale) * 100}%` }}
      >
        {Object.entries(styles).map(([id, style], segmentIndex) => {
          const value = bar[id];
          if (typeof value !== "number") return null;

          const boundedValue = total > 0 ? (Math.max(0, value) / total) * 100 : 0;
          const description = `${style.label}${bar.label ? ` on ${bar.label}` : ""}: ${value}`;
          const isActive =
            active !== null && active.barIndex === barIndex && active.segmentId === id;
          const isDimmed = active !== null && !isActive;

          return (
            <motion.div
              key={id}
              className="group/segment relative w-full rounded-sm outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring"
              initial={shouldAnimate ? { height: 0, opacity: 0 } : false}
              animate={{
                height: `${boundedValue}%`,
                opacity: isDimmed ? DIMMED_OPACITY : 1,
              }}
              transition={{
                height: { duration: 0.45, delay: segmentIndex * 0.04 },
                opacity: { duration: 0.18 },
              }}
              whileHover={shouldReduceMotion ? undefined : { scaleX: 1.04 }}
              tabIndex={0}
              role="img"
              aria-label={description}
              onMouseEnter={() => setActive({ barIndex, segmentId: id })}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive({ barIndex, segmentId: id })}
              onBlur={() => setActive(null)}
              style={{
                ...segmentBackground(style),
                zIndex: isActive ? 10 : undefined,
              }}
            >
              <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 rounded-md border border-border bg-popover px-2 py-1 whitespace-nowrap text-popover-foreground shadow-b6-sm group-hover/segment:block group-focus-visible/segment:block">
                <span className={cn("block text-muted-foreground", TYPE.caption)}>
                  {style.label}
                  {bar.label ? ` · ${bar.label}` : ""}
                </span>
                <span className={cn("block font-semibold", TYPE.small)}>{value}</span>
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

/** Legend row showing colour dot + label for each segment. */
export const ChartLegend = React.forwardRef<
  HTMLDivElement,
  ChartLegendProps & React.ComponentPropsWithoutRef<"div">
>(function ChartLegend({ styles, data, stats, className, ...props }, ref) {
  const statMap = React.useMemo(() => {
    const m: Record<SegmentId, string> = {};
    Object.keys(styles).forEach((id) => {
      const total = data.reduce((sum, bar) => {
        const value = bar[id];
        return sum + (typeof value === "number" ? value : 0);
      }, 0);
      m[id] = total.toLocaleString();
    });
    stats?.forEach((stat) => {
      if (stat.value != null) m[stat.segment] = stat.value;
    });
    return m;
  }, [data, stats, styles]);

  return (
    <div ref={ref} className={cn("flex gap-x-4", className)} {...props}>
      {Object.entries(styles).map(([id, style]) => {
        const stat = statMap[id];
        return (
          <div key={id}>
            <div
              className={cn("flex items-center gap-1.5 text-muted-foreground", TYPE.caption)}
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: style.fill }}
                aria-hidden
              />
              {style.label}
            </div>
            <div className={cn("mt-0.5 font-semibold text-card-foreground", TYPE.small)}>
              {stat}
            </div>
          </div>
        );
      })}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

const ActivityGraph = React.forwardRef<HTMLDivElement, ActivityGraphProps>(
  function ActivityGraph(
    {
      className,
      variant,
      size,
      data,
      config,
      stats,
      title = "Weekly Activity",
      showLegend = true,
      animated = true,
      segmentStyles,
      ...props
    },
    ref,
  ) {
    const [activeSegment, setActiveSegment] = React.useState<ActiveSegment | null>(null);
    const chartHeight = SIZE_HEIGHT_MAP[size ?? "md"];
    const maxTotal = React.useMemo(
      () =>
        data.reduce((max, bar) => {
          const total = Object.keys(config).reduce((sum, segmentId) => {
            const value = bar[segmentId];
            return sum + (typeof value === "number" ? Math.max(0, value) : 0);
          }, 0);
          return Math.max(max, total);
        }, 0),
      [data, config],
    );
    const isCompact = variant === "compact";
    const resolvedStyles = Object.fromEntries(
      Object.entries(config).map(([id, style]) => [id, { ...style, ...segmentStyles?.[id] }]),
    ) as ChartConfig;

    return (
      <div
        ref={ref}
        className={cn(activityGraphVariants({ variant, size }), className)}
        {...props}
      >
        {/* ---- Header ---------------------------------------------------- */}
        {!isCompact && (
          <div className="mb-3 flex items-center justify-between">
            <h3 className={cn("font-semibold text-card-foreground", TYPE.body)}>{title}</h3>
          </div>
        )}

        {/* ---- Chart bars ------------------------------------------------ */}
        <div className={cn("@container", !isCompact && "mb-3")}>
          <div
            className={cn("flex items-end justify-between gap-1.5 px-0.5", chartHeight)}
            onMouseLeave={() => setActiveSegment(null)}
          >
            {data.map((bar, idx) => (
              <BarColumn
                key={idx}
                bar={bar}
                barIndex={idx}
                maxTotal={maxTotal}
                styles={resolvedStyles}
                animated={animated}
                activeSegment={activeSegment}
                onActiveSegmentChange={setActiveSegment}
              />
            ))}
          </div>
        </div>

        {/* ---- Footer: legend + stats ------------------------------------- */}
        {showLegend && (
          <div className="flex items-end justify-between gap-3">
            <ChartLegend styles={resolvedStyles} data={data} stats={stats} />
          </div>
        )}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/* Exports                                                                     */
/* -------------------------------------------------------------------------- */

export default ActivityGraph;
export { ActivityGraph, activityGraphVariants };
export type { PatternVariant };
