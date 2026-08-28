import { CopyButton } from "@/components/site/copy-button";
import { highlight, type CodeLanguage } from "@/lib/highlight";
import { cn } from "@/lib/utils";

interface CodePanelProps {
  code: string;
  language?: CodeLanguage;
  className?: string;
  /** Cap the height and scroll — useful for long source files. */
  scroll?: boolean;
  /** Render a line-number gutter. On by default. */
  lineNumbers?: boolean;
}

/**
 * Highlighted code with no chrome around it.
 *
 * Server component: `highlight()` runs here, so the markup reaches the browser
 * already coloured and no highlighter is shipped to the client. Use it when the
 * surrounding panel already has a border and a header — `ComponentShowcase`
 * does. Everywhere else, use `CodeBlock`.
 */
export async function CodePanel({
  code,
  language = "tsx",
  className,
  scroll = false,
  lineNumbers = true,
}: CodePanelProps) {
  const html = await highlight(code, language);

  return (
    <div
      className={cn("b6-code font-mono", className)}
      data-scroll={scroll ? "" : undefined}
      data-line-numbers={lineNumbers ? "" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface CodeBlockProps extends CodePanelProps {
  /** Shown in the block header, e.g. a file path. */
  filename?: string;
}

/** A framed, copyable code sample. */
export async function CodeBlock({
  code,
  filename,
  language = "tsx",
  className,
  scroll = false,
  lineNumbers = true,
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
      <CodePanel code={code} language={language} scroll={scroll} lineNumbers={lineNumbers} />
    </figure>
  );
}
