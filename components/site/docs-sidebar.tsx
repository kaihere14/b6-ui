"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumn,
  ChevronDown,
  Layers,
  MousePointerClick,
  Rocket,
  Rows3,
  TextCursorInput,
  Type,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { docsNav, easeB6Out } from "@/lib/constants";
import { getComponentsByCategory } from "@/lib/registry";
import { cn } from "@/lib/utils";
import type { ComponentCategory } from "@/types";

interface SidebarLink {
  href: string;
  title: string;
  isNew?: boolean;
}

/**
 * One icon per group heading.
 *
 * The heading is what a reader scans for on the way to a component, so the mark
 * belongs there. The rows under it stay plain: every one of them is already
 * named after what it is, and a glyph on each would turn the column into a list
 * of pictures with words beside them.
 */
const categoryIcon: Record<ComponentCategory, LucideIcon> = {
  Buttons: MousePointerClick,
  Forms: TextCursorInput,
  Display: Layers,
  Text: Type,
  Graphs: ChartColumn,
  Layout: Rows3,
};

/** Static data: neither list changes at runtime. */
const sections: { label: string; icon: LucideIcon; links: SidebarLink[] }[] = [
  {
    label: "Getting started",
    icon: Rocket,
    links: docsNav.map((item) => ({ href: item.href, title: item.title })),
  },
  ...getComponentsByCategory().map((group) => ({
    label: group.category,
    icon: categoryIcon[group.category],
    links: group.items.map((component) => ({
      href: `/components/${component.slug}`,
      title: component.title,
      isNew: component.isNew,
    })),
  })),
];

/** One shared identity, so the bar travels between links instead of reappearing. */
const INDICATOR = "docs-sidebar-active";

/**
 * The documentation index: prose pages, then every registry item by category.
 *
 * Rendered by the `(docs)` layout rather than by a page, so navigating keeps the
 * nav mounted and its scroll position intact. Below `lg` the tree collapses
 * behind a disclosure button.
 *
 * Two markers sit behind the rows. The current page owns the tint, which stays
 * put so selection survives a pointer wandering elsewhere. The rail is a single
 * element shared across every link through `layoutId`: only one is ever mounted,
 * so moving it between rows unmounts it in the old one and mounts it in the new
 * one, and `motion` interpolates the two positions into a slide. It follows the
 * pointer while the tree is hovered and falls back to the current page the moment
 * the pointer leaves, so an abandoned hover returns it to where navigation
 * actually stands. Under `prefers-reduced-motion` the rail renders without the
 * shared identity and the tint without its wipe, so both land in place with
 * nothing moving.
 */
export function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  /** The row the pointer or keyboard is on, or `null` when neither is in the tree. */
  const [preview, setPreview] = React.useState<string | null>(null);
  const reduced = useReducedMotion();
  const marked = preview ?? pathname;

  return (
    <nav
      aria-label="Documentation"
      // `overflow-y-auto` clips horizontally too, and the group headings hang
      // half an icon into the left margin. The nav takes that space back from
      // the page gutter with `-ml-2 pl-2`, so the glyphs sit inside the scroll
      // box while every row stays exactly where it was.
      className="-ml-2 b6-scroll-hidden py-6 pl-2 lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:overflow-y-auto lg:py-12"
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

      <div
        onMouseLeave={() => setPreview(null)}
        // Focus leaving the tree resets too; moving between links fires this
        // before the next link's focus, so the incoming row still wins.
        onBlur={() => setPreview(null)}
        className={cn("mt-3 flex-col gap-7 lg:mt-0 lg:flex", open ? "flex" : "hidden")}
      >
        {sections.map((section) => (
          <div key={section.label}>
            {/* Pulled half an icon left so the glyph is centred on the rail
                below it, and the gap is set so the label still starts on the
                same 12px line as every row label under it. */}
            <p className="mb-2 -ml-2 flex items-center gap-1 text-caption text-foreground uppercase">
              <section.icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              {section.label}
            </p>
            <ul className="flex flex-col border-l border-border">
              {section.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="relative flex">
                    {active ? (
                      <motion.span
                        aria-hidden
                        // Wiped in from the rail edge, so a new selection reads as
                        // colour spilling out of the pill rather than switching on.
                        initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 1.6, ease: easeB6Out }}
                        className="absolute inset-y-0 right-0 left-0 rounded-r-sm bg-linear-to-r from-accent via-muted/40 via-45% to-transparent"
                      />
                    ) : null}
                    {marked === link.href ? (
                      <motion.span
                        aria-hidden
                        layoutId={reduced ? undefined : INDICATOR}
                        transition={{ duration: 0.32, ease: easeB6Out }}
                        className="absolute inset-y-0 -left-px h-full w-px bg-foreground"
                      />
                    ) : null}
                    <Link
                      href={link.href}
                      // Navigating on a narrow viewport puts the content back in view.
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setPreview(link.href)}
                      onFocus={() => setPreview(link.href)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        // `relative` keeps the label painting above the absolutely
                        // positioned marker travelling behind it.
                        "relative -ml-px flex flex-1 items-center gap-2 border-l border-transparent py-1.5 pl-3 text-small transition-colors duration-150 ease-b6",
                        active
                          ? "font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground",
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
