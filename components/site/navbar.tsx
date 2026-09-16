"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CommandMenu } from "@/components/site/command-menu";
import { GithubMark } from "@/components/site/icons";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { easeB6Out, mainNav, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Pixels of scroll before the bar separates itself from the page. */
const SCROLL_THRESHOLD = 8;

/** Shared identity between the trigger and the panel it grows into. */
const MOBILE_MENU_SHELL = "mobile-menu-shell";
/** Shared identity between the hamburger glyph and the close glyph it morphs into. */
const MOBILE_MENU_ICON = "mobile-menu-icon";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Route change closes the panel: without this a link tap inside it would
  // navigate away with the menu still expanded in the frozen next page.
  // Adjusted during render rather than in an effect, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [priorPathname, setPriorPathname] = useState(pathname);
  if (pathname !== priorPathname) {
    setPriorPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    function onPointerDown(event: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  /**
   * The landing hero runs under the bar, so the bar stays invisible over it and
   * only draws its surface and rule once the page has scrolled. Every other
   * route starts against content, where the separation is needed immediately.
   *
   * `scrolled` is false on the server and on the first client render, so a docs
   * page would flash an unseparated bar for one frame, hence the route check
   * rather than scroll position alone.
   */
  const separated = pathname !== "/" || scrolled;

  const nav_svg = (
    <svg
      width="3420"
      height="252"
      viewBox="0 0 3420 252"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-white dark:fill-black"
    >
      <path
        d="M0 251 L220 251 Q260 251 279.67 216.17 L381.83 35.33 Q401.5 0.5 441.5 0.5 L2910 0.5 Q2950 0.5 2970.14 35.06 L3075.86 216.44 Q3096 251 3136 251 L3419.5 251"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="stroke-black/50 dark:stroke-white/50"
      />
    </svg>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200 ease-b6",
        separated
          ? "border-border bg-background/80 backdrop-blur"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="absolute top-2 left-1/2 hidden h-6 max-w-6xl -translate-x-1/2 rotate-180 items-center gap-6 lg:flex">
        {nav_svg}
      </div>
      <nav
        aria-label="Main"
        className="absolute left-1/2 flex h-14 w-full max-w-4xl -translate-x-1/2 items-center gap-6 px-4 sm:px-6"
      >
        <Link href="/" className="flex">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-small transition-colors duration-150 ease-b6",
                    active
                      ? "text-brand underline"
                      : "text-muted-foreground hover:text-foreground hover:underline",
                  )}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <CommandMenu />
          <ThemeToggle />
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            aria-label="B6 UI on GitHub"
            className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground lg:inline-flex"
          >
            <GithubMark className="size-4" />
          </a>

          <AnimatePresence initial={false}>
            {!menuOpen ? (
              <motion.button
                key="menu-trigger"
                layoutId={reduced ? undefined : MOBILE_MENU_SHELL}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu-panel"
                aria-label="Open menu"
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground lg:hidden"
              >
                <motion.span
                  layoutId={reduced ? undefined : MOBILE_MENU_ICON}
                  transition={{ duration: 0.2, ease: easeB6Out }}
                  className="flex"
                >
                  <Menu aria-hidden className="size-4" />
                </motion.span>
              </motion.button>
            ) : (
              // Keeps the trigger's footprint in the row while the panel (which
              // shares its layoutId) takes over visually, so nothing else in the
              // row reflows when the button "leaves".
              <div key="menu-trigger-spacer" aria-hidden className="size-9 lg:hidden" />
            )}
          </AnimatePresence>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu-backdrop"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu-panel"
            id="mobile-menu-panel"
            ref={panelRef}
            layoutId={reduced ? undefined : MOBILE_MENU_SHELL}
            transition={{ type: "spring", bounce: 0.16, duration: 0.45 }}
            className="absolute top-2 right-4 z-50 w-56 origin-top-right overflow-hidden rounded-2xl border border-border bg-popover shadow-b6-lg sm:right-6 lg:hidden"
          >
            <div className="flex items-center justify-between p-1.5">
              <span className="px-2 text-caption text-muted-foreground uppercase">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground"
              >
                <motion.span
                  layoutId={reduced ? undefined : MOBILE_MENU_ICON}
                  transition={{ duration: 0.2, ease: easeB6Out }}
                  className="flex"
                >
                  <X aria-hidden className="size-4" />
                </motion.span>
              </button>
            </div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.08, ease: easeB6Out } }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              className="flex flex-col gap-0.5 p-1.5 pt-0"
            >
              {mainNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-2.5 py-2 text-small transition-colors duration-150 ease-b6",
                        active
                          ? "font-medium text-brand"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md px-2.5 py-2 text-small text-muted-foreground transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground"
                >
                  <GithubMark className="size-4" />
                  GitHub
                </a>
              </li>
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
