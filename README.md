# B6 UI

**Components you own.**

B6 UI is an original React component library with its own design language. It is not published
as an npm package — components are distributed as **source code** through a shadcn-compatible
registry. You run one command, the file lands in your repository, and it is yours to change.

```bash
bunx --bun shadcn add @b6-ui/button-base
```

> B6 UI is designed and coded from scratch. It borrows the _developer experience_ of
> shadcn-style registries and nothing else — no components, class strings, or visual identity
> from Aceternity UI, shadcn/ui, Magic UI, or any other library.

---

## Contents

- [Quick start](#quick-start)
- [Using B6 UI in your project](#using-b6-ui-in-your-project)
- [How the pipeline works](#how-the-pipeline-works)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Adding a new component](#adding-a-new-component)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Quick start

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev            # http://localhost:3000
```

Verify everything before you push:

```bash
bun run verify         # registry check + typecheck + lint + tests + build
```

---

## Using B6 UI in your project

You need a React project on Tailwind CSS v4 with a `components.json` (run
`bunx --bun shadcn@latest init` if you do not have one).

**1. Register the namespace once**

```bash
bunx --bun shadcn@latest registry add @b6-ui=https://ui.armandev.space/r/{name}.json
```

or add it to `components.json` by hand:

```json
{
  "registries": {
    "@b6-ui": "https://ui.armandev.space/r/{name}.json"
  }
}
```

**2. Add a component**

```bash
bunx --bun shadcn add @b6-ui/button-base
```

The CLI writes `components/ui/button-base.tsx`, installs the npm dependencies the item
declares, and merges the B6 design tokens into your stylesheet.

**3. Use it**

```tsx
import { ButtonBase } from "@/components/ui/button-base";

<ButtonBase>Get Started</ButtonBase>
<ButtonBase variant="secondary">Learn More</ButtonBase>
```

### Components

| Component     | Install                                    |
| ------------- | ------------------------------------------ |
| Button Base   | `bunx --bun shadcn add @b6-ui/button-base` |
| Card Base     | `bunx --bun shadcn add @b6-ui/card-base`   |
| Badge         | `bunx --bun shadcn add @b6-ui/badge`       |
| Input         | `bunx --bun shadcn add @b6-ui/input`       |
| Separator     | `bunx --bun shadcn add @b6-ui/separator`   |
| Design tokens | `bunx --bun shadcn add @b6-ui/tokens`      |

---

## How the pipeline works

```
registry/button-base/button-base.tsx     source of truth
            │
            ├──► components/ui/button-base.tsx      re-export, used by the docs site
            │              │
            │              └──► components/previews/…   live preview on the website
            │
            └──► registry.json ──► shadcn build ──► public/r/button-base.json
                                                            │
                                                            ▼
                                                   bunx shadcn add @b6-ui/button-base
                                                            │
                                                            ▼
                                        consumer's components/ui/button-base.tsx
```

Component logic exists in exactly one place. The docs site imports it, the registry ships it,
and the source panel on each component page reads that same file from disk — so what you see
documented is byte-for-byte what you install.

---

## Project structure

```
app/                       Next.js App Router — pages only
  globals.css              the design system: every token lives here
  components/              /components and /components/[slug]
  docs/                    /docs and /docs/installation
components/
  ui/                      thin re-exports of registry/
  previews/                one preview per component
  site/                    documentation-site components (never distributed)
registry/<slug>/<slug>.tsx source of truth for each component
lib/                       cn(), docs metadata, site config, source reader
types/                     shared TypeScript types
scripts/                   registry integrity check
tests/                     bun test
registry.json              shadcn registry definition
public/r/                  generated registry JSON — committed, never hand-edited
```

---

## Design system

Everything visual resolves to a token in `app/globals.css`. Components never hard-code a
value.

- **Colour** — semantic oklch tokens: `background`, `foreground`, `card`, `popover`, `primary`,
  `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, each with a
  foreground pair where it carries text. Light and dark are both first-class.
- **Typography** — eight steps: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`,
  `text-small`, `text-caption`, `text-code`. Each ships its own line-height and tracking.
- **Spacing** — Tailwind's 0.25rem scale, unmodified.
- **Radius** — derived from one `--b6-radius` base: `rounded-xs` through `rounded-xl`.
- **Elevation** — `shadow-b6-xs` through `shadow-b6-lg`.
- **Motion** — two easing curves (`ease-b6`, `ease-b6-out`) and five named animations: fade,
  slide, scale, expand, collapse. All honour `prefers-reduced-motion`.

---

## Adding a new component

The slug is the contract — folder name, file name, export path, docs URL, and `shadcn add`
argument all use it. Kebab-case.

1. **Write the source** — `registry/<slug>/<slug>.tsx`. This exact file is what consumers
   receive.
2. **Re-export it** — `components/ui/<slug>.tsx`:
   ```ts
   export * from "@/registry/<slug>/<slug>";
   ```
3. **Add a preview** — `components/previews/<slug>-preview.tsx`, then register it in
   `components/previews/index.ts`.
4. **Document it** — add a `ComponentMeta` entry to `lib/registry.ts`: description, props,
   examples, accessibility notes, responsive behaviour.
5. **Register it** — add an item to `registry.json`:
   ```json
   {
     "name": "toggle",
     "type": "registry:ui",
     "title": "Toggle",
     "description": "…",
     "dependencies": ["class-variance-authority"],
     "registryDependencies": ["@b6-ui/tokens"],
     "files": [
       {
         "path": "registry/toggle/toggle.tsx",
         "type": "registry:ui",
         "target": "components/ui/toggle.tsx"
       }
     ]
   }
   ```
6. **Build and verify**:
   ```bash
   bun run registry:build
   bun run verify
   ```

`bun run registry:check` fails if `registry.json`, `lib/registry.ts`, and the files on disk
disagree, so a half-wired component cannot reach `main`.

### Testing the install flow locally

```bash
bun run registry:build
bunx --bun serve public          # or any static server on the public/ folder
# in a scratch project, point components.json at http://localhost:3000/r/{name}.json
bunx --bun shadcn add @b6-ui/button-base
```

---

## Scripts

| Script                   | What it does                                  |
| ------------------------ | --------------------------------------------- |
| `bun run dev`            | Development server                            |
| `bun run build`          | Production build                              |
| `bun run start`          | Serve the production build                    |
| `bun run lint`           | ESLint                                        |
| `bun run typecheck`      | `tsc --noEmit`                                |
| `bun run test`           | `bun test` — registry integrity               |
| `bun run format`         | Prettier                                      |
| `bun run registry:check` | registry.json ↔ lib/registry.ts ↔ disk parity |
| `bun run registry:build` | Regenerate `public/r/*.json`                  |
| `bun run verify`         | All of the above, in the order CI runs them   |

---

## Contributing

Branches:

```
main        released, always green
develop     integration
feature/*   one branch per unit of work
```

```bash
git checkout -b feature/button-base
git add .
git commit -m "feat: add button base"
git push origin feature/button-base
```

Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`,
`chore:`). Open the pull request against `develop`. `bun run verify` must pass.

Repository rules for humans and AI agents alike live in [AGENTS.md](./AGENTS.md).

---

## License

[MIT](./LICENSE)
# b6-ui
