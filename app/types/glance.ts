export interface GlanceConfig {
  server?: ServerConfig
  theme?: ThemeConfig
  branding?: BrandingConfig
  auth?: AuthConfig
  pages: Page[]
}

export interface AuthUser {
  password?: string
  'password-hash'?: string
}

export interface AuthConfig {
  'secret-key'?: string
  users?: Record<string, AuthUser>
}

export interface AuthUserEntry {
  username: string
  password?: string
  'password-hash'?: string
}

export interface ServerConfig {
  host?: string
  port?: number
  'base-url'?: string
}

export interface ThemeConfig {
  'background-color'?: string
  'primary-color'?: string
  'positive-color'?: string
  'negative-color'?: string
  'contrast-multiplier'?: number
  'text-saturation-multiplier'?: number
  'disable-picker'?: boolean
  'custom-css-file'?: string
  presets?: ThemePreset[]
}

export interface ThemePreset {
  name: string
  'background-color'?: string
  'primary-color'?: string
}

export interface BrandingConfig {
  'logo-text'?: string
  'favicon-url'?: string
  'app-name'?: string
  'hide-footer'?: boolean
}

export interface EnvVar {
  name: string
  value: string
}

export interface Page {
  id: string
  name: string
  slug?: string
  width?: 'default' | 'slim' | 'wide'
  'center-vertically'?: boolean
  columns: Column[]
}

export interface Column {
  id: string
  size: 'full' | 'small'
  widgets: Widget[]
}

export interface Widget {
  id: string
  type: string
  title?: string
  'title-url'?: string
  'hide-header'?: boolean
  'cache'?: string
  'css-class'?: string
  [key: string]: unknown
}

export interface RssWidget extends Widget {
  type: 'rss'
  feeds: string[]
  style?: 'vertical-list' | 'detailed-list' | 'horizontal-cards' | 'horizontal-cards-2'
  limit?: number
  'new-tab'?: boolean
}

export interface BookmarksWidget extends Widget {
  type: 'bookmarks'
  groups: BookmarkGroup[]
}

export interface BookmarkGroup {
  title?: string
  color?: string
  links: BookmarkLink[]
}

export interface BookmarkLink {
  title: string
  url: string
  icon?: string
  'new-tab'?: boolean
}

export interface HtmlWidget extends Widget {
  type: 'html'
  source?: string
}

export interface WeatherWidget extends Widget {
  type: 'weather'
  location: string
  units?: 'metric' | 'imperial'
}

export interface ClockWidget extends Widget {
  type: 'clock'
  'hour-format'?: '12h' | '24h'
  timezones?: ClockTimezone[]
}

export interface ClockTimezone {
  timezone: string
  label?: string
}

export interface MonitorWidget extends Widget {
  type: 'monitor'
  sites: MonitorSite[]
}

export interface MonitorSite {
  title: string
  url: string
  icon?: string
}

export interface SearchWidget extends Widget {
  type: 'search'
  'search-engine'?: string
  bangs?: SearchBang[]
  'new-tab'?: boolean
  autofocus?: boolean
}

export interface SearchBang {
  title: string
  shortcut: string
  url: string
}
