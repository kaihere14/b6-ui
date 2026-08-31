"use client";

import * as React from "react";

import { HandwrittenText, type HandwrittenTextHand } from "@/components/ui/handwritten-text";
import { cn } from "@/lib/utils";

const HANDS: { value: HandwrittenTextHand; label: string }[] = [
  { value: "script", label: "Script" },
  { value: "brush", label: "Brush" },
];

export function HandwrittenTextPreview() {
  const [hand, setHand] = React.useState<HandwrittenTextHand>("script");
  const [line, setLine] = React.useState(0);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
      <div className="flex min-h-28 flex-col items-center justify-center">
        <HandwrittenText
          key={`${hand}-greeting`}
          text="Handwritten, not typed."
          hand={hand}
          size="lg"
          speed={2.5}
          nib
          onWritten={() => setLine(1)}
        />

        {line >= 1 && (
          <HandwrittenText
            key={`${hand}-line`}
            text="written, not typed."
            hand={hand}
            size="sm"
            variant="muted"
            speed={7}
          />
        )}
      </div>

      <div
        role="group"
        aria-label="Handwriting"
        className="inline-flex gap-0.5 rounded-lg border border-border bg-muted p-0.5"
      >
        {HANDS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={hand === option.value}
            onClick={() => {
              setHand(option.value);
              setLine(0);
            }}
            className={cn(
              "rounded-md px-3 py-1 text-caption transition-colors duration-150 ease-b6",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              hand === option.value
                ? "bg-raised text-foreground shadow-b6-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
