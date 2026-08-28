"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/** Storage key shared with the blocking script in `app/layout.tsx`. */
export const THEME_STORAGE_KEY = "b6-ui-theme";

/** How the theme reveal is scoped — matches the selector in `globals.css`. */
const REVEAL_ATTRIBUTE = "b6ThemeReveal";

/** `document.startViewTransition` is not in every browser, nor in lib.dom yet. */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

/** The `dark` class on `<html>` is the source of truth; subscribe to it. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const theme = React.useSyncExternalStore<Theme>(subscribe, getSnapshot, () => "light");

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    const apply = () => {
      root.classList.toggle("dark", next === "dark");
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Storage can be unavailable (private mode); the toggle still works.
      }
    };

    const { startViewTransition } = document as ViewTransitionDocument;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !startViewTransition) {
      apply();
      return;
    }

    root.dataset[REVEAL_ATTRIBUTE] = "";

    startViewTransition.call(document, apply).finished.finally(() => {
      delete root.dataset[REVEAL_ATTRIBUTE];
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-b6 hover:bg-muted hover:text-foreground"
    >
      {/*
        Both icons are always rendered and swapped by the `dark:` variant rather
        than by the value above: the blocking theme script runs before React
        hydrates, so a conditional render would disagree with the server's HTML.
      */}
      <span aria-hidden className="relative inline-flex size-4">
        <Sun className="absolute inset-0 size-4 scale-100 rotate-0 opacity-100 transition duration-300 ease-b6-out dark:scale-0 dark:-rotate-90 dark:opacity-0" />
        <Moon className="absolute inset-0 size-4 scale-0 rotate-90 opacity-0 transition duration-300 ease-b6-out dark:scale-100 dark:rotate-0 dark:opacity-100" />
      </span>
    </button>
  );
}
