import type { Metadata } from "next";

import { CodeBlock } from "@/components/site/code-block";
import { InstallCommand, RegisterNamespaceCommand } from "@/components/site/install-command";
import { Separator } from "@/components/ui/separator";
import { registryUrlTemplate, siteConfig } from "@/lib/constants";

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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="text-h1">Installation</h1>
        <p className="mt-3 text-muted-foreground">
          B6 UI is a shadcn-compatible registry. Install any component straight from its URL —
          no setup beyond the <code className="font-mono text-code">components.json</code> you
          already have.
        </p>
      </header>

      <Separator className="my-10" decorative={false} />

      <section aria-labelledby="prereq-heading">
        <h2 id="prereq-heading" className="text-h2">
          Requirements
        </h2>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-small text-muted-foreground">
          <li>A React project with Tailwind CSS v4.</li>
          <li>
            A <code className="font-mono text-code">components.json</code> — run{" "}
            <code className="font-mono text-code">bunx --bun shadcn@latest init</code> if you do
            not have one.
          </li>
          <li>
            Nothing else — the B6 base below installs the{" "}
            <code className="font-mono text-code">cn</code> helper at{" "}
            <code className="font-mono text-code">@/lib/utils</code> and the design tokens.
          </li>
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="base-heading">
        <h2 id="base-heading" className="text-h2">
          1. Install the base
        </h2>
        <p className="mt-2 text-small text-muted-foreground">
          Once per project. It writes <code className="font-mono text-code">lib/utils.ts</code>{" "}
          and merges the B6 design tokens into your stylesheet — the two things every component
          assumes are already there.
        </p>
        <InstallCommand slug="base" className="mt-4" />
      </section>

      <section className="mt-12" aria-labelledby="add-heading">
        <h2 id="add-heading" className="text-h2">
          2. Add a component
        </h2>
        <InstallCommand slug="button-base" className="mt-4" />
        <p className="mt-3 text-small text-muted-foreground">
          The CLI writes the source to{" "}
          <code className="font-mono text-code">components/ui/button-base.tsx</code> and
          installs any npm dependencies the item declares. Every component is a single file with
          no registry dependencies, so nothing you already own is overwritten. A component built
          on another one — Magnetic Button is a Button Base — says so on its page; install that
          one first.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="register-heading">
        <h2 id="register-heading" className="text-h2">
          3. Optional: register the namespace
        </h2>
        <p className="mt-2 text-small text-muted-foreground">
          Installing lots of components? Register{" "}
          <code className="font-mono text-code">{siteConfig.registryNamespace}</code> once and
          drop the URL from every command.
        </p>
        <RegisterNamespaceCommand className="mt-4" />
        <p className="mt-3 text-small text-muted-foreground">
          Or add it to <code className="font-mono text-code">components.json</code> by hand:
        </p>
        <CodeBlock
          className="mt-3"
          code={componentsJson}
          filename="components.json"
          language="json"
        />
        <p className="mt-3 text-small text-muted-foreground">
          Then the short form works. Without this entry the CLI fails with{" "}
          <code className="font-mono text-code">
            Unknown registry &quot;{siteConfig.registryNamespace}&quot;
          </code>
          .
        </p>
        <InstallCommand slug="button-base" variant="namespace" className="mt-3" />
      </section>

      <section className="mt-12" aria-labelledby="own-heading">
        <h2 id="own-heading" className="text-h2">
          4. It is yours now
        </h2>
        <p className="mt-2 text-muted-foreground">
          The file is in your repository. Rename it, restyle it, delete the variants you do not
          use. There is no package to keep in sync.
        </p>
      </section>
    </div>
  );
}
