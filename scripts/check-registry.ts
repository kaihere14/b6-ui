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

for (const component of components) {
  if (!existsSync(path.join(root, component.source))) {
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
