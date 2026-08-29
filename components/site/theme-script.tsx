"use client";

import { useServerInsertedHTML } from "next/navigation";

const themeScript = `(function(){try{var s=localStorage.getItem("b6-ui-theme");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script id="theme-script" dangerouslySetInnerHTML={{ __html: themeScript }} />
  ));

  return null;
}
