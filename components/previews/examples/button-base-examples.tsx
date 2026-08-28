import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { ButtonBase } from "@/components/ui/button-base";

export function ButtonBaseVariantsExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ButtonBase>Get Started</ButtonBase>
      <ButtonBase variant="secondary">Learn More</ButtonBase>
      <ButtonBase variant="outline">Docs</ButtonBase>
      <ButtonBase variant="ghost">Cancel</ButtonBase>
      <ButtonBase variant="destructive">Delete</ButtonBase>
    </div>
  );
}

export function ButtonBaseIconsExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ButtonBase leftIcon={<Download />}>Install</ButtonBase>
      <ButtonBase variant="ghost" rightIcon={<ArrowRight />}>
        Read the docs
      </ButtonBase>
    </div>
  );
}

export function ButtonBaseLoadingExample() {
  return (
    <ButtonBase loading loadingLabel="Saving changes">
      Save
    </ButtonBase>
  );
}

export function ButtonBaseAsLinkExample() {
  return (
    <ButtonBase asChild>
      <Link href="/components">Browse components</Link>
    </ButtonBase>
  );
}
