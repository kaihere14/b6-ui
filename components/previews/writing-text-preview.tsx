"use client";

import * as React from "react";

import { WritingText } from "@/components/ui/writing-text";

export function WritingTextPreview() {
  const [line, setLine] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <WritingText
        text="Components you own, not import."
        size="lg"
        onWritten={() => setLine(1)}
      />

      {line >= 1 && (
        <WritingText
          text="Copied into your project, yours from that moment on."
          size="sm"
          variant="muted"
          onWritten={() => setLine(2)}
        />
      )}

      {line >= 2 && (
        <WritingText
          text="One line hands over to the next."
          size="sm"
          variant="primary"
          keepCursor
        />
      )}
    </div>
  );
}
