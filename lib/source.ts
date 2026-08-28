import { readFile } from "node:fs/promises";
import path from "node:path";

/** Registry sources are the only files the site reads from disk. */
const REGISTRY_DIR = path.join(process.cwd(), "registry");

/**
 * Read a registry source file at render time.
 *
 * Server-only: the documentation site shows the exact bytes the shadcn CLI
 * distributes, so the source panel can never drift from the shipped component.
 *
 * @param sourcePath Repository-relative path, e.g. `registry/badge/badge.tsx`.
 */
export async function readSource(sourcePath: string) {
  const relative = sourcePath.replace(/^registry\//, "");
  const absolute = path.join(REGISTRY_DIR, relative);

  if (!absolute.startsWith(`${REGISTRY_DIR}${path.sep}`)) {
    throw new Error(`Refusing to read outside the registry: ${sourcePath}`);
  }

  return readFile(absolute, "utf8");
}
