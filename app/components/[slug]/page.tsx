import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { previews } from "@/components/previews";
import { CodeBlock } from "@/components/site/code-block";
import { ComponentPreview } from "@/components/site/component-preview";
import { ComponentSidebar } from "@/components/site/component-sidebar";
import { InstallCommand } from "@/components/site/install-command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getComponent, getComponentSlugs } from "@/lib/registry";
import { readSource } from "@/lib/source";

export function generateStaticParams() {
  return getComponentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return {};
  return { title: component.title, description: component.description };
}

export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) notFound();

  const Preview = previews[component.slug];
  const source = await readSource(component.source);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[12rem_minmax(0,1fr)]">
      <ComponentSidebar />

      <article className="min-w-0">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-h1">{component.title}</h1>
            <Badge size="sm" variant="muted">
              {component.slug}
            </Badge>
          </div>
          <p className="mt-3 max-w-2xl text-muted-foreground">{component.description}</p>
        </header>

        {Preview ? (
          <section className="mt-8" aria-labelledby="preview-heading">
            <h2 id="preview-heading" className="sr-only">
              Live preview
            </h2>
            <ComponentPreview>
              <Preview />
            </ComponentPreview>
          </section>
        ) : null}

        <Separator className="my-12" decorative={false} />

        <section aria-labelledby="installation-heading">
          <h2 id="installation-heading" className="text-h2">
            Installation
          </h2>
          <p className="mt-2 text-small text-muted-foreground">
            One file, no registry dependencies. Install the{" "}
            <Link href="/docs/installation" className="underline underline-offset-4">
              B6 base
            </Link>{" "}
            once per project, then add this component to any project — it needs nothing else
            from B6.
          </p>
          <InstallCommand slug={component.slug} className="mt-4 max-w-xl" />
          {component.dependencies.length > 0 ? (
            <p className="mt-3 text-small text-muted-foreground">
              Pulls in{" "}
              {component.dependencies.map((dependency, index) => (
                <span key={dependency}>
                  <code className="font-mono text-code">{dependency}</code>
                  {index < component.dependencies.length - 1 ? ", " : ""}
                </span>
              ))}
              .
            </p>
          ) : (
            <p className="mt-3 text-small text-muted-foreground">No extra dependencies.</p>
          )}
        </section>

        <section className="mt-12" aria-labelledby="usage-heading">
          <h2 id="usage-heading" className="text-h2">
            Usage
          </h2>
          <div className="mt-4 flex flex-col gap-6">
            {component.examples.map((example) => (
              <div key={example.title}>
                <h3 className="text-h3">{example.title}</h3>
                {example.description ? (
                  <p className="mt-1 text-small text-muted-foreground">{example.description}</p>
                ) : null}
                <CodeBlock className="mt-3" code={example.code} filename={example.title} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="source-heading">
          <h2 id="source-heading" className="text-h2">
            Source code
          </h2>
          <p className="mt-2 text-small text-muted-foreground">
            Exactly what the CLI writes into your project.
          </p>
          <CodeBlock className="mt-4" code={source} filename={component.source} scroll />
        </section>

        <section className="mt-12" aria-labelledby="api-heading">
          <h2 id="api-heading" className="text-h2">
            API
          </h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[40rem] text-left text-small">
              <thead className="bg-muted/60">
                <tr>
                  <th scope="col" className="px-4 py-2 font-medium">
                    Prop
                  </th>
                  <th scope="col" className="px-4 py-2 font-medium">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-2 font-medium">
                    Default
                  </th>
                  <th scope="col" className="px-4 py-2 font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {component.props.map((prop) => (
                  <tr key={prop.name} className="border-t border-border align-top">
                    <td className="px-4 py-2 font-mono text-code">{prop.name}</td>
                    <td className="px-4 py-2 font-mono text-code text-muted-foreground">
                      {prop.type}
                    </td>
                    <td className="px-4 py-2 font-mono text-code text-muted-foreground">
                      {prop.defaultValue ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-small text-muted-foreground">
            All remaining props are forwarded to the underlying element.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="a11y-heading">
          <h2 id="a11y-heading" className="text-h2">
            Accessibility
          </h2>
          <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-small text-muted-foreground">
            {component.accessibility.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="responsive-heading">
          <h2 id="responsive-heading" className="text-h2">
            Responsive behaviour
          </h2>
          <p className="mt-2 text-small text-muted-foreground">{component.responsive}</p>
        </section>
      </article>
    </div>
  );
}
