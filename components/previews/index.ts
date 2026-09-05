import type { ComponentType } from "react";

import {
  BadgeIconExample,
  BadgeTonesExample,
} from "@/components/previews/examples/badge-examples";
import {
  ButtonBaseAsLinkExample,
  ButtonBaseIconsExample,
  ButtonBaseLoadingExample,
  ButtonBaseVariantsExample,
} from "@/components/previews/examples/button-base-examples";
import {
  CardBaseAnatomyExample,
  CardBaseInteractiveExample,
} from "@/components/previews/examples/card-base-examples";
import {
  DepthButtonAsLinkExample,
  DepthButtonSizesExample,
  DepthButtonStatesExample,
  DepthButtonVariantsExample,
} from "@/components/previews/examples/depth-button-examples";
import {
  DotMatrixGraphRangesExample,
  DotMatrixGraphSizesExample,
} from "@/components/previews/examples/dot-matrix-graph-examples";
import {
  InputInvalidExample,
  InputLabelledExample,
  InputSearchExample,
} from "@/components/previews/examples/input-examples";
import {
  MagneticButtonAsChildExample,
  MagneticButtonDefaultExample,
  MagneticButtonOptOutExample,
  MagneticButtonStrengthExample,
} from "@/components/previews/examples/magnetic-button-examples";
import {
  StatefulButtonDefaultExample,
  StatefulButtonErrorExample,
  StatefulButtonMotionExample,
  StatefulButtonVariantsExample,
} from "@/components/previews/examples/stateful-button-examples";
import {
  ActivityGraphSingleSeriesExample,
  ActivityGraphSizesExample,
  ActivityGraphTwoSeriesExample,
} from "@/components/previews/examples/activity-graph-examples";
import {
  WritingTextDefaultExample,
  WritingTextSequenceExample,
  WritingTextSpeedExample,
} from "@/components/previews/examples/writing-text-examples";
import {
  HandwrittenTextDefaultExample,
  HandwrittenTextHandsExample,
  HandwrittenTextNibExample,
  HandwrittenTextSequenceExample,
  HandwrittenTextSpeedExample,
} from "@/components/previews/examples/handwritten-text-examples";
import {
  SeparatorCaptionedExample,
  SeparatorHorizontalExample,
  SeparatorVerticalExample,
} from "@/components/previews/examples/separator-examples";
import {
  SwipeCardAxisExample,
  SwipeCardControlsExample,
  SwipeCardDeckExample,
  SwipeCardDepthExample,
  SwipeCardEmptyExample,
  SwipeCardWashExample,
} from "@/components/previews/examples/swipe-card-examples";
import {
  CrossButtonAdExample,
  CrossButtonShapesExample,
  CrossButtonSizesExample,
  CrossButtonVariantsExample,
} from "@/components/previews/examples/cross-button-examples";

import {
  GlowButtonAsLinkExample,
  GlowButtonSizesExample,
  GlowButtonStatesExample,
  GlowButtonVariantsExample,
} from "@/components/previews/examples/glow-button-examples";

import { BadgePreview } from "@/components/previews/badge-preview";
import { ButtonBasePreview } from "@/components/previews/button-base-preview";
import { CardBasePreview } from "@/components/previews/card-base-preview";
import { SwipeCardPreview } from "@/components/previews/swipe-card-preview";
import { ActivityGraphPreview } from "@/components/previews/activity-graph-preview";
import { DepthButtonPreview } from "@/components/previews/depth-button-preview";
import { DotMatrixGraphPreview } from "@/components/previews/dot-matrix-graph-preview";
import { InputPreview } from "@/components/previews/input-preview";
import { MagneticButtonPreview } from "@/components/previews/magnetic-button-preview";
import { SeparatorPreview } from "@/components/previews/separator-preview";
import { StatefulButtonPreview } from "@/components/previews/stateful-button-preview";
import { HandwrittenTextPreview } from "@/components/previews/handwritten-text-preview";
import { WritingTextPreview } from "@/components/previews/writing-text-preview";
import { CrossButtonPreview } from "@/components/previews/cross-button-preview";
import { ThinkingOrbPreview } from "@/components/previews/thinking-orb-preview";
import { CircularMusicPlayerPreview } from "@/components/previews/circular-music-player-preview";
import { GlowButtonPreview } from "@/components/previews/glow-button-preview";
import {
  ThinkingOrbCustomExample,
  ThinkingOrbSizesExample,
  ThinkingOrbTonesExample,
} from "@/components/previews/examples/thinking-orb-examples";
import {
  CircularMusicPlayerAnatomyExample,
  CircularMusicPlayerRingExample,
  CircularMusicPlayerSizesExample,
  CircularMusicPlayerSpotifyExample,
  CircularMusicPlayerTonesExample,
} from "@/components/previews/examples/circular-music-player-examples";

