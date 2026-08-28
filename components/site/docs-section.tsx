import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DocsSectionProps {
  /** Anchor target — also what the table of contents links to. */
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * One titled section of a documentation page.
 *
 * Every section carries the same rule, spacing and scroll offset, so the page
 * keeps a single rhythm and an anchor never lands underneath the sticky navbar.
 */
export function DocsSection({ id, title, description, children, className }: DocsSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("mt-12 scroll-mt-20 border-t border-border pt-12", className)}
    >
      <h2 id={`${id}-heading`} className="text-h2">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-small text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}
