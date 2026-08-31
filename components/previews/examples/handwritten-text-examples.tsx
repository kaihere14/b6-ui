"use client";

import * as React from "react";

import { HandwrittenText } from "@/components/ui/handwritten-text";

export function HandwrittenTextDefaultExample() {
  return (
    <div className="flex w-full max-w-sm justify-center">
      <HandwrittenText text="Every letter is one stroke." />
    </div>
  );
}

export function HandwrittenTextHandsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-1">
      <HandwrittenText text="A fine connected script." size="sm" />
      <HandwrittenText text="A faster brush hand." size="sm" hand="brush" variant="primary" />
    </div>
  );
}

export function HandwrittenTextSpeedExample() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-1">
      <HandwrittenText text="A slow, careful hand." size="sm" speed={3} />
      <HandwrittenText text="A quick one." size="sm" speed={9} variant="primary" />
    </div>
  );
}

export function HandwrittenTextNibExample() {
  return (
    <div className="flex w-full max-w-sm justify-center">
      <HandwrittenText text="Follow the nib." nib speed={3} />
    </div>
  );
}

export function HandwrittenTextSequenceExample() {
  const [firstDone, setFirstDone] = React.useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-1">
      <HandwrittenText text="One line lands." onWritten={() => setFirstDone(true)} />
      {firstDone && (
        <HandwrittenText text="Then the next one starts." size="sm" variant="muted" />
      )}
    </div>
  );
}
