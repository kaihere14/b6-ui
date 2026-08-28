"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandMenu } from "@/components/site/command-menu";
import { GithubMark } from "@/components/site/icons";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { mainNav, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6"
      >
        <Link href="/" className="rounded-sm">
          <Logo />
          <span className="sr-only">{siteConfig.name} home</span>
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
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
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
      <ul className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
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
