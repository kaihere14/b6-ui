"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  useVelocity,
  type PanInfo,
  type Transition,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * B6 UI: Swipe Card
 *
 * A deck of cards stacked in depth, where the front one is thrown away by hand.
 * `SwipeCardStack` owns the geometry and the gesture; `SwipeCard` and its slots
 * are the surface that sits in each slot of the deck.
 *
 * The stack is a single stacking context of absolutely positioned cards. Depth
 * is expressed four ways at once (scale, offset, tilt, opacity) so the queue
 * reads as a physical pile rather than as a list that happens to overlap. Every
 * transition between two of those states is a spring, because a card that
 * settles on a curve reads as a drawn thing and a card that settles on a spring
 * reads as an object with weight.
 *
 * The gesture layer is a second element inside each card's depth layer. Drag
 * writes to the inner transform and the deck's position animates on the outer
 * one, so the two never fight over the same value: a released card can spring
 * back to origin while the pile behind it is still restacking.
 */
/**
 * B6 type steps, written as direct token reads.
 *
 * `text-body` and `text-primary-foreground` fall into the same tailwind-merge
 * class group unless cn() has been told the B6 scale is a font size, so under a
 * stock shadcn cn() the size silently deletes the colour and the label renders
 * in whatever colour it inherits, invisible on a solid button. Reading the
 * token directly lands the step in the font-size group for every cn(), extended
 * or not, and still loses to a consumer's own `text-lg`.
 */
const TYPE = {
  small: "text-(length:--text-small) leading-(--text-small--line-height)",
  h3: "text-(length:--text-h3) leading-(--text-h3--line-height) tracking-(--text-h3--letter-spacing) font-(weight:--text-h3--font-weight)",
} as const;

/** Direction a card leaves in. */
export type SwipeDirection = "left" | "right" | "up" | "down";

/** Axis the gesture tracks. */
export type SwipeAxis = "x" | "y" | "both";

const DIRECTION_VECTOR: Record<SwipeDirection, { x: number; y: number }> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
};

const KEY_DIRECTION: Record<string, SwipeDirection> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};

/** Springs, not curves. Everything the deck animates settles through one of these. */
const STACK_SPRING: Transition = { type: "spring", stiffness: 300, damping: 32, mass: 0.9 };
const EXIT_SPRING: Transition = { type: "spring", stiffness: 220, damping: 30, mass: 0.8 };
const INSTANT: Transition = { duration: 0 };

/** Degrees the top card tilts at full drag, and the tilt it keeps as it flies out. */
const MAX_DRAG_ROTATE = 18;
const EXIT_ROTATE = 22;

/** Divisors turning drag distance and drag velocity into degrees of tilt. */
const ROTATE_PER_PX = 14;
const ROTATE_PER_VELOCITY = 240;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/* -------------------------------------------------------------------------- */
/*                                  Surface                                   */
/* -------------------------------------------------------------------------- */

