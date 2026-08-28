"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

interface CopyButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  value: string;
  label?: string;
}

/** Copies `value` to the clipboard and confirms for two seconds. */
export function CopyButton({ value, label = "Copy", className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground",
        "transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
    >
      {copied ? (
        <Check aria-hidden className="size-4 text-primary" />
      ) : (
        <Copy aria-hidden className="size-4" />
      )}
    </button>
  );
}
