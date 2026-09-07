"use client";

import * as React from "react";
import { CheckCircle2, GitPullRequestArrow, MessageCircle } from "lucide-react";

import { WaterLoading } from "@/components/ui/water-loading";

const rows = [
  { icon: GitPullRequestArrow, title: "Motion review approved", at: "4m" },
  { icon: MessageCircle, title: "New component feedback", at: "18m" },
  { icon: CheckCircle2, title: "Registry checks passed", at: "31m" },
];

function Feed() {
  return (
    <ul className="divide-y border-t">
      {rows.map(({ icon: Icon, title, at }) => (
        <li key={title} className="flex items-center gap-3 px-4 py-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full border text-muted-foreground">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <span className="flex-1 truncate text-small font-medium">{title}</span>
          <span className="shrink-0 font-mono text-caption text-muted-foreground">
            {at}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border bg-card text-card-foreground shadow-b6-md">
      <div className="px-4 pt-4 pb-3">
        <h3 className="text-h3">Activity</h3>
      </div>
      {children}
    </div>
  );
}

export function WaterLoadingSizesExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div
          key={size}
          className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-b6-md"
        >
          <div className="px-4 pt-4 pb-3 text-caption text-muted-foreground">
            size {size}
          </div>
          <WaterLoading size={size}>
            <Feed />
          </WaterLoading>
        </div>
      ))}
    </div>
  );
}

export function WaterLoadingControlledExample() {
  const [refreshing, setRefreshing] = React.useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setRefreshing((value) => !value)}
        className="rounded-md border px-3 py-1.5 text-small"
      >
        {refreshing ? "Stop refreshing" : "Start refreshing"}
      </button>
      <Card>
        <WaterLoading refreshing={refreshing}>
          <Feed />
        </WaterLoading>
      </Card>
    </div>
  );
}

export function WaterLoadingThresholdExample() {
  return (
    <Card>
      <WaterLoading threshold={120}>
        <Feed />
      </WaterLoading>
    </Card>
  );
}

const PAGE = 6;
const TOTAL = 30;

export function WaterLoadingInfiniteExample() {
  const [count, setCount] = React.useState(PAGE);

  const loadNextPage = React.useCallback(
    () =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          setCount((c) => Math.min(TOTAL, c + PAGE));
          resolve();
        }, 4200);
      }),
    [],
  );

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border bg-card text-card-foreground shadow-b6-md">
      <div className="px-4 pt-4 pb-3">
        <h3 className="text-h3">Feed</h3>
      </div>
      <div className="h-80 overflow-y-auto border-t">
        <WaterLoading
          onRefresh={() => new Promise((r) => setTimeout(r, 4600))}
          onLoadMore={loadNextPage}
          hasMore={count < TOTAL}
        >
          <ul className="divide-y">
            {Array.from({ length: count }, (_, i) => (
              <li key={i} className="px-4 py-4 text-small">
                <p className="font-medium">Post {i + 1}</p>
                <p className="text-muted-foreground">
                  Scroll on to pull the next page in.
                </p>
              </li>
            ))}
          </ul>
        </WaterLoading>
      </div>
      <p className="px-4 py-2 text-caption text-muted-foreground">
        {count < TOTAL ? `${count} of ${TOTAL}` : "All caught up"}
      </p>
    </div>
  );
}
