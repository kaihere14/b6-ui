"use client";

import * as React from "react";
import { Maximize2, Monitor, RotateCcw, Smartphone, Tablet, X } from "lucide-react";

import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "preview", label: "Preview" },
  { id: "code", label: "Code" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/** Canvas widths the preview can be constrained to, narrowest first. */
const widths = [
  { id: "sm", label: "Narrow viewport", icon: Smartphone, className: "max-w-sm" },
  { id: "md", label: "Medium viewport", icon: Tablet, className: "max-w-2xl" },
  { id: "full", label: "Full width", icon: Monitor, className: "max-w-none" },
] as const;

type WidthId = (typeof widths)[number]["id"];

const toolbarButton =
  "inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground";

interface ComponentShowcaseProps {
  /** The live demo. Rendered on the dotted canvas. */
  preview: React.ReactNode;
  /** Highlighted source, normally a `<CodePanel />`. */
  code: React.ReactNode;
  /** Raw source behind `code`, for the copy button. */
  rawCode: string;
  /** Hide the viewport-width and fullscreen controls on small demos. */
  toolbar?: boolean;
  className?: string;
}

/**
 * Preview and source for one component, behind a pair of tabs.
 *
 * Both panels stay mounted and the inactive one is `hidden`, so switching tabs
 * never restarts an animation or drops the demo's state. `preview` and `code`
 * arrive as already-rendered server output — the highlighting still happens on
 * the server even though the tab state lives on the client.
 */
export function ComponentShowcase({
  preview,
  code,
  rawCode,
  toolbar = true,
  className,
}: ComponentShowcaseProps) {
  const [active, setActive] = React.useState<TabId>("preview");
  const [width, setWidth] = React.useState<WidthId>("full");
  // Bumped by the reload button; used as a `key` to remount the demo.
  const [generation, setGeneration] = React.useState(0);
  const fullscreen = React.useRef<HTMLDialogElement>(null);

  const baseId = React.useId();
  const tabId = (id: TabId) => `${baseId}-tab-${id}`;
  const panelId = (id: TabId) => `${baseId}-panel-${id}`;

  /** Left/right move between tabs, as the tabs pattern expects. */
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (offset === 0) return;

    event.preventDefault();
    const index = tabs.findIndex((tab) => tab.id === active);
    const next = tabs[(index + offset + tabs.length) % tabs.length];
    setActive(next.id);
    document.getElementById(tabId(next.id))?.focus();
  }

  const canvas = (
    <div
      key={generation}
      className={cn(
        "mx-auto flex w-full items-center justify-center transition-[max-width] duration-200 ease-b6",
        widths.find((option) => option.id === width)?.className,
      )}
    >
      {preview}
    </div>
  );

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/60 p-1.5">
        <div
          role="tablist"
          aria-label="Component preview and source"
          onKeyDown={onKeyDown}
          className="flex items-center gap-1"
        >
          {tabs.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                id={tabId(tab.id)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId(tab.id)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "rounded-sm px-3 py-1 text-small transition-colors duration-150 ease-b6",
                  selected
                    ? "bg-card font-medium text-foreground shadow-b6-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          {toolbar && active === "preview" ? (
            <>
              <div
                role="group"
                aria-label="Preview width"
                className="hidden items-center gap-0.5 sm:flex"
              >
                {widths.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={option.label}
                    aria-pressed={width === option.id}
                    onClick={() => setWidth(option.id)}
                    className={cn(toolbarButton, width === option.id && "text-foreground")}
                  >
                    <option.icon aria-hidden className="size-4" />
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-label="Restart the preview"
                onClick={() => setGeneration((current) => current + 1)}
                className={toolbarButton}
              >
                <RotateCcw aria-hidden className="size-4" />
              </button>

              <button
                type="button"
                aria-label="Open the preview fullscreen"
                onClick={() => fullscreen.current?.showModal()}
                className={cn(toolbarButton, "hidden sm:inline-flex")}
              >
                <Maximize2 aria-hidden className="size-4" />
              </button>
            </>
          ) : null}

          <CopyButton value={rawCode} label="Copy source" />
        </div>
      </div>

      <div
        role="tabpanel"
        id={panelId("preview")}
        aria-labelledby={tabId("preview")}
        hidden={active !== "preview"}
        className={cn(
          "min-h-72 w-full b6-dot-canvas p-10",
          // `hidden` alone loses to a `display` utility, so the layout class is
          // only applied while the panel is the active one.
          active === "preview" ? "flex items-center justify-center" : "hidden",
        )}
      >
        {canvas}
      </div>

      <div
        role="tabpanel"
        id={panelId("code")}
        aria-labelledby={tabId("code")}
        hidden={active !== "code"}
      >
        {code}
      </div>

      {toolbar ? (
        <dialog
          ref={fullscreen}
          aria-label="Fullscreen preview"
          className="m-0 mx-auto mt-[6vh] h-[80vh] w-[calc(100%-3rem)] max-w-6xl overflow-hidden rounded-lg border border-border bg-card p-0 backdrop:bg-foreground/20 open:animate-scale"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-end border-b border-border bg-muted/60 p-1.5">
              <button
                type="button"
                aria-label="Close the fullscreen preview"
                onClick={() => fullscreen.current?.close()}
                className={toolbarButton}
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center overflow-auto b6-dot-canvas p-10">
              {preview}
            </div>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
