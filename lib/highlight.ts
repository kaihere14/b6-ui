import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import bash from "shiki/langs/bash.mjs";
import css from "shiki/langs/css.mjs";
import json from "shiki/langs/json.mjs";
import tsx from "shiki/langs/tsx.mjs";
import vitesseDark from "shiki/themes/vitesse-dark.mjs";
import vitesseLight from "shiki/themes/vitesse-light.mjs";

/**
 * Server-side syntax highlighting.
 *
 * Every code sample on the site is highlighted at render time on the server, so
 * the browser receives plain HTML and no highlighter ships to the client. The
 * grammars and themes are imported one by one rather than through the `shiki`
 * bundle entry, which would pull in every language Shiki knows.
 *
 * Both themes are emitted at once (`defaultColor: false`): each token carries a
 * `--shiki-light` and a `--shiki-dark` custom property, and `app/globals.css`
 * picks the pair that matches the active theme. Nothing re-highlights on toggle.
 */

/** Languages with a grammar loaded. Anything else must be a plain language. */
const grammars = ["tsx", "bash", "json", "css"] as const;

/** Languages Shiki renders without a grammar, as unstyled text. */
const plainLanguages = ["text", "plaintext", "txt", "plain"] as const;

export const codeLanguages = [...grammars, ...plainLanguages] as const;

export type CodeLanguage = (typeof codeLanguages)[number];

let highlighter: Promise<HighlighterCore> | null = null;

/** One highlighter per process, because creating it parses every grammar. */
function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [vitesseLight, vitesseDark],
    langs: [tsx, bash, json, css],
    // The JavaScript engine keeps the WASM Oniguruma build out of the server
    // bundle. It handles all four grammars above.
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/**
 * Highlight `code` and return the `<pre>` markup for it.
 *
 * @param language Must be a loaded grammar or a plain language.
 */
export async function highlight(code: string, language: CodeLanguage = "tsx") {
  const shiki = await getHighlighter();

  return shiki.codeToHtml(code.trimEnd(), {
    lang: language,
    themes: { light: "vitesse-light", dark: "vitesse-dark" },
    defaultColor: false,
  });
}
