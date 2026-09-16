"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { docsNav } from "@/lib/constants";
import { components } from "@/lib/registry";
import { cn } from "@/lib/utils";

interface SearchEntry {
  /** DOM id, so the input can point `aria-activedescendant` at the option. */
  id: string;
  href: string;
  title: string;
  /** Shown beside the title: a category, or the prose-page grouping. */
  group: string;
  description: string;
}

const entryId = (href: string) => `b6-search-${href.replace(/\W+/g, "-")}`;

/** Everything the menu searches: prose pages first, then the registry. */
const entries: SearchEntry[] = [
  ...docsNav.map((item) => ({
    id: entryId(item.href),
    href: item.href,
    title: item.title,
    group: "Docs",
    description: item.description,
  })),
  ...components.map((component) => ({
    id: entryId(`/components/${component.slug}`),
    href: `/components/${component.slug}`,
    title: component.title,
    group: component.category,
    description: component.description,
  })),
];

/**
 * The dialog is a page-wide singleton (`CommandMenuDialog`, mounted once in
 * the root layout), but its trigger appears in multiple places at once — the
 * navbar and the hero. Every `CommandMenu` button below calls into this tiny
 * bus instead of owning its own `<dialog>`, so ⌘K and every trigger open the
 * same instance rather than two independently-toggling ones.
 */
const openListeners = new Set<() => void>();

function requestOpen() {
  openListeners.forEach((listener) => listener());
}

interface CommandMenuProps {
  /** Trigger footprint: the compact navbar chip, or the hero's larger bar. */
  size?: "sm" | "lg";
  /** Label shown on the closed trigger. */
  label?: string;
  className?: string;
}

/** A button that opens the shared search dialog. Safe to render more than once. */
export function CommandMenu({
  size = "sm",
  label = "Search docs",
  className,
}: CommandMenuProps) {
  // The modifier key never changes, so it is read from the platform rather than
  // held in state. The server snapshot assumes ⌘; hydration corrects it.
  const isApple = React.useSyncExternalStore(
    () => () => {},
    () => /mac|iphone|ipad/i.test(navigator.userAgent),
    () => true,
  );

  return (
    <button
      type="button"
      onClick={requestOpen}
      className={cn(
        "inline-flex items-center gap-2 border border-border bg-card text-muted-foreground transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground",
        size === "lg"
          ? "h-12 rounded-full px-4 text-body shadow-b6-xs sm:w-72"
          : "h-9 rounded-md px-2.5 text-small sm:w-56",
        className,
      )}
    >
      <Search aria-hidden className="size-4 shrink-0" />
      <span className={cn("truncate", size === "lg" ? "inline" : "hidden sm:inline")}>
        {label}
      </span>
      {size === "lg" ? null : <span className="sr-only sm:hidden">Search documentation</span>}
      <kbd className="ml-auto hidden items-center justify-center rounded-sm border bg-primary/5 p-[2] sm:flex">
        <kbd className="ml-auto hidden rounded border bg-primary-foreground px-2 font-mono text-caption text-muted-foreground drop-shadow-sm drop-shadow-neutral-600 sm:inline dark:drop-shadow-neutral-950">
          {isApple ? "⌘K" : "Ctrl K"}
        </kbd>
      </kbd>
    </button>
  );
}

/**
 * Search over the documentation, opened with any `CommandMenu` button or ⌘K /
 * Ctrl+K. Mount exactly once (the root layout does) — everything that should
 * open it renders a `CommandMenu` trigger instead of another one of these.
 *
 * Built on a native `<dialog>` rather than a command-palette dependency: the
 * platform already gives the focus trap, the backdrop and Escape-to-close, and
 * the list is small enough that a substring match is the whole search engine.
 *
 * The dialog starts closed and stays that way until something explicitly asks
 * it to open — `showModal()` is only ever called from `open()` below, and
 * `open()` only ever runs from a trigger click or the ⌘K/Ctrl+K handler. It is
 * never called during render or from a mount effect, so there is no path from
 * "page just loaded" to "dialog is open".
 */
export function CommandMenuDialog() {
  const router = useRouter();
  const dialog = React.useRef<HTMLDialogElement>(null);
  const [query, setQuery] = React.useState("");
  const [highlighted, setHighlighted] = React.useState(0);

  const results = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) =>
      `${entry.title} ${entry.href} ${entry.group} ${entry.description}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  const open = React.useCallback(() => {
    setQuery("");
    setHighlighted(0);
    dialog.current?.showModal();
  }, []);

  const close = React.useCallback(() => {
    dialog.current?.close();
  }, []);

  const toggle = React.useCallback(() => {
    if (dialog.current?.open) close();
    else open();
  }, [close, open]);

  // Registers this instance's `open` with every mounted trigger button. Runs
  // once on mount; it only ever adds a listener, it never calls one.
  React.useEffect(() => {
    openListeners.add(open);
    return () => {
      openListeners.delete(open);
    };
  }, [open]);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      toggle();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  React.useEffect(() => {
    // A page restored from the back-forward cache resumes the exact frozen
    // DOM it was suspended with, dialog included — none of this component's
    // mount logic re-runs. Without this, leaving the search open and then
    // navigating away and back (or the tab getting backgrounded and resumed)
    // shows it stuck open with no visible interaction that caused it.
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) close();
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [close]);

  function go(href: string) {
    close();
    router.push(href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      // The native `<dialog>` already closes on Escape; this only stops the
      // keypress from also bubbling to the global ⌘K/Ctrl+K handler above.
      event.stopPropagation();
      return;
    }

    if (results.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      setHighlighted((current) => (current + offset + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = results[highlighted];
      if (item) go(item.href);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-label="Search documentation"
      onClick={(event) => {
        // The backdrop is part of the dialog's own box, so a click that lands
        // on the element itself rather than on the panel is a backdrop click.
        if (event.target === dialog.current) close();
      }}
      className="m-0 mx-auto mt-[14vh] mb-4 hidden max-h-[70vh] w-[calc(100%-2rem)] max-w-lg flex-col rounded-lg border border-border bg-popover p-0 text-popover-foreground shadow-b6-lg backdrop:bg-foreground/20 open:flex open:animate-scale"
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3">
        <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setHighlighted(0);
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Search documentation…"
          aria-label="Search documentation"
          role="combobox"
          aria-expanded
          aria-controls="command-menu-results"
          aria-activedescendant={results[highlighted]?.id}
          className="h-11 flex-1 bg-transparent text-small outline-none placeholder:text-muted-foreground"
        />
      </div>

      <ul
        id="command-menu-results"
        role="listbox"
        aria-label="Documentation"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5"
      >
        {results.map((entry, index) => (
          <li key={entry.href}>
            <button
              type="button"
              id={entry.id}
              role="option"
              aria-selected={index === highlighted}
              onClick={() => go(entry.href)}
              onMouseMove={() => setHighlighted(index)}
              className={cn(
                "flex w-full flex-col items-start gap-0.5 rounded-sm px-2.5 py-2 text-left transition-colors duration-150 ease-b6",
                index === highlighted ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
            >
              <span className="flex items-center gap-2 text-small font-medium text-foreground">
                {entry.title}
                <span className="text-caption text-muted-foreground uppercase">
                  {entry.group}
                </span>
              </span>
              <span className="line-clamp-1 text-caption">{entry.description}</span>
            </button>
          </li>
        ))}

        {results.length === 0 ? (
          <li className="px-2.5 py-6 text-center text-small text-muted-foreground">
            Nothing matches “{query}”.
          </li>
        ) : null}
      </ul>
    </dialog>
  );
}
