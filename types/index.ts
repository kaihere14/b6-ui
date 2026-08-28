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
}

/** Everything the documentation site needs to render one component page. */
export interface ComponentMeta {
  /** Registry item name — also the URL slug and the shadcn install target. */
  slug: string;
  title: string;
  description: string;
  /** Source file, relative to the repository root. */
  source: string;
  /** npm packages the component pulls in. */
  dependencies: string[];
  /**
   * Slugs of other B6 components this one imports and expects to already be
   * installed. Deliberately not `registryDependencies`: reinstalling them would
   * overwrite files the consumer owns.
   */
  requires?: string[];
  props: ComponentProp[];
  examples: ComponentExample[];
  accessibility: string[];
  responsive: string;
}
