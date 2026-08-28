import { ArrowRight, Download } from "lucide-react";

import { ButtonBase } from "@/components/ui/button-base";

export function ButtonBasePreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ButtonBase>Get started</ButtonBase>
      <ButtonBase variant="secondary">Learn more</ButtonBase>
      <ButtonBase variant="outline" leftIcon={<Download />}>
        Install
      </ButtonBase>
      <ButtonBase variant="ghost" rightIcon={<ArrowRight />}>
        Docs
      </ButtonBase>
      <ButtonBase variant="destructive" size="sm">
        Delete
      </ButtonBase>
      <ButtonBase loading>Saving</ButtonBase>
      <ButtonBase disabled>Disabled</ButtonBase>
    </div>
  );
}
