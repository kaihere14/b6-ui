import Link from "next/link";
import { ArrowRight, Boxes, PackageCheck, Terminal } from "lucide-react";

import { ButtonBasePreview } from "@/components/previews/button-base-preview";
import { ComponentPreview } from "@/components/site/component-preview";
import { InstallCommand } from "@/components/site/install-command";
import { Badge } from "@/components/ui/badge";
import { ButtonBase } from "@/components/ui/button-base";
import {
  CardBase,
  CardBaseDescription,
  CardBaseHeader,
  CardBaseTitle,
} from "@/components/ui/card-base";
import { components } from "@/lib/registry";
import { siteConfig } from "@/lib/constants";

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
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 b6-grid-bg opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Badge size="sm" variant="outline" className="animate-fade">
            v0.1.0 · Registry preview
          </Badge>
          <h1 className="mt-5 max-w-3xl animate-slide text-display">{siteConfig.tagline}</h1>
          <p className="mt-5 max-w-xl text-muted-foreground">{siteConfig.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonBase asChild size="lg" rightIcon={<ArrowRight />}>
              <Link href="/components">Browse components</Link>
            </ButtonBase>
            <ButtonBase asChild size="lg" variant="outline">
              <Link href="/docs/installation">Installation</Link>
            </ButtonBase>
          </div>

          <InstallCommand slug="button-base" className="mt-8 max-w-md" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }) => (
            <CardBase key={title}>
              <CardBaseHeader>
                <Icon aria-hidden className="size-5 text-primary" />
                <CardBaseTitle as="h2">{title}</CardBaseTitle>
                <CardBaseDescription>{description}</CardBaseDescription>
              </CardBaseHeader>
            </CardBase>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-h2">Button Base</h2>
            <p className="mt-1 text-small text-muted-foreground">
              The first B6 component, end to end: source, registry entry, docs, install command.
            </p>
          </div>
          <ButtonBase asChild variant="ghost" size="sm" rightIcon={<ArrowRight />}>
            <Link href="/components/button-base">View</Link>
          </ButtonBase>
        </div>
        <ComponentPreview>
          <ButtonBasePreview />
        </ComponentPreview>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="text-h2">In the registry</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((component) => (
            <li key={component.slug}>
              <CardBase asChild variant="elevated" interactive className="h-full">
                <Link href={`/components/${component.slug}`}>
                  <CardBaseHeader>
                    <CardBaseTitle as="h3">{component.title}</CardBaseTitle>
                    <CardBaseDescription>{component.description}</CardBaseDescription>
                  </CardBaseHeader>
                </Link>
              </CardBase>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
