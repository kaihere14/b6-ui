import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { CommandMenu } from "@/components/site/command-menu";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { siteConfig } from "@/lib/constants";

interface HeroProps {
  /** Number of installable items in the registry, shown in the pill. */
  componentCount: number;
}

/** Tags under the headline. Kept to the three things the registry actually runs on. */
const stack = ["React 19", "TypeScript", "Tailwind v4"];

/**
 * The landing hero: registry pill, headline, stack line, description and the
 * two entry points, all centered as a single column.
 */
export function Hero({ componentCount }: HeroProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <Link
        href={siteConfig.github}
        target="_blank"
        rel="noreferrer noopener"
        className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-small font-medium shadow-b6-xs transition-colors duration-150 ease-b6 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
        {componentCount} components · {siteConfig.heroStack}
        <ArrowUpRight
          aria-hidden
          className="size-3.5 text-muted-foreground transition-transform duration-150 ease-b6-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>

      <h1 className="mt-8 bg-gradient-to-b from-foreground to-foreground/55 bg-clip-text text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.95] font-black tracking-tight text-balance text-transparent">
        {siteConfig.heroHeadline.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line}
          </span>
        ))}
      </h1>

      <div className="mt-8 flex items-center justify-center gap-3 text-small text-muted-foreground">
        {stack.map((item, index) => (
          <span key={item} className="flex items-center gap-3">
            {index > 0 ? <span aria-hidden className="size-1 rounded-full bg-border" /> : null}
            {item}
          </span>
        ))}
      </div>

      <p className="mt-8 max-w-md text-balance text-muted-foreground">
        {siteConfig.description}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <MagneticButton
          asChild
          maxTravel={10}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight />}
          className="rounded-full"
        >
          <Link href="/components">Browse components</Link>
        </MagneticButton>
        <CommandMenu size="lg" label="Search components…" className="sm:w-64" />
      </div>
    </div>
  );
}
