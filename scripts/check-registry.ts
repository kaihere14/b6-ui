/**
 * Registry integrity check.
 *
 * Fails the build when `registry.json`, `lib/registry.ts` and the files on disk
 * disagree — the three places a new component has to be wired up.
 *
 *   bun run registry:check
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { components } from "../lib/registry";

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  files?: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
  cssVars?: Record<string, Record<string, string>>;
}

const root = path.resolve(import.meta.dirname, "..");
const registry = JSON.parse(readFileSync(path.join(root, "registry.json"), "utf8")) as {
  items: RegistryItem[];
};

const errors: string[] = [];

const uiItems = registry.items.filter((item) => item.type === "registry:ui");
const uiNames = new Set(uiItems.map((item) => item.name));
const docSlugs = new Set(components.map((component) => component.slug));

for (const name of uiNames) {
  if (!docSlugs.has(name))
    errors.push(`registry.json item "${name}" has no entry in lib/registry.ts`);
}
for (const slug of docSlugs) {
  if (!uiNames.has(slug))
    errors.push(`lib/registry.ts entry "${slug}" has no item in registry.json`);
}

for (const item of uiItems) {
  for (const file of item.files ?? []) {
    if (!existsSync(path.join(root, file.path))) {
      errors.push(`registry.json item "${item.name}" points at missing file ${file.path}`);
    }
    if (!file.target) {
      errors.push(`registry.json item "${item.name}" file ${file.path} has no install target`);
    }
  }
}

// A self-contained item inlines the token block instead of depending on
// `@b6-ui/tokens`. That is a second copy, so it has to stay byte-identical to
// the theme item or consumers install a component whose colours have drifted.
const themeItem = registry.items.find((item) => item.type === "registry:theme");

for (const item of registry.items) {
  if (!item.cssVars || item === themeItem) continue;
  if (!themeItem) {
    errors.push(
      `registry.json item "${item.name}" declares cssVars but there is no theme item`,
    );
    continue;
  }
  if (JSON.stringify(item.cssVars) !== JSON.stringify(themeItem.cssVars)) {
    errors.push(
      `registry.json item "${item.name}" inlines cssVars that no longer match "${themeItem.name}"`,
    );
  }
}

// A distributed component may import npm packages and `@/lib/utils`, nothing
// else. An import of another B6 component compiles here and breaks in the
// consumer's project, where that file was never installed.
const forbiddenImport = /from\s+"@\/(?!lib\/utils")[^"]+"/g;

// A distributed component may not name a B6 type step (`text-body`, `text-h3`, …)
// as a class. Stock `tailwind-merge` files those under `text-color`, so a size
// from one cva variant deletes the colour from another and the label renders in
// the colour it inherits — invisible on a solid button. Only B6's own extended
// cn() knows better, and a consumer who already had `lib/utils.ts` never got it.
// Read the token instead: `text-(length:--text-body) leading-(--text-body--line-height)`.
const forbiddenTypeClass =
  /(?<![\w-])text-(display|h1|h2|h3|body|small|caption|code)(?![\w-])/g;

for (const component of components) {
  const sourcePath = path.join(root, component.source);
  if (existsSync(sourcePath)) {
    for (const match of readFileSync(sourcePath, "utf8").matchAll(forbiddenImport)) {
      errors.push(
        `${component.source} imports ${match[0].replace(/^from\s+/, "")} — a registry component may only import npm packages and "@/lib/utils"`,
      );
    }

    const code = readFileSync(sourcePath, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");

    for (const match of code.matchAll(forbiddenTypeClass)) {
      errors.push(
        `${component.source} uses the class "${match[0]}" — a registry component reads the type token directly (text-(length:--text-${match[1]})), because stock tailwind-merge treats a named step as a colour`,
      );
    }
  }

  if (!existsSync(sourcePath)) {
    errors.push(
      `lib/registry.ts "${component.slug}" points at missing source ${component.source}`,
    );
  }
  if (!existsSync(path.join(root, `components/ui/${component.slug}.tsx`))) {
    errors.push(`"${component.slug}" has no re-export at components/ui/${component.slug}.tsx`);
  }
  if (!existsSync(path.join(root, `components/previews/${component.slug}-preview.tsx`))) {
    errors.push(
      `"${component.slug}" has no preview at components/previews/${component.slug}-preview.tsx`,
    );
  }
}

if (errors.length > 0) {
  console.error("Registry check failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Registry check passed: ${uiItems.length} components in sync.`);
