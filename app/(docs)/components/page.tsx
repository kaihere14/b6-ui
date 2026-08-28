import type { Metadata } from "next";

import { ComponentCard } from "@/components/site/component-card";
import { components } from "@/lib/registry";
import { componentCategories } from "@/types";

export const metadata: Metadata = {
  title: "Components",
  description: "Every component in the B6 UI registry.",
};

export default function ComponentsIndexPage() {
  /** Categories in their declared order, minus the ones nothing sits in yet. */
  const groups = componentCategories
    .map((category) => ({
      category,
      items: components.filter((component) => component.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <article className="min-w-0 pb-16 lg:py-12">
      <header className="max-w-2xl">
        <h1 className="text-h1">Components</h1>
        <p className="mt-3 text-muted-foreground">
          {components.length} components in the registry. Each one installs as source code into
          your project, then belongs to you.
        </p>
      </header>

      {groups.map(({ category, items }) => (
        <section key={category} className="mt-12">
          <h2 className="text-caption text-muted-foreground uppercase">{category}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((component) => (
              <li key={component.slug}>
                <ComponentCard component={component} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
