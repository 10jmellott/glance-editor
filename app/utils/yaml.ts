import yaml from 'js-yaml'
import type { GlanceConfig, Page, Column, Widget, ServerConfig, ThemeConfig, BrandingConfig, EnvVar } from '~/types/glance'

function stripIds<T extends object>(obj: T): Omit<T, 'id'> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'id') continue
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'object' && item !== null ? stripIds(item as object) : item
      )
    } else if (typeof value === 'object') {
      result[key] = stripIds(value as object)
    } else {
      result[key] = value
    }
  }
  return result as Omit<T, 'id'>
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export interface ParsedImport {
  pages: Page[]
  server: ServerConfig
  theme: ThemeConfig
  branding: BrandingConfig
}

export function parseConfig(yamlText: string): ParsedImport {
  const raw = yaml.load(yamlText) as Record<string, unknown>

  const rawPages = (raw.pages as Record<string, unknown>[] | undefined) ?? []
  const pages: Page[] = rawPages.map((p) => {
    const rawCols = (p.columns as Record<string, unknown>[] | undefined) ?? []
    const columns: Column[] = rawCols.map((c) => {
      const rawWidgets = (c.widgets as Record<string, unknown>[] | undefined) ?? []
      const widgets: Widget[] = rawWidgets.map((w) => ({ ...w, id: genId() } as Widget))
      return { ...c, id: genId(), widgets } as Column
    })
    return { ...p, id: genId(), columns } as Page
  })

  return {
    pages,
    server: (raw.server as ServerConfig) ?? {},
    theme: (raw.theme as ThemeConfig) ?? {},
    branding: (raw.branding as BrandingConfig) ?? {},
  }
}

export function serializeConfig(config: GlanceConfig): string {
  const clean = stripIds(config)
  return yaml.dump(clean, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
  })
}

export function downloadEnv(content: string, filename = '.env'): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadYaml(config: GlanceConfig, filename = 'glance.yml'): void {
  const content = serializeConfig(config)
  const blob = new Blob([content], { type: 'text/yaml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
