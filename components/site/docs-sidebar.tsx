"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { docsNav } from "@/lib/constants";
import { getComponentsByCategory } from "@/lib/registry";
import { cn } from "@/lib/utils";

interface SidebarLink {
  href: string;
  title: string;
  isNew?: boolean;
}

/** Static data — neither list changes at runtime. */
const sections: { label: string; links: SidebarLink[] }[] = [
  {
    label: "Getting started",
    links: docsNav.map((item) => ({ href: item.href, title: item.title })),
  },
  ...getComponentsByCategory().map((group) => ({
    label: group.category,
    links: group.items.map((component) => ({
      href: `/components/${component.slug}`,
      title: component.title,
      isNew: component.isNew,
    })),
  })),
];

/**
 * The documentation index: prose pages, then every registry item by category.
 *
 * Rendered by the `(docs)` layout rather than by a page, so navigating keeps the
 * nav mounted and its scroll position intact. Below `lg` the tree collapses
 * behind a disclosure button.
 */
export function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <nav
      aria-label="Documentation"
      className="py-6 lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:overflow-y-auto lg:py-12"
    >
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-small transition-colors duration-150 ease-b6 hover:bg-muted lg:hidden"
      >
        Browse documentation
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-150 ease-b6",
            open && "rotate-180",
          )}
        />
      </button>

      <div className={cn("mt-3 flex-col gap-7 lg:mt-0 lg:flex", open ? "flex" : "hidden")}>
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 pl-3 text-caption text-muted-foreground uppercase">
              {section.label}
            </p>
            <ul className="flex flex-col border-l border-border">
              {section.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="flex">
                    <Link
                      href={link.href}
                      // Navigating on a narrow viewport puts the content back in view.
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "-ml-px flex flex-1 items-center gap-2 border-l py-1.5 pl-3 text-small transition-colors duration-150 ease-b6",
                        active
                          ? "border-foreground font-medium text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                      )}
                    >
                      {link.title}
                      {link.isNew ? (
                        <Badge size="sm" variant="primary">
                          New
                        </Badge>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