const swipeCardVariants = cva(
  [
    "relative flex size-full flex-col overflow-hidden rounded-xl text-card-foreground select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ],
  {
    variants: {
      variant: {
        outline: "border border-border bg-card",
        elevated: "border border-border bg-card shadow-b6-md",
        muted: "border border-transparent bg-muted",
      },
      padding: {
        none: "",
        sm: "gap-2.5 p-2.5",
        md: "gap-3 p-3",
        lg: "gap-4 p-4",
      },
    },
    defaultVariants: {
      // A card in a deck is a physical object with cards under it, so it
      // carries its shadow by default rather than being asked for one.
      variant: "elevated",
      padding: "md",
    },
  },
);

export interface SwipeCardProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof swipeCardVariants> {}

export const SwipeCard = React.forwardRef<HTMLDivElement, SwipeCardProps>(function SwipeCard(
  { className, variant, padding, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="swipe-card"
      className={cn(swipeCardVariants({ variant, padding }), className)}
      {...props}
    />
  );
});

/**
 * The media well: a rounded inset that holds a photo, a video or anything else,
 * with the card's padding showing as a frame around it.
 *
 * `wash` tints the picture from the bottom up. `brand` desaturates the media
 * and blends the brand colour back in as hue alone, so the picture keeps its
 * own light and dark and the card still belongs to the palette. It is a blend
 * rather than a veil: a flat colour laid over a photograph hides the subject,
 * while a colour blended into a greyscale photograph replaces what it never
 * had. `scrim` leaves the colour alone and fades the surface up over it, for
 * when something has to be readable on top.
 */
const swipeCardMediaVariants = cva(
  [
    "relative isolate overflow-hidden rounded-lg bg-muted",
    "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover",
  ],
  {
    variants: {
      aspect: {
        fill: "min-h-0 flex-1",
        square: "aspect-square",
        portrait: "aspect-3/4",
        video: "aspect-video",
      },
      wash: {
        none: "",
        brand: "[&>img]:grayscale [&>video]:grayscale",
        scrim: "",
      },
    },
    defaultVariants: {
      aspect: "fill",
      wash: "none",
    },
  },
);

const WASH_OVERLAY = {
  brand: "bg-linear-to-t from-brand via-brand/45 to-transparent mix-blend-color",
  scrim: "bg-linear-to-t from-background/90 via-background/30 to-transparent",
} as const;

export interface SwipeCardMediaProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof swipeCardMediaVariants> {}

export const SwipeCardMedia = React.forwardRef<HTMLDivElement, SwipeCardMediaProps>(
  function SwipeCardMedia({ className, aspect, wash, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="swipe-card-media"
        className={cn(swipeCardMediaVariants({ aspect, wash }), className)}
        {...props}
      >
        {children}
        {wash && wash !== "none" ? (
          <span
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-0", WASH_OVERLAY[wash])}
          />
        ) : null}
      </div>
    );
  },
);

const swipeCardMediaActionVariants = cva(
  [
    "absolute z-10 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full",
    "bg-card/80 text-foreground shadow-b6-sm backdrop-blur-sm",
    "transition-[background-color,transform] duration-200 ease-b6",
    "hover:bg-card active:scale-95",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      position: {
        "top-right": "top-3 right-3",
        "top-left": "top-3 left-3",
        "bottom-right": "right-3 bottom-3",
        "bottom-left": "bottom-3 left-3",
      },
    },
    defaultVariants: {
      position: "top-right",
    },
  },
);

export interface SwipeCardMediaActionProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof swipeCardMediaActionVariants> {}

/**
 * A control floating on the media, such as share or mute.
 *
 * It swallows its own pointerdown, so pressing it never starts a drag: on a
 * deck, a button the thumb lands on has to be a button and not a handle.
 * Icon-only, so it needs an `aria-label`.
 */
export const SwipeCardMediaAction = React.forwardRef<
  HTMLButtonElement,
  SwipeCardMediaActionProps
>(function SwipeCardMediaAction(
  { className, position, type = "button", onPointerDown, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="swipe-card-media-action"
      className={cn(swipeCardMediaActionVariants({ position }), className)}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        event.stopPropagation();
      }}
      {...props}
    />
  );
});

export const SwipeCardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SwipeCardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="swipe-card-header"
      className={cn("flex min-w-0 flex-col gap-0.5", className)}
      {...props}
    />
  );
});

export interface SwipeCardTitleProps extends React.ComponentPropsWithoutRef<"h3"> {
  /** Heading level to render. Pick the one that fits the page outline. */
  as?: "h2" | "h3" | "h4";
}

export const SwipeCardTitle = React.forwardRef<HTMLHeadingElement, SwipeCardTitleProps>(
  function SwipeCardTitle({ className, as: Comp = "h3", ...props }, ref) {
    return (
      <Comp
        ref={ref}
        data-slot="swipe-card-title"
        className={cn(TYPE.h3, "truncate", className)}
        {...props}
      />
    );
  },
);

export const SwipeCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(function SwipeCardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="swipe-card-description"
      className={cn(TYPE.small, "text-muted-foreground", className)}
      {...props}
    />
  );
});

const swipeCardStatusDotVariants = cva("size-2 shrink-0 rounded-full", {
  variants: {
    tone: {
      brand: "bg-brand",
      muted: "bg-muted-foreground",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    tone: "muted",
  },
});

export interface SwipeCardStatusProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof swipeCardStatusDotVariants> {}

/**
 * A dot and a word, for the line under a name.
 *
 * The word is the meaning and the dot only repeats it, because a reader who
 * cannot separate the two colours still has to be able to read the state.
 */
export const SwipeCardStatus = React.forwardRef<HTMLSpanElement, SwipeCardStatusProps>(
  function SwipeCardStatus({ className, tone, children, ...props }, ref) {
    return (
      <span
        ref={ref}
        data-slot="swipe-card-status"
        className={cn(TYPE.small, "inline-flex items-center gap-1.5 text-muted-foreground", className)}
        {...props}
      >
        <span aria-hidden="true" className={swipeCardStatusDotVariants({ tone })} />
        {children}
      </span>
    );
  },
);

export const SwipeCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SwipeCardContent({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="swipe-card-content"
      className={cn("min-h-0 flex-1", className)}
      {...props}
    />
  );
});

