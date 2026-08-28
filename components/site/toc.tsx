"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  /** `id` of the section this entry links to. */
  id: string;
  label: string;
}

/** Height of the sticky navbar, in px — `rootMargin` takes no other unit. */
const NAVBAR_HEIGHT = 56;

/**
 * "On this page" — the section index shown beside a documentation page.
 *
 * The active entry follows the topmost section inside the reading band: the
 * `rootMargin` discounts the sticky navbar at the top and the bottom 70% of the
 * viewport, so an entry lights up as its section reaches the top of the screen.
 */
export function Toc({ items, className }: { items: TocItem[]; className?: string }) {
  const [active, setActive] = React.useState(items[0]?.id);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: `-${NAVBAR_HEIGHT}px 0px -70% 0px` },
    );

    for (const item of items) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className={cn("hidden xl:sticky xl:top-14 xl:block xl:h-fit xl:py-12", className)}
    >
      <p className="mb-2 pl-3 text-caption text-muted-foreground uppercase">On this page</p>
      <ul className="flex flex-col border-l border-border">
        {items.map((item) => (
          <li key={item.id} className="flex">
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "-ml-px flex-1 border-l py-1.5 pl-3 text-small transition-colors duration-150 ease-b6",
                active === item.id
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
