import type { Metadata } from "next";

import { CodeBlock } from "@/components/site/code-block";
import { DocsSection } from "@/components/site/docs-section";
import { InstallCommand, RegisterNamespaceCommand } from "@/components/site/install-command";
import { Toc, type TocItem } from "@/components/site/toc";
import { registryUrlTemplate, siteConfig } from "@/lib/constants";

/** Section index for the right-hand column. Mirrors the section ids below. */
const tocItems: TocItem[] = [
  { id: "requirements", label: "Requirements" },
  { id: "base", label: "Install the base" },
  { id: "add", label: "Add a component" },
  { id: "register", label: "Register the namespace" },
  { id: "own", label: "It is yours" },
];

export const metadata: Metadata = {
  title: "Installation",
  description: "Install the B6 base once, then add components with the shadcn CLI.",
};

const componentsJson = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "utils": "@/lib/utils"
  },
  "registries": {
    "${siteConfig.registryNamespace}": "${registryUrlTemplate}"
  }
}`;

export default function InstallationPage() {
  return (
    <>
      <article className="min-w-0 pb-16 lg:py-12">
        <header>
          <h1 className="text-h1">Installation</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            B6 UI is a shadcn-compatible registry. Install any component straight from its URL —
            no setup beyond the <code className="font-mono text-code">components.json</code> you
            already have.
          </p>
        </header>

        <DocsSection id="requirements" title="Requirements">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-small text-muted-foreground">
            <li>A React project with Tailwind CSS v4.</li>
            <li>
              A <code className="font-mono text-code">components.json</code> — run{" "}
              <code className="font-mono text-code">npx shadcn@latest init</code> if you
              do not have one.
            </li>
            <li>
              Nothing else — the B6 base below installs the{" "}
              <code className="font-mono text-code">cn</code> helper at{" "}
              <code className="font-mono text-code">@/lib/utils</code> and the design tokens.
            </li>
          </ul>
        </DocsSection>

        <DocsSection
          id="base"
          title="1. Install the base"
          description={
            <>
              Once per project. It writes{" "}
              <code className="font-mono text-code">lib/utils.ts</code> and merges the B6 design
              tokens into your stylesheet — the two things every component assumes are already
              there.
            </>
          }
        >
          <InstallCommand slug="base" />
        </DocsSection>

        <DocsSection id="add" title="2. Add a component">
          <InstallCommand slug="button-base" />
          <p className="mt-3 max-w-2xl text-small text-muted-foreground">
            The CLI writes the source to{" "}
            <code className="font-mono text-code">components/ui/button-base.tsx</code> and
            installs any npm dependencies the item declares. Every component is a single file
            with no registry dependencies, so nothing you already own is overwritten. A
            component built on another one — Magnetic Button is a Button Base — says so on its
            page; install that one first.
          </p>
        </DocsSection>

        <DocsSection
          id="register"
          title="3. Optional: register the namespace"
          description={
            <>
              Installing lots of components? Register{" "}
              <code className="font-mono text-code">{siteConfig.registryNamespace}</code> once
              and drop the URL from every command.
            </>
          }
        >
          <RegisterNamespaceCommand />
          <p className="mt-3 max-w-2xl text-small text-muted-foreground">
            Or add it to <code className="font-mono text-code">components.json</code> by hand:
          </p>
          <CodeBlock
            className="mt-3"
            code={componentsJson}
            filename="components.json"
            language="json"
          />
          <p className="mt-3 max-w-2xl text-small text-muted-foreground">
            Then the short form works. Without this entry the CLI fails with{" "}
            <code className="font-mono text-code">
              Unknown registry &quot;{siteConfig.registryNamespace}&quot;
            </code>
            .
          </p>
          <InstallCommand slug="button-base" variant="namespace" className="mt-3" />
        </DocsSection>

        <DocsSection id="own" title="4. It is yours now">
          <p className="max-w-2xl text-muted-foreground">
            The file is in your repository. Rename it, restyle it, delete the variants you do
            not use. There is no package to keep in sync.
          </p>
        </DocsSection>
      </article>

      <Toc items={tocItems} />
    </>
  );
}
