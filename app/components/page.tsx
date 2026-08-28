import type { Metadata } from "next";
import Link from "next/link";

import { InstallCommand } from "@/components/site/install-command";
import { Badge } from "@/components/ui/badge";
import {
  CardBase,
  CardBaseContent,
  CardBaseDescription,
  CardBaseHeader,
  CardBaseTitle,
} from "@/components/ui/card-base";
import { components } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Components",
  description: "Every component in the B6 UI registry.",
};

export default function ComponentsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-h1">Components</h1>
        <p className="mt-3 text-muted-foreground">
          {components.length} components in the registry. Each one installs as source code into
          your project, then belongs to you.
        </p>
      </header>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {components.map((component) => (
          <li key={component.slug}>
            <CardBase className="h-full">
              <CardBaseHeader>
                <div className="flex items-center gap-2">
                  <CardBaseTitle as="h2">
                    <Link
                      href={`/components/${component.slug}`}
                      className="rounded-sm hover:text-primary"
                    >
                      {component.title}
                    </Link>
                  </CardBaseTitle>
                  <Badge size="sm" variant="muted">
                    {component.slug}
                  </Badge>
                </div>
                <CardBaseDescription>{component.description}</CardBaseDescription>
              </CardBaseHeader>
              <CardBaseContent>
                <InstallCommand slug={component.slug} />
              </CardBaseContent>
            </CardBase>
          </li>
        ))}
      </ul>
    </div>
  );
}
