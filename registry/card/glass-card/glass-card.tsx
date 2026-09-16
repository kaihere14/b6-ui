"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI: Glass Card
 *
 * A poster-forward card for a carousel of films, shows or tracks: a wide
 * media well carrying a play affordance and a callout, a title and a meta
 * line, and an optional detail panel that opens on the card itself.
 * `GlassCardCarousel` fans several of them in depth around one centred card
 * and brings a clicked neighbour to the centre.
 *
 * The surface reads `glyph`, not `card`. `glyph` is the one B6 token pair that
 * never follows the site theme (see its definition in `globals.css`), because
 * it exists for a face that is a physical object rather than a themed panel: a
 * pixel display, and here, a pane of dark glass sitting over a poster. A card
 * built from `card`/`background` would flip to a white panel on the light
 * theme, which a glass overlay never does regardless of what page it sits on.
 *
 * `intro` plays a one-shot cinematic entrance: the card tumbles in from a
 * slight scale, offset and 3D pitch, its header controls and title strip
 * stagger in after it, and once settled it carries a very subtle idle float
 * and an occasional light sweep across the glass, the way a broadcast graphic
 * sits and breathes on screen rather than standing dead still.
 *
 * Every transition here is a spring with an intentional overshoot, so a card
 * that settles reads as an object with weight rather than a value that was
 * merely interpolated. `useReducedMotion` drops every spring to an instant
 * cut, per the state each transition ends on.
 */
const TYPE = {
  small: "text-(length:--text-small) leading-(--text-small--line-height)",
  h3: "text-(length:--text-h3) leading-(--text-h3--line-height) tracking-(--text-h3--letter-spacing) font-(weight:--text-h3--font-weight)",
} as const;

/**
 * Every element in this file that can be `motion.*`'d needs this: plain React
 * event props and Motion's own conflict on `onDrag` (a gesture callback in
 * Motion's world, a native drag-and-drop event in React's), so a component
 * that might render a `motion` element omits the native one rather than
 * fighting the type error at every call site.
 */
type MotionSafeProps<Tag extends keyof React.JSX.IntrinsicElements> = Omit<
  React.ComponentPropsWithoutRef<Tag>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

/**
 * The one spring every interaction bounce in this file shares. Framer's
 * `duration` + `bounce` parametrisation is used instead of stiffness/damping/mass
 * because those two numbers map directly onto what was asked for: `duration`
 * caps how long the settle takes regardless of distance, and `bounce` is the
 * overshoot, so "faster" and "bouncier" are each a single number to turn up.
 */
const BOUNCE: Transition = { type: "spring", duration: 0.4, bounce: 0.4 };
const INSTANT: Transition = { duration: 0 };

/**
 * The one-shot entrance a card plays when `intro` is set: slower and far less
 * bouncy than `BOUNCE`, because a card arriving on screen for the first time
 * reads as premium when it settles once, not when it wobbles like a control
 * being pressed.
 */
const ENTER: Transition = { type: "spring", duration: 0.9, bounce: 0.2 };
/** The quicker settle each staggered element inside an entering card uses. */
const ENTER_ITEM: Transition = { type: "spring", duration: 0.55, bounce: 0.15 };
/** Base delay before the first staggered child starts, timed to land inside the card's own entrance rather than after it. */
const INTRO_STAGGER_BASE = 0.2;

/** Stable across renders on purpose: a new array literal every render would restart the loop instead of continuing it. */
const FLOAT_Y = [0, -4, 0, 4, 0];
const FLOAT: Transition = { duration: 6, delay: 0.6, repeat: Infinity, ease: "easeInOut" };

const SHEEN_X = ["-120%", "320%"];
const SHEEN: Transition = {
  duration: 1.8,
  delay: 1,
  repeat: Infinity,
  repeatDelay: 4,
  ease: "easeInOut",
};

/** Whether the card carrying this context is showing its `GlassCardDetails`, and how to change that. */
const GlassCardExpandedContext = React.createContext<{
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}>({ expanded: false, setExpanded: () => {} });

/**
 * Null when no ancestor `GlassCard` is playing its `intro`. A number when one
 * is: the delay, in seconds, a staggered child adds its own offset to, so the
 * header controls, then the title, then the meta line land in sequence during
 * the card's own settle instead of all at once.
 */
