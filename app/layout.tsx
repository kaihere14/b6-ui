import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { siteConfig } from "@/lib/constants";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong palette. Kept inline and dependency-free on purpose.
 *
 * It stays a raw `<script>` rather than `next/script`: `beforeInteractive`
 * queues an inline script onto `self.__next_s`, which is drained by an `async`
 * chunk, so the class would land after the first paint and the flash would be
 * back. A parse-blocking tag in `<head>` is the only thing that runs early
 * enough.
 *
 * React logs "Encountered a script tag while rendering React component" for
 * this in development. That warning is about client rendering, where React
 * never executes a script it creates — this one only ever has to run from the
 * server-rendered HTML, where the browser does execute it.
 */
const themeScript = `(function(){try{var s=localStorage.getItem("b6-ui-theme");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-small"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
