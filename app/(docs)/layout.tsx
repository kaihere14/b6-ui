import { DocsSidebar } from "@/components/site/docs-sidebar";

/**
 * The documentation shell shared by `/components`, `/docs` and every component
 * page: registry index on the left, page in the middle, section index on the
 * right where the page provides one.
 *
 * The sidebar lives here rather than in a page so that moving between two
 * documentation pages re-renders only the middle column — the nav keeps its
 * scroll position and its open/closed state.
 */
export default function DocsLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto grid max-w-7xl gap-x-12 px-4 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)_12rem]">
      <DocsSidebar />
      {children}
    </div>
  );
}
