"use client";

import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";

import {
  StatefulButton,
  type ButtonStatus,
} from "@/components/ui/stateful-button";

export function StatefulButtonPreview() {
  const [s1, setS1] = useState<ButtonStatus>("idle");
  const [s2, setS2] = useState<ButtonStatus>("idle");
  const [s3, setS3] = useState<ButtonStatus>("idle");

  const cycle = useCallback(
    (setter: (s: ButtonStatus) => void, outcome: ButtonStatus) => {
      setter("loading");
      setTimeout(() => setter(outcome), 1500);
    },
    [],
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6">
      <StatefulButton
        status={s1}
        onReset={() => setS1("idle")}
        onClick={() => cycle(setS1, "success")}
        loadingText="Submitting…"
        successText="Submitted!"
        rightIcon={<ArrowRight />}
      >
        Submit
      </StatefulButton>
      <StatefulButton
        variant="outline"
        status={s2}
        onReset={() => setS2("idle")}
        onClick={() => cycle(setS2, "error")}
        loadingText="Trying…"
        errorText="Failed!"
      >
        Will fail
      </StatefulButton>
      <StatefulButton
        variant="secondary"
        status={s3}
        onReset={() => setS3("idle")}
        onClick={() => cycle(setS3, "success")}
        loadingText="Saving…"
        successText="Saved!"
      >
        Save
      </StatefulButton>
    </div>
  );
}
