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
  SeparatorCaptionedExample,
  SeparatorHorizontalExample,
  SeparatorVerticalExample,
} from "@/components/previews/examples/separator-examples";

import { BadgePreview } from "@/components/previews/badge-preview";
import { ButtonBasePreview } from "@/components/previews/button-base-preview";
import { CardBasePreview } from "@/components/previews/card-base-preview";
import { InputPreview } from "@/components/previews/input-preview";
import { MagneticButtonPreview } from "@/components/previews/magnetic-button-preview";
import { SeparatorPreview } from "@/components/previews/separator-preview";
import { StatefulButtonPreview } from "@/components/previews/stateful-button-preview";

/** Slug → the demo at the top of the component page. Keys match `lib/registry.ts` slugs. */
export const previews: Record<string, ComponentType> = {
  "button-base": ButtonBasePreview,
  "magnetic-button": MagneticButtonPreview,
  "stateful-button": StatefulButtonPreview,
  "card-base": CardBasePreview,
  badge: BadgePreview,
  input: InputPreview,
  separator: SeparatorPreview,
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
  "card-base/anatomy": CardBaseAnatomyExample,
  "card-base/interactive": CardBaseInteractiveExample,
  "badge/tones": BadgeTonesExample,
  "badge/icon": BadgeIconExample,
  "input/labelled": InputLabelledExample,
  "input/search": InputSearchExample,
  "input/invalid": InputInvalidExample,
  "separator/horizontal": SeparatorHorizontalExample,
  "separator/captioned": SeparatorCaptionedExample,
  "separator/vertical": SeparatorVerticalExample,
};
