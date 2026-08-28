import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  /** Omit on the final crumb — the page you are already on. */
  href?: string;
}

/** Trail above a documentation page title. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-small text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 ? (
              <ChevronRight aria-hidden className="size-3.5 shrink-0 opacity-60" />
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="rounded-sm transition-colors duration-150 ease-b6 hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
