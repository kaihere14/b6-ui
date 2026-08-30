import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { exampleDemos, previews } from "@/components/previews";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { CodeBlock, CodePanel } from "@/components/site/code-block";
import { ComponentShowcase } from "@/components/site/component-showcase";
import { DocsSection } from "@/components/site/docs-section";
import { InstallCommand } from "@/components/site/install-command";
import { Pager } from "@/components/site/pager";
import { Toc, type TocItem } from "@/components/site/toc";
import { Badge } from "@/components/ui/badge";
import { getComponent, getComponentSlugs } from "@/lib/registry";
import { readSource } from "@/lib/source";

/** Section index for the right-hand column. Mirrors the section ids below. */
const tocItems: TocItem[] = [
  { id: "preview", label: "Preview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "api", label: "API" },
  { id: "accessibility", label: "Accessibility" },
  { id: "responsive", label: "Responsive" },
];

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
    <>
      <article className="min-w-0 pb-16 lg:py-12">
        <Breadcrumb
          items={[{ label: "Components", href: "/components" }, { label: component.title }]}
        />

        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-h1">{component.title}</h1>
            <Badge size="sm" variant="muted">
              {component.slug}
            </Badge>
          </div>
          <p className="mt-3 max-w-2xl text-muted-foreground">{component.description}</p>
        </header>

        <section id="preview" className="mt-8 scroll-mt-20" aria-labelledby="preview-heading">
          <h2 id="preview-heading" className="sr-only">
            Preview and source
          </h2>
          {Preview ? (
            <ComponentShowcase
              preview={<Preview />}
              code={<CodePanel code={source} scroll />}
              rawCode={source}
            />
          ) : (
            <CodeBlock code={source} filename={component.source} scroll />
          )}
        </section>

        <DocsSection
          id="installation"
          title="Installation"
          description={
            <>
              One file, no registry dependencies. Install the{" "}
              <Link href="/docs/installation" className="underline underline-offset-4">
                B6 base
              </Link>{" "}
              once per project, then add this component to any project — it needs nothing else
              from B6.
            </>
          }
        >
          <InstallCommand slug={component.slug} />
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
        </DocsSection>

        <DocsSection id="usage" title="Usage">
          <div className="flex flex-col gap-10">
            {component.examples.map((example) => {
              const Demo = example.preview ? exampleDemos[example.preview] : undefined;
              return (
                <div key={example.title}>
                  <h3 className="text-h3">{example.title}</h3>
                  {example.description ? (
                    <p className="mt-1 max-w-2xl text-small text-muted-foreground">
                      {example.description}
                    </p>
                  ) : null}
                  {Demo ? (
                    <ComponentShowcase
                      className="mt-4"
                      preview={<Demo />}
                      code={<CodePanel code={example.code} />}
                      rawCode={example.code}
                      toolbar={false}
                    />
                  ) : (
                    <CodeBlock className="mt-4" code={example.code} filename={example.title} />
                  )}
                </div>
              );
            })}
          </div>
        </DocsSection>

        <DocsSection
          id="api"
          title="API"
          description="All remaining props are forwarded to the underlying element."
        >
          <div className="overflow-x-auto rounded-lg border border-border">
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
        </DocsSection>

        <DocsSection id="accessibility" title="Accessibility">
          <ul className="flex list-disc flex-col gap-2 pl-5 text-small text-muted-foreground">
            {component.accessibility.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </DocsSection>

        <DocsSection id="responsive" title="Responsive behaviour">
          <p className="max-w-2xl text-small text-muted-foreground">{component.responsive}</p>
        </DocsSection>

        <Pager slug={component.slug} />
      </article>

      <Toc items={tocItems} />
    </>
  );
}
