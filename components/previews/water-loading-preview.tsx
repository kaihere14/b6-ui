"use client";

import type { ComponentProps, ComponentType } from "react";
import * as React from "react";
import {
  CloudUpload,
  GitCommitHorizontal,
  MessageSquare,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";

import { WaterLoading } from "@/components/ui/water-loading";

type Icon = ComponentType<{ className?: string }>;

interface Row {
  icon: Icon;
  title: string;
  body: string;
  at: string;
}

function RowItem({ icon: Icon, title, body, at }: Row) {
  return (
    <li className="flex gap-4 px-6 py-5">
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full border text-muted-foreground"
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate font-medium">{title}</p>
          <span className="shrink-0 font-mono text-caption text-muted-foreground">{at}</span>
        </div>
        <p className="text-small text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

/**
 * One card shape, used for both demos. The outer card and the inner scroll box
 * are identical every time; only the WaterLoading props passed through differ,
 * so one card refreshes from a pull and the other from the scroll bottom.
 */
function FeedCard({
  title,
  subtitle,
  children,
  ...water
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
} & Partial<ComponentProps<typeof WaterLoading>>) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-b6-lg">
      <h3 className="px-6 pt-5 text-h3">{title}</h3>
      <p className="px-6 pt-1 pb-4 text-small text-muted-foreground">{subtitle}</p>
      <div className="h-64 overflow-y-auto border-t">
        <WaterLoading {...water}>{children}</WaterLoading>
      </div>
    </div>
  );
}

const updates: Row[] = [
  {
    icon: CloudUpload,
    title: "Deploy finished",
    body: "web-app shipped to production in 42s.",
    at: "2m",
  },
  {
    icon: GitCommitHorizontal,
    title: "main advanced",
    body: "6 commits merged from feature/water-loading.",
    at: "12m",
  },
  {
    icon: ShieldCheck,
    title: "Security scan clean",
    body: "No advisories across 214 dependencies.",
    at: "25m",
  },
  {
    icon: Package,
    title: "Registry published",
    body: "water-loading is now on the CDN.",
    at: "1h",
  },
  {
    icon: Users,
    title: "3 new contributors",
    body: "They opened their first pull requests today.",
    at: "3h",
  },
];

const PAGE = 6;
const TOTAL = 30;

function InfiniteCard() {
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
    <FeedCard
      title="Feed"
      subtitle="Scroll on to pull the next page in"
      onRefresh={() => new Promise((r) => setTimeout(r, 4600))}
      onLoadMore={loadNextPage}
      hasMore={count < TOTAL}
    >
      <ul className="divide-y">
        {Array.from({ length: count }, (_, i) => (
          <RowItem
            key={i}
            icon={MessageSquare}
            title={`Post ${i + 1}`}
            body="A card in the endless feed, loaded on demand."
            at={`${i + 1}h`}
          />
        ))}
      </ul>
    </FeedCard>
  );
}

function PullCard() {
  return (
    <FeedCard
      title="Activity"
      subtitle="Pull down to check for updates"
      onRefresh={() => new Promise((r) => setTimeout(r, 4600))}
      hasMore={false}
    >
      <ul className="divide-y">
        {updates.map((row) => (
          <RowItem key={row.title} {...row} />
        ))}
      </ul>
    </FeedCard>
  );
}

const MODES = [
  { id: "pull", label: "Pull to refresh" },
  { id: "infinite", label: "Infinite scroll" },
] as const;

export function WaterLoadingPreview() {
  const [mode, setMode] = React.useState<(typeof MODES)[number]["id"]>("pull");

  return (
    <div className="mx-auto max-w-md space-y-4 py-8">
      <div className="inline-flex rounded-lg border p-1 text-small">
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            aria-pressed={mode === id}
            className={
              mode === id
                ? "rounded-md bg-muted px-3 py-1.5 font-medium"
                : "rounded-md px-3 py-1.5 text-muted-foreground"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "pull" ? <PullCard /> : <InfiniteCard />}
    </div>
  );
}
