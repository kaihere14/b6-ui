"use client";

import {
  DotMatrixGraph,
  type DotChartConfig,
  type DotColumnData,
} from "@/components/ui/dot-matrix-graph";

const MAY = [120, 90, 140, 260, 180, 150, 210, 190, 160, 130, 110, 170, 220, 150, 120, 100];
const JUNE = [180, 420, 980, 1400, 760, 520, 610, 900, 340, 280, 700, 460, 380, 520, 640, 410];

const COMPARISON_DATA: DotColumnData[] = [
  ...MAY.map((value, index) => ({ value, series: "may", label: `May ${index + 1}` })),
  ...JUNE.map((value, index) => ({ value, series: "june", label: `Jun ${index + 1}` })),
];

const RANGE_DATA: Record<string, DotColumnData[]> = {
  daily: COMPARISON_DATA,
  weekly: [
    ...[640, 820, 700, 1090].map((value, index) => ({
      value,
      series: "may",
      label: `W${index + 1}`,
    })),
    ...[1980, 3400, 2600, 4412].map((value, index) => ({
      value,
      series: "june",
      label: `W${index + 1}`,
    })),
  ],
  monthly: [
    ...[2100, 2450, 3250].map((value, index) => ({
      value,
      series: "may",
      label: `M${index + 1}`,
    })),
    ...[6800, 9100, 12392].map((value, index) => ({
      value,
      series: "june",
      label: `M${index + 1}`,
    })),
  ],
};

const COMPARISON_CONFIG: DotChartConfig = {
  may: { fill: "var(--color-muted-foreground)", label: "May", value: "$3,250" },
  june: { fill: "var(--color-foreground)", label: "Jun", value: "$12,392" },
};

const currency = (value: number) => `$${Math.round(value).toLocaleString()}`;

export function DotMatrixGraphRangesExample() {
  return (
    <div className="flex flex-col gap-4">
      <DotMatrixGraph
        data={RANGE_DATA}
        config={COMPARISON_CONFIG}
        title="Revenue"
        headline="+326%"
        defaultRange="monthly"
        formatValue={currency}
        className="w-full max-w-2xl"
      />
      <DotMatrixGraph
        data={RANGE_DATA}
        config={COMPARISON_CONFIG}
        title="Revenue · toggle hidden"
        headline="+326%"
        showRanges={false}
        defaultRange="weekly"
        formatValue={currency}
        className="w-full max-w-2xl"
      />
    </div>
  );
}

export function DotMatrixGraphSizesExample() {
  return (
    <div className="flex flex-col gap-4">
      <DotMatrixGraph
        data={COMPARISON_DATA}
        config={COMPARISON_CONFIG}
        size="sm"
        title="Small"
        formatValue={currency}
        showRanges={false}
        className="w-full max-w-2xl"
      />
      <DotMatrixGraph
        data={COMPARISON_DATA}
        config={COMPARISON_CONFIG}
        size="lg"
        title="Large"
        formatValue={currency}
        showRanges={false}
        className="w-full max-w-2xl"
      />
    </div>
  );
}
