# glance-editor — Design Guidelines

A reference for visual design decisions, component patterns, and the color system used throughout the editor. The goal is a focused, quiet UI that stays out of the way of the configuration work.

---

## Design Philosophy

**Minimal, not sparse.** The editor should feel calm and purposeful — every element earns its place. Decorative chrome, gradients, shadows, and animation are avoided unless they carry functional meaning.

**Components, not one-offs.** Every repeated pattern (form row, card, pill, icon button) is a shared component. New UI is built by composing existing pieces, not adding new styles.

**The config is the product.** The UI surfaces the Glance configuration — it doesn't compete with it. Sidebar, toolbar, and settings panels are subordinate to the canvas.

---

## Color Palette

Inspired by Monokai Pro's soft, desaturated pastels. Warm neutrals anchor the UI; accent colors are deliberate and restrained.

### Base

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background | Void | `#1e1c1e` | App-level background |
| Surface | Charcoal | `#2d2a2e` | Sidebar, panels |
| Raised | Ash | `#3a373b` | Cards, dropzones, canvas columns |
| Border | Smoke | `#4a474b` | Dividers, input borders, widget card outlines |
| Border subtle | Haze | `#3e3b3f` | Subtle separators within panels |

### Text

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary | Cream | `#fcfcfa` | Headings, active labels, widget titles |
| Secondary | Fog | `#c1bec6` | Body text, field labels, descriptions |
| Muted | Dusk | `#7a7680` | Placeholders, disabled states, hints |

### Accents

These are used sparingly — one accent per context, never decoratively.

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary action | Blossom | `#ff6188` | Primary buttons, active page indicator, focus rings |
| Confirm / add | Sage | `#a9dc76` | Add widget, success states, positive indicators |
| Warning | Saffron | `#ffd866` | Unsaved changes indicator, caution states |
| Info / link | Periwinkle | `#78dce8` | Links, info badges, type labels |
| Special | Lavender | `#ab9df2` | Widget type chips, special callouts |
| Orange | Ember | `#fc9867` | Destructive confirm hover, error highlights |

### Usage Rules

- **Never use more than two accent colors in the same view.** The canvas uses Periwinkle for widget type labels; the sidebar uses Blossom for active states. They don't compete.
- Accents appear on text or small icon/badge surfaces — never as large filled backgrounds.
- All interactive state changes (hover, focus, active) are expressed through opacity or border shifts on the base palette, not accent swaps.
- Light/dark variants of the UI are not scoped — the editor is dark-only.

---

## Typography

One typeface, two weights.

| Element | Weight | Size | Color |
|---|---|---|---|
| Page heading | 500 | 13px | Cream |
| Section label | 500 | 11px uppercase | Dusk |
| Body / label | 400 | 13px | Fog |
| Input value | 400 | 13px | Cream |
| Hint / placeholder | 400 | 12px | Dusk |
| Widget type chip | 500 | 11px | Periwinkle |
| Code / YAML preview | 400 | 12px mono | Fog |

- Section labels use uppercase + `letter-spacing: 0.06em` to distinguish structural groupings without adding visual weight.
- No font sizes below 11px.
- Line height is `1.5` for body copy, `1.2` for single-line labels.

---

## Spacing

An 8px base grid. Use multiples exclusively: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`.

- Within a component (e.g. between a label and its input): `4–8px`
- Between components in a panel (e.g. between form rows): `12–16px`
- Between sections within a panel: `24px`, separated by a `1px` Haze border
- Panel internal padding: `16px`
- Canvas gutter between columns: `12px`
- Widget card internal padding: `12px`

---

## Layout

The editor shell has three persistent regions:

```
┌────────────┬────────────────────────────┬──────────────┐
│  Page List │        Canvas              │  Settings    │
│  (sidebar) │  (columns → widget cards)  │  Panel       │
│  200px     │  flex-fill                 │  280px       │
└────────────┴────────────────────────────┴──────────────┘
```

- All three panels are fixed-height (viewport), independently scrollable.
- The top bar spans the full width and holds global controls (theme pickers, port, export button). Height: `48px`.
- No horizontal scroll on the canvas — column layout adapts to available width within the canvas region.

---

## Components

### Widget Card

The atomic unit of the canvas. Represents one widget in a column.

- Background: Raised (`#3a373b`)
- Border: `1px solid` Smoke (`#4a474b`)
- Border radius: `6px`
- Padding: `12px`
- On hover: border shifts to `Blossom` at `60%` opacity
- On selected (settings open): border is solid `Blossom`
- Drag handle: appears on left edge on hover — three horizontal dots in Dusk
- Type chip: pill in the card header — `background: transparent`, `color: Periwinkle`, `border: 1px solid Periwinkle at 40%`, `font-size: 11px`, `border-radius: 4px`, `padding: 2px 6px`
- Title text: Cream, 13px, 500 weight
- Action icons (duplicate, delete) appear on hover, right-aligned, in Dusk — turning Blossom (delete) or Sage (duplicate) on their own hover

