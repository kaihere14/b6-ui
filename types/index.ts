/**
 * Sidebar groupings, in the order they are listed.
 *
 * A category is a docs-navigation concern, not a registry one: it never reaches
 * `registry.json` and never changes how a component installs.
 */
export const componentCategories = ["Buttons", "Forms", "Display", "Graphs", "Layout"] as const;

export type ComponentCategory = (typeof componentCategories)[number];

/** A single documented prop on a B6 UI component. */
export interface ComponentProp {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}

/** A runnable usage example shown on a component page. */
export interface ComponentExample {
  title: string;
  description?: string;
  code: string;
  /**
   * Key into `exampleDemos` in `components/previews/index.ts`. An example with
   * one renders as a live preview beside its code; without one, code only.
   */
  preview?: string;
}

/** Everything the documentation site needs to render one component page. */
export interface ComponentMeta {
  /** Registry item name — also the URL slug and the shadcn install target. */
  slug: string;
  title: string;
  description: string;
  /** Sidebar grouping. */
  category: ComponentCategory;
  /** Flags the component as recently added in the sidebar. */
  isNew?: boolean;
  /** Source file, relative to the repository root. */
  source: string;
  /** npm packages the component pulls in. */
  dependencies: string[];
  props: ComponentProp[];
  examples: ComponentExample[];
  accessibility: string[];
  responsive: string;
}
