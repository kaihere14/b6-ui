/** Static, build-time site configuration. Nothing secret belongs in here. */
export const siteConfig = {
  name: "B6 UI",
  tagline: "Components you own.",
  description:
    "An original React component library distributed as source code through the shadcn CLI. Copy it in, keep it, change it.",
  /** Public origin of the deployed docs site — also the registry host. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ui.armandev.space",
  github: "https://github.com/kaihere14/b6-ui",
  /** Namespace consumers register in their own components.json. */
  registryNamespace: "@b6-ui",
} as const;

/** Path template consumers point their `registries` entry at. */
export const registryUrlTemplate = `${siteConfig.url}/r/{name}.json`;

/** Direct URL of a single registry item — installable without any local config. */
export function registryItemUrl(slug: string) {
  return `${siteConfig.url}/r/${slug}.json`;
}

/** Package managers the install snippets offer. First entry is the default. */
export const packageManagers = ["bun", "npm", "pnpm"] as const;

export type PackageManager = (typeof packageManagers)[number];

/** How each package manager runs a one-off binary. */
const shadcnRunner: Record<PackageManager, string> = {
  bun: "bunx --bun shadcn@latest",
  npm: "npx shadcn@latest",
  pnpm: "pnpm dlx shadcn@latest",
};

export const mainNav = [
  { title: "Components", href: "/components" },
  { title: "Documentation", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
] as const;

/**
 * Build the shadcn install command for a registry item. Uses the direct item URL
 * so it works in any project with a `components.json` — no namespace to register
 * first. See `namespacedInstallCommand` for the shorter form.
 */
export function installCommand(slug: string, packageManager: PackageManager = "bun") {
  return `${shadcnRunner[packageManager]} add ${registryItemUrl(slug)}`;
}

/** Registers the `@b6-ui` namespace in the consumer's components.json. */
export function registerNamespaceCommand(packageManager: PackageManager = "bun") {
  return `${shadcnRunner[packageManager]} registry add ${siteConfig.registryNamespace}=${registryUrlTemplate}`;
}

/** Shorter form, only valid once `@b6-ui` is in the consumer's `registries`. */
export function namespacedInstallCommand(slug: string, packageManager: PackageManager = "bun") {
  return `${shadcnRunner[packageManager]} add ${siteConfig.registryNamespace}/${slug}`;
}
