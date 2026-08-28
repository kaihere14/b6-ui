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
  /** Shown beside the title — a category, or the prose-page grouping. */
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
 * Search over the documentation, opened with the search button or ⌘K / Ctrl+K.
 *
 * Built on a native `<dialog>` rather than a command-palette dependency: the
 * platform already gives the focus trap, the backdrop and Escape-to-close, and
 * the list is small enough that a substring match is the whole search engine.
 */
export function CommandMenu() {
  const router = useRouter();
  const dialog = React.useRef<HTMLDialogElement>(null);
  const [query, setQuery] = React.useState("");
  const [highlighted, setHighlighted] = React.useState(0);
  // The modifier key never changes, so it is read from the platform rather than
  // held in state. The server snapshot assumes ⌘; hydration corrects it.
  const isApple = React.useSyncExternalStore(
    () => () => {},
    () => /mac|iphone|ipad/i.test(navigator.userAgent),
    () => true,
  );

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

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      if (dialog.current?.open) dialog.current.close();
      else open();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function go(href: string) {
    dialog.current?.close();
    router.push(href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
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
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-small text-muted-foreground transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground sm:w-56"
      >
        <Search aria-hidden className="size-4 shrink-0" />
        <span className="hidden sm:inline">Search docs</span>
        <span className="sr-only sm:hidden">Search documentation</span>
        <kbd className="ml-auto hidden items-center justify-center rounded-sm border bg-primary/5 p-[2] sm:flex">
          <kbd className="ml-auto hidden rounded border bg-primary-foreground px-2 font-mono text-caption text-muted-foreground drop-shadow-sm drop-shadow-neutral-600 sm:inline dark:drop-shadow-neutral-950">
            {isApple ? "⌘K" : "Ctrl K"}
          </kbd>
        </kbd>
      </button>

      <dialog
        ref={dialog}
        aria-label="Search documentation"
        onClick={(event) => {
          // The backdrop is part of the dialog's own box, so a click that lands
          // on the element itself rather than on the panel is a backdrop click.
          if (event.target === dialog.current) dialog.current.close();
        }}
        className="m-0 mx-auto mt-[14vh] w-[calc(100%-2rem)] max-w-lg rounded-lg border border-border bg-popover p-0 text-popover-foreground shadow-b6-lg backdrop:bg-foreground/20 open:animate-scale"
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            type="search"
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
          className="max-h-80 overflow-y-auto p-1.5"
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
    </>
  );
}
