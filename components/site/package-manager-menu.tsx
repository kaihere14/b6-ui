"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

import { BunMark, NpmMark, PnpmMark } from "@/components/site/icons";
import { packageManagers, type PackageManager } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Brand mark and colour per package manager. These hexes are the only hard-coded
 * colours on the site: they are third-party brand constants, not design
 * decisions, so they must never become `--b6-*` tokens — tokens ship to
 * consumers through the `tokens` registry item, and npm red is not part of the
 * B6 palette. Bun's cream is unreadable on a light surface, so its mark uses
 * bun's own ink/cream pair per theme.
 */
const packageManagerMark: Record<
  PackageManager,
  { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; className: string }
> = {
  bun: { Icon: BunMark, className: "text-[#14151A] dark:text-[#FBF0DF]" },
  npm: { Icon: NpmMark, className: "text-[#CB3837]" },
  pnpm: { Icon: PnpmMark, className: "text-[#F69220]" },
};

const STORAGE_KEY = "b6-ui-package-manager";
/** Fires when one menu changes the choice, so every other snippet follows. */
const SYNC_EVENT = "b6-ui:package-manager";

/** Menu geometry, in pixels — `min-w-32`, the 4px offset, and a viewport gutter. */
const MENU_WIDTH = 128;
const GAP = 4;
const GUTTER = 8;

function isPackageManager(value: string | null): value is PackageManager {
  return packageManagers.includes(value as PackageManager);
}

/**
 * The visitor's preferred package manager, shared across every install snippet
 * on the page and remembered between visits. The server always renders the
 * default, so the stored value is only applied after mount and hydration matches.
 */
export function usePackageManager() {
  const [packageManager, setPackageManager] = React.useState<PackageManager>(
    packageManagers[0],
  );

  React.useEffect(() => {
    function read() {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (isPackageManager(stored)) setPackageManager(stored);
      } catch {
        /* storage unavailable — keep the default */
      }
    }

    read();
    window.addEventListener(SYNC_EVENT, read);
    return () => window.removeEventListener(SYNC_EVENT, read);
  }, []);

  const select = React.useCallback((next: PackageManager) => {
    setPackageManager(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — the choice still applies to this page */
    }
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, []);

  return [packageManager, select] as const;
}

interface PackageManagerMenuProps {
  value: PackageManager;
  onSelect: (packageManager: PackageManager) => void;
  className?: string;
}

/**
 * Small menu that swaps the package manager an install command is written for.
 * Hand-built rather than pulled from a primitive: it is three static options in
 * documentation chrome, never a distributed component.
 */
export function PackageManagerMenu({ value, onSelect, className }: PackageManagerMenuProps) {
  const [open, setOpen] = React.useState(false);
  const activeMark = packageManagerMark[value];
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const itemsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

  /**
   * The menu is portalled to `document.body` and positioned from the trigger's
   * viewport rect. Install snippets sit inside clipping ancestors — the hero
   * section, scrollable code rows — and no z-index escapes an `overflow: hidden`
   * box, so staying in flow would leave the menu cut off.
   */
  const place = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const left = Math.min(rect.left, window.innerWidth - MENU_WIDTH - GUTTER);
    setPosition({ top: rect.bottom + GAP, left: Math.max(GUTTER, left) });
  }, []);

  React.useLayoutEffect(() => {
    if (!open) return;

    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Move focus into the menu as it opens, starting on the current choice.
  React.useEffect(() => {
    if (!open) return;
    itemsRef.current[packageManagers.indexOf(value)]?.focus({ preventScroll: true });
    // `value` is intentionally read once per open — selecting closes the menu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus({ preventScroll: true });
  }

  function choose(packageManager: PackageManager) {
    onSelect(packageManager);
    close(true);
  }

  function onItemKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = (index + step + packageManagers.length) % packageManagers.length;
      itemsRef.current[next]?.focus({ preventScroll: true });
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key === "Tab") close(false);
  }

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Package manager: ${value}. Change it.`}
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm py-1 pr-1.5 pl-2 font-mono text-caption",
          "text-muted-foreground uppercase transition-colors duration-150 ease-b6",
          "hover:bg-muted hover:text-foreground",
          open && "bg-muted text-foreground",
        )}
      >
        <activeMark.Icon className={cn("size-3.5", activeMark.className)} />
        {value}
        <ChevronDown aria-hidden className="size-3.5" />
      </button>

      {open && position
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label="Package manager"
              style={{ top: position.top, left: position.left }}
              className={cn(
                "fixed z-50 min-w-32 animate-scale rounded-md border border-border",
                "bg-card p-1 shadow-b6-md",
              )}
            >
              {packageManagers.map((packageManager, index) => {
                const { Icon, className: markClassName } = packageManagerMark[packageManager];

                return (
                  <button
                    key={packageManager}
                    ref={(node) => {
                      itemsRef.current[index] = node;
                    }}
                    type="button"
                    role="menuitemradio"
                    aria-checked={packageManager === value}
                    onClick={() => choose(packageManager)}
                    onKeyDown={(event) => onItemKeyDown(event, index)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xs px-2 py-1.5",
                      "font-mono text-code text-muted-foreground transition-colors duration-150 ease-b6",
                      "hover:bg-muted hover:text-foreground focus-visible:bg-muted",
                      "focus-visible:text-foreground",
                      packageManager === value && "text-foreground",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className={cn("size-3.5", markClassName)} />
                      {packageManager}
                    </span>
                    {packageManager === value ? (
                      <Check aria-hidden className="size-3.5" />
                    ) : null}
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
