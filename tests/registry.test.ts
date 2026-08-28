import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "bun:test";

import { exampleDemos, previews } from "../components/previews";
import { components, getComponent, getComponentSlugs } from "../lib/registry";

const root = path.resolve(import.meta.dirname, "..");
const registry = JSON.parse(readFileSync(path.join(root, "registry.json"), "utf8")) as {
  name: string;
  items: {
    name: string;
    type: string;
    files?: { path: string; target?: string }[];
    registryDependencies?: string[];
    cssVars?: Record<string, Record<string, string>>;
  }[];
};

const uiItems = registry.items.filter((item) => item.type === "registry:ui");

describe("registry.json", () => {
  test("declares the b6-ui namespace and a theme item", () => {
    expect(registry.name).toBe("b6-ui");
    expect(registry.items.some((item) => item.type === "registry:theme")).toBe(true);
  });

  test("every component item ships exactly one file with an install target", () => {
    for (const item of uiItems) {
      expect(item.files?.length).toBe(1);
      expect(item.files?.[0]?.target).toBe(`components/ui/${item.name}.tsx`);
      expect(existsSync(path.join(root, item.files![0]!.path))).toBe(true);
    }
  });

  test("components name no registry dependencies — the base is installed first", () => {
    for (const item of uiItems) {
      expect(item.registryDependencies).toEqual([]);
    }
  });

  test("ships a base item carrying cn() and the tokens verbatim", () => {
    const base = registry.items.find((item) => item.type === "registry:base");
    const tokens = registry.items.find((item) => item.type === "registry:theme");

    expect(base?.name).toBe("base");
    expect(base?.files?.[0]?.target).toBe("lib/utils.ts");
    expect(base?.cssVars).toEqual(tokens!.cssVars!);
  });
});

describe("documentation metadata", () => {
  test("matches the registry item names exactly", () => {
    expect(getComponentSlugs().toSorted()).toEqual(uiItems.map((item) => item.name).toSorted());
  });

  test("every component has source, props, examples and accessibility notes", () => {
    for (const component of components) {
      expect(existsSync(path.join(root, component.source))).toBe(true);
      expect(component.examples.length).toBeGreaterThan(0);
      expect(component.accessibility.length).toBeGreaterThan(0);
      expect(component.responsive.length).toBeGreaterThan(0);
    }
  });

  test("every component has a preview and a re-export", () => {
    for (const component of components) {
      expect(previews[component.slug]).toBeDefined();
      expect(existsSync(path.join(root, `components/ui/${component.slug}.tsx`))).toBe(true);
    }
  });

  test("every usage example that names a preview has a demo behind it", () => {
    for (const component of components) {
      for (const example of component.examples) {
        if (!example.preview) continue;
        expect(exampleDemos[example.preview]).toBeDefined();
      }
    }
  });

  test("getComponent resolves known slugs and rejects unknown ones", () => {
    expect(getComponent("button-base")?.title).toBe("Button Base");
    expect(getComponent("does-not-exist")).toBeUndefined();
  });
});
