import { cn } from "@/lib/utils";

/** The B6 mark: a squared monogram in the primary tone. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-sm bg-primary font-mono text-small font-semibold text-primary-foreground"
      >
        B6
      </span>
      <span className="font-semibold tracking-tight">B6 UI</span>
    </span>
  );
}
