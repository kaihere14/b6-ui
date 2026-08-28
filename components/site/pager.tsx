import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { components } from "@/lib/registry";
import { cn } from "@/lib/utils";

/**
 * Previous/next links across the registry, in `lib/registry.ts` order.
 *
 * When a component sits at either end of the list the matching slot is left
 * empty rather than wrapping around, so the pair always reads as a position.
 */
export function Pager({ slug }: { slug: string }) {
  const index = components.findIndex((component) => component.slug === slug);
  const previous = index > 0 ? components[index - 1] : undefined;
  const next = index >= 0 ? components[index + 1] : undefined;

  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Component pagination"
      className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/components/${previous.slug}`}
          rel="prev"
          className="group flex flex-col gap-1 rounded-lg border border-border bg-card p-4 transition-colors duration-150 ease-b6 hover:bg-muted"
        >
          <span className="flex items-center gap-1.5 text-caption text-muted-foreground uppercase">
            <ArrowLeft aria-hidden className="size-3.5" />
            Previous
          </span>
          <span className="text-small font-medium">{previous.title}</span>
        </Link>
      ) : (
        <span aria-hidden />
      )}

      {next ? (
        <Link
          href={`/components/${next.slug}`}
          rel="next"
          className={cn(
            "group flex flex-col items-end gap-1 rounded-lg border border-border bg-card p-4 transition-colors duration-150 ease-b6 hover:bg-muted",
            !previous && "sm:col-start-2",
          )}
        >
          <span className="flex items-center gap-1.5 text-caption text-muted-foreground uppercase">
            Next
            <ArrowRight aria-hidden className="size-3.5" />
          </span>
          <span className="text-small font-medium">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
