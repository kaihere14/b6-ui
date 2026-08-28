"use client";

import { useCallback, useState } from "react";

import { StatefulButton, type ButtonStatus } from "@/components/ui/stateful-button";

export function StatefulButtonDefaultExample() {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  const handleClick = useCallback(() => {
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1500);
  }, []);

  return (
    <StatefulButton
      status={status}
      onReset={() => setStatus("idle")}
      onClick={handleClick}
      loadingText="Saving…"
      successText="Saved!"
    >
      Save changes
    </StatefulButton>
  );
}

export function StatefulButtonErrorExample() {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  const handleClick = useCallback(() => {
    setStatus("loading");
    setTimeout(() => setStatus("error"), 1500);
  }, []);

  return (
    <StatefulButton
      variant="outline"
      status={status}
      onReset={() => setStatus("idle")}
      onClick={handleClick}
      loadingText="Sending…"
      errorText="Failed!"
    >
      Try again
    </StatefulButton>
  );
}

export function StatefulButtonVariantsExample() {
  const [statuses, setStatuses] = useState<Record<string, ButtonStatus>>({
    primary: "idle",
    secondary: "idle",
    destructive: "idle",
  });

  const handleClick = useCallback((key: string) => {
    setStatuses((prev) => ({ ...prev, [key]: "loading" }));
    setTimeout(() => {
      setStatuses((prev) => ({
        ...prev,
        [key]: key === "destructive" ? "error" : "success",
      }));
    }, 1500);
  }, []);

  const handleReset = useCallback((key: string) => {
    setStatuses((prev) => ({ ...prev, [key]: "idle" }));
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <StatefulButton
        status={statuses.primary}
        onReset={() => handleReset("primary")}
        onClick={() => handleClick("primary")}
        loadingText="Publishing…"
        successText="Published!"
      >
        Publish
      </StatefulButton>
      <StatefulButton
        variant="secondary"
        status={statuses.secondary}
        onReset={() => handleReset("secondary")}
        onClick={() => handleClick("secondary")}
        loadingText="Saving…"
        successText="Saved!"
      >
        Save draft
      </StatefulButton>
      <StatefulButton
        variant="destructive"
        status={statuses.destructive}
        onReset={() => handleReset("destructive")}
        onClick={() => handleClick("destructive")}
        loadingText="Deleting…"
        errorText="Failed!"
      >
        Delete
      </StatefulButton>
    </div>
  );
}

export function StatefulButtonMotionExample() {
  const [statuses, setStatuses] = useState<Record<string, ButtonStatus>>({
    noBlur: "idle",
    noStagger: "idle",
    plain: "idle",
  });

  const handleClick = useCallback((key: string) => {
    setStatuses((prev) => ({ ...prev, [key]: "loading" }));
    setTimeout(() => setStatuses((prev) => ({ ...prev, [key]: "success" })), 1500);
  }, []);

  const handleReset = useCallback((key: string) => {
    setStatuses((prev) => ({ ...prev, [key]: "idle" }));
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <StatefulButton
        blur={false}
        status={statuses.noBlur}
        onReset={() => handleReset("noBlur")}
        onClick={() => handleClick("noBlur")}
        loadingText="Saving…"
        successText="Saved!"
      >
        No blur
      </StatefulButton>
      <StatefulButton
        variant="secondary"
        stagger={false}
        status={statuses.noStagger}
        onReset={() => handleReset("noStagger")}
        onClick={() => handleClick("noStagger")}
        loadingText="Saving…"
        successText="Saved!"
      >
        No stagger
      </StatefulButton>
      <StatefulButton
        variant="outline"
        blur={false}
        stagger={false}
        status={statuses.plain}
        onReset={() => handleReset("plain")}
        onClick={() => handleClick("plain")}
        loadingText="Saving…"
        successText="Saved!"
      >
        Plain fade
      </StatefulButton>
    </div>
  );
}
