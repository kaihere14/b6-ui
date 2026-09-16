# B6 UI

B6 UI is an original React component library distributed as source code through the shadcn CLI. Components install directly into your repository as individual TypeScript files, giving you full ownership and customization control with no runtime package dependencies.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available Components](#available-components)
- [Development Scripts](#development-scripts)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [License](#license)

## Features

- **Distributed as Source Code**: Copy components directly into your project using the shadcn CLI with no runtime package dependencies.
- **Tailwind CSS v4 & React 19 Support**: Built specifically for React 19, Next.js 16, and Tailwind CSS v4.
- **Accessible Defaults**: Uses semantic HTML elements, visible focus rings, keyboard navigation, accessible labels/states, and `prefers-reduced-motion` handling.
- **B6 Design Tokens**: Components reference cohesive system tokens for colors (OKLCH), custom font size steps, border radius, elevation shadows, and motion curves.

## Requirements

- Node.js environment running [Bun](https://bun.sh) (`bun@1.4.0`).
- A React 19 project configured with Tailwind CSS v4.
- An initialized `components.json` file in your project.

## Installation

### 1. Install the Base

Run the base item installer once per project to write `lib/utils.ts` and merge B6 design tokens into your CSS variables:

```bash
npx shadcn@latest add https://ui.armandev.space/r/base.json
```

Or using Bun:

```bash
bunx --bun shadcn@latest add https://ui.armandev.space/r/base.json
```

### 2. Add a Component

Install individual components directly using their registry item URL:

```bash
npx shadcn@latest add https://ui.armandev.space/r/button-base.json
```

## Configuration

### Optional: Register the `@b6-ui` Namespace

To install components using short names instead of full URLs, register the `@b6-ui` registry namespace:

```bash
npx shadcn@latest registry add @b6-ui=https://ui.armandev.space/r/{name}.json
```

Alternatively, add the namespace directly to `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "utils": "@/lib/utils"
  },
  "registries": {
    "@b6-ui": "https://ui.armandev.space/r/{name}.json"
  }
}
```

After registering the namespace, install components using the short form:

```bash
npx shadcn@latest add @b6-ui/button-base
```

## Available Components

The repository defines the following components across six primary categories:

| Category | Slug                    | Title                 | Source Path                                                             |
| -------- | ----------------------- | --------------------- | ----------------------------------------------------------------------- |
| Buttons  | `button-base`           | Button Base           | `registry/button/button-base/button-base.tsx`                           |
| Buttons  | `magnetic-button`       | Magnetic Button       | `registry/button/magnetic-button/magnetic-button.tsx`                   |
| Buttons  | `cross-button`          | Cross Button          | `registry/buttons/cross-button/cross-button.tsx`                        |
| Buttons  | `stateful-button`       | Stateful Button       | `registry/button/stateful-button/stateful-button.tsx`                   |
| Buttons  | `glow-button`           | Glow Button           | `registry/button/glow-button/glow-button.tsx`                           |
| Buttons  | `depth-button`          | Depth Button          | `registry/button/depth-button/depth-button.tsx`                         |
| Forms    | `input`                 | Input                 | `registry/input/input/input.tsx`                                        |
| Display  | `badge`                 | Badge                 | `registry/badge/badge/badge.tsx`                                        |
| Display  | `thinking-orb`          | Thinking Orb          | `registry/orb/thinking-orb/thinking-orb.tsx`                            |
| Display  | `water-loading`         | Water Loading         | `registry/loading/water-loading/water-loading.tsx`                      |
| Display  | `circular-music-player` | Circular Music Player | `registry/music-player/circular-music-player/circular-music-player.tsx` |
| Text     | `handwritten-text`      | Handwritten Text      | `registry/text/handwritten-text/handwritten-text.tsx`                   |
| Text     | `writing-text`          | Writing Text          | `registry/text/writing-text/writing-text.tsx`                           |
| Graphs   | `activity-graph`        | Activity Graph        | `registry/graphs/activity-graph/activity-graph.tsx`                     |
| Graphs   | `dot-matrix-graph`      | Dot Matrix Graph      | `registry/graphs/dot-matrix-graph/dot-matrix-graph.tsx`                 |
| Layout   | `card-base`             | Card Base             | `registry/card/card-base/card-base.tsx`                                 |
| Layout   | `swipe-card`            | Swipe Card            | `registry/card/swipe-card/swipe-card.tsx`                               |
| Layout   | `separator`             | Separator             | `registry/separator/separator/separator.tsx`                            |
| Layout   | `sortable-dropdown`     | Sortable Dropdown     | `registry/dropdown/sortable-dropdown/sortable-dropdown.tsx`             |

## Development Scripts

Project scripts defined in `package.json` are executed using Bun:

Start the Next.js development server:

```bash
bun run dev
```

Build the Next.js production site:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

Run ESLint checks:

```bash
bun run lint
```

Automatically fix ESLint errors:

```bash
bun run lint:fix
```

Run TypeScript type checking without emitting files:

```bash
bun run typecheck
```

Format repository files with Prettier:

```bash
bun run format
```

Check repository formatting with Prettier:

```bash
bun run format:check
```

Execute the test suite:

```bash
bun run test
```

Build registry JSON files using shadcn CLI:

```bash
bun run registry:build
```

Check registry consistency between `registry.json`, `lib/registry.ts`, and component files:

```bash
bun run registry:check
```

Run all verification steps (registry check, typecheck, lint, test, build):

```bash
bun run verify
```

## Project Structure

```
├── app/                  # Next.js App Router application and documentation site
│   ├── (docs)/           # Documentation pages (/docs, /docs/installation, /components)
│   ├── globals.css       # Global stylesheet and Tailwind CSS v4 design tokens
│   ├── layout.tsx        # Root site layout
│   └── page.tsx          # Home page
├── components/
│   ├── previews/         # Live preview components and interactive examples
│   ├── site/             # Site header, navbar, sidebar, TOC, and documentation components
│   └── ui/               # Re-exports pointing to canonical registry source files
├── lib/
│   ├── constants.ts      # Site configuration and install command builders
│   ├── highlight.ts      # Server-side Shiki syntax highlighting engine
│   ├── registry.ts       # Metadata, props, and examples for documented components
│   ├── source.ts         # Utility for reading registry source files at render time
│   └── utils.ts          # Tailwind class merger (cn) extended for B6 type steps
├── public/
│   └── r/                # Generated JSON registry items output by shadcn build
├── registry/             # Canonical single-source-of-truth component files
├── scripts/
│   └── check-registry.ts # Verification script checking registry file integrity
└── tests/
    └── registry.test.ts  # Test suite validating registry configuration and metadata
```

## Testing

Run tests with Bun:

```bash
bun run test
```

Tests in `tests/registry.test.ts` verify:

- `registry.json` correctly declares the `b6-ui` namespace, theme, and base items.
- Component items map to valid single-file paths and install targets.
- Documentation metadata in `lib/registry.ts` matches all UI items in `registry.json`.
- Previews and usage example demos are defined for every documented component.

## License

This project is licensed under the [MIT License](LICENSE).
