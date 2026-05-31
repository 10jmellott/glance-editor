# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A visual UI editor for composing [Glance](https://github.com/glanceapp/glance) dashboard YAML configuration files. Users build multi-page dashboards with columns and widgets through a GUI, then export the result as a valid `glance.yml`.

## Commands

```bash
npm run dev        # Start dev server (localhost)
npm run build      # Build for GitHub Pages (static SPA)
npm run postinstall  # Regenerate Nuxt type artifacts (run after adding modules)
```

No test or lint scripts are configured yet.

## Architecture

**Stack:** Nuxt 4 (SPA mode, SSR disabled), Vue 3, TypeScript, Pinia, js-yaml

**Single store:** `app/stores/config.ts` — the entire app state lives here. It holds pages, columns, widgets, server config, theme, branding, and env vars. It auto-persists to `localStorage` under key `glance-editor-v1` and generates YAML on demand. Start here when tracing any data flow.

**Type system:** `app/types/glance.ts` defines all TypeScript interfaces mirroring the Glance config schema. Every widget type, column layout, and config option is typed here. Consult `docs/glance-config.md` for the upstream Glance spec when adding new widget types.

**Layout:**
```
AppTopBar          (top)
PageListSidebar    (left)   — page CRUD and reordering
EditorCanvas       (center) — column/widget layout preview
SettingsPanel      (right)  — dynamic form for selected widget
YamlPreview        (modal)  — rendered YAML output + import
```

**Widget forms** live in `app/components/widgets/`. Each widget type has its own component rendered by `SettingsPanel` based on the selected widget's `type` field. When adding a new widget type, create the form component here and register it in `SettingsPanel` and `app/utils/widgetIcons.ts`.

**Design tokens** are in `app/assets/css/tokens.css` — use CSS custom properties (`--color-void`, `--space-4`, etc.) rather than hardcoded values. The design guide is at `docs/design-guide.md`.

## Key Conventions

- YAML serialization/download helpers are in `app/utils/yaml.ts` — keep all yaml logic there.
- The store exposes actions for all mutations (add/remove/move pages, columns, widgets). Components should not mutate state directly.
- Widget movement (up/down within column, left/right between columns) is handled by store actions, not component logic.
