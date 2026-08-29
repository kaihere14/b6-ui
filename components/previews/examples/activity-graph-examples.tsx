"use client";

import { ActivityGraph, type BarData, type ChartConfig } from "@/components/ui/activity-graph";

const SAMPLE_DATA: BarData[] = [
  { label: "Mon", design: 62, build: 38, review: 24 },
  { label: "Tue", design: 46, build: 72, review: 34 },
  { label: "Wed", design: 78, build: 52, review: 42 },
  { label: "Thu", design: 54, build: 86, review: 28 },
  { label: "Fri", design: 68, build: 64, review: 56 },
  { label: "Sat", design: 35, build: 42, review: 18 },
  { label: "Sun", design: 58, build: 76, review: 38 },
];

const SAMPLE_CONFIG: ChartConfig = {
  design: { fill: "var(--color-primary)", pattern: "solid", label: "Design" },
  build: { fill: "var(--color-accent)", pattern: "solid", label: "Build" },
  review: {
    fill: "var(--color-muted-foreground)",
    pattern: "hatched",
    label: "Review",
  },
};

const SINGLE_CONFIG: ChartConfig = {
  design: { fill: "var(--color-primary)", pattern: "solid", label: "Design" },
};

const DUAL_CONFIG: ChartConfig = {
  design: { fill: "var(--color-primary)", pattern: "solid", label: "Design" },
  review: {
    fill: "var(--color-muted-foreground)",
    pattern: "hatched",
    label: "Review",
  },
};

export function ActivityGraphSingleSeriesExample() {
  return (
    <ActivityGraph
      data={SAMPLE_DATA}
      config={SINGLE_CONFIG}
      title="Design Hours"
      className="w-full max-w-md"
    />
  );
}

export function ActivityGraphTwoSeriesExample() {
  return (
    <ActivityGraph
      data={SAMPLE_DATA}
      config={DUAL_CONFIG}
      title="Design vs Review"
      className="w-full max-w-md"
    />
  );
}

export function ActivityGraphSizesExample() {
  return (
    <div className="flex flex-col gap-4">
      <ActivityGraph
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        size="sm"
        title="Small"
        className="w-full max-w-md"
      />
      <ActivityGraph
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        size="lg"
        title="Large"
        className="w-full max-w-md"
      />
    </div>
  );
}
