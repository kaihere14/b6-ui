"use client";

import { CopyButton } from "@/components/site/copy-button";
import { PackageManagerMenu, usePackageManager } from "@/components/site/package-manager-menu";
import {
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
}

/** Terminal-styled block: package-manager menu, the command, a copy button. */
function CommandShell({
  command,
  packageManager,
  onSelect,
  label,
  className,
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
        <code className="font-mono text-code whitespace-nowrap">{command}</code>
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
