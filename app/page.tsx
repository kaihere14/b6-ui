import Link from "next/link";
import { ArrowRight, Boxes, PackageCheck, Terminal } from "lucide-react";

import { ComponentCard } from "@/components/site/component-card";
import { Hero } from "@/components/site/hero";
import { RotatingInstallCommand } from "@/components/site/install-command";
import { SectionHeader } from "@/components/site/section-header";
import { ButtonBase } from "@/components/ui/button-base";
import {
  CardBase,
  CardBaseDescription,
  CardBaseHeader,
  CardBaseTitle,
} from "@/components/ui/card-base";
import { components } from "@/lib/registry";

const pillars = [
  {
    icon: Boxes,
    title: "Original by design",
    description:
      "Every component is drawn from the B6 token set — colour, type, radius, elevation and motion — not borrowed from another library.",
  },
  {
    icon: Terminal,
    title: "Installed as source",
    description:
      "The shadcn CLI copies the component into your repository. No runtime package, no version pinning, no upgrade wall.",
  },
  {
    icon: PackageCheck,
    title: "Accessible on arrival",
    description:
      "Semantic elements, visible focus, keyboard support and reduced-motion handling are part of the component, not a follow-up ticket.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pt-20 pb-16 sm:px-6 md:pt-28">
        <div aria-hidden className="absolute inset-0 -z-10 b6-grid-bg opacity-60" />
        <Hero componentCount={components.length} />
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        <p className="mb-4 text-center text-small text-muted-foreground">
          Install the base once, then add a component. Nothing else to wire up.
        </p>
        <RotatingInstallCommand slugs={components.map((component) => component.slug)} />
      </section>

      <section className="mx-auto max-w-6xl border-t border-border px-4 pt-14 pb-16 sm:px-6">
        <SectionHeader
          eyebrow="Components"
          title="Everything in the registry"
          description={`${components.length} components, each one installable on its own and yours to edit once it lands.`}
          action={
            <ButtonBase asChild variant="ghost" size="sm" rightIcon={<ArrowRight />}>
              <Link href="/components">Browse all components</Link>
            </ButtonBase>
          }
        />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((component) => (
            <li key={component.slug}>
              <ComponentCard component={component} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl border-t border-border px-4 pt-14 pb-20 sm:px-6">
        <SectionHeader eyebrow="Why B6" title="Yours the moment it lands" />
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }) => (
            <CardBase key={title}>
              <CardBaseHeader>
                <Icon aria-hidden className="size-5 text-primary" />
                <CardBaseTitle as="h3">{title}</CardBaseTitle>
                <CardBaseDescription>{description}</CardBaseDescription>
              </CardBaseHeader>
            </CardBase>
          ))}
        </div>
      </section>
    </>
  );
}
