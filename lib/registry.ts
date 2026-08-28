import type { ComponentMeta } from "@/types";

/**
 * Documentation metadata for every B6 UI registry item.
 *
 * `slug` is the contract: it is the registry item name, the docs URL segment,
 * the component folder under `registry/<family>/`, and the argument to
 * `shadcn add`. Adding a component means adding one entry here and one entry
 * in `registry.json`.
 */
export const components: ComponentMeta[] = [
  {
    slug: "button-base",
    title: "Button Base",
    description:
      "The foundation button of the B6 system: six variants, four sizes, a built-in loading state and icon slots.",
    source: "registry/button/button-base/button-base.tsx",
    dependencies: ["class-variance-authority", "@radix-ui/react-slot", "lucide-react"],
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
        defaultValue: '"primary"',
        description: "Visual weight of the button.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "icon"',
        defaultValue: '"md"',
        description: "Control height and padding. Use `icon` for square icon-only buttons.",
      },
      {
        name: "block",
        type: "boolean",
        defaultValue: "false",
        description: "Stretch the button to the full width of its container.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description:
          "Swap the leading icon for a spinner, block interaction and set `aria-busy`.",
      },
      {
        name: "loadingLabel",
        type: "string",
        defaultValue: '"Loading"',
        description: "Text announced to screen readers while loading.",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        description: "Icon before the label. Hidden while loading.",
      },
      { name: "rightIcon", type: "React.ReactNode", description: "Icon after the label." },
      {
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description: "Render the child element (e.g. a `Link`) with the button's styling.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Native disabled state.",
      },
    ],
    examples: [
      {
        title: "Variants",
        code: `<ButtonBase>Get Started</ButtonBase>
<ButtonBase variant="secondary">Learn More</ButtonBase>
<ButtonBase variant="outline">Docs</ButtonBase>
<ButtonBase variant="ghost">Cancel</ButtonBase>
<ButtonBase variant="destructive">Delete</ButtonBase>`,
      },
      {
        title: "With icons",
        code: `import { ArrowRight, Download } from "lucide-react";

<ButtonBase leftIcon={<Download />}>Install</ButtonBase>
<ButtonBase variant="ghost" rightIcon={<ArrowRight />}>Read the docs</ButtonBase>`,
      },
      {
        title: "Loading",
        description: "The button disables itself and reports `aria-busy` while loading.",
        code: `<ButtonBase loading loadingLabel="Saving changes">Save</ButtonBase>`,
      },
      {
        title: "As a link",
        description: "`asChild` keeps the styling but renders your own element.",
        code: `import Link from "next/link";

<ButtonBase asChild>
  <Link href="/components">Browse components</Link>
</ButtonBase>`,
      },
    ],
    accessibility: [
      'Renders a real `<button>` with `type="button"` unless you pass a `type`.',
      "Focus is always visible through the shared `--color-ring` outline; it is never removed.",
      "`loading` sets `aria-busy` and announces `loadingLabel` through a visually hidden span.",
      "Icons are decorative — pass an `aria-label` when a button has no text.",
      "Motion is limited to a 1px press offset, and is suppressed under `prefers-reduced-motion`.",
    ],
    responsive:
      "Sizing is fixed per `size` token; use `block` to fill narrow layouts and change `size` at a breakpoint via `className`.",
  },
  {
    slug: "magnetic-button",
    title: "Magnetic Button",
    description:
      "A Button Base that leans toward the pointer while the pointer is over it, and springs back when it leaves.",
    source: "registry/button/magnetic-button/magnetic-button.tsx",
    dependencies: ["motion"],
    requires: ["button-base"],
    props: [
      {
        name: "strength",
        type: "number",
        defaultValue: "0.3",
        description:
          "Fraction of the pointer's offset from the centre that the button travels.",
      },
      {
        name: "maxTravel",
        type: "number",
        defaultValue: "24",
        description: "Hard cap on travel in pixels, in any direction.",
      },
      {
        name: "contentStrength",
        type: "number",
        defaultValue: "0.4",
        description:
          "Extra fraction the label travels on top of the button's own pull, for parallax.",
      },
      {
        name: "magnetic",
        type: "boolean",
        defaultValue: "true",
        description: "Hold the button at rest without removing it from the layout.",
      },
      {
        name: "...ButtonBaseProps",
        type: "ButtonBaseProps",
        description:
          "Every Button Base prop except `asChild` — `variant`, `size`, `block`, `loading`, `leftIcon`, `rightIcon`.",
      },
    ],
    examples: [
      {
        title: "Default",
        description: "Inherits the primary Button Base styling and adds the pull.",
        code: `<MagneticButton>Get started</MagneticButton>`,
      },
      {
        title: "Tuning the pull",
        description:
          "`strength` sets how closely the button follows the pointer; `maxTravel` caps how far it can go.",
        code: `<MagneticButton variant="outline" strength={0.5} maxTravel={40}>
  Stronger pull
</MagneticButton>`,
      },
      {
        title: "Opting out",
        description:
          "`magnetic={false}` parks the button at rest — useful inside dense or scrolling layouts.",
        code: `<MagneticButton magnetic={false}>Magnet off</MagneticButton>`,
      },
    ],
    accessibility: [
      "Renders the same real `<button>` as Button Base, with the same focus ring and keyboard behaviour.",
      "Magnetism is a hover affordance only: it never moves under keyboard focus, so focus order is stable.",
      "Suppressed entirely under `prefers-reduced-motion: reduce` (via Motion\'s `useReducedMotion`) and on coarse pointers, where it behaves exactly like Button Base.",
      "Held at rest while `disabled` or `loading`, so a non-interactive control never invites a click.",
      "Motion carries no meaning — every state is already conveyed by the underlying Button Base.",
    ],
    responsive:
      "The pull is measured from the live bounding box, so it stays correct at any width, and `maxTravel` keeps a full-width `block` button from swinging. On touch layouts the magnet is off and the button falls back to Button Base sizing.",
  },
  {
    slug: "card-base",
    title: "Card Base",
    description:
      "A composable surface with header, content and footer slots, in flat, elevated and muted variants.",
    source: "registry/card/card-base/card-base.tsx",
    dependencies: ["class-variance-authority", "@radix-ui/react-slot"],
    props: [
      {
        name: "variant",
        type: '"outline" | "elevated" | "muted"',
        defaultValue: '"outline"',
        description: "Surface treatment.",
      },
      {
        name: "padding",
        type: '"none" | "sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Internal padding and slot gap.",
      },
      {
        name: "interactive",
        type: "boolean",
        defaultValue: "false",
        description: "Add hover lift and a focus ring for cards that act as links.",
      },
      {
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description: "Render the child element (e.g. a `Link`) with the card's styling.",
      },
      {
        name: "as (CardBaseTitle)",
        type: '"h2" | "h3" | "h4"',
        defaultValue: '"h3"',
        description: "Heading level, so the card fits the page outline.",
      },
    ],
    examples: [
      {
        title: "Anatomy",
        code: `<CardBase>
  <CardBaseHeader>
    <CardBaseTitle>Registry</CardBaseTitle>
    <CardBaseDescription>Distributed through the shadcn CLI.</CardBaseDescription>
  </CardBaseHeader>
  <CardBaseContent>Every component ships as source you own.</CardBaseContent>
  <CardBaseFooter>
    <ButtonBase size="sm">Read more</ButtonBase>
  </CardBaseFooter>
</CardBase>`,
      },
      {
        title: "Interactive card",
        code: `<CardBase asChild variant="elevated" interactive>
  <a href="/components/button-base">
    <CardBaseTitle>Button Base</CardBaseTitle>
  </a>
</CardBase>`,
      },
    ],
    accessibility: [
      "`CardBase` is a plain `<div>` — it adds no implicit semantics.",
      "Set `CardBaseTitle`'s `as` prop so headings never skip a level.",
      "An `interactive` card must contain a real link or button; do not attach `onClick` to the card alone.",
    ],
    responsive:
      "Cards fill their grid cell. Compose them inside a `grid` and change `padding` per breakpoint if needed.",
  },
  {
    slug: "badge",
    title: "Badge",
    description: "A compact status marker in five tones and two sizes.",
    source: "registry/badge/badge/badge.tsx",
    dependencies: ["class-variance-authority"],
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "muted" | "outline" | "destructive"',
        defaultValue: '"secondary"',
        description: "Tone of the badge.",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        defaultValue: '"md"',
        description: "`sm` renders uppercase caption type for metadata chips.",
      },
    ],
    examples: [
      {
        title: "Tones",
        code: `<Badge variant="primary">Stable</Badge>
<Badge>Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Deprecated</Badge>`,
      },
      {
        title: "With an icon",
        code: `import { Check } from "lucide-react";

<Badge variant="primary">
  <Check aria-hidden />
  Verified
</Badge>`,
      },
    ],
    accessibility: [
      "A badge is a label, not a control — it is not focusable and has no role.",
      "When a badge carries status that changes at runtime, put it in a live region.",
      "Colour alone never conveys the meaning; the text does.",
    ],
    responsive: "Badges are inline and shrink-wrap their text; they never wrap mid-label.",
  },
  {
    slug: "input",
    title: "Input",
    description:
      "A single-line text field with size and tone tokens, icon slots and a wired-up invalid state.",
    source: "registry/input/input/input.tsx",
    dependencies: ["class-variance-authority"],
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "B6 sizing token. The native `size` attribute is not forwarded.",
      },
      {
        name: "tone",
        type: '"default" | "subtle"',
        defaultValue: '"default"',
        description: "`subtle` drops the border and sits on the muted surface.",
      },
      {
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description: "Applies the destructive border and sets `aria-invalid`.",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        description: "Icon inside the leading edge.",
      },
      {
        name: "rightIcon",
        type: "React.ReactNode",
        description: "Icon or affordance inside the trailing edge.",
      },
    ],
    examples: [
      {
        title: "Labelled field",
        code: `<label className="text-small font-medium" htmlFor="email">Email</label>
<Input id="email" type="email" placeholder="you@example.com" />`,
      },
      {
        title: "Search field",
        code: `import { Search } from "lucide-react";

<Input aria-label="Search" leftIcon={<Search />} placeholder="Search…" />`,
      },
      {
        title: "Invalid",
        code: `<Input invalid aria-describedby="email-error" defaultValue="not-an-email" />
<p id="email-error" className="text-small text-destructive">Enter a valid email.</p>`,
      },
    ],
    accessibility: [
      "Always pair the input with a `<label htmlFor>` or an `aria-label`.",
      "`invalid` sets `aria-invalid`; point `aria-describedby` at the message that explains why.",
      "Leading icons are `aria-hidden` and pointer-transparent, so clicks still focus the field.",
      "Disabled fields keep 4.5:1 contrast on their placeholder text.",
    ],
    responsive:
      "The field is `w-full` by default; constrain it with a `max-w-*` on the wrapper.",
  },
  {
    slug: "separator",
    title: "Separator",
    description: "A one-pixel rule — horizontal or vertical, optionally captioned.",
    source: "registry/separator/separator/separator.tsx",
    dependencies: [],
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description: "Direction of the rule.",
      },
      {
        name: "decorative",
        type: "boolean",
        defaultValue: "true",
        description:
          "Decorative rules are hidden from assistive tech. Set `false` when the rule divides real content groups.",
      },
      {
        name: "label",
        type: "React.ReactNode",
        description: "Caption rendered inside a horizontal rule.",
      },
    ],
    examples: [
      { title: "Horizontal", code: `<Separator />` },
      { title: "Captioned", code: `<Separator label="or" />` },
      {
        title: "Vertical",
        description: "A vertical separator needs a parent with a resolved height.",
        code: `<div className="flex h-8 items-center gap-4">
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Registry</span>
</div>`,
      },
    ],
    accessibility: [
      'Defaults to `role="none"` because most rules are purely visual.',
      '`decorative={false}` switches to `role="separator"` with the matching `aria-orientation`.',
      "The rule uses the shared border token, so it stays visible in both themes.",
    ],
    responsive:
      "Horizontal rules fill their container; vertical rules stretch to the parent's height via `self-stretch`.",
  },
];

export function getComponent(slug: string): ComponentMeta | undefined {
  return components.find((component) => component.slug === slug);
}

export function getComponentSlugs(): string[] {
  return components.map((component) => component.slug);
}