/**
 * The bar under the media: who this is on one side, what to do about it on the
 * other.
 */
export const SwipeCardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SwipeCardFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="swipe-card-footer"
      className={cn("flex min-w-0 items-center justify-between gap-3", className)}
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/*                                   Stack                                    */
/* -------------------------------------------------------------------------- */

/** Where one card sits in the pile. Depth 0 is the card being held. */
type StackTarget = {
  scale: number;
  y: number;
  rotate: number;
  opacity: number;
};

/** Pixel target the leaving card flies to, resolved when the throw starts. */
type ExitTarget = {
  x: number;
  y: number;
  rotate: number;
  instant: boolean;
};

const exitVariants = {
  exit: (target: ExitTarget) => ({
    x: target.x,
    y: target.y,
    rotate: target.rotate,
    opacity: 0,
    transition: target.instant ? INSTANT : EXIT_SPRING,
  }),
};

/** One entry in the deck. `pass` changes every time a looped card comes round again. */
interface StackEntry {
  id: number;
  pass: number;
}

interface StackItemProps {
  target: StackTarget;
  enterFrom: StackTarget;
  zIndex: number;
  active: boolean;
  axis: SwipeAxis;
  threshold: number;
  velocityThreshold: number;
  spring: Transition;
  reduced: boolean;
  onDismiss: (direction: SwipeDirection) => void;
  activeRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}

/**
 * One card of the deck, in two layers.
 *
 * Outer layer: where the card sits in the pile, driven by `animate`, and where
 * it flies to on exit. Inner layer: the gesture, driven by motion values that
 * the drag writes to directly. Splitting them is what lets a released card
 * spring home while the pile behind it restacks in the same frame.
 */
function SwipeCardStackItem({
  target,
  enterFrom,
  zIndex,
  active,
  axis,
  threshold,
  velocityThreshold,
  spring,
  reduced,
  onDismiss,
  activeRef,
  children,
}: StackItemProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xVelocity = useVelocity(x);

  // Tilt while dragging comes from how far the card has been pulled plus how
  // fast it is moving, so a flick tilts further than a slow drag of the same
  // distance. Reading motion values here keeps it off the React render path.
  const dragRotate = useTransform(() => {
    if (reduced || axis === "y") return 0;
    const fromDistance = x.get() / ROTATE_PER_PX;
    const fromVelocity = xVelocity.get() / ROTATE_PER_VELOCITY;
    return clamp(fromDistance + fromVelocity, -MAX_DRAG_ROTATE, MAX_DRAG_ROTATE);
  });

  function handleDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const horizontal = axis !== "y";
    const vertical = axis !== "x";
    const passedX =
      horizontal &&
      (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold);
    const passedY =
      vertical &&
      (Math.abs(info.offset.y) > threshold || Math.abs(info.velocity.y) > velocityThreshold);

    // Under the threshold the card is not dismissed and `dragSnapToOrigin`
    // springs it back on its own.
    if (!passedX && !passedY) return;

    const throwHorizontally =
      passedX && (!passedY || Math.abs(info.offset.x) >= Math.abs(info.offset.y));
    if (throwHorizontally) onDismiss(info.offset.x > 0 ? "right" : "left");
    else onDismiss(info.offset.y > 0 ? "down" : "up");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const direction = KEY_DIRECTION[event.key];
    if (!direction) return;
    if (axis === "x" && (direction === "up" || direction === "down")) return;
    if (axis === "y" && (direction === "left" || direction === "right")) return;
    event.preventDefault();
    onDismiss(direction);
  }

  const dragProp = active ? (axis === "both" ? true : axis) : false;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex }}
      initial={enterFrom}
      animate={target}
      exit="exit"
      variants={exitVariants}
      transition={reduced ? INSTANT : spring}
    >
      <motion.div
        ref={activeRef}
        data-slot="swipe-card-item"
        data-active={active ? "true" : undefined}
        className={cn(
          "size-full",
          active ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
        )}
        style={{ x, y, rotate: dragRotate }}
        drag={dragProp}
        dragSnapToOrigin
        dragElastic={0.55}
        dragMomentum={false}
        transition={reduced ? INSTANT : spring}
        onDragEnd={handleDragEnd}
        onKeyDown={active ? handleKeyDown : undefined}
        tabIndex={active ? 0 : -1}
        aria-hidden={active ? undefined : true}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Imperative control, for dismissing the top card from a button. */
