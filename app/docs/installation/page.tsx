import type { Metadata } from "next";

import { CodeBlock } from "@/components/site/code-block";
import { InstallCommand } from "@/components/site/install-command";
import { Separator } from "@/components/ui/separator";
import { registryUrlTemplate, siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Installation",
  description: "Register the B6 UI namespace and install components with the shadcn CLI.",
};

const registerCli = `bunx --bun shadcn@latest registry add ${siteConfig.registryNamespace}=${registryUrlTemplate}`;

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

const tokens = `:root {
  --b6-background: oklch(0.99 0.004 95);
  --b6-foreground: oklch(0.18 0.012 75);
  --b6-primary: oklch(0.68 0.165 58);
  --b6-primary-foreground: oklch(0.16 0.03 60);
  /* …the full set lives in this repository's app/globals.css */
}`;

export default function InstallationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="text-h1">Installation</h1>
        <p className="mt-3 text-muted-foreground">
          B6 UI is a shadcn-compatible registry. You register the namespace once, then install
          any component by name.
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
            A <code className="font-mono text-code">cn</code> helper at{" "}
            <code className="font-mono text-code">@/lib/utils</code> (the shadcn init creates
            it).
          </li>
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="register-heading">
        <h2 id="register-heading" className="text-h2">
          1. Register the namespace
        </h2>
        <CodeBlock className="mt-4" code={registerCli} filename="terminal" language="bash" />
        <p className="mt-3 text-small text-muted-foreground">
          Or add it to <code className="font-mono text-code">components.json</code> by hand:
        </p>
        <CodeBlock
          className="mt-3"
          code={componentsJson}
          filename="components.json"
          language="json"
        />
      </section>

      <section className="mt-12" aria-labelledby="add-heading">
        <h2 id="add-heading" className="text-h2">
          2. Add a component
        </h2>
        <InstallCommand slug="button-base" className="mt-4" />
        <p className="mt-3 text-small text-muted-foreground">
          The CLI writes the source to{" "}
          <code className="font-mono text-code">components/ui/button-base.tsx</code> and
          installs any npm dependencies the item declares.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="tokens-heading">
        <h2 id="tokens-heading" className="text-h2">
          3. Add the B6 tokens
        </h2>
        <p className="mt-2 text-small text-muted-foreground">
          Components reference semantic tokens. Registry items carry their own{" "}
          <code className="font-mono text-code">cssVars</code>, so the CLI merges the values it
          needs into your stylesheet. To adopt the full B6 look, copy the token block:
        </p>
        <CodeBlock className="mt-4" code={tokens} filename="app/globals.css" language="css" />
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
