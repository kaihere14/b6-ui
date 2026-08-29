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

export function ActivityGraphPreview() {
  return (
    <div className="flex items-center justify-center py-6">
      <ActivityGraph
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        title="Weekly Activity"
        size="lg"
        className="w-full max-w-4xl scale-140"
      />
    </div>
  );
}
