"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandMenu } from "@/components/site/command-menu";
import { GithubMark } from "@/components/site/icons";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { mainNav, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Pixels of scroll before the bar separates itself from the page. */
const SCROLL_THRESHOLD = 8;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200 ease-b6",
        separated
          ? "border-border bg-background/80 backdrop-blur"
          : "border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6"
      >
        <Link href="/" className="flex">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-small transition-colors duration-150 ease-b6",
                    active ? "text-brand" : "text-muted-foreground hover:text-foreground",
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
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground"
          >
            <GithubMark className="size-4" />
          </a>
        </div>
      </nav>

      {/* Compact nav for narrow viewports. */}
      <ul
        className={cn(
          "flex items-center gap-1 overflow-x-auto border-t px-4 py-2 transition-colors duration-200 ease-b6 md:hidden",
          separated ? "border-border" : "border-transparent",
        )}
      >
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="rounded-sm px-3 py-1 text-small whitespace-nowrap text-muted-foreground"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
