import { Separator } from "@/components/ui/separator";

export function SeparatorHorizontalExample() {
  return (
    <div className="w-full max-w-md">
      <Separator />
    </div>
  );
}

export function SeparatorCaptionedExample() {
  return (
    <div className="w-full max-w-md">
      <Separator label="or" />
    </div>
  );
}

export function SeparatorVerticalExample() {
  return (
    <div className="flex h-8 items-center gap-4 text-small">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Registry</span>
    </div>
  );
}