const GlassCardIntroContext = React.createContext<number | null>(null);

/* -------------------------------------------------------------------------- */
/*                                   Surface                                  */
/* -------------------------------------------------------------------------- */

const glassCardVariants = cva(
  [
    "relative isolate flex flex-col overflow-hidden rounded-xl",
    "border border-glyph-foreground/10 bg-glyph/75 text-glyph-foreground shadow-b6-lg backdrop-blur-xl",
  ],
  {
    variants: {
      padding: {
        sm: "gap-3 p-3",
        md: "gap-4 p-4",
        lg: "gap-5 p-5",
      },
      /**
       * A static rotation, not a hover or drag effect: the resting tilt a card
       * carries when it sits off-centre in a carousel. `none` is the default
       * because the card being looked at head-on is not tilted; its neighbours
       * would be. `GlassCardCarousel` drives its own rotation and ignores this.
       */
      tilt: {
        none: "",
        left: "-rotate-2",
        right: "rotate-2",
      },
    },
    defaultVariants: {
      padding: "md",
      tilt: "none",
    },
  },
);

export interface GlassCardProps
  extends MotionSafeProps<"div">, VariantProps<typeof glassCardVariants> {
  /** Make the card itself a toggle for `GlassCardDetails`. Off by default: a plain card stays a plain container. */
  expandable?: boolean;
  /** Whether `GlassCardDetails` is open. Omit to let the card manage this itself. */
  expanded?: boolean;
  /** Initial open state for an uncontrolled card. */
  defaultExpanded?: boolean;
  /** Fired whenever `expanded` would change, controlled or not. */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Extra classes applied only while `expanded` is true, merged in after the
   * card's own variant classes. Grows a card into a wider rectangle instead
   * of a tall column when it opens: `expandedClassName="w-4/5"` widens it, a
   * plain `width` CSS transition (already on the card) settles it there.
   */
  expandedClassName?: string;
  /**
   * Play a one-shot cinematic entrance on mount: the card scales up, slides
   * up and untilts out of a slight 3D pitch, its header controls, title and
   * meta line stagger in after it, and once settled it carries a very subtle
   * idle float and an occasional light sweep across the glass. Off by
   * default: a plain card never moves unless it is being interacted with.
   */
  intro?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  {
    className,
    padding,
    tilt,
    expandable = false,
    expanded: expandedProp,
    defaultExpanded = false,
    onExpandedChange,
    expandedClassName,
    intro = false,
    onClick,
    onKeyDown,
    children,
    ...props
  },
  ref,
) {
  const reduced = useReducedMotion() ?? false;
  const isControlled = expandedProp !== undefined;
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded);
  const expanded = isControlled ? expandedProp : uncontrolledExpanded;

  // `initial` only ever runs once, at mount, so this only has to distinguish
  // the first settle (the slower, near-still `ENTER` spring) from every
  // interaction bounce after it (the quick, springy `BOUNCE`) without a timer.
  const [hasEntered, setHasEntered] = React.useState(!intro || reduced);
  const floating = intro && hasEntered && !reduced;

  const setExpanded = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledExpanded(value);
      onExpandedChange?.(value);
    },
    [isControlled, onExpandedChange],
  );

  return (
    <GlassCardExpandedContext.Provider value={{ expanded, setExpanded }}>
      <GlassCardIntroContext.Provider value={intro && !reduced ? INTRO_STAGGER_BASE : null}>
        <motion.div
          ref={ref}
          data-slot="glass-card"
          data-expanded={expanded ? "true" : undefined}
          role={expandable ? "button" : undefined}
          tabIndex={expandable ? 0 : undefined}
          aria-expanded={expandable ? expanded : undefined}
          style={{ transformPerspective: 1000 }}
          initial={intro && !reduced ? { opacity: 0, y: 32, scale: 0.9, rotateX: 14 } : false}
          animate={{
            opacity: 1,
            y: floating ? FLOAT_Y : 0,
            scale: expanded ? 1.015 : 1,
            rotateX: 0,
          }}
          transition={
            reduced
              ? INSTANT
              : { default: hasEntered ? BOUNCE : ENTER, y: floating ? FLOAT : BOUNCE }
          }
          onAnimationComplete={() => setHasEntered(true)}
          className={cn(
            glassCardVariants({ padding, tilt }),
            expandedClassName && "transition-[width] duration-500 ease-b6-out",
            expandable &&
              "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            className,
            // Comes after `className` on purpose: while expanded, the card's
            // width should grow into `expandedClassName` even when the
            // consumer's own className (the resting width, e.g. `w-56`)
            // would otherwise win the merge.
            expanded && expandedClassName,
          )}
          onClick={(event) => {
            onClick?.(event);
            if (expandable) setExpanded(!expanded);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!expandable || (event.key !== "Enter" && event.key !== " ")) return;
            event.preventDefault();
            setExpanded(!expanded);
          }}
          {...props}
        >
          {children}
          {floating ? (
            <motion.span
              aria-hidden="true"
              data-slot="glass-card-sheen"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-glyph-foreground/15 to-transparent"
              animate={{ x: SHEEN_X }}
              transition={SHEEN}
            />
          ) : null}
        </motion.div>
      </GlassCardIntroContext.Provider>
    </GlassCardExpandedContext.Provider>
  );
});

