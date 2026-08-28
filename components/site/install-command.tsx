import { CopyButton } from "@/components/site/copy-button";
import { installCommand } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface InstallCommandProps {
  /** Registry item slug, e.g. `button-base`. */
  slug: string;
  className?: string;
}

/** The one-line shadcn command that installs a B6 UI component. */
export function InstallCommand({ slug, className }: InstallCommandProps) {
  const command = installCommand(slug);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-border bg-card py-1.5 pr-1.5 pl-3",
        className,
      )}
    >
      <span aria-hidden className="font-mono text-code text-muted-foreground select-none">
        $
      </span>
      <code className="flex-1 overflow-x-auto font-mono text-code whitespace-nowrap">
        {command}
      </code>
      <CopyButton value={command} label="Copy install command" />
    </div>
  );
}