export interface SwipeCardStackHandle {
  /** Throw the top card in `direction`. No-op on an empty deck. */
  swipe: (direction: SwipeDirection) => void;
  /** Put every card back in its starting order. */
  reset: () => void;
  /** The stack container element. */
  element: HTMLDivElement | null;
}

export interface SwipeCardStackProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> {
  /** Cards, front of the deck first. */
  children: React.ReactNode;
  /** Axis the gesture tracks. */
  axis?: SwipeAxis;
  /** Pixels the card must travel before a release dismisses it. */
  threshold?: number;
  /** Pixels per second that dismiss the card regardless of distance. */
  velocityThreshold?: number;
  /** How many cards of the queue are mounted and visible behind the top one. */
  visibleCards?: number;
  /** Scale removed per card of depth. */
  scaleStep?: number;
  /** Pixels of offset added per card of depth. */
  offsetStep?: number;
  /** Degrees the queue tilts by, alternating sign so the pile looks hand-stacked. */
  rotateStep?: number;
  /** Opacity removed per card of depth. */
  opacityStep?: number;
  /** Which edge the queue peeks out of. */
  stackFrom?: "bottom" | "top";
  /** Send a dismissed card to the back instead of dropping it. */
  loop?: boolean;
  /** Block the gesture without changing how the deck looks. */
  disabled?: boolean;
  /** Spring driving the restack. Exit and drag springs derive from the same feel. */
  spring?: Transition;
  /** Fired with the direction thrown and the index of the card that left. */
  onSwipe?: (direction: SwipeDirection, index: number) => void;
  /** Fired once the last card leaves. Never fires while `loop` is set. */
  onEmpty?: () => void;
  /** Rendered in place of the deck once every card is gone. */
  empty?: React.ReactNode;
}

/**
 * The deck.
 *
 * Order is held as entries rather than as child indexes, because a looped card
 * has to leave and come back as a different mounted element: same child, new
 * `pass`, so the exit animation still plays on a three-card deck where the card
 * is immediately visible again at the back.
 */
