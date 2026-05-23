import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { serializeConfig, parseConfig } from '~/utils/yaml'
import type { GlanceConfig, Page, Column, Widget, ServerConfig, ThemeConfig, BrandingConfig, EnvVar } from '~/types/glance'

const STORAGE_KEY = 'glance-editor-v1'

interface PersistedState {
  pages: Page[]
  activePageId: string
  server: ServerConfig
  theme: ThemeConfig
  branding: BrandingConfig
  envVars: EnvVar[]
}

function loadSaved(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PersistedState) : null
  } catch {
    return null
  }
}

function persistState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // quota exceeded or unavailable
  }
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function makeColumn(size: 'full' | 'small' = 'full'): Column {
  return { id: generateId(), size, widgets: [] }
}

function makePage(name: string): Page {
  return {
    id: generateId(),
    name,
    columns: [makeColumn('full'), makeColumn('small')],
  }
}

function makeWidget(type: string): Widget {
  const base: Widget = { id: generateId(), type, title: '' }
  if (type === 'weather') return { ...base, location: '', units: 'metric', 'hour-format': '12h' }
  if (type === 'clock') return { ...base, 'hour-format': '12h' }
  if (type === 'search') return { ...base, 'search-engine': 'duckduckgo', autofocus: false }
  if (type === 'rss') return { ...base, style: 'vertical-list', feeds: [] }
  if (type === 'bookmarks') return { ...base, groups: [] }
  if (type === 'monitor') return { ...base, sites: [] }
  if (type === 'videos') return { ...base, channels: [], style: 'horizontal-cards' }
  if (type === 'markets') return { ...base, markets: [] }
  if (type === 'releases') return { ...base, repositories: [] }
  if (type === 'server-stats') return { ...base, servers: [{ type: 'local' }] }
  if (type === 'reddit') return { ...base, subreddit: '', style: 'vertical-list' }
  if (type === 'hacker-news') return { ...base }
  if (type === 'lobsters') return { ...base }
  if (type === 'to-do') return { ...base }
  if (type === 'calendar') return { ...base }
  if (type === 'calendar-legacy') return { ...base }
  if (type === 'iframe') return { ...base, source: '', height: 300 }
  if (type === 'docker-containers') return { ...base }
  if (type === 'dns-stats') return { ...base, service: 'adguard', url: '' }
  if (type === 'twitch-channels') return { ...base, channels: [] }
  if (type === 'twitch-top-games') return { ...base }
  if (type === 'repository') return { ...base, repository: '' }
  if (type === 'change-detection') return { ...base }
  if (type === 'extension') return { ...base, url: '' }
  if (type === 'custom-api') return { ...base, method: 'GET', 'body-type': 'json', template: '' }
  return base
}

function hasValues(obj: Record<string, unknown>): boolean {
  return Object.values(obj).some((v) => v !== undefined && v !== null && v !== '')
}

