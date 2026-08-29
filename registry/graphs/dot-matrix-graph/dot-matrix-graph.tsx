"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI — Dot Matrix Graph
 *
 * A column chart drawn in dots instead of bars: every column is a stack of
 * dots, one dot per `dotValue` units, so a value is read by counting rather
 * than by measuring a length. Columns can belong to different series, which is
 * how two periods sit side by side in one plot — the past one muted, the
 * current one solid.
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
  h2: "text-(length:--text-h2) leading-(--text-h2--line-height) tracking-(--text-h2--letter-spacing)",
} as const;

const dotMatrixGraphVariants = cva(
  [
    "relative border border-border bg-card text-card-foreground",
    "overflow-visible shadow-b6-sm select-none",
  ],
  {
    variants: {
      variant: {
        default: "p-4",
        compact: "p-3",
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

/** Opacity applied to every column that is not the active one. */
const DIMMED_OPACITY = 0.3;

/** Opacity of the baseline dot under an empty or short column. */
const BASELINE_OPACITY = 0.35;

/**
 * Plot height per size, in rem.
 *
 * The plot owns its height, so the card is exactly as tall on `monthly` with
 * six columns as on `daily` with thirty-two — switching range never resizes it.
 * The cell ceiling falls out of it: `height / maxDots`, published as
 * `--dot-cell` so every dot reads the same number.
 */
const SIZE_PLOT_HEIGHT_REM: Record<"sm" | "md" | "lg", number> = {
  sm: 5,
  md: 7,
  lg: 9,
};

/** Share of the cell the dot itself occupies. The rest is the lattice spacing. */
const DOT_FILL = "w-[62%]";

/** Range toggle shown in the header when `ranges` is left unset. */
const DEFAULT_RANGES: RangeOption[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

/**
 * Default ceiling on stack height.
 *
 * A dot column spends height fast — every dot is a row — so the stack is capped
 * and, without an explicit `dotValue`, the tallest column is drawn at exactly
 * this many dots. Raise `maxDots` for a taller, finer-grained plot.
 */
const MAX_DOTS_PER_COLUMN = 14;

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type SeriesId = string;
export type DotChartConfig = Record<SeriesId, SeriesStyle>;

export interface SeriesStyle {
  fill: string;
  label: string;
  /** Footer caption for the series. When omitted, the summed total is shown. */
  value?: string;
}

/** One column of the plot. */
export interface DotColumnData {
  value: number;
  /** Tick label, e.g. a day or a date. Used in the accessible label. */
  label?: string;
  /** Key into `config`. Defaults to the first series when omitted. */
  series?: SeriesId;
}

/** One entry in the header range toggle. */
export interface RangeOption {
  id: string;
  label: string;
}

/**
 * Columns to plot, either as one list or keyed by range id.
 *
 * A keyed object makes the range toggle work on its own: picking `weekly`
 * swaps in `data.weekly`. Pass a plain array instead when the parent owns the
 * switch and feeds new columns through `onRangeChange`.
 */
export type DotMatrixData = DotColumnData[] | Record<string, DotColumnData[]>;

export interface DotMatrixGraphProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "title">,
    VariantProps<typeof dotMatrixGraphVariants> {
  data: DotMatrixData;
  /** Series definitions keyed by the `series` field on each column. */
  config: DotChartConfig;
  title?: string;
  /** Headline figure beside the title, e.g. `"+326%"`. */
  headline?: React.ReactNode;
  /**
   * Units one dot stands for. When omitted, it is derived from the largest
   * column so the tallest stack is exactly `maxDots` tall.
   */
  dotValue?: number;
  /** Tallest a column may get, in dots. Caps how much height the plot spends. */
  maxDots?: number;
  /** Show the range toggle in the header. */
  showRanges?: boolean;
  /** Range toggle entries. Defaults to daily / weekly / monthly. */
  ranges?: RangeOption[];
  /**
   * Range selected on mount, and the range used when the toggle is hidden.
   * Defaults to `"daily"`.
   */
  defaultRange?: string;
  /** Controlled range id. Pass `onRangeChange` alongside it. */
  range?: string;
  onRangeChange?: (range: string) => void;
  /** Render a muted dot on the baseline of every column, including empty ones. */
  showBaseline?: boolean;
  /** Show a value tooltip above the hovered or focused column. */
  showTooltip?: boolean;
  /** Footer captions, one per series. */
  showLegend?: boolean;
  animated?: boolean;
  /** Formats a value for the footer and the accessible labels. */
  formatValue?: (value: number) => string;
  seriesStyles?: Partial<Record<SeriesId, Partial<SeriesStyle>>>;
}

export interface DotColumnProps {
  column: DotColumnData;
  style: SeriesStyle;
  /** Units one dot stands for. */
  dotValue: number;
  /** Tallest this column may get, in dots. */
  maxDots?: number;
  /** Position of this column in the plot. Part of the active-column identity. */
  columnIndex?: number;
  animated?: boolean;
  showBaseline?: boolean;
  /** Show the value tooltip while the column is hovered or focused. */
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  /**
   * Controlled active column. When set, every other column dims so the active
   * one stands out. Pass `onActiveColumnChange` to control it; left
   * uncontrolled, the column tracks its own hover state.
   */
  activeColumn?: number | null;
  onActiveColumnChange?: (columnIndex: number | null) => void;
}

export interface DotRangeToggleProps {
  ranges: RangeOption[];
  value: string;
  onValueChange: (range: string) => void;
}

export interface DotLegendProps {
  styles: Record<SeriesId, SeriesStyle>;
  data: DotColumnData[];
  formatValue?: (value: number) => string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** The series a column belongs to, falling back to the first configured one. */
function columnSeries(column: DotColumnData, seriesIds: SeriesId[]): SeriesId {
  return column.series ?? seriesIds[0] ?? "";
}

/** How many dots a value is worth, clamped to the stack ceiling. */
function dotCount(value: number, dotValue: number, maxDots: number): number {
  if (!(dotValue > 0)) return 0;
  return Math.min(maxDots, Math.max(0, Math.round(value / dotValue)));
}

/** Columns for the active range, whichever shape `data` arrived in. */
function resolveColumns(data: DotMatrixData, range: string): DotColumnData[] {
  if (Array.isArray(data)) return data;
  return data[range] ?? Object.values(data)[0] ?? [];
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                              */
/* -------------------------------------------------------------------------- */

/** A single column of dots, drawn from the baseline up. */
export const DotColumn = React.forwardRef<
  HTMLDivElement,
  DotColumnProps & Omit<HTMLMotionProps<"div">, "children" | "ref">
>(function DotColumn(
  {
    column,
    style,
    dotValue,
    maxDots = MAX_DOTS_PER_COLUMN,
    columnIndex = 0,
    animated = true,
    showBaseline = true,
    showTooltip = true,
    formatValue,
    activeColumn,
    onActiveColumnChange,
    className,
    ...props
  },
  ref,
) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = animated && !shouldReduceMotion;

  // Uncontrolled fallback so a standalone `DotColumn` still dims itself.
  const [internalActive, setInternalActive] = React.useState<number | null>(null);
  const isControlled = activeColumn !== undefined;
  const active = isControlled ? (activeColumn ?? null) : internalActive;

  const setActive = React.useCallback(
    (next: number | null) => {
      if (!isControlled) setInternalActive(next);
      onActiveColumnChange?.(next);
    },
    [isControlled, onActiveColumnChange],
  );

  const filled = dotCount(column.value, dotValue, maxDots);
  const dots = showBaseline ? Math.max(1, filled) : filled;
  const isActive = active === columnIndex;
  const isDimmed = active !== null && !isActive;
  const readable = formatValue ? formatValue(column.value) : column.value.toLocaleString();

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative flex h-full min-w-0 flex-1 flex-col-reverse items-center justify-start rounded-xs outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card",
        isActive && "z-20",
        className,
      )}
      animate={{ opacity: isDimmed ? DIMMED_OPACITY : 1 }}
      transition={{ duration: 0.18 }}
      tabIndex={0}
      role="img"
      aria-label={`${style.label}${column.label ? ` · ${column.label}` : ""}: ${readable}`}
      onMouseEnter={() => setActive(columnIndex)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(columnIndex)}
      onBlur={() => setActive(null)}
      {...props}
    >
      {Array.from({ length: dots }, (_, dotIndex) => (
        <motion.span
          key={dotIndex}
          className="flex aspect-square w-full max-w-[var(--dot-cell,0.5rem)] items-center justify-center"
          initial={shouldAnimate ? { opacity: 0, scale: 0.4 } : false}
          animate={{
            opacity: dotIndex < filled ? 1 : BASELINE_OPACITY,
            scale: 1,
          }}
          transition={{
            duration: 0.22,
            delay: shouldAnimate ? columnIndex * 0.012 + dotIndex * 0.008 : 0,
          }}
        >
          <span
            className={cn("aspect-square rounded-full", DOT_FILL)}
            style={{ backgroundColor: style.fill }}
          />
        </motion.span>
      ))}

      {/* Tooltip. Absolutely positioned, so it sits above the stack whatever
          the column height, and it never takes part in the dot layout. */}
      <AnimatePresence>
        {showTooltip && isActive && (
          <motion.span
            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 rounded-md border border-border bg-popover px-2 py-1 whitespace-nowrap text-popover-foreground shadow-b6-sm"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            aria-hidden
          >
            <span className={cn("block text-muted-foreground", TYPE.caption)}>
              {style.label}
              {column.label ? ` · ${column.label}` : ""}
            </span>
            <span className={cn("block font-semibold", TYPE.small)}>{readable}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

/**
 * Header range toggle.
 *
 * Plain buttons with `aria-pressed` rather than a tablist: the plot below is
 * one region that swaps its numbers, not a set of panels, so a pressed toggle
 * describes it honestly and needs no panel wiring.
 */
export const DotRangeToggle = React.forwardRef<
  HTMLDivElement,
  DotRangeToggleProps & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "onChange">
>(function DotRangeToggle({ ranges, value, onValueChange, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      role="group"
      aria-label="Range"
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      {ranges.map((option) => {
        const isSelected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onValueChange(option.id)}
            className={cn(
              "rounded-xs uppercase transition-colors duration-150 ease-b6",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              TYPE.caption,
              isSelected
                ? "font-semibold text-card-foreground"
                : "text-muted-foreground hover:text-card-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
});

/** Footer captions: one colour-keyed label and total per series. */
export const DotLegend = React.forwardRef<
  HTMLDivElement,
  DotLegendProps & React.ComponentPropsWithoutRef<"div">
>(function DotLegend({ styles, data, formatValue, className, ...props }, ref) {
  const seriesIds = Object.keys(styles);

  const totals = React.useMemo(() => {
    const sums: Record<SeriesId, number> = {};
    for (const id of seriesIds) sums[id] = 0;
    for (const column of data) {
      const id = columnSeries(column, seriesIds);
      if (id in sums) sums[id] = (sums[id] ?? 0) + column.value;
    }
    return sums;
  }, [data, seriesIds]);

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-x-6 gap-y-1", className)} {...props}>
      {seriesIds.map((id) => {
        const style = styles[id];
        if (!style) return null;
        const total = totals[id] ?? 0;

        return (
          <div key={id} className={cn("flex items-center gap-1.5", TYPE.caption)}>
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: style.fill }}
              aria-hidden
            />
            <span className="text-muted-foreground uppercase">{style.label}</span>
            <span className="font-semibold text-card-foreground">
              {style.value ?? (formatValue ? formatValue(total) : total.toLocaleString())}
            </span>
          </div>
        );
      })}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

const DotMatrixGraph = React.forwardRef<HTMLDivElement, DotMatrixGraphProps>(
  function DotMatrixGraph(
    {
      className,
      variant,
      size,
      data,
      config,
      title = "Distribution",
      headline,
      dotValue,
      maxDots = MAX_DOTS_PER_COLUMN,
      showRanges = true,
      ranges,
      defaultRange = "daily",
      range,
      onRangeChange,
      showBaseline = true,
      showTooltip = true,
      showLegend = true,
      animated = true,
      formatValue,
      seriesStyles,
      ...props
    },
    ref,
  ) {
    const [activeColumn, setActiveColumn] = React.useState<number | null>(null);
    const [internalRange, setInternalRange] = React.useState(defaultRange);
    const resolvedSize = size ?? "md";
    const isCompact = variant === "compact";

    // `maxDots` divides the plot height in CSS, so it can never reach 0.
    const rows = Math.max(1, Math.round(maxDots));
    const rangeOptions = ranges ?? DEFAULT_RANGES;
    // With the toggle hidden there is nothing to select, so the graph stays on
    // `defaultRange` — "daily" unless the consumer named another one.
    const activeRange = range ?? (showRanges ? internalRange : defaultRange);

    const setRange = React.useCallback(
      (next: string) => {
        if (range === undefined) setInternalRange(next);
        onRangeChange?.(next);
      },
      [range, onRangeChange],
    );

    const columns = React.useMemo(() => resolveColumns(data, activeRange), [data, activeRange]);

    const resolvedStyles = React.useMemo(
      () =>
        Object.fromEntries(
          Object.entries(config).map(([id, style]) => [
            id,
            { ...style, ...seriesStyles?.[id] },
          ]),
        ) as DotChartConfig,
      [config, seriesStyles],
    );
    const seriesIds = React.useMemo(() => Object.keys(resolvedStyles), [resolvedStyles]);

    // Without an explicit `dotValue`, the tallest column is drawn at the stack
    // ceiling and every other column is scaled against it.
    const resolvedDotValue = React.useMemo(() => {
      if (dotValue && dotValue > 0) return dotValue;
      const max = columns.reduce((peak, column) => Math.max(peak, column.value), 0);
      return max > 0 ? max / rows : 1;
    }, [columns, dotValue, rows]);

    return (
      <div
        ref={ref}
        className={cn(dotMatrixGraphVariants({ variant, size }), className)}
        {...props}
      >
        {/* ---- Header ---------------------------------------------------- */}
        {!isCompact && (
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className={cn("text-muted-foreground uppercase", TYPE.caption)}>{title}</h3>
              {headline != null && (
                <p className={cn("mt-1 font-semibold text-card-foreground", TYPE.h2)}>
                  {headline}
                </p>
              )}
            </div>
            {showRanges && rangeOptions.length > 0 && (
              <DotRangeToggle
                ranges={rangeOptions}
                value={activeRange}
                onValueChange={setRange}
                className="pt-0.5"
              />
            )}
          </div>
        )}

        {/* ---- Dot columns ------------------------------------------------ */}
        <div className={cn(!isCompact && "mb-3")}>
          <div
            className="flex w-full items-end"
            style={
              {
                height: `${SIZE_PLOT_HEIGHT_REM[resolvedSize]}rem`,
                "--dot-cell": `${SIZE_PLOT_HEIGHT_REM[resolvedSize] / rows}rem`,
              } as React.CSSProperties
            }
            onMouseLeave={() => setActiveColumn(null)}
          >
            {columns.map((column, index) => {
              const style = resolvedStyles[columnSeries(column, seriesIds)];
              if (!style) return null;

              return (
                <DotColumn
                  key={index}
                  column={column}
                  columnIndex={index}
                  style={style}
                  dotValue={resolvedDotValue}
                  maxDots={rows}
                  animated={animated}
                  showBaseline={showBaseline}
                  showTooltip={showTooltip}
                  formatValue={formatValue}
                  activeColumn={activeColumn}
                  onActiveColumnChange={setActiveColumn}
                />
              );
            })}
          </div>
        </div>

        {/* ---- Footer: series captions ------------------------------------ */}
        {showLegend && (
          <DotLegend styles={resolvedStyles} data={columns} formatValue={formatValue} />
        )}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/* Exports                                                                     */
/* -------------------------------------------------------------------------- */

export default DotMatrixGraph;
export { DotMatrixGraph, dotMatrixGraphVariants };