export const SwipeCardStack = React.forwardRef<SwipeCardStackHandle, SwipeCardStackProps>(
  function SwipeCardStack(
    {
      className,
      children,
      axis = "x",
      threshold = 120,
      velocityThreshold = 500,
      visibleCards = 3,
      scaleStep = 0.05,
      offsetStep = 16,
      rotateStep = 4,
      opacityStep = 0.15,
      stackFrom = "bottom",
      loop = false,
      disabled = false,
      spring = STACK_SPRING,
      onSwipe,
      onEmpty,
      empty,
      ...props
    },
    ref,
  ) {
    const reduced = useReducedMotion() ?? false;
    const containerRef = React.useRef<HTMLDivElement>(null);
    const frontRef = React.useRef<HTMLDivElement>(null);

    const cards = React.useMemo(
      () => React.Children.toArray(children).filter(React.isValidElement),
      [children],
    );
    const count = cards.length;

    const [order, setOrder] = React.useState<StackEntry[]>(() =>
      Array.from({ length: count }, (_, id) => ({ id, pass: 0 })),
    );
    const [exitTarget, setExitTarget] = React.useState<ExitTarget>({
      x: 0,
      y: 0,
      rotate: 0,
      instant: false,
    });

    // Adding or removing cards refills the deck. Anything subtler would leave
    // `order` pointing at children that are no longer there.
    const knownCount = React.useRef(count);
    React.useEffect(() => {
      if (knownCount.current === count) return;
      knownCount.current = count;
      setOrder(Array.from({ length: count }, (_, id) => ({ id, pass: 0 })));
    }, [count]);

    // The deck is read back inside event handlers, so it is mirrored into a ref
    // rather than dismissed through a state updater: an updater that fired
    // `onSwipe` would fire it twice under StrictMode.
    const orderRef = React.useRef(order);
    const callbacks = React.useRef({ onSwipe, onEmpty });
    React.useEffect(() => {
      orderRef.current = order;
      callbacks.current = { onSwipe, onEmpty };
    });

    React.useEffect(() => {
      if (count > 0 && order.length === 0) callbacks.current.onEmpty?.();
    }, [order.length, count]);

    // A thrown card takes the focus with it. Focus is handed to the new top card
    // only when it was already inside the deck, so a throw never pulls focus
    // across the page.
    const restoreFocus = React.useRef(false);
    React.useEffect(() => {
      if (!restoreFocus.current) return;
      restoreFocus.current = false;
      frontRef.current?.focus();
    }, [order]);

    const dismiss = React.useCallback(
      (direction: SwipeDirection) => {
        const [front, ...rest] = orderRef.current;
        if (!front) return;

        // The card flies clear of the container it was measured against, so a
        // deck of any size throws its card fully out of view.
        const bounds = containerRef.current?.getBoundingClientRect();
        const width = bounds?.width ?? 320;
        const height = bounds?.height ?? 320;
        const vector = DIRECTION_VECTOR[direction];

        setExitTarget({
          x: vector.x * (width * 1.4 + 160),
          y: vector.y * (height * 1.4 + 160),
          rotate: vector.x * EXIT_ROTATE,
          instant: reduced,
        });

        restoreFocus.current = containerRef.current?.contains(document.activeElement) ?? false;

        const next = loop ? [...rest, { id: front.id, pass: front.pass + 1 }] : rest;
        orderRef.current = next;
        setOrder(next);
        callbacks.current.onSwipe?.(direction, front.id);
      },
      [loop, reduced],
    );

    const reset = React.useCallback(() => {
      const fresh = Array.from({ length: count }, (_, id) => ({ id, pass: 0 }));
      orderRef.current = fresh;
      setOrder(fresh);
    }, [count]);

    React.useImperativeHandle(
      ref,
      () => ({
        swipe: (direction) => {
          if (!disabled) dismiss(direction);
        },
        reset,
        element: containerRef.current,
      }),
      [disabled, dismiss, reset],
    );

    const targetFor = React.useCallback(
      (depth: number): StackTarget => ({
        scale: Math.max(0, 1 - depth * scaleStep),
        y: depth * offsetStep * (stackFrom === "top" ? -1 : 1),
        rotate: depth === 0 ? 0 : depth % 2 === 1 ? -rotateStep : rotateStep,
        opacity: Math.max(0, 1 - depth * opacityStep),
      }),
      [scaleStep, offsetStep, stackFrom, rotateStep, opacityStep],
    );

    // Only the visible window is mounted: a hundred-card deck still renders
    // three cards. A card entering the window starts one step deeper than the
    // last visible slot, so it grows into place instead of appearing.
    const visible = order.slice(0, Math.max(1, visibleCards));
    const enterFrom = targetFor(Math.max(1, visibleCards));

    return (
      <div
        ref={containerRef}
        data-slot="swipe-card-stack"
        role="group"
        aria-roledescription="card stack"
        className={cn("relative isolate", className)}
        {...props}
      >
        <AnimatePresence initial={false} custom={exitTarget}>
          {visible.map((entry, depth) => (
            <SwipeCardStackItem
              key={`${entry.id}:${entry.pass}`}
              target={targetFor(depth)}
              enterFrom={enterFrom}
              zIndex={visible.length - depth}
              active={depth === 0 && !disabled}
              axis={axis}
              threshold={threshold}
              velocityThreshold={velocityThreshold}
              spring={spring}
              reduced={reduced}
              onDismiss={dismiss}
              activeRef={depth === 0 ? frontRef : undefined}
            >
              {cards[entry.id]}
            </SwipeCardStackItem>
          ))}
        </AnimatePresence>

        {order.length === 0 ? empty : null}

        <span aria-live="polite" className="sr-only">
          {order.length === 0
            ? "No cards left."
            : `Card ${order[0]!.id + 1} of ${count}. Use the arrow keys to swipe.`}
        </span>
      </div>
    );
  },
);

export { swipeCardMediaActionVariants, swipeCardMediaVariants, swipeCardVariants };
