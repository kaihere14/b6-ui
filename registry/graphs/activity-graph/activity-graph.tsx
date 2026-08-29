"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI — Activity Graph
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
    "shadow-b6-sm select-none overflow-visible",
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

const SIZE_HEIGHT_MAP: Record<"sm" | "md" | "lg", string> = {
  sm: "h-12",
  md: "h-16",
  lg: "h-24",
};

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
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title">,
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

export interface BarColumnProps {
  bar: BarData;
  styles: Record<SegmentId, SegmentStyle>;
  animated?: boolean;
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
>(function BarColumn({ bar, styles, animated = true, className, ...props }, ref) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = animated && !shouldReduceMotion;

  return (
    <div
      ref={ref}
      className={cn("relative z-10 flex h-full min-h-0 flex-1 flex-col justify-end gap-0.5", className)}
      {...props}
    >
      {Object.entries(styles).map(([id, style], segmentIndex) => {
        const value = bar[id];
        if (typeof value !== "number") return null;

        const total = Object.keys(styles).reduce((sum, segmentId) => {
          const segmentValue = bar[segmentId];
          return sum + (typeof segmentValue === "number" ? Math.max(0, segmentValue) : 0);
        }, 0);
        const boundedValue = total > 0 ? (Math.max(0, value) / total) * 100 : 0;
        const description = `${style.label}${bar.label ? ` on ${bar.label}` : ""}: ${value}`;

        return (
          <motion.div
            key={id}
            className="group/segment relative w-full rounded-sm outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring"
            initial={shouldAnimate ? { height: 0, opacity: 0 } : false}
            animate={{ height: `${boundedValue}%`, opacity: 1 }}
            transition={{ duration: 0.45, delay: segmentIndex * 0.04 }}
            whileHover={shouldReduceMotion ? undefined : { scaleX: 1.04 }}
            tabIndex={0}
            role="img"
            aria-label={description}
            style={{
              ...segmentBackground(style),
            }}
          >
            <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-popover-foreground shadow-b6-sm group-hover/segment:block group-focus-visible/segment:block">
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
              className={cn(
                "flex items-center gap-1.5 text-muted-foreground",
                TYPE.caption,
              )}
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: style.fill }}
                aria-hidden
              />
              {style.label}
            </div>
            <div className={cn("font-semibold text-card-foreground mt-0.5", TYPE.small)}>
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
    const chartHeight = SIZE_HEIGHT_MAP[size ?? "md"];
    const isCompact = variant === "compact";
    const resolvedStyles = Object.fromEntries(
      Object.entries(config).map(([id, style]) => [
        id,
        { ...style, ...segmentStyles?.[id] },
      ]),
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
            <h3 className={cn("font-semibold text-card-foreground", TYPE.body)}>
              {title}
            </h3>
          </div>
        )}

        {/* ---- Chart bars ------------------------------------------------ */}
        <div
          className={cn(
            "flex items-end justify-between gap-1.5 px-0.5",
            chartHeight,
            !isCompact && "mb-3",
          )}
        >
          {data.map((bar, idx) => (
            <BarColumn
              key={idx}
              bar={bar}
              styles={resolvedStyles}
              animated={animated}
            />
          ))}
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