/* -------------------------------------------------------------------------- */
/*                                 Media well                                 */
/* -------------------------------------------------------------------------- */

const glassCardMediaVariants = cva(
  "relative isolate overflow-hidden rounded-xl border border-glyph-foreground/10 bg-glyph-foreground/5",
  {
    variants: {
      aspect: {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-3/4",
        fill: "min-h-0 flex-1",
      },
    },
    defaultVariants: {
      aspect: "square",
    },
  },
);

export interface GlassCardMediaProps
  extends MotionSafeProps<"div">, VariantProps<typeof glassCardMediaVariants> {}

/**
 * The poster well. Left empty here on purpose: this is the placeholder a
 * poster image or a player drops into later, not the picture itself, so it
 * renders no image and no fallback graphic of its own. `GlassCardPlayButton`
 * and `GlassCardMediaAction` are positioned to sit on top of it, so they are
 * meant as its children.
 *
 * Renders as `motion.div` unconditionally, but only actually animates when
 * the nearest `GlassCard` is playing its `intro`: otherwise no `initial` is
 * set and it paints exactly like the plain `<div>` it used to be.
 */
export const GlassCardMedia = React.forwardRef<HTMLDivElement, GlassCardMediaProps>(
  function GlassCardMedia({ className, aspect, ...props }, ref) {
    const introDelay = React.useContext(GlassCardIntroContext);
    const animated = introDelay !== null;
    return (
      <motion.div
        ref={ref}
        data-slot="glass-card-media"
        initial={animated ? { opacity: 0, y: 14, scale: 0.96 } : false}
        animate={animated ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={animated ? { ...ENTER_ITEM, delay: introDelay } : undefined}
        className={cn(glassCardMediaVariants({ aspect }), className)}
        {...props}
      />
    );
  },
);

/**
 * The round control centred on the poster. Icon-only, so it needs an
 * `aria-label`; this shell wires no navigation of its own. It swallows its
 * own click, so pressing it never also toggles the card's details.
 */
export const GlassCardPlayButton = React.forwardRef<
  HTMLButtonElement,
  MotionSafeProps<"button">
>(function GlassCardPlayButton({ className, type = "button", onClick, ...props }, ref) {
  const introDelay = React.useContext(GlassCardIntroContext);
  const animated = introDelay !== null;
  return (
    <motion.button
      ref={ref}
      type={type}
      data-slot="glass-card-play-button"
      initial={animated ? { opacity: 0, y: -8 } : false}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={animated ? { ...ENTER_ITEM, delay: introDelay + 0.35 } : undefined}
      onClick={(event) => {
        onClick?.(event);
        event.stopPropagation();
      }}
      className={cn(
        "absolute top-1/2 left-1/2 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
        "border border-glyph-foreground/25 bg-glyph-foreground/15 text-glyph-foreground backdrop-blur-md",
        "transition-colors duration-200 ease-b6 hover:bg-glyph-foreground/25 active:bg-glyph-foreground/30",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    />
  );
});

/**
 * The pill callout low on the poster, such as "Watch Trailer" or "Preview".
 * A real `<button>` carrying its own icon and label as children, and, like
 * `GlassCardPlayButton`, swallowing its own click.
 */
export const GlassCardMediaAction = React.forwardRef<
  HTMLButtonElement,
  MotionSafeProps<"button">
>(function GlassCardMediaAction({ className, type = "button", onClick, ...props }, ref) {
  const introDelay = React.useContext(GlassCardIntroContext);
  const animated = introDelay !== null;
  return (
    <motion.button
      ref={ref}
      type={type}
      data-slot="glass-card-media-action"
      initial={animated ? { opacity: 0, y: 10 } : false}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={animated ? { ...ENTER_ITEM, delay: introDelay + 0.42 } : undefined}
      onClick={(event) => {
        onClick?.(event);
        event.stopPropagation();
      }}
      className={cn(
        TYPE.small,
        "absolute inset-x-0 bottom-4 mx-auto flex w-fit items-center gap-1.5 rounded-full",
        "border border-glyph-foreground/20 bg-glyph-foreground/10 px-4 py-2 font-medium text-glyph-foreground backdrop-blur-md",
        "transition-colors duration-200 ease-b6 hover:bg-glyph-foreground/20 active:bg-glyph-foreground/25",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/*                                Title strip                                 */
/* -------------------------------------------------------------------------- */

export const GlassCardInfo = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function GlassCardInfo({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="glass-card-info"
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
});

export interface GlassCardTitleProps extends MotionSafeProps<"h3"> {
  /** Heading level to render. Pick the one that fits the page outline. */
  as?: "h2" | "h3" | "h4";
}

export const GlassCardTitle = React.forwardRef<HTMLHeadingElement, GlassCardTitleProps>(
  function GlassCardTitle({ className, as: Comp = "h3", ...props }, ref) {
    const introDelay = React.useContext(GlassCardIntroContext);
    const animated = introDelay !== null;
    // `motion` only ships fixed names (`motion.h3`, …); reading one dynamically
    // by the resolved tag is what lets `as` stay a plain string prop.
    const MotionHeading = motion[Comp];
    return (
      <MotionHeading
        ref={ref}
        data-slot="glass-card-title"
        initial={animated ? { opacity: 0, y: 10 } : false}
        animate={animated ? { opacity: 1, y: 0 } : undefined}
        transition={animated ? { ...ENTER_ITEM, delay: introDelay + 0.5 } : undefined}
        className={cn(TYPE.h3, "truncate text-glyph-foreground", className)}
        {...props}
      />
    );
  },
);

/** The line under the title: year, genre, runtime, whatever the card wants to list. */
export const GlassCardMeta = React.forwardRef<HTMLParagraphElement, MotionSafeProps<"p">>(
  function GlassCardMeta({ className, ...props }, ref) {
    const introDelay = React.useContext(GlassCardIntroContext);
    const animated = introDelay !== null;
    return (
      <motion.p
        ref={ref}
        data-slot="glass-card-meta"
        initial={animated ? { opacity: 0, y: 10 } : false}
        animate={animated ? { opacity: 1, y: 0 } : undefined}
        transition={animated ? { ...ENTER_ITEM, delay: introDelay + 0.58 } : undefined}
        className={cn(TYPE.small, "truncate text-glyph-foreground/60", className)}
        {...props}
      />
    );
  },
);

/**
 * A rating, inline inside `GlassCardMeta`: `<GlassCardRating><Star .../>8.8</GlassCardRating>`.
 * It renders no icon of its own, so any mark (a star, a thumbs-up) can carry the score.
 */
export const GlassCardRating = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(function GlassCardRating({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      data-slot="glass-card-rating"
      className={cn(
        "inline-flex items-center gap-1 text-glyph-foreground/80",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
});

/**
 * The panel a `GlassCard` reveals once `expanded`: a synopsis, a cast list,
 * whatever the poster and the meta line left no room for. It opens sideways,
 * not downward: `width` animates from `0` to full, not `height`, so the box
 * unfolds into a wide, short rectangle rather than growing into a tall
 * column. `overflow-hidden` plus `self-start` (so the flex column it sits in
 * does not stretch it to full width before the animation starts) is what
 * makes a `width` reveal work at all. Its own layout is a single row rather
 * than a stack, so content only adds width, keeping the shape landscape at
 * every point of the animation, not just at rest. It mounts and unmounts with
 * `AnimatePresence` rather than toggling visibility, so nothing inside it sits
 * in the tab order while closed.
 */
export const GlassCardDetails = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function GlassCardDetails({ className, children, ...props }, ref) {
  const { expanded } = React.useContext(GlassCardExpandedContext);
  const reduced = useReducedMotion() ?? false;

  return (
    <AnimatePresence initial={false}>
      {expanded ? (
        <motion.div
          key="details"
          data-slot="glass-card-details"
          initial={reduced ? false : { width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          exit={reduced ? undefined : { width: 0, opacity: 0 }}
          transition={reduced ? INSTANT : BOUNCE}
          className="mt-3 self-start overflow-hidden"
        >
          <div
            ref={ref}
            className={cn(
              TYPE.small,
              "flex w-full items-center justify-between gap-3 rounded-lg border border-glyph-foreground/10 bg-glyph-foreground/5 p-3 text-glyph-foreground/70",
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
});

/**
 * The pill that closes `GlassCardDetails`, typically placed inside it. Reads
 * the nearest `GlassCard`'s expanded state directly, so it needs no props of
 * its own to know what to close.
 */
export const GlassCardClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function GlassCardClose(
  { className, type = "button", children = "Close", onClick, ...props },
  ref,
) {
  const { setExpanded } = React.useContext(GlassCardExpandedContext);
  return (
    <button
      ref={ref}
      type={type}
      data-slot="glass-card-close"
      onClick={(event) => {
        onClick?.(event);
        event.stopPropagation();
        setExpanded(false);
      }}
      className={cn(
        TYPE.small,
        "shrink-0 rounded-full border border-glyph-foreground/15 bg-glyph-foreground/10 px-3.5 py-1.5 font-medium text-glyph-foreground",
        "transition-colors duration-200 ease-b6 hover:bg-glyph-foreground/15 active:bg-glyph-foreground/20",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

/* -------------------------------------------------------------------------- */
/*                                  Carousel                                  */
/* -------------------------------------------------------------------------- */

export interface GlassCardCarouselProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> {
  /** Cards, left to right. Each is expected to be a `GlassCard` element. */
  children: React.ReactNode;
  /** Index of the centred, focused card. Controlled: pair with `onActiveChange`. */
  active?: number;
  /** Initial centred index for an uncontrolled carousel. Defaults to the middle child. */
  defaultActive?: number;
  /** Fired whenever the centred index would change, controlled or not, including a click on a neighbour. */
  onActiveChange?: (index: number) => void;
  /** Neighbours rendered on each side before fading out of the layout entirely. */
  visible?: number;
  /** Scale removed per step away from centre. */
  scaleStep?: number;
  /** Opacity removed per step away from centre. */
  opacityStep?: number;
  /** Degrees of Y rotation per step away from centre, mirrored left to right. */
  rotateStep?: number;
  /** Pixels a card shifts per step away from centre. */
  offsetStep?: number;
  /**
   * Advance `active` on a timer, wrapping past the last card back to the
   * first: an infinite right-to-left loop, since advancing the index is
   * exactly what a manual click on the next card over already does. Off by
   * default: a plain carousel only moves when clicked.
   */
  autoPlay?: boolean;
  /** Milliseconds between automatic advances while `autoPlay` is on. */
  autoPlayInterval?: number;
}

/**
 * A row of cards fanned in depth around one centred card, the way `SwipeCardStack`
 * fans cards in depth front to back: every neighbour's position, rotation, scale
 * and opacity is derived from its distance to `active`, not stored per card.
 *
 * Clicking a neighbour brings it to the centre with the same spring the rest of
 * the file bounces on. The card at the centre is rendered as the real thing;
 * everyone else sits behind an `inert`, click-to-focus overlay, so a background
 * card's own play button cannot be tabbed to or clicked while it is only there
 * for depth. Bringing a new card to the centre also closes whatever was
 * expanded, so an old centre never carries an open details panel out to the side.
 *
 * Opening the centred card's details is a spotlight, not one more state to fan
 * around: every other card fades out and its overlay stops being clickable,
 * and the centred card widens to four-fifths of the row via `expandedClassName`,
 * so it reads as a wider rectangle with room for what it just revealed rather
 * than the same small card with text stuffed underneath.
 *
 * A row of dots sits under the fan, one per card and each a click-to-jump
 * shortcut of its own. The active one is drawn as a pill rather than a plain
 * dot, and while `autoPlay` is actually ticking it fills from empty to full
 * in lockstep with `autoPlayInterval`, the way a story or slide counter
 * shows how long until the next advance rather than just which one is
 * current. It mounts fresh — and so restarts from empty — every time a
 * different card becomes active, whether that change came from the timer or
 * a click.
 */
export const GlassCardCarousel = React.forwardRef<HTMLDivElement, GlassCardCarouselProps>(
  function GlassCardCarousel(
    {
      className,
      children,
      active,
      defaultActive,
      onActiveChange,
      visible = 2,
      scaleStep = 0.14,
      opacityStep = 0.32,
      rotateStep = 28,
      offsetStep = 130,
      autoPlay = false,
      autoPlayInterval = 3000,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) {
    const reduced = useReducedMotion() ?? false;
    const cards = React.useMemo(
      () => React.Children.toArray(children).filter(React.isValidElement),
      [children],
    );
    const middle = Math.floor((cards.length - 1) / 2);

    const isControlled = active !== undefined;
    const [uncontrolledActive, setUncontrolledActive] = React.useState(defaultActive ?? middle);
    const resolvedActive = isControlled ? active : uncontrolledActive;

    const [expandedActive, setExpandedActive] = React.useState(false);

    // A newly centred card starts closed: a background card should never
    // carry an open details panel with it when it is no longer in focus.
    React.useEffect(() => {
      setExpandedActive(false);
    }, [resolvedActive]);

    const setActive = React.useCallback(
      (index: number) => {
        if (!isControlled) setUncontrolledActive(index);
        onActiveChange?.(index);
      },
      [isControlled, onActiveChange],
    );

    // Paused on hover so a viewer can actually read the card they stopped
    // on, and while a card's details are open, so the spotlight moment
    // isn't yanked away out from under someone reading it. `reduced` opts a
    // carousel out of driving itself at all: an auto-advancing loop is
    // exactly the kind of motion that setting exists to suppress. Shared
    // with the dots below, so the progress pill only ever fills while a
    // tick is actually scheduled to land.
    const [hovered, setHovered] = React.useState(false);
    const timerRunning =
      autoPlay && !reduced && !hovered && !expandedActive && cards.length > 1;

    // One card settles, holds for the full `autoPlayInterval`, then the next
    // one comes: the timer is the only thing pacing that gap. It's a fresh
    // `setInterval` every tick (this effect re-runs whenever `resolvedActive`
    // changes) rather than one long-lived interval, so a tick can never
    // silently drift out of step with a stale `resolvedActive` closure — each
    // one is scheduled off the card that is actually active right now, and
    // the wait between cards is always this interval, never whatever the
    // very first render happened to schedule.
    React.useEffect(() => {
      if (!timerRunning) return;
      const id = window.setInterval(() => {
        setActive((resolvedActive + 1) % cards.length);
      }, autoPlayInterval);
      return () => window.clearInterval(id);
    }, [timerRunning, autoPlayInterval, cards.length, resolvedActive, setActive]);

    return (
      <div className="flex flex-col items-center">
        <div
          ref={ref}
          data-slot="glass-card-carousel"
          // No `place-items-center` here: a grid item centred by
          // `justify-items` shrinks to fit its content, which leaves
          // `expandedClassName`'s `w-4/5` with no definite width to resolve
          // its percentage against (the classic auto-width/percentage-width
          // circularity). Left at the grid default (`stretch`), each item
          // spans the full column instead, so the card inside has a real
          // width to be a fraction of, and centres itself via the wrapper's
          // own `flex justify-center` below.
          className={cn("grid grid-cols-1", className)}
          style={{ perspective: "1600px", ...style }}
          onMouseEnter={(event) => {
            onMouseEnter?.(event);
            setHovered(true);
          }}
          onMouseLeave={(event) => {
            onMouseLeave?.(event);
            setHovered(false);
          }}
          {...props}
        >
          {cards.map((card, index) => {
            // The shortest signed distance around the ring, not the plain
            // index difference: wrapping past the last card lands adjacent to
            // the first rather than jumping across the whole row, so an
            // autoplay loop reads as one continuous ring with no seam where
            // it resets back to the start.
            const length = cards.length;
            let distance = (index - resolvedActive) % length;
            if (distance > length / 2) distance -= length;
            else if (distance < -length / 2) distance += length;
            const magnitude = Math.abs(distance);
            if (magnitude > visible) return null;
            const side = Math.sign(distance);
            const isActive = magnitude === 0;
            // The centred card opening its details is a spotlight moment: every
            // other card gets out of the way instead of sitting dimmed behind it,
            // and the centred one is given room to grow into.
            const eclipsed = !isActive && expandedActive;

            // Children are documented as `GlassCard` elements: the carousel owns
            // which one is expanded, so a card leaving the centre cannot stay open.
            // Growing into `expandedClassName`'s width is how the centred card
            // takes the room its now-hidden neighbours gave up, rather than just
            // scaling up: a wider box, not a bigger copy of the same shape.
            const item = React.cloneElement(card as React.ReactElement<GlassCardProps>, {
              expanded: isActive ? expandedActive : false,
              onExpandedChange: isActive ? setExpandedActive : undefined,
              expandedClassName: isActive ? "w-4/5" : undefined,
            });

            return (
              <motion.div
                key={card.key ?? index}
                data-slot="glass-card-carousel-item"
                // Fills the full grid column (see the container's className
                // above) and re-centres its child itself, so a card growing
                // into `expandedClassName` visibly expands outward from its
                // own centred position rather than from a stray edge.
                className="flex items-center justify-center"
                style={{
                  gridArea: "1 / 1",
                  zIndex: isActive ? cards.length + 1 : cards.length - magnitude,
                }}
                initial={false}
                animate={{
                  x: side * magnitude * offsetStep,
                  rotateY: isActive ? 0 : -side * rotateStep,
                  scale: isActive ? 1 : Math.max(0.4, 1 - magnitude * scaleStep),
                  opacity: eclipsed
                    ? 0
                    : isActive
                      ? 1
                      : Math.max(0.2, 1 - magnitude * opacityStep),
                  filter: isActive ? "blur(0px)" : `blur(${Math.min(magnitude, 2) * 1.5}px)`,
                }}
                transition={reduced ? INSTANT : BOUNCE}
              >
                {isActive ? (
                  item
                ) : (
                  <div
                    role="button"
                    tabIndex={eclipsed ? -1 : 0}
                    aria-hidden={eclipsed || undefined}
                    aria-label={
                      (card.props as { "aria-label"?: string })["aria-label"] ??
                      `Show card ${index + 1} of ${cards.length}`
                    }
                    onClick={() => {
                      if (eclipsed) return;
                      setActive(index);
                    }}
                    onKeyDown={(event) => {
                      if (eclipsed || (event.key !== "Enter" && event.key !== " ")) return;
                      event.preventDefault();
                      setActive(index);
                    }}
                    className={cn(
                      "cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      eclipsed && "pointer-events-none",
                    )}
                  >
                    <div inert className="pointer-events-none">
                      {item}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {cards.length > 1 ? (
          <div data-slot="glass-card-carousel-dots" className="mt-4 flex items-center gap-1.5">
            {cards.map((card, index) => {
              const isActive = index === resolvedActive;
              return (
                <button
                  key={card.key ?? index}
                  type="button"
                  aria-label={`Go to card ${index + 1} of ${cards.length}`}
                  aria-current={isActive || undefined}
                  onClick={() => setActive(index)}
                  className={cn(
                    "relative h-1.5 shrink-0 overflow-hidden rounded-full bg-glyph-foreground/20",
                    "transition-[width] duration-300 ease-b6-out",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isActive ? "w-6" : "w-1.5",
                  )}
                >
                  {isActive ? (
                    // Mounts fresh every time this dot becomes the active
                    // one (React remounts it, since its parent button was
                    // just rendering `null` a moment ago), so the fill
                    // always restarts from empty on a card change, exactly
                    // like a countdown resetting. It only actually animates
                    // while `timerRunning`: paused (hovered, an open detail
                    // panel, `autoPlay` off, or `reduced`) shows a plain
                    // filled pill instead of a frozen mid-count one.
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 rounded-full bg-glyph-foreground"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={
                        timerRunning
                          ? { duration: autoPlayInterval / 1000, ease: "linear" }
                          : INSTANT
                      }
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  },
);

export { glassCardVariants, glassCardMediaVariants };
