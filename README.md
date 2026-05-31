# Glance Editor UI

A visual UI editor for composing [Glance](https://github.com/glanceapp/glance) dashboard YAML configuration files. Build multi-page dashboards with columns and widgets through a GUI, then export or copy the resulting `glance.yml`.

## Features

- **Visual layout editor** — add and arrange pages, columns, and 20+ widget types
- **Widget configuration** — form-based settings panel for every widget type
- **YAML export** — generate valid `glance.yml` output ready to drop into your Glance instance
- **YAML import** — paste an existing config to load it into the editor
- **Persistent state** — editor state is saved to localStorage automatically

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build   # Builds static site for GitHub Pages
```

## Resources

- [Glance Config Reference](/docs/glance-config.md)
- [Design Guide](/docs/design-guide.md)
- [Glance project](https://github.com/glanceapp/glance)
