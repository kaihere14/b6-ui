import { Separator } from "@/components/ui/separator";

export function SeparatorPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-small text-muted-foreground">Above the rule</p>
        <Separator />
        <p className="text-small text-muted-foreground">Below the rule</p>
      </div>

      <Separator label="or" />

      <div className="flex h-8 items-center gap-4 text-small">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Registry</span>
        <Separator orientation="vertical" />
        <span>GitHub</span>
      </div>
    </div>
  );
}
