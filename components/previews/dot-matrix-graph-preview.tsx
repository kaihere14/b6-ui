"use client";

import {
  DotMatrixGraph,
  type DotChartConfig,
  type DotColumnData,
} from "@/components/ui/dot-matrix-graph";

/** Two periods side by side: the past one muted, the current one solid. */
function pair(previous: number[], current: number[]): DotColumnData[] {
  return [
    ...previous.map((value, index) => ({ value, series: "previous", label: `#${index + 1}` })),
    ...current.map((value, index) => ({ value, series: "current", label: `#${index + 1}` })),
  ];
}

const RANGE_DATA: Record<string, DotColumnData[]> = {
  daily: pair(
    [120, 90, 140, 260, 180, 150, 210, 190, 160, 130, 110, 170, 220, 150, 120, 100],
    [180, 420, 980, 1400, 760, 520, 610, 900, 340, 280, 700, 460, 380, 520, 640, 410],
  ),
  weekly: pair([640, 820, 700, 1090], [1980, 3400, 2600, 4412]),
  monthly: pair([2100, 2450, 3250], [6800, 9100, 12392]),
};

const SAMPLE_CONFIG: DotChartConfig = {
  previous: { fill: "var(--color-muted-foreground)", label: "May", value: "$3,250" },
  current: { fill: "var(--color-foreground)", label: "Jun", value: "$12,392" },
};

const currency = (value: number) => `$${Math.round(value).toLocaleString()}`;

export function DotMatrixGraphPreview() {
  return (
    <div className="flex items-center justify-center py-6">
      <DotMatrixGraph
        data={RANGE_DATA}
        config={SAMPLE_CONFIG}
        title="Revenue"
        headline="+326%"
        formatValue={currency}
        size={"lg"}
        className="w-full max-w-2xl scale-120"
      />
    </div>
  );
}
