/** Static, build-time site configuration. Nothing secret belongs in here. */
export const siteConfig = {
  name: "B6 UI",
  tagline: "Components you own.",
  description:
    "An original React component library distributed as source code through the shadcn CLI. Copy it in, keep it, change it.",
  /** Public origin of the deployed docs site — also the registry host. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://b6-ui.dev",
  github: "https://github.com/b6-ui/b6-ui",
  /** Namespace consumers register in their own components.json. */
  registryNamespace: "@b6-ui",
} as const;

/** Path template consumers point their `registries` entry at. */
export const registryUrlTemplate = `${siteConfig.url}/r/{name}.json`;

export const mainNav = [
  { title: "Components", href: "/components" },
  { title: "Documentation", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
] as const;

/** Build the shadcn install command for a registry item. */
export function installCommand(slug: string) {
  return `bunx --bun shadcn add ${siteConfig.registryNamespace}/${slug}`;
}
