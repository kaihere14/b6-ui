import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** Small uppercase label above the title. */
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional trailing link or button, right-aligned from `md` up. */
  action?: ReactNode;
  className?: string;
}

/** Shared heading block for the landing page's stacked sections. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-xl">
        <p className="text-caption text-brand uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-h1">{title}</h2>
        {description ? <p className="mt-3 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