export const useConfigStore = defineStore('config', () => {
  const saved = loadSaved()
  const defaultPage = makePage('Home')

  const pages = ref<Page[]>(saved?.pages ?? [defaultPage])
  const activePageId = ref<string>(saved?.activePageId ?? defaultPage.id)
  const selectedWidgetId = ref<string | null>(null)
  const showYamlPreview = ref(false)

  const server = ref<ServerConfig>(saved?.server ?? {})
  const theme = ref<ThemeConfig>(saved?.theme ?? {})
  const branding = ref<BrandingConfig>(saved?.branding ?? {})
  const envVars = ref<EnvVar[]>(saved?.envVars ?? [])

  const activePage = computed(
    () => pages.value.find((p) => p.id === activePageId.value) ?? pages.value[0]
  )

  const selectedWidget = computed<Widget | null>(() => {
    if (!selectedWidgetId.value) return null
    for (const page of pages.value) {
      for (const col of page.columns) {
        const found = col.widgets.find((w) => w.id === selectedWidgetId.value)
        if (found) return found
      }
    }
    return null
  })

  const glanceConfig = computed<GlanceConfig>(() => {
    const config: GlanceConfig = { pages: pages.value }
    if (hasValues(server.value as Record<string, unknown>)) config.server = server.value
    if (hasValues(theme.value as Record<string, unknown>)) config.theme = theme.value
    if (hasValues(branding.value as Record<string, unknown>)) config.branding = branding.value
    return config
  })

  const yamlOutput = computed(() => serializeConfig(glanceConfig.value))

  const envOutput = computed(() =>
    envVars.value
      .filter((v) => v.name.trim())
      .map((v) => `${v.name.trim()}=${v.value}`)
      .join('\n')
  )

  function addPage(name: string) {
    const page = makePage(name)
    pages.value.push(page)
    activePageId.value = page.id
  }

  function removePage(pageId: string) {
    const idx = pages.value.findIndex((p) => p.id === pageId)
    if (idx === -1 || pages.value.length === 1) return
    pages.value.splice(idx, 1)
    if (activePageId.value === pageId) {
      activePageId.value = pages.value[Math.max(0, idx - 1)].id
    }
  }

  function setActivePage(pageId: string) {
    activePageId.value = pageId
    selectedWidgetId.value = null
  }

  function renamePage(pageId: string, name: string) {
    const page = pages.value.find((p) => p.id === pageId)
    if (page && name.trim()) page.name = name.trim()
  }

  function addColumn(pageId: string, size: 'full' | 'small' = 'full') {
    const page = pages.value.find((p) => p.id === pageId)
    if (!page || page.columns.length >= 3) return
    page.columns.push(makeColumn(size))
  }

  function removeColumn(columnId: string) {
    for (const page of pages.value) {
      const idx = page.columns.findIndex((c) => c.id === columnId)
      if (idx === -1) continue
      if (page.columns.length <= 1) return
      page.columns.splice(idx, 1)
      return
    }
  }

  function setColumnSize(columnId: string, size: 'full' | 'small') {
    for (const page of pages.value) {
      const col = page.columns.find((c) => c.id === columnId)
      if (!col) continue
      if (size === 'small') {
        const fullCount = page.columns.filter((c) => c.size === 'full').length
        if (fullCount <= 1) return
      }
      col.size = size
      return
    }
  }

  function addWidget(columnId: string, type: string) {
    for (const page of pages.value) {
      const col = page.columns.find((c) => c.id === columnId)
      if (col) {
        const widget = makeWidget(type)
        col.widgets.push(widget)
        selectedWidgetId.value = widget.id
        return
      }
    }
  }

  function updateWidget(widgetId: string, patch: Partial<Widget>) {
    for (const page of pages.value) {
      for (const col of page.columns) {
        const idx = col.widgets.findIndex((w) => w.id === widgetId)
        if (idx !== -1) {
          col.widgets[idx] = { ...col.widgets[idx], ...patch }
          return
        }
      }
    }
  }

  function removeWidget(widgetId: string) {
    for (const page of pages.value) {
      for (const col of page.columns) {
        const idx = col.widgets.findIndex((w) => w.id === widgetId)
        if (idx !== -1) {
          col.widgets.splice(idx, 1)
          if (selectedWidgetId.value === widgetId) selectedWidgetId.value = null
          return
        }
      }
    }
  }

  function selectWidget(widgetId: string | null) {
    selectedWidgetId.value = widgetId
  }

  function updateServer(patch: Partial<ServerConfig>) {
    server.value = { ...server.value, ...patch }
  }

  function updateTheme(patch: Partial<ThemeConfig>) {
    theme.value = { ...theme.value, ...patch }
  }

  function updateBranding(patch: Partial<BrandingConfig>) {
    branding.value = { ...branding.value, ...patch }
  }

  function addEnvVar() {
    envVars.value.push({ name: '', value: '' })
  }

  function updateEnvVar(index: number, patch: Partial<EnvVar>) {
    envVars.value[index] = { ...envVars.value[index], ...patch }
  }

  function removeEnvVar(index: number) {
    envVars.value.splice(index, 1)
  }

  function loadConfig(yamlText: string) {
    const parsed = parseConfig(yamlText)
    pages.value = parsed.pages
    activePageId.value = parsed.pages[0]?.id ?? ''
    server.value = parsed.server
    theme.value = parsed.theme
    branding.value = parsed.branding
    selectedWidgetId.value = null
  }

  watch(
    [pages, activePageId, server, theme, branding, envVars],
    () =>
      persistState({
        pages: pages.value,
        activePageId: activePageId.value,
        server: server.value,
        theme: theme.value,
        branding: branding.value,
        envVars: envVars.value,
      }),
    { deep: true }
  )

  function moveWidgetUp(widgetId: string) {
    for (const page of pages.value) {
      for (const col of page.columns) {
        const idx = col.widgets.findIndex((w) => w.id === widgetId)
        if (idx > 0) {
          const [w] = col.widgets.splice(idx, 1)
          col.widgets.splice(idx - 1, 0, w)
          return
        }
      }
    }
  }

  function moveWidgetDown(widgetId: string) {
    for (const page of pages.value) {
      for (const col of page.columns) {
        const idx = col.widgets.findIndex((w) => w.id === widgetId)
        if (idx !== -1 && idx < col.widgets.length - 1) {
          const [w] = col.widgets.splice(idx, 1)
          col.widgets.splice(idx + 1, 0, w)
          return
        }
      }
    }
  }

  function moveWidgetToColumn(widgetId: string, direction: 'left' | 'right') {
    for (const page of pages.value) {
      const colIdx = page.columns.findIndex((c) => c.widgets.some((w) => w.id === widgetId))
      if (colIdx === -1) continue
      const targetIdx = direction === 'left' ? colIdx - 1 : colIdx + 1
      if (targetIdx < 0 || targetIdx >= page.columns.length) return
      const col = page.columns[colIdx]
      const wIdx = col.widgets.findIndex((w) => w.id === widgetId)
      const [widget] = col.widgets.splice(wIdx, 1)
      page.columns[targetIdx].widgets.push(widget)
      return
    }
  }

  function duplicatePage(pageId: string) {
    const page = pages.value.find((p) => p.id === pageId)
    if (!page) return
    const clone = JSON.parse(JSON.stringify(page)) as Page
    clone.id = generateId()
    clone.name = `${page.name} (copy)`
    for (const col of clone.columns) {
      col.id = generateId()
      for (const widget of col.widgets) widget.id = generateId()
    }
    const idx = pages.value.findIndex((p) => p.id === pageId)
    pages.value.splice(idx + 1, 0, clone)
    activePageId.value = clone.id
  }

  function movePage(pageId: string, direction: 'up' | 'down') {
    const idx = pages.value.findIndex((p) => p.id === pageId)
    if (idx === -1) return
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= pages.value.length) return
    const [page] = pages.value.splice(idx, 1)
    pages.value.splice(targetIdx, 0, page)
  }

  return {
    pages,
    activePageId,
    selectedWidgetId,
    showYamlPreview,
    activePage,
    selectedWidget,
    server,
    theme,
    branding,
    envVars,
    glanceConfig,
    yamlOutput,
    envOutput,
    addPage,
    removePage,
    renamePage,
    setActivePage,
    addColumn,
    removeColumn,
    setColumnSize,
    addWidget,
    updateWidget,
    removeWidget,
    selectWidget,
    moveWidgetUp,
    moveWidgetDown,
    moveWidgetToColumn,
    duplicatePage,
    movePage,
    loadConfig,
    updateServer,
    updateTheme,
    updateBranding,
    addEnvVar,
    updateEnvVar,
    removeEnvVar,
  }
})
