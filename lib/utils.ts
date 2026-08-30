import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * B6 UI names its type steps (`text-body`, `text-small`, `text-h1`, …) instead
 * of sizing them on a t-shirt scale. tailwind-merge cannot infer that, so it
 * files them under `text-color`, and a later `text-body` from the `size`
 * variant then silently deletes an earlier `text-primary-foreground` from the
 * `variant` one. Registering the scale as font sizes keeps the two apart.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["hero", "display", "h1", "h2", "h3", "body", "small", "caption", "code"] },
      ],
    },
  },
});

/**
 * Merge conditional class names and resolve conflicting Tailwind utilities.
 * Every B6 UI component funnels its `className` prop through this so consumer
 * overrides always win over the component's own defaults.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
