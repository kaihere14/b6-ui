import { componentCategories, type ComponentMeta } from "@/types";

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
    category: "Buttons",
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
        preview: "button-base/variants",
        code: `<ButtonBase>Get Started</ButtonBase>
<ButtonBase variant="secondary">Learn More</ButtonBase>
<ButtonBase variant="outline">Docs</ButtonBase>
<ButtonBase variant="ghost">Cancel</ButtonBase>
<ButtonBase variant="destructive">Delete</ButtonBase>`,
      },
      {
        title: "With icons",
        preview: "button-base/icons",
        code: `import { ArrowRight, Download } from "lucide-react";

<ButtonBase leftIcon={<Download />}>Install</ButtonBase>
<ButtonBase variant="ghost" rightIcon={<ArrowRight />}>Read the docs</ButtonBase>`,
      },
      {
        title: "Loading",
        preview: "button-base/loading",
        description: "The button disables itself and reports `aria-busy` while loading.",
        code: `<ButtonBase loading loadingLabel="Saving changes">Save</ButtonBase>`,
      },
      {
        title: "As a link",
        preview: "button-base/as-link",
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
      "Sizing is fixed per `size` token; use `block` to fill narrow layouts and change `size` at a breakpoint via `className`. The content wrapper measures itself and animates its width, so a longer status label (\"Save\" → \"Saving…\") grows the button smoothly instead of snapping.",
  },
  {
    slug: "magnetic-button",
    category: "Buttons",
    isNew: true,
    title: "Magnetic Button",
    description:
      "A standalone button that leans toward the pointer while the pointer is over it, and springs back when it leaves.",
    source: "registry/button/magnetic-button/magnetic-button.tsx",
    dependencies: [
      "motion",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "lucide-react",
    ],
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
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description:
          "Render the child element instead of a `<button>`, keeping the styling, the pull and the press dip. Use it to make a link magnetic.",
      },
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
        defaultValue: '"primary"',
        description: "Visual tone, matching the Button Base scale.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "icon"',
        defaultValue: '"md"',
        description: "Control height and padding.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description:
          "Swap the leading icon for a spinner, mark the control busy and hold it at rest.",
      },
      {
        name: "leftIcon / rightIcon",
        type: "React.ReactNode",
        description: "Icons rendered either side of the label, inside the parallax layer.",
      },
    ],
    examples: [
      {
        title: "Default",
        preview: "magnetic-button/default",
        description: "The primary B6 button styling, plus the pull.",
        code: `<MagneticButton>Get started</MagneticButton>`,
      },
      {
        title: "Tuning the pull",
        preview: "magnetic-button/strength",
        description:
          "`strength` sets how closely the button follows the pointer; `maxTravel` caps how far it can go.",
        code: `<MagneticButton variant="outline" strength={0.5} maxTravel={40}>
  Stronger pull
</MagneticButton>`,
      },
      {
        title: "As a link",
        preview: "magnetic-button/as-child",
        description:
          "`asChild` hands the styling and the motion to the child element, so a navigation target stays a real `<a>` — middle-click and open-in-new-tab keep working.",
        code: `<MagneticButton asChild rightIcon={<ArrowRight />}>
  <Link href="/components">Browse components</Link>
</MagneticButton>`,
      },
      {
        title: "Opting out",
        preview: "magnetic-button/opt-out",
        description:
          "`magnetic={false}` parks the button at rest — useful inside dense or scrolling layouts.",
        code: `<MagneticButton magnetic={false}>Magnet off</MagneticButton>`,
      },
    ],
    accessibility: [
      "Renders a real `<button>` with the standard B6 focus ring and keyboard behaviour.",
      "Magnetism is a hover affordance only: it never moves under keyboard focus, so focus order is stable.",
      "Clicking the button dips it 2px along y and eases it back. It hangs off `click`, which a button also fires for Enter and Space, so keyboard activation is confirmed the same way as a pointer one.",
      "Magnetism is suppressed entirely under `prefers-reduced-motion: reduce` (via Motion\'s `useReducedMotion`) and on coarse pointers, where it is an ordinary B6 button. The press dip is dropped under reduced motion as well; colour and focus still confirm the press.",
      "Held at rest while `disabled` or `loading`, so a non-interactive control never invites a click.",
      "Motion carries no meaning — every state is already conveyed by colour, the spinner and `aria-busy`.",
    ],
    responsive:
      "The pull is measured from the live bounding box, so it stays correct at any width, and `maxTravel` keeps a full-width `block` button from swinging. On touch layouts the magnet is off, but the press dip stays, so a tap is still confirmed.",
  },
  {
    slug: "stateful-button",
    category: "Buttons",
    isNew: true,
    title: "Stateful Button",
    description:
      "A button that progresses through visual states — idle, loading, success and error — with animated icon transitions and an error shake.",
    source: "registry/button/stateful-button/stateful-button.tsx",
    dependencies: [
      "motion",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "lucide-react",
    ],
    props: [
      {
        name: "status",
        type: '"idle" | "loading" | "success" | "error"',
        defaultValue: '"idle"',
        description:
          "Current lifecycle state. The button disables itself in any state other than `idle`.",
      },
      {
        name: "resetDelay",
        type: "number",
        defaultValue: "2000",
        description:
          "Milliseconds before auto-resetting from `success` or `error` back to `idle`. Set `0` to disable.",
      },
      {
        name: "onReset",
        type: "() => void",
        description:
          "Fired when the auto-reset timer completes. Use it to set `status` back to `idle`.",
      },
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
        defaultValue: '"primary"',
        description: "Visual tone, matching the Button Base scale.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "icon"',
        defaultValue: '"md"',
        description: "Control height and padding.",
      },
      {
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description:
          "Render the child element instead of a `<button>`, keeping all styling and motion.",
      },
      {
        name: "loadingText / successText / errorText",
        type: "React.ReactNode",
        description:
          'Visible label shown during the corresponding state. When set, replaces `children` so the label transitions alongside the icon (e.g. "Save" → "Saving…" → "Saved!").',
      },
      {
        name: "loadingLabel",
        type: "string",
        defaultValue: '"Loading"',
        description:
          "Screen-reader-only announcement while loading. Only rendered when `loadingText` is not set, so readers never hear duplicate labels.",
      },
      {
        name: "successLabel",
        type: "string",
        defaultValue: '"Success"',
        description:
          "Screen-reader-only announcement on success. Only rendered when `successText` is not set.",
      },
      {
        name: "errorLabel",
        type: "string",
        defaultValue: '"Error"',
        description:
          "Screen-reader-only announcement on error. Only rendered when `errorText` is not set.",
      },
      {
        name: "leftIcon / rightIcon",
        type: "React.ReactNode",
        description:
          "Icons rendered either side of the label. The left icon is replaced by status icons during loading, success and error.",
      },
      {
        name: "successIcon / errorIcon",
        type: "React.ReactNode",
        description:
          "Custom icons for the success and error states. Default to `Check` and `X` from lucide-react.",
      },
      {
        name: "blur",
        type: "boolean",
        defaultValue: "true",
        description:
          "Blur the content as it swaps between states. Set `false` for a plain fade-scale.",
      },
      {
        name: "stagger",
        type: "boolean",
        defaultValue: "true",
        description:
          "Animate the label one character at a time. Set `false` to move the whole label as one block; with `blur={false}` too, the swap is a simple fade.",
      },
    ],
    examples: [
      {
        title: "Default",
        preview: "stateful-button/default",
        description: "Click to trigger the full lifecycle: idle → loading → success → idle.",
        code: `const [status, setStatus] = useState<ButtonStatus>("idle");

<StatefulButton
  status={status}
  onReset={() => setStatus("idle")}
  onClick={() => {
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1500);
  }}
  loadingText="Saving…"
  successText="Saved!"
>
  Save changes
</StatefulButton>`,
      },
      {
        title: "Error with shake",
        preview: "stateful-button/error",
        description:
          "When the status reaches `error`, the button shakes horizontally and shows an X icon.",
        code: `<StatefulButton
  variant="outline"
  status={status}
  onReset={() => setStatus("idle")}
  onClick={() => {
    setStatus("loading");
    setTimeout(() => setStatus("error"), 1500);
  }}
  loadingText="Sending…"
  errorText="Failed!"
>
  Try again
</StatefulButton>`,
      },
      {
        title: "Variants",
        preview: "stateful-button/variants",
        description:
          "The status lifecycle works with every variant. Click each to see the transition.",
        code: `<StatefulButton status={s} onReset={reset} onClick={go}>Primary</StatefulButton>
<StatefulButton variant="secondary" status={s} ...>Secondary</StatefulButton>
<StatefulButton variant="destructive" status={s} ...>Delete</StatefulButton>`,
      },
      {
        title: "Simpler motion",
        preview: "stateful-button/motion",
        description:
          "Turn the swap down one piece at a time: `blur={false}` keeps the stagger without the defocus, `stagger={false}` moves the label as one block, and both off leave a plain fade-scale.",
        code: `<StatefulButton blur={false} status={s} ...>No blur</StatefulButton>
<StatefulButton stagger={false} status={s} ...>No stagger</StatefulButton>
<StatefulButton blur={false} stagger={false} status={s} ...>Plain fade</StatefulButton>`,
      },
    ],
    accessibility: [
      "Renders a real `<button>` with the standard B6 focus ring and keyboard behaviour.",
      "Icons and labels transition via AnimatePresence; all motion is suppressed under `prefers-reduced-motion: reduce` via Motion's `useReducedMotion`, which also collapses the per-character stagger and the blur regardless of how `stagger` and `blur` are set.",
      '`status="loading"` sets `aria-busy`. When no `loadingText` is provided, `loadingLabel` is announced through a visually hidden span; when `loadingText` is visible the sr-only span is omitted so readers never hear "Loading Saving…". The same logic applies to success and error.',
      "The error shake is a horizontal displacement that carries no meaning — the X icon and `errorLabel` convey the failure.",
      "Held at rest while `disabled` or in any non-idle state, so a non-interactive control never invites a click.",
      "A `data-status` attribute is exposed for consumer styling hooks without hard-coding colours in the component.",
    ],
    responsive:
      "Sizing is fixed per `size` token; use `block` to fill narrow layouts and change `size` at a breakpoint via `className`.",
  },
  {
    slug: "card-base",
    category: "Layout",
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
        preview: "card-base/anatomy",
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
        preview: "card-base/interactive",
        code: `import Link from "next/link";

<CardBase asChild variant="elevated" interactive>
  <Link href="/components/button-base">
    <CardBaseTitle>Button Base</CardBaseTitle>
  </Link>
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
    category: "Display",
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
        preview: "badge/tones",
        code: `<Badge variant="primary">Stable</Badge>
<Badge>Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Deprecated</Badge>`,
      },
      {
        title: "With an icon",
        preview: "badge/icon",
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
    category: "Forms",
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
        preview: "input/labelled",
        code: `<label className="text-small font-medium" htmlFor="email">Email</label>
<Input id="email" type="email" placeholder="you@example.com" />`,
      },
      {
        title: "Search field",
        preview: "input/search",
        code: `import { Search } from "lucide-react";

<Input aria-label="Search" leftIcon={<Search />} placeholder="Search…" />`,
      },
      {
        title: "Invalid",
        preview: "input/invalid",
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
    category: "Layout",
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
      { title: "Horizontal", preview: "separator/horizontal", code: `<Separator />` },
      { title: "Captioned", preview: "separator/captioned", code: `<Separator label="or" />` },
      {
        title: "Vertical",
        preview: "separator/vertical",
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

/**
 * Components grouped for the sidebar, in `componentCategories` order.
 *
 * Categories with no components are dropped, so adding a category up front
 * costs nothing until the first component lands in it.
 */
export function getComponentsByCategory() {
  return componentCategories
    .map((category) => ({
      category,
      items: components.filter((component) => component.category === category),
    }))
    .filter((group) => group.items.length > 0);
}
