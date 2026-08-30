import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { previews } from "@/components/previews";
import { Badge } from "@/components/ui/badge";
import type { ComponentMeta } from "@/types";
import { cn } from "@/lib/utils";

interface ComponentCardProps {
  component: ComponentMeta;
  className?: string;
}

/**
 * Registry entry as a browsable tile: the component's own preview on top, its
 * name and description underneath.
 *
 * The preview is decorative here, so it is inert (`pointer-events-none`,
 * `aria-hidden`) so the whole tile is one link and a keyboard user tabs past a
 * card once, not through every control inside the demo.
 */
export function ComponentCard({ component, className }: ComponentCardProps) {
  const Preview = previews[component.slug];

  return (
    <article className={cn("group/card relative h-72", className)}>
      <Link
        href={`/components/${component.slug}`}
        aria-label={`View ${component.title}`}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 ease-b6 group-hover/card:border-accent">
        <div
          aria-hidden
          className="pointer-events-none relative m-2 mb-0 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-md border border-border bg-background b6-dot-canvas p-4"
        >
          <div className="scale-75 transition-transform duration-300 ease-b6-out group-hover/card:scale-80">
            {Preview ? <Preview /> : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-h3">{component.title}</h3>
              {component.isNew ? (
                <Badge size="sm" variant="muted">
                  New
                </Badge>
              ) : null}
            </div>
            <p className="mt-0.5 truncate text-small text-muted-foreground">
              {component.description}
            </p>
          </div>
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 -translate-x-1 text-brand opacity-0 transition duration-200 ease-b6-out group-hover/card:translate-x-0 group-hover/card:opacity-100"
          />
        </div>
      </div>
    </article>
  );
}
