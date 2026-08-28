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
  /**
   * Landing headline, one array entry per rendered line. The hero reveals it a
   * word at a time, so the line break is a content decision, not a wrap.
   */
  heroHeadline: ["Components you own,", "not a dependency."],
  /** Stack line shown in the hero pill beside the registry count. */
  heroStack: "Tailwind v4 + React 19",
} as const;

/**
 * `--ease-b6-out` as a cubic-bezier tuple, for `motion` transitions on the
 * documentation site. CSS transitions read the token through `ease-b6-out`;
 * `motion` cannot resolve a custom property, so the same curve is spelled out
 * here once instead of at every call site.
 */
export const easeB6Out = [0.16, 1, 0.3, 1] as const;

/** Path template consumers point their `registries` entry at. */
export const registryUrlTemplate = `${siteConfig.url}/r/{name}.json`;

/** Direct URL of a single registry item — installable without any local config. */
export function registryItemUrl(slug: string) {
  return `${siteConfig.url}/r/${slug}.json`;
}

/** Package managers the install snippets offer. First entry is the default. */
export const packageManagers = ["npm", "bun", "pnpm"] as const;

export type PackageManager = (typeof packageManagers)[number];

/** How each package manager runs a one-off binary. */
const shadcnRunner: Record<PackageManager, string> = {
  npm: "npx shadcn@latest",
  bun: "bunx --bun shadcn@latest",
  pnpm: "pnpm dlx shadcn@latest",
};

/**
 * Prose pages, listed above the component groups in the documentation sidebar
 * and searched alongside the registry in the command menu.
 */
export const docsNav = [
  {
    title: "Introduction",
    href: "/docs",
    description: "How B6 UI is built: design tokens, architecture, adding a component.",
  },
  {
    title: "Installation",
    href: "/docs/installation",
    description: "Install the B6 base once, then add components with the shadcn CLI.",
  },
  {
    title: "All components",
    href: "/components",
    description: "Every component in the B6 UI registry.",
  },
] as const;

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
export function installCommand(slug: string, packageManager: PackageManager = "npm") {
  return `${shadcnRunner[packageManager]} add ${registryItemUrl(slug)}`;
}

/** Registers the `@b6-ui` namespace in the consumer's components.json. */
export function registerNamespaceCommand(packageManager: PackageManager = "npm") {
  return `${shadcnRunner[packageManager]} registry add ${siteConfig.registryNamespace}=${registryUrlTemplate}`;
}

/** Shorter form, only valid once `@b6-ui` is in the consumer's `registries`. */
export function namespacedInstallCommand(slug: string, packageManager: PackageManager = "npm") {
  return `${shadcnRunner[packageManager]} add ${siteConfig.registryNamespace}/${slug}`;
}
