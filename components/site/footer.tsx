import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-1">
          <Logo />
          <p className="text-small text-muted-foreground">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-small">
          <Link href="/components" className="text-muted-foreground hover:text-foreground">
            Components
          </Link>
          <Link href="/docs" className="text-muted-foreground hover:text-foreground">
            Documentation
          </Link>
          <Link
            href="/docs/installation"
            className="text-muted-foreground hover:text-foreground"
          >
            Installation
          </Link>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
