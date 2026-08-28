"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { CopyButton } from "@/components/site/copy-button";
import { PackageManagerMenu, usePackageManager } from "@/components/site/package-manager-menu";
import {
  easeB6Out,
  installCommand,
  namespacedInstallCommand,
  registerNamespaceCommand,
  type PackageManager,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CommandShellProps {
  command: string;
  packageManager: PackageManager;
  onSelect: (packageManager: PackageManager) => void;
  label: string;
  className?: string;
  /**
   * Rendered in place of the plain command text. `command` is still what the
   * copy button writes to the clipboard, so the two never drift.
   */
  body?: ReactNode;
}

/** Terminal-styled block: package-manager menu, the command, a copy button. */
function CommandShell({
  command,
  packageManager,
  onSelect,
  label,
  className,
  body,
}: CommandShellProps) {
  return (
    <div className={cn("rounded-md border border-border bg-card", className)}>
      <div className="flex items-center justify-between gap-2 rounded-t-md border-b border-border bg-muted/60 p-1.5">
        <PackageManagerMenu value={packageManager} onSelect={onSelect} />
        <CopyButton value={command} label={label} />
      </div>
      <div className="flex items-start gap-2 overflow-x-auto px-3 py-2.5">
        <span aria-hidden className="font-mono text-code text-muted-foreground select-none">
          $
        </span>
        {body ?? <code className="font-mono text-code whitespace-nowrap">{command}</code>}
      </div>
    </div>
  );
}

interface InstallCommandProps {
  /** Registry item slug, e.g. `button-base`. */
  slug: string;
  /**
   * `url` (default) writes the full registry item URL, which installs with no
   * `registries` entry in the consumer's components.json. `namespace` writes the
   * short `@b6-ui/<slug>` form, which requires that entry.
   */
  variant?: "url" | "namespace";
  className?: string;
}

/** The shadcn command that installs a B6 UI component. */
export function InstallCommand({ slug, variant = "url", className }: InstallCommandProps) {
  const [packageManager, setPackageManager] = usePackageManager();
  const command =
    variant === "namespace"
      ? namespacedInstallCommand(slug, packageManager)
      : installCommand(slug, packageManager);

  return (
    <CommandShell
      command={command}
      packageManager={packageManager}
      onSelect={setPackageManager}
      label="Copy install command"
      className={className}
    />
  );
}

/** The one-time command that adds the `@b6-ui` namespace to components.json. */
export function RegisterNamespaceCommand({ className }: { className?: string }) {
  const [packageManager, setPackageManager] = usePackageManager();

  return (
    <CommandShell
      command={registerNamespaceCommand(packageManager)}
      packageManager={packageManager}
      onSelect={setPackageManager}
      label="Copy registry command"
      className={className}
    />
  );
}

/** How long one item name holds before the next types in, in milliseconds. */
const ROTATE_INTERVAL = 2600;
/** Seconds between one character's entrance and the next. */
const CHAR_STAGGER = 0.025;

interface RotatingInstallCommandProps {
  /** Registry item slugs to cycle through, in order. */
  slugs: string[];
  className?: string;
}

/**
 * The install command with its item name cycling through the registry, one
 * character at a time — each character rises into place from below while the
 * outgoing name lifts away.
 *
 * Only the `<slug>.json` tail moves — the runner and the registry origin are
 * fixed and muted, so the eye stays on the part that changes, which carries the
 * brand colour from the mark. Rotation pauses while the
 * pointer is over the block, so the command cannot change out from under a
 * click on copy, and the clipboard always gets the command on screen.
 *
 * Under `prefers-reduced-motion` nothing rotates: the first slug stays put and
 * the block behaves exactly like `InstallCommand`.
 */
export function RotatingInstallCommand({ slugs, className }: RotatingInstallCommandProps) {
  const [packageManager, setPackageManager] = usePackageManager();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slug = slugs[index] ?? slugs[0];
  const command = installCommand(slug, packageManager);
  /** The animated tail, and everything ahead of it that never changes. */
  const suffix = `${slug}.json`;
  const prefix = command.slice(0, command.length - suffix.length);

  useEffect(() => {
    if (reduced || paused || slugs.length < 2) return;
    const id = setInterval(
      () => setIndex((current) => (current + 1) % slugs.length),
      ROTATE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [reduced, paused, slugs.length]);

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <CommandShell
        command={command}
        packageManager={packageManager}
        onSelect={setPackageManager}
        label="Copy install command"
        className={className}
        body={
          <code className="font-mono text-code whitespace-nowrap">
            <span className="sr-only">{command}</span>
            <span aria-hidden className="text-muted-foreground">
              {prefix}
            </span>
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={suffix}
                aria-hidden
                className="inline-block text-brand"
                exit={reduced ? undefined : { opacity: 0, y: "-0.5em" }}
                transition={{ duration: 0.12, ease: easeB6Out }}
              >
                {[...suffix].map((character, position) => (
                  <motion.span
                    key={position}
                    className="inline-block whitespace-pre"
                    initial={reduced ? false : { opacity: 0, y: "0.5em" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.26,
                      ease: easeB6Out,
                      delay: position * CHAR_STAGGER,
                    }}
                  >
                    {character}
                  </motion.span>
                ))}
              </motion.span>
            </AnimatePresence>
          </code>
        }
      />
    </div>
  );
}
