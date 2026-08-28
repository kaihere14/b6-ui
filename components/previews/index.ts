import type { ComponentType } from "react";

import { BadgePreview } from "@/components/previews/badge-preview";
import { ButtonBasePreview } from "@/components/previews/button-base-preview";
import { CardBasePreview } from "@/components/previews/card-base-preview";
import { InputPreview } from "@/components/previews/input-preview";
import { SeparatorPreview } from "@/components/previews/separator-preview";

/** Slug → preview component. Keys must match `lib/registry.ts` slugs. */
export const previews: Record<string, ComponentType> = {
  "button-base": ButtonBasePreview,
  "card-base": CardBasePreview,
  badge: BadgePreview,
  input: InputPreview,
  separator: SeparatorPreview,
};
