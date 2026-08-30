"use client";

import * as React from "react";

import { WritingText } from "@/components/ui/writing-text";

export function WritingTextDefaultExample() {
  return <WritingText text="Writing itself out, one character at a time." />;
}

export function WritingTextSpeedExample() {
  return (
    <div className="flex flex-col gap-2">
      <WritingText text="Twelve characters a second." size="sm" speed={12} />
      <WritingText text="Forty characters a second." size="sm" speed={40} variant="primary" />
    </div>
  );
}

export function WritingTextSequenceExample() {
  const [firstDone, setFirstDone] = React.useState(false);

  return (
    <div className="flex flex-col gap-1 text-center">
      <WritingText text="One line lands." onWritten={() => setFirstDone(true)} />
      {firstDone && (
        <WritingText text="Then the next one starts." size="sm" variant="muted" keepCursor />
      )}
    </div>
  );
}
