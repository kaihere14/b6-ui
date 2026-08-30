"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { ButtonBase } from "@/components/ui/button-base";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { easeB6Out, siteConfig } from "@/lib/constants";

/** Seconds before the first word lifts, and between each word after it. */
const START = 0.12;
const STAGGER = 0.07;
const WORD_DURATION = 0.6;

interface HeroProps {
  /** Number of installable items in the registry, shown in the pill. */
  componentCount: number;
}

/**
 * The landing hero: registry pill, word-by-word headline, the two entry points.
 *
 * The headline reveal is real motion (words slide out from a clipped line box),
 * so it is driven by `motion`, not a CSS keyframe. Under
 * `prefers-reduced-motion` every word renders in place and the CTAs skip their
 * entrance, leaving the same layout with nothing moving.
 */
export function Hero({ componentCount }: HeroProps) {
  const reduced = useReducedMotion();
  /**
   * Each line carries the number of words before it, so a word knows its place
   * in the whole headline without a counter mutated during render.
   */
  const lines = siteConfig.heroHeadline.reduce<{ words: string[]; offset: number }[]>(
    (accumulated, line) => {
      const previous = accumulated.at(-1);
      const offset = previous ? previous.offset + previous.words.length : 0;
      return [...accumulated, { words: line.split(" "), offset }];
    },
    [],
  );
  const lastLine = lines.at(-1);
  const wordCount = lastLine ? lastLine.offset + lastLine.words.length : 0;
  const ctaDelay = reduced ? 0 : START + wordCount * STAGGER + 0.1;

  return (
    <div className="mx-auto max-w-4xl text-center">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeB6Out, delay: 0.05 }}
        className="flex justify-center"
      >
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
      </motion.div>

      <h1 className="mt-7 text-hero text-balance">
        {lines.map(({ words, offset }, lineIndex) => (
          <span key={lineIndex} className="block">
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="-mb-3 inline-block overflow-hidden pb-3"
              >
                <motion.span
                  className="inline-block"
                  initial={reduced ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: WORD_DURATION,
                    ease: easeB6Out,
                    delay: START + (offset + index) * STAGGER,
                  }}
                >
                  {/* A plain trailing space sits at the end of an inline-block and is
                      trimmed away, running the words together. nbsp survives. */}
                  {index < words.length - 1 ? `${word}\u00A0` : word}
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </h1>

      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: easeB6Out, delay: ctaDelay - 0.15 }}
        className="mx-auto mt-6 max-w-md text-balance text-muted-foreground"
      >
        {siteConfig.description}
      </motion.p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeB6Out, delay: ctaDelay }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
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
        <ButtonBase asChild size="lg" variant="outline" className="rounded-full">
          <Link href="/docs/installation">Installation</Link>
        </ButtonBase>
      </motion.div>
    </div>
  );
}
