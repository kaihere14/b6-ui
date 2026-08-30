"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { BunMark, NpmMark, PnpmMark } from "@/components/site/icons";
import { easeB6Out, packageManagers, type PackageManager } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Brand mark and colour per package manager. These hexes are the only hard-coded
 * colours on the site: they are third-party brand constants, not design
 * decisions, so they must never become `--b6-*` tokens. Tokens ship to
 * consumers through the `tokens` registry item, and npm red is not part of the
 * B6 palette. Bun's cream is unreadable on a light surface, so its mark uses
 * bun's own ink/cream pair per theme.
 */
const packageManagerMark: Record<
  PackageManager,
  { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; className: string }
> = {
  npm: { Icon: NpmMark, className: "text-[#CB3837]" },
  bun: { Icon: BunMark, className: "text-[#14151A] dark:text-[#FBF0DF]" },
  pnpm: { Icon: PnpmMark, className: "text-[#F69220]" },
};

const STORAGE_KEY = "b6-ui-package-manager";
/** Fires when one snippet changes the choice, so every other snippet follows. */
const SYNC_EVENT = "b6-ui:package-manager";

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
        /* storage unavailable, so keep the default */
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
      /* storage unavailable, but the choice still applies to this page */
    }
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, []);

  return [packageManager, select] as const;
}

interface PackageManagerTabsProps {
  value: PackageManager;
  onSelect: (packageManager: PackageManager) => void;
  /**
   * Id of the command line below the tabs. Also namespaces the sliding marker,
   * so two install snippets on one page each animate their own.
   */
  panelId: string;
  className?: string;
}

/**
 * Package managers as a row of tabs across the top of an install snippet.
 *
 * Every option is on screen, so switching is one click and the reader can see
 * what else is on offer without opening anything. Three options is the whole
 * set, which is what makes a row the right shape here. A menu would hide two
 * of them behind a click to save no space at all.
 *
 * Roving tabindex: one stop in the page's tab order, arrows move between the
 * options. Selection follows focus, which is the expected behaviour for a tab
 * list whose panels are already rendered and cost nothing to swap.
 */
export function PackageManagerTabs({
  value,
  onSelect,
  panelId,
  className,
}: PackageManagerTabsProps) {
  const reduced = useReducedMotion();
  const tabsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (step !== 0) {
      event.preventDefault();
      const next = (index + step + packageManagers.length) % packageManagers.length;
      onSelect(packageManagers[next]);
      tabsRef.current[next]?.focus({ preventScroll: true });
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next = event.key === "Home" ? 0 : packageManagers.length - 1;
      onSelect(packageManagers[next]);
      tabsRef.current[next]?.focus({ preventScroll: true });
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Package manager"
      aria-orientation="horizontal"
      // `overflow-x-auto` makes this a scroll container on both axes, so the
      // marker hanging a pixel below each tab would raise a vertical scrollbar.
      // The padding gives that pixel somewhere to land inside the box.
      className={cn("flex items-center gap-1 overflow-x-auto pb-px", className)}
    >
      {packageManagers.map((packageManager, index) => {
        const { Icon, className: markClassName } = packageManagerMark[packageManager];
        const selected = packageManager === value;

        return (
          <button
            key={packageManager}
            ref={(node) => {
              tabsRef.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${panelId}-${packageManager}`}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(packageManager)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-t-sm px-3 py-2.5",
              "font-mono text-caption uppercase transition-colors duration-150 ease-b6",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {/* One element shared through `layoutId`: selecting another tab
                unmounts it here and mounts it there, and Motion interpolates
                the two positions into a slide along the header's own border.
                Under `prefers-reduced-motion` it drops the shared identity and
                lands in place. */}
            {selected ? (
              <motion.span
                aria-hidden
                layoutId={reduced ? undefined : `${panelId}-marker`}
                transition={{ duration: 0.24, ease: easeB6Out }}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-foreground"
              />
            ) : null}

            <Icon
              aria-hidden
              className={cn(
                "relative size-3.5 transition-opacity duration-150 ease-b6",
                markClassName,
                !selected && "opacity-60",
              )}
            />
            {/* Above the marker travelling along the border. */}
            <span className="relative">{packageManager}</span>
          </button>
        );
      })}
    </div>
  );
}
