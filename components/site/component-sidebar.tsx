"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { components } from "@/lib/registry";
import { cn } from "@/lib/utils";

/** Index of every registry item, shown alongside the component pages. */
export function ComponentSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Components" className="lg:sticky lg:top-20">
      <p className="mb-3 text-caption text-muted-foreground uppercase">Components</p>
      <ul className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {components.map((component) => {
          const href = `/components/${component.slug}`;
          const active = pathname === href;
          return (
            <li key={component.slug}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-sm px-3 py-1.5 text-small whitespace-nowrap transition-colors duration-150 ease-b6",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {component.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