### Panel Section

Used to group related settings within the right panel.

- Section label: uppercase Dusk, `11px`, `letter-spacing: 0.06em`
- Separator: `1px solid` Haze, `margin: 16px 0`
- No background change — sections are defined by label + separator alone

### Form Row

Label above input, full-width.

- Label: `12px`, Fog, `margin-bottom: 4px`
- Input: `height: 32px`, `background: Void`, `border: 1px solid Smoke`, `border-radius: 4px`, `color: Cream`, `font-size: 13px`, `padding: 0 8px`
- Input focus: border shifts to `Periwinkle`, no box-shadow
- Hint text below input: `12px`, Dusk

### Repeatable List (feeds, channels, repos, etc.)

A vertically stacked list of items, each with a drag handle and a delete icon.

- Each row uses the same height as a form input (`32px`), with a left drag handle in Dusk and a right-aligned delete icon
- An "Add item" row sits below the list — `12px`, Sage color, leading `+` icon
- No card wrapper around the list — it lives directly within the panel section

### Toggle

For boolean widget options (`show-thumbnails`, `new-tab`, etc.).

- A minimal sliding toggle: `32px × 18px`, track color Smoke (off) / Sage (on)
- Label to the left, toggle to the right, full-width row
- No intermediate state

### Dropdown / Select

For enumerated options (`sort-by`, `units`, `style`, column size, etc.).

- Same height and styling as text input
- Chevron icon right-aligned in Dusk
- Options list: `background: Charcoal`, `border: 1px solid Smoke`, `border-radius: 4px`, items `32px` tall, hover state `background: Raised`

### Button — Primary

Used only for the Export action and modal confirmation.

- `background: Blossom`, `color: Void`, `font-weight: 500`, `font-size: 13px`, `border-radius: 4px`, `height: 32px`, `padding: 0 16px`
- Hover: `Blossom` at `85%` opacity
- No shadow

### Button — Ghost

Used for secondary actions (cancel, add page, add column).

- `background: transparent`, `border: 1px solid Smoke`, `color: Fog`, `border-radius: 4px`, `height: 32px`, `padding: 0 12px`
- Hover: `background: Raised`

### Icon Button

For inline actions (drag, delete, duplicate, collapse).

- `24px × 24px`, `border-radius: 4px`, no border
- Hover: `background: Raised`
- Color: Dusk at rest; action-specific accent on hover

---

## Iconography

Use a single icon library throughout — no mixing sets. Icons should be `16px` for inline/action use, `20px` for nav/section-level use.

Icons are outline style only. Fill variants are not used.

---

## Interaction States

| State | Treatment |
|---|---|
| Default | Base styles as documented per component |
| Hover | Border opacity shift, or background shift to Raised — never both |
| Focus | Border changes to Periwinkle — no box-shadow |
| Active / pressed | `scale(0.97)` transform on buttons |
| Selected | Border changes to solid Blossom |
| Disabled | Opacity `0.4`, `cursor: not-allowed` |
| Drag active | Card lifts with `scale(1.02)`, drop targets highlight border in Sage |
| Destructive confirm | Button border and icon shift to Ember before action fires |

---

## YAML Preview Panel

The export panel is a split-pane sheet that slides up from the bottom or in from the right (implementation's choice). It contains:

- A monospace code block: `background: Void`, `color: Fog`, `font-size: 12px`, `line-height: 1.6`, `padding: 16px`, no line numbers
- Syntax is not highlighted — the panel is for review and copy, not editing
- A copy button (top-right of code block) and a download button (in the panel header)
- The `.env` tab uses the same treatment

---

## Do / Don't

**Do:**
- Reuse existing components for every new pattern
- Use CSS custom properties for every color and spacing token
- Express hierarchy through spacing and text weight, not borders or backgrounds
- Use a single accent color per functional region

**Don't:**
- Add drop shadows, gradients, or blur effects
- Introduce a new font size not in the type scale
- Use an accent color for a large filled background
- Create one-off styles outside the component system
- Use color to convey the only signal — pair it with shape, weight, or position