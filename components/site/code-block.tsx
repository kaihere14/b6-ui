import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  /** Shown in the block header, e.g. a file path. */
  filename?: string;
  language?: string;
  className?: string;
  /** Cap the height and scroll — useful for long source files. */
  scroll?: boolean;
}

export function CodeBlock({
  code,
  filename,
  language = "tsx",
  className,
  scroll = false,
}: CodeBlockProps) {
  return (
    <figure
      className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}
    >
      <figcaption className="flex items-center justify-between gap-2 border-b border-border bg-muted/60 py-1.5 pr-1.5 pl-3">
        <span className="truncate font-mono text-caption text-muted-foreground uppercase">
          {filename ?? language}
        </span>
        <CopyButton value={code} label={`Copy ${filename ?? "code"}`} />
      </figcaption>
      <div className={cn("overflow-x-auto", scroll && "max-h-[32rem] overflow-y-auto")}>
        <pre className="p-4 text-code">
          <code className="font-mono">{code}</code>
        </pre>
      </div>
    </figure>
  );
}