/** Slug → the demo at the top of the component page. Keys match `lib/registry.ts` slugs. */
export const previews: Record<string, ComponentType> = {
  "button-base": ButtonBasePreview,
  "magnetic-button": MagneticButtonPreview,
  "stateful-button": StatefulButtonPreview,
  "depth-button": DepthButtonPreview,
  "glow-button": GlowButtonPreview,
  "card-base": CardBasePreview,
  "swipe-card": SwipeCardPreview,
  "activity-graph": ActivityGraphPreview,
  "dot-matrix-graph": DotMatrixGraphPreview,
  badge: BadgePreview,
  input: InputPreview,
  separator: SeparatorPreview,
  "writing-text": WritingTextPreview,
  "handwritten-text": HandwrittenTextPreview,
  "cross-button": CrossButtonPreview,
  "thinking-orb": ThinkingOrbPreview,
  "circular-music-player": CircularMusicPlayerPreview,
};

/**
 * Runnable demo for a single usage example.
 *
 * Keys match the `preview` field on a `ComponentExample`; an example without one
 * renders as code only. `tests/registry.test.ts` fails when a key has no demo.
 */
export const exampleDemos: Record<string, ComponentType> = {
  "button-base/variants": ButtonBaseVariantsExample,
  "button-base/icons": ButtonBaseIconsExample,
  "button-base/loading": ButtonBaseLoadingExample,
  "button-base/as-link": ButtonBaseAsLinkExample,
  "magnetic-button/default": MagneticButtonDefaultExample,
  "magnetic-button/strength": MagneticButtonStrengthExample,
  "magnetic-button/as-child": MagneticButtonAsChildExample,
  "magnetic-button/opt-out": MagneticButtonOptOutExample,
  "stateful-button/default": StatefulButtonDefaultExample,
  "stateful-button/error": StatefulButtonErrorExample,
  "stateful-button/variants": StatefulButtonVariantsExample,
  "stateful-button/motion": StatefulButtonMotionExample,
  "depth-button/variants": DepthButtonVariantsExample,
  "depth-button/sizes": DepthButtonSizesExample,
  "depth-button/states": DepthButtonStatesExample,
  "depth-button/as-link": DepthButtonAsLinkExample,
  "glow-button/variants": GlowButtonVariantsExample,
  "glow-button/sizes": GlowButtonSizesExample,
  "glow-button/states": GlowButtonStatesExample,
  "glow-button/as-link": GlowButtonAsLinkExample,
  "card-base/anatomy": CardBaseAnatomyExample,
  "card-base/interactive": CardBaseInteractiveExample,
  "swipe-card/deck": SwipeCardDeckExample,
  "swipe-card/controls": SwipeCardControlsExample,
  "swipe-card/wash": SwipeCardWashExample,
  "swipe-card/depth": SwipeCardDepthExample,
  "swipe-card/axis": SwipeCardAxisExample,
  "swipe-card/empty": SwipeCardEmptyExample,
  "badge/tones": BadgeTonesExample,
  "badge/icon": BadgeIconExample,
  "input/labelled": InputLabelledExample,
  "input/search": InputSearchExample,
  "input/invalid": InputInvalidExample,
  "activity-graph/single-series": ActivityGraphSingleSeriesExample,
  "activity-graph/two-series": ActivityGraphTwoSeriesExample,
  "activity-graph/sizes": ActivityGraphSizesExample,
  "dot-matrix-graph/ranges": DotMatrixGraphRangesExample,
  "dot-matrix-graph/sizes": DotMatrixGraphSizesExample,
  "separator/horizontal": SeparatorHorizontalExample,
  "separator/captioned": SeparatorCaptionedExample,
  "separator/vertical": SeparatorVerticalExample,
  "writing-text/default": WritingTextDefaultExample,
  "writing-text/speed": WritingTextSpeedExample,
  "writing-text/sequence": WritingTextSequenceExample,
  "handwritten-text/default": HandwrittenTextDefaultExample,
  "handwritten-text/hands": HandwrittenTextHandsExample,
  "handwritten-text/speed": HandwrittenTextSpeedExample,
  "handwritten-text/nib": HandwrittenTextNibExample,
  "handwritten-text/sequence": HandwrittenTextSequenceExample,
  "cross-button/variants": CrossButtonVariantsExample,
  "cross-button/sizes": CrossButtonSizesExample,
  "cross-button/shapes": CrossButtonShapesExample,
  "cross-button/ad": CrossButtonAdExample,
  "thinking-orb/sizes": ThinkingOrbSizesExample,
  "thinking-orb/tones": ThinkingOrbTonesExample,
  "thinking-orb/custom": ThinkingOrbCustomExample,
  "circular-music-player/anatomy": CircularMusicPlayerAnatomyExample,
  "circular-music-player/ring": CircularMusicPlayerRingExample,
  "circular-music-player/spotify": CircularMusicPlayerSpotifyExample,
  "circular-music-player/sizes": CircularMusicPlayerSizesExample,
  "circular-music-player/tones": CircularMusicPlayerTonesExample,
};
