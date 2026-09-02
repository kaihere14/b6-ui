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
      "Icons are decorative. Pass an `aria-label` when a button has no text.",
      "Motion is limited to a 1px press offset, and is suppressed under `prefers-reduced-motion`.",
    ],
    responsive:
      'Sizing is fixed per `size` token; use `block` to fill narrow layouts and change `size` at a breakpoint via `className`. The content wrapper measures itself and animates its width, so a longer status label ("Save" → "Saving…") grows the button smoothly instead of snapping.',
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
          "`asChild` hands the styling and the motion to the child element, so a navigation target stays a real `<a>`, so middle-click and open-in-new-tab keep working.",
        code: `<MagneticButton asChild rightIcon={<ArrowRight />}>
  <Link href="/components">Browse components</Link>
</MagneticButton>`,
      },
      {
        title: "Opting out",
        preview: "magnetic-button/opt-out",
        description:
          "`magnetic={false}` parks the button at rest, which suits dense or scrolling layouts.",
        code: `<MagneticButton magnetic={false}>Magnet off</MagneticButton>`,
      },
    ],
    accessibility: [
      "Renders a real `<button>` with the standard B6 focus ring and keyboard behaviour.",
      "Magnetism is a hover affordance only: it never moves under keyboard focus, so focus order is stable.",
      "Clicking the button dips it 2px along y and eases it back. It hangs off `click`, which a button also fires for Enter and Space, so keyboard activation is confirmed the same way as a pointer one.",
      "Magnetism is suppressed entirely under `prefers-reduced-motion: reduce` (via Motion\'s `useReducedMotion`) and on coarse pointers, where it is an ordinary B6 button. The press dip is dropped under reduced motion as well; colour and focus still confirm the press.",
      "Held at rest while `disabled` or `loading`, so a non-interactive control never invites a click.",
      "Motion carries no meaning. Every state is already conveyed by colour, the spinner and `aria-busy`.",
    ],
    responsive:
      "The pull is measured from the live bounding box, so it stays correct at any width, and `maxTravel` keeps a full-width `block` button from swinging. On touch layouts the magnet is off, but the press dip stays, so a tap is still confirmed.",
  },
  {
    slug: "cross-button",
    category: "Buttons",
    isNew: true,
    title: "Cross Button",
    description:
      "A family of close or dismiss buttons with two interaction modes: a plain close, and a timed countdown that draws a border before enabling.",
    source: "registry/buttons/cross-button/cross-button.tsx",
    dependencies: [
      "motion",
      "class-variance-authority",
      "lucide-react",
    ],
    props: [
      {
        name: "mode",
        type: '"default" | "timed"',
        defaultValue: '"default"',
        description:
          "Interaction mode. `default` is a plain close button, `timed` disables the button until a border-drawing countdown completes.",
      },
      {
        name: "variant",
        type: '"ghost" | "outline" | "solid" | "soft" | "destructive"',
        defaultValue: '"ghost"',
        description: "Visual tone.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Control dimension.",
      },
      {
        name: "shape",
        type: '"square" | "circle"',
        defaultValue: '"square"',
        description: "Border radius: rounded corners or a full circle.",
      },
      {
        name: "duration",
        type: "number",
        defaultValue: "3000",
        description:
          "Timed mode only. Duration in milliseconds for the border to trace around the button.",
      },
      {
        name: "onReady",
        type: "() => void",
        description:
          "Timed mode only. Fired when the countdown completes and the button becomes pressable.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: '"Close"',
        description: "Screen-reader label for the button.",
      },
    ],
    examples: [
      {
        title: "Variants",
        preview: "cross-button/variants",
        description: "Five visual styles to suit any context: ghost, outline, solid, soft, and destructive.",
        code: `<CrossButton variant="ghost" />
<CrossButton variant="outline" />
<CrossButton variant="solid" />
<CrossButton variant="soft" />
<CrossButton variant="destructive" />`,
      },
      {
        title: "Sizes",
        preview: "cross-button/sizes",
        description: "Three sizes with proportionally scaled icons.",
        code: `<CrossButton size="sm" />
<CrossButton size="md" />
<CrossButton size="lg" />`,
      },
      {
        title: "Shapes",
        preview: "cross-button/shapes",
        description: "Rounded square or full circle.",
        code: `<CrossButton shape="square" variant="outline" />
<CrossButton shape="circle" variant="outline" />`,
      },
      {
        title: "Close ad after countdown",
        preview: "cross-button/ad",
        description:
          "A skippable ad. The close button sits inside the ad in `timed` mode, so the countdown border traces around it while the ad stays on screen. Once the border completes the button unlocks and the reader can dismiss the ad.",
        code: `function SkippableAd() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative">
      {/* ad content */}
      <CrossButton
        className="absolute top-2 right-2"
        mode="timed"
        variant="ghost"
        size="sm"
        duration={5000}
        label="Close ad"
        onClick={() => setDismissed(true)}
      />
    </div>
  );
}`,
      },
    ],
    accessibility: [
      "Renders as a native `<button>` element with full keyboard support.",
      "Always carries an `aria-label` (defaults to \"Close\").",
      "The X icon is `aria-hidden` and paired with a visually hidden label so screen readers announce the action.",
      "Timed mode sets `disabled` until the countdown completes, preventing premature interaction. Under `prefers-reduced-motion` the countdown completes instantly.",
      "All Motion animations honour `useReducedMotion()` and fall back to instant transitions.",
    ],
    responsive:
      "A fixed-size button determined by the `size` prop. Does not stretch to fill its container.",
  },
  {
    slug: "stateful-button",
    category: "Buttons",
    isNew: true,
    title: "Stateful Button",
    description:
      "A button that progresses through four visual states (idle, loading, success and error) with animated icon transitions and an error shake.",
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
      "The error shake is a horizontal displacement that carries no meaning. The X icon and `errorLabel` convey the failure.",
      "Held at rest while `disabled` or in any non-idle state, so a non-interactive control never invites a click.",
      "A `data-status` attribute is exposed for consumer styling hooks without hard-coding colours in the component.",
    ],
    responsive:
      "Sizing is fixed per `size` token; use `block` to fill narrow layouts and change `size` at a breakpoint via `className`.",
  },
  {
    slug: "depth-button",
    category: "Buttons",
    isNew: true,
    title: "Depth Button",
    description:
      "A button that sits on a hard, unblurred ledge and travels down into it: half-way on hover, flush with the page on press.",
    source: "registry/button/depth-button/depth-button.tsx",
    dependencies: ["class-variance-authority", "@radix-ui/react-slot", "lucide-react"],
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "destructive"',
        defaultValue: '"primary"',
        description:
          "Visual weight. Every variant is a solid surface, because the depth mechanic needs a face to press, so there is no ghost or link variant.",
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
          "Swap the leading icon for a spinner, block interaction and set `aria-busy`. The button holds its full ledge and stops travelling.",
      },
      {
        name: "loadingLabel",
        type: "string",
        defaultValue: '"Loading"',
        description: "Text announced to screen readers while loading.",
      },
      {
        name: "leftIcon / rightIcon",
        type: "React.ReactNode",
        description: "Icons either side of the label. The left one is hidden while loading.",
      },
      {
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description:
          "Render the child element (e.g. a `Link`) with the button's styling and the full press mechanic.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Native disabled state. Holds the button at rest on its full ledge.",
      },
    ],
    examples: [
      {
        title: "Variants",
        preview: "depth-button/variants",
        description:
          "Hover to sink the button halfway into its ledge; press to take it all the way down.",
        code: `<DepthButton>Get started</DepthButton>
<DepthButton variant="secondary">Learn more</DepthButton>
<DepthButton variant="outline">Docs</DepthButton>
<DepthButton variant="destructive">Delete</DepthButton>`,
      },
      {
        title: "Sizes",
        preview: "depth-button/sizes",
        description:
          "The ledge is a fixed 4px at every size, so a small button never looks like it is on stilts.",
        code: `<DepthButton size="sm">Small</DepthButton>
<DepthButton size="md">Medium</DepthButton>
<DepthButton size="lg">Large</DepthButton>
<DepthButton size="icon" aria-label="Download"><Download /></DepthButton>`,
      },
      {
        title: "Icons, loading and disabled",
        preview: "depth-button/states",
        description:
          "A button that cannot be pressed keeps its full ledge and never moves. The depth is an affordance, so a non-interactive control does not offer it.",
        code: `<DepthButton variant="outline" leftIcon={<Download />}>Install</DepthButton>
<DepthButton loading loadingLabel="Saving changes">Saving</DepthButton>
<DepthButton variant="secondary" disabled>Disabled</DepthButton>`,
      },
      {
        title: "As a link",
        preview: "depth-button/as-link",
        description:
          "`asChild` hands the styling and the press to the child, so a navigation target stays a real `<a>`.",
        code: `import Link from "next/link";

<DepthButton asChild rightIcon={<ArrowRight />}>
  <Link href="/components">Browse components</Link>
</DepthButton>`,
      },
    ],
    accessibility: [
      'Renders a real `<button>` with `type="button"` unless you pass a `type`.',
      "Focus is always visible through the shared `--color-ring` outline, offset clear of the ledge; it is never removed.",
      "The press is a CSS state, so Enter and Space activate the button exactly as a pointer does.",
      "`loading` sets `aria-busy` and announces `loadingLabel` through a visually hidden span. `aria-disabled` is set alongside the native `disabled`, so an `asChild` link is announced as unavailable too.",
      "Depth carries no meaning on its own. Colour, the spinner and `aria-busy` already convey every state. Under `prefers-reduced-motion: reduce` the transition is dropped and the travel is instant, so the press is still confirmed.",
      "Icons are decorative. Pass an `aria-label` when a button has no text.",
    ],
    responsive:
      "Sizing is fixed per `size` token; use `block` to fill narrow layouts and change `size` at a breakpoint via `className`. The ledge is a shadow, so it never adds to the layout box, and buttons in a row stay on their baseline whether pressed or not.",
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
      "`CardBase` is a plain `<div>`, so it adds no implicit semantics.",
      "Set `CardBaseTitle`'s `as` prop so headings never skip a level.",
      "An `interactive` card must contain a real link or button; do not attach `onClick` to the card alone.",
    ],
    responsive:
      "Cards fill their grid cell. Compose them inside a `grid` and change `padding` per breakpoint if needed.",
  },
  {
    slug: "activity-graph",
    category: "Graphs",
    isNew: true,
    title: "Activity Graph",
    description:
      "A configurable seven-day stacked-bar graph for any activity series, with derived totals and optional hatched fills.",
    source: "registry/graphs/activity-graph/activity-graph.tsx",
    dependencies: ["class-variance-authority", "motion"],
    props: [
      {
        name: "data",
        type: "BarData[]",
        required: true,
        description:
          "Array of seven bars to render left-to-right. Each bar can contain any numeric series keys (0-100 scale) plus an optional label.",
      },
      {
        name: "config",
        type: "Record<string, SegmentStyle>",
        required: true,
        description:
          "Series definitions keyed by the numeric fields in each bar, including label, color and optional pattern.",
      },
      {
        name: "stats",
        type: "StatItem[]",
        description:
          "Optional total overrides. When omitted, each total is calculated from the current bars.",
      },
      {
        name: "title",
        type: "string",
        defaultValue: '"Weekly Activity"',
        description: "Card header text.",
      },
      {
        name: "variant",
        type: '"default" | "compact" | "detailed"',
        defaultValue: '"default"',
        description:
          "Layout density. `compact` hides the header. All variants provide per-segment hover and keyboard details.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Controls the height of the chart area.",
      },
      {
        name: "showLegend",
        type: "boolean",
        defaultValue: "true",
        description: "Whether to render the colour legend.",
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: "true",
        description: "Whether to animate bars on mount.",
      },
      {
        name: "segmentStyles",
        type: "Partial<Record<string, Partial<SegmentStyle>>>",
        description: "Optional per-series style overrides merged with `config`.",
      },
    ],
    examples: [
      {
        title: "Single Series",
        preview: "activity-graph/single-series",
        description:
          "One value per day. With a single key in `config`, each bar is a plain column and the legend collapses to one total.",
        code: `const config = {
  design: { fill: "var(--color-primary)", pattern: "solid", label: "Design" },
};

<ActivityGraph data={data} config={config} title="Design Hours" />`,
      },
      {
        title: "Two Series",
        preview: "activity-graph/two-series",
        description:
          "Two values per day, stacked and normalised to each day's total. Pattern fills keep the pair distinguishable without relying on colour.",
        code: `const config = {
  design: { fill: "var(--color-primary)", pattern: "solid", label: "Design" },
  review: {
    fill: "var(--color-muted-foreground)",
    pattern: "hatched",
    label: "Review",
  },
};

<ActivityGraph data={data} config={config} title="Design vs Review" />`,
      },
      {
        title: "Sizes",
        preview: "activity-graph/sizes",
        description: "The `size` prop controls the height of the chart area: sm, md, lg.",
        code: `<ActivityGraph data={data} config={config} size="sm" title="Small" />
<ActivityGraph data={data} config={config} size="lg" title="Large" />`,
      },
    ],
    accessibility: [
      "Each bar segment is keyboard focusable and has an accessible label containing its series, optional day, and raw value.",
      "Hatched patterns use a CSS pattern background rather than colour alone, providing a secondary visual cue beyond colour for distinguishing segment types.",
      "Colour tokens resolve from the B6 design system and respect light/dark mode.",
    ],
    responsive:
      'The chart fills its container width. Use `size` to control height, and `variant="compact"` for tighter spaces. The bar count adapts to the data provided.',
  },
  {
    slug: "dot-matrix-graph",
    category: "Graphs",
    isNew: true,
    title: "Dot Matrix Graph",
    description:
      "A column graph drawn in dots instead of bars: one dot per unit, stacked from the baseline up, with two periods comparable inside one plot.",
    source: "registry/graphs/dot-matrix-graph/dot-matrix-graph.tsx",
    dependencies: ["class-variance-authority", "motion"],
    props: [
      {
        name: "data",
        type: "DotColumnData[] | Record<string, DotColumnData[]>",
        required: true,
        description:
          "Columns to plot left-to-right, either as one list or keyed by range id (`{ daily: [...], weekly: [...] }`). Each column carries a numeric `value`, an optional tick `label`, and an optional `series` key into `config`.",
      },
      {
        name: "config",
        type: "Record<string, SeriesStyle>",
        required: true,
        description:
          "Series definitions keyed by the `series` field on a column: `fill`, `label`, and an optional `value` caption for the footer. A column with no `series` uses the first entry.",
      },
      {
        name: "title",
        type: "string",
        defaultValue: '"Distribution"',
        description: "Card header text, rendered in the caption step and uppercased.",
      },
      {
        name: "headline",
        type: "React.ReactNode",
        description: 'Headline figure under the title, e.g. `"+326%"`.',
      },
      {
        name: "dotValue",
        type: "number",
        description:
          "Units one dot stands for. When omitted, it is derived from the largest column so the tallest stack is exactly `maxDots` tall.",
      },
      {
        name: "maxDots",
        type: "number",
        defaultValue: "14",
        description:
          "Tallest a column may get, in dots. It divides the plot height into cells and, without an explicit `dotValue`, sets the scale, so the tallest column of the active range is drawn at exactly this many dots.",
      },
      {
        name: "showRanges",
        type: "boolean",
        defaultValue: "true",
        description:
          "Show the range toggle in the header. Hidden, the graph stays on `defaultRange`.",
      },
      {
        name: "ranges",
        type: "RangeOption[]",
        defaultValue: "daily / weekly / monthly",
        description:
          "Toggle entries, each `{ id, label }`. The id is what `data` is keyed by and what `onRangeChange` reports.",
      },
      {
        name: "defaultRange",
        type: "string",
        defaultValue: '"daily"',
        description: "Range selected on mount, and the range used when the toggle is hidden.",
      },
      {
        name: "range",
        type: "string",
        description:
          "Controlled range id. Pass `onRangeChange` alongside it and own the switch in the parent.",
      },
      {
        name: "onRangeChange",
        type: "(range: string) => void",
        description: "Called with the new range id whenever a toggle is pressed.",
      },
      {
        name: "showBaseline",
        type: "boolean",
        defaultValue: "true",
        description:
          "Draw a muted dot on the baseline of every column, so an empty column still reads as a position on the axis.",
      },
      {
        name: "showTooltip",
        type: "boolean",
        defaultValue: "true",
        description:
          "Show a tooltip above the hovered or focused column with its series, tick label and formatted value.",
      },
      {
        name: "formatValue",
        type: "(value: number) => string",
        description:
          "Formats a value for the footer totals and the accessible labels, e.g. as currency.",
      },
      {
        name: "variant",
        type: '"default" | "compact"',
        defaultValue: '"default"',
        description:
          "Layout density. `compact` tightens the padding and drops the header, so the range toggle goes with it.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Controls the height of the plot (5 / 7 / 9rem) and, with it, the dot cell ceiling, which is the plot height divided by `maxDots`.",
      },
      {
        name: "showLegend",
        type: "boolean",
        defaultValue: "true",
        description: "Whether to render the footer series captions.",
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: "true",
        description: "Whether to stagger the dots in on mount.",
      },
      {
        name: "seriesStyles",
        type: "Partial<Record<string, Partial<SeriesStyle>>>",
        description: "Optional per-series style overrides merged with `config`.",
      },
    ],
    examples: [
      {
        title: "Ranges",
        preview: "dot-matrix-graph/ranges",
        description:
          "Key `data` by range id and the header toggle switches the plot on its own. `defaultRange` picks the range on mount; `showRanges={false}` hides the toggle and pins the graph to it. Pass `range` + `onRangeChange` instead to own the switch in the parent.",
        code: `const data = {
  daily: dailyColumns,
  weekly: weeklyColumns,
  monthly: monthlyColumns,
};

<DotMatrixGraph data={data} config={config} defaultRange="monthly" />

// toggle hidden, so the graph stays on the default range
<DotMatrixGraph data={data} config={config} showRanges={false} defaultRange="weekly" />`,
      },
      {
        title: "Sizes",
        preview: "dot-matrix-graph/sizes",
        description: "The `size` prop controls dot diameter and spacing: sm, md, lg.",
        code: `<DotMatrixGraph data={data} config={config} size="sm" title="Small" />
<DotMatrixGraph data={data} config={config} size="lg" title="Large" />`,
      },
    ],
    accessibility: [
      'Each column is one focus stop with `role="img"` and a label carrying its series, tick label and formatted value. Dots are a drawing, not hundreds of tab stops.',
      "Focus is visible through `--color-ring`; hovering or focusing a column dims the rest rather than changing hue alone.",
      "The tooltip is `aria-hidden` and duplicates the column's own accessible label, so a screen reader hears the value once. Keyboard focus surfaces the same tooltip a pointer does.",
      "Dot count encodes the value, so magnitude survives when colour does not: two series stay distinguishable by position and height as well as fill.",
      "Range toggles are real `<button>`s in a labelled group, each carrying `aria-pressed`, so the selected range is announced and reachable by keyboard.",
      "Colour tokens resolve from the B6 design system and respect light/dark mode.",
    ],
    responsive:
      "The plot owns its height, so the card is the same size on every range, whether that is six monthly columns or thirty-two daily ones. Dots sit in square cells capped by both the column track and the plot height divided by `maxDots`, so a wide card grows them, a narrow one shrinks them, and the sizes stay in order at every width.",
  },
  {
    slug: "thinking-orb",
    category: "Display",
    isNew: true,
    title: "Thinking Orb",
    description:
      "A status pill that pairs an animated orb with a label, for showing what an agent is doing: thinking, listening, searching, working, solving.",
    source: "registry/orb/thinking-orb/thinking-orb.tsx",
    dependencies: ["motion", "class-variance-authority"],
    props: [
      {
        name: "preset",
        type: '"idle" | "thinking" | "listening" | "working" | "searching" | "solving"',
        defaultValue: '"thinking"',
        description:
          "Named state. Sets the orb motion and the default label. Idle, listening, searching and solving are one particle sphere moving differently (slow and dim, soft radar rings, a scanning band shooting outward, particles pulled to the centre and back). Thinking is a scanning ring of meridian lines; working is a stationary tall dot matrix with a soft wave of brightness bouncing down it and back up.",
      },
      {
        name: "kind",
        type: '"pulse" | "dots" | "wave" | "cluster" | "spark" | "globe"',
        description:
          "Overrides just the motion chosen by `preset`. Use it to keep a preset's label but swap the movement, or on its own with no preset.",
      },
      {
        name: "label",
        type: "string",
        description: "Replaces the preset's default label.",
      },
      {
        name: "showLabel",
        type: "boolean",
        defaultValue: "true",
        description:
          "Render the label next to the orb. When false, the label text still becomes the pill's `aria-label`.",
      },
      {
        name: "active",
        type: "boolean",
        defaultValue: "true",
        description:
          "Run the animation. Set false to freeze the orb on a resting frame while keeping the pill on screen.",
      },
      {
        name: "speed",
        type: "number",
        defaultValue: "1",
        description: "Animation timing multiplier. 2 runs twice as fast, 0.5 half speed.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Pill height, padding, label type step, and orb diameter.",
      },
      {
        name: "tone",
        type: '"surface" | "muted" | "ghost"',
        defaultValue: '"surface"',
        description:
          "Container styling: a raised card, a flat muted fill, or no background at all.",
      },
    ],
    examples: [
      {
        title: "Sizes",
        preview: "thinking-orb/sizes",
        description: "Three sizes. The orb scales with the pill.",
        code: `<ThinkingOrb size="sm" preset="searching" />
<ThinkingOrb size="md" preset="searching" />
<ThinkingOrb size="lg" preset="searching" />`,
      },
      {
        title: "Tones",
        preview: "thinking-orb/tones",
        description: "A raised card, a flat muted fill, or no container.",
        code: `<ThinkingOrb tone="surface" preset="working" />
<ThinkingOrb tone="muted" preset="working" />
<ThinkingOrb tone="ghost" preset="working" />`,
      },
      {
        title: "Custom label, motion and speed",
        preview: "thinking-orb/custom",
        description:
          "`label` overrides the preset text, `kind` overrides just the motion, `speed` scales the timing, and `active={false}` freezes the orb.",
        code: `<ThinkingOrb preset="solving" label="Compiling project" speed={1.6} />
<ThinkingOrb kind="wave" label="Streaming response" tone="muted" />
<ThinkingOrb preset="idle" active={false} label="Paused" tone="ghost" />`,
      },
    ],
    accessibility: [
      "The pill is a live region: `role=\"status\"` with `aria-live=\"polite\"`, so a state change is announced without stealing focus.",
      "The orb is a decorative `<canvas>` marked `aria-hidden`. The label carries the meaning.",
      "With `showLabel={false}` the label text moves to the pill's `aria-label` so the state is still announced.",
      "The particle loop runs on Motion's frame loop and honours `useReducedMotion()`: it paints one still frame and stops, the same frame `active={false}` shows.",
    ],
    responsive:
      "The pill shrink-wraps its content and never wraps mid-label; the label truncates if a container forces it narrower. All sizing comes from the `size` variant, so it renders the same at any viewport width.",
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
      "A badge is a label, not a control, so it is not focusable and has no role.",
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
    slug: "writing-text",
    category: "Text",
    title: "Writing Text",
    description:
      "Text that writes itself in one character at a time behind a blinking caret, at a speed you set.",
    isNew: true,
    source: "registry/text/writing-text/writing-text.tsx",
    dependencies: ["class-variance-authority", "motion"],
    props: [
      {
        name: "text",
        type: "string",
        required: true,
        description: "The string to write out.",
      },
      {
        name: "variant",
        type: '"default" | "muted" | "primary"',
        defaultValue: '"default"',
        description: "Colour of the written text and the caret.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Type step, from body copy up to a display line.",
      },
      {
        name: "speed",
        type: "number",
        defaultValue: "24",
        description: "Characters written per second.",
      },
      {
        name: "startDelay",
        type: "number",
        defaultValue: "0",
        description: "Seconds to wait before the first character is written.",
      },
      {
        name: "cursor",
        type: "boolean",
        defaultValue: "true",
        description: "Show the blinking caret while the text is being written.",
      },
      {
        name: "keepCursor",
        type: "boolean",
        defaultValue: "false",
        description: "Keep the caret after the last character has been written.",
      },
      {
        name: "onWritten",
        type: "() => void",
        description: "Fires once the last character is written. Use it to start the next line.",
      },
    ],
    examples: [
      {
        title: "Default",
        preview: "writing-text/default",
        code: `<WritingText text="Writing itself out, one character at a time." />`,
      },
      {
        title: "Speed",
        description: "`speed` is characters per second, so a longer string takes longer.",
        preview: "writing-text/speed",
        code: `<WritingText text="Twelve characters a second." size="sm" speed={12} />
<WritingText text="Forty characters a second." size="sm" speed={40} variant="primary" />`,
      },
      {
        title: "Sequencing lines",
        description:
          "`onWritten` fires on the last character, which is how one line hands over to the next.",
        preview: "writing-text/sequence",
        code: `const [firstDone, setFirstDone] = React.useState(false);

<WritingText text="One line lands." onWritten={() => setFirstDone(true)} />
{firstDone && <WritingText text="Then the next one starts." size="sm" variant="muted" keepCursor />}`,
      },
    ],
    accessibility: [
      "The complete string is in the accessibility tree from the first render; only the visible characters animate, and they are `aria-hidden`.",
      "Under `prefers-reduced-motion` the text renders complete immediately and the caret stops blinking.",
      "The component renders a `span` and carries no role, so it inherits the semantics of whatever heading or paragraph wraps it.",
    ],
    responsive:
      "The text wraps with its container and reserves no width of its own, so it can sit inline inside a sentence at any breakpoint.",
  },
  {
    slug: "handwritten-text",
    category: "Text",
    title: "Handwritten Text",
    description:
      "A line written by a pen: connected script drawn stroke by stroke, in the order a hand would draw it, in either of two hands.",
    isNew: true,
    source: "registry/text/handwritten-text/handwritten-text.tsx",
    dependencies: ["class-variance-authority", "motion"],
    props: [
      {
        name: "text",
        type: "string",
        required: true,
        description:
          "The line to write. Latin letters, digits and common punctuation, from the single-line script bundled with the component.",
      },
      {
        name: "hand",
        type: '"script" | "brush"',
        defaultValue: '"script"',
        description:
          "Which alphabet writes the line. `script` is a fine connected script; `brush` is a faster, more slanted brush hand.",
      },
      {
        name: "variant",
        type: '"default" | "muted" | "primary"',
        defaultValue: '"default"',
        description: "Colour of the ink, taken from the semantic colour tokens.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Type step. The glyphs are drawn in em, so the whole hand scales with it.",
      },
      {
        name: "speed",
        type: "number",
        defaultValue: "5",
        description:
          "Characters written per second. Stroke timing is shared out by length, so the pen keeps one pace across the line.",
      },
      {
        name: "startDelay",
        type: "number",
        defaultValue: "0",
        description: "Seconds to wait before the pen touches down.",
      },
      {
        name: "nib",
        type: "boolean",
        defaultValue: "false",
        description: "Show the nib riding the head of the stroke, lifts included.",
      },
      {
        name: "onWritten",
        type: "() => void",
        description: "Fires once the last stroke is finished. Use it to start the next line.",
      },
    ],
    examples: [
      {
        title: "Default",
        preview: "handwritten-text/default",
        code: `<HandwrittenText text="Every letter is one stroke." />`,
      },
      {
        title: "Two hands",
        description:
          "Both alphabets are single-line scripts, drawn as centrelines rather than outlines. They differ in the pen, not in the animation.",
        preview: "handwritten-text/hands",
        code: `<HandwrittenText text="A fine connected script." size="sm" />
<HandwrittenText text="A faster brush hand." size="sm" hand="brush" variant="primary" />`,
      },
      {
        title: "Speed",
        description:
          "`speed` is characters per second. Long strokes still take longer than short ones, so the hand stays even.",
        preview: "handwritten-text/speed",
        code: `<HandwrittenText text="A slow, careful hand." size="sm" speed={3} />
<HandwrittenText text="A quick one." size="sm" speed={9} variant="primary" />`,
      },
      {
        title: "The nib",
        description:
          "The pen travels between strokes as well as along them, which is where the pauses in the line come from.",
        preview: "handwritten-text/nib",
        code: `<HandwrittenText text="Follow the nib." nib speed={3} />`,
      },
      {
        title: "Sequencing lines",
        description:
          "`onWritten` fires on the last stroke, which is how one line hands over to the next.",
        preview: "handwritten-text/sequence",
        code: `const [firstDone, setFirstDone] = React.useState(false);

<HandwrittenText text="One line lands." onWritten={() => setFirstDone(true)} />
{firstDone && <HandwrittenText text="Then the next one starts." size="sm" variant="muted" />}`,
      },
    ],
    accessibility: [
      'The svg carries `role="img"` and an `aria-label` holding the whole line, so the text is read out complete from the first render while the strokes are still arriving.',
      "Under `prefers-reduced-motion` the line is drawn in full immediately and the nib never appears.",
      "Ink is `currentColor`, so the writing inherits the colour of the surface it sits on and keeps its contrast in both themes.",
      "A character the alphabet does not carry advances by a space rather than dropping out of the line, and the label still reads it.",
      "Letterforms come from EMS Allure and Mistral SingleLine (both SIL Open Font License 1.1), scripts drawn as centrelines rather than outlines, so the paths are the pen's own route through each letter.",
    ],
    responsive:
      "The line is one line: it never wraps, and it scales with the type step. Width is measured in em and capped at the container, so a long line shrinks rather than overflowing.",
  },
  {
    slug: "separator",
    category: "Layout",
    title: "Separator",
    description: "A one-pixel rule, horizontal or vertical, optionally captioned.",
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
