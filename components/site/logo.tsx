import Image from "next/image";

import { cn } from "@/lib/utils";

/** The B6 mark: the flame beside the wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        // Decorative: the wordmark beside it already names the site.
        alt=""
        aria-hidden
        src="/logo.webp"
        // Rendered size, not the asset's: it keeps the 1308×1203 aspect ratio
        // while telling Next to generate a 64px srcset rather than a 1080px one.
        width={62}
        height={57}
        priority
        className="h-7 w-auto"
      />
      <span className="font-semibold tracking-tight self-end">B6 UI</span>
    </span>
  );
}
