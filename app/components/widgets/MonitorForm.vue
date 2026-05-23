<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'

interface MonitorSite {
  title: string
  url: string
  icon?: string
  'check-url'?: string
  'error-url'?: string
  timeout?: string
  'allow-insecure'?: boolean
  'same-tab'?: boolean
  'alt-status-codes'?: number[]
}

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getSites(): MonitorSite[] {
  return (store.selectedWidget?.sites as MonitorSite[] | undefined) ?? []
}

function updateSite(index: number, patch: Partial<MonitorSite>) {
  const sites = getSites().map((s, i) => (i === index ? { ...s, ...patch } : s))
  update({ sites })
}

function addSite() {
  update({ sites: [...getSites(), { title: '', url: '' }] })
}

function removeSite(index: number) {
  const sites = getSites().filter((_, i) => i !== index)
  update({ sites })
}

function getAltCodes(site: MonitorSite): string {
  return (site['alt-status-codes'] ?? []).join(', ')
}

function setAltCodes(index: number, value: string) {
  const codes = value
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n))
  updateSite(index, { 'alt-status-codes': codes.length ? codes : undefined })
}

const styleOptions = [
  { label: 'Default', value: '' },
  { label: 'Compact', value: 'compact' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="monitor-form">
    <WidgetsSharedFields />

    <PanelSection label="Display">
      <FormRow label="Style">
        <AppDropdown
          :model-value="store.selectedWidget.style as string ?? ''"
          :options="styleOptions"
          @update:model-value="update({ style: $event || undefined })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['show-failing-only'] as boolean"
        label="Show failing only"
        @update:model-value="update({ 'show-failing-only': $event })"
      />
    </PanelSection>

    <PanelSection label="Sites">
      <div class="item-list">
        <div v-for="(site, i) in getSites()" :key="i" class="item-card">
          <div class="item-card__header">
            <span class="item-card__index">{{ site.title || `Site ${i + 1}` }}</span>
            <button class="item-delete-btn" title="Remove" @click="removeSite(i)">
              <Trash2 :size="13" />
            </button>
          </div>
          <FormRow label="Title *">
            <AppInput
              :model-value="site.title"
              placeholder="Jellyfin"
              @update:model-value="updateSite(i, { title: $event })"
            />
          </FormRow>
          <FormRow label="URL *">
            <AppInput
              :model-value="site.url"
              placeholder="https://jellyfin.yourdomain.com"
              @update:model-value="updateSite(i, { url: $event })"
            />
          </FormRow>
          <FormRow label="Icon" hint="URL or si:name, sh:name, di:name, mdi:name">
            <AppInput
              :model-value="site.icon"
              placeholder="si:jellyfin"
              @update:model-value="updateSite(i, { icon: $event || undefined })"
            />
          </FormRow>
          <FormRow label="Check URL" hint="Overrides URL for status check.">
            <AppInput
              :model-value="site['check-url']"
              placeholder="https://..."
              @update:model-value="updateSite(i, { 'check-url': $event || undefined })"
            />
          </FormRow>
          <FormRow label="Error URL" hint="Redirect here on error.">
            <AppInput
              :model-value="site['error-url']"
              placeholder="https://..."
              @update:model-value="updateSite(i, { 'error-url': $event || undefined })"
            />
          </FormRow>
          <FormRow label="Timeout" hint="e.g. 3s, 1m">
            <AppInput
              :model-value="site.timeout"
              placeholder="3s"
              @update:model-value="updateSite(i, { timeout: $event || undefined })"
            />
          </FormRow>
          <FormRow label="Alt status codes" hint="Comma-separated codes treated as OK, e.g. 401, 403">
            <AppInput
              :model-value="getAltCodes(site)"
              placeholder="401, 403"
              @update:model-value="setAltCodes(i, $event)"
            />
          </FormRow>
          <AppToggle
            :model-value="site['allow-insecure']"
            label="Allow insecure certificate"
            @update:model-value="updateSite(i, { 'allow-insecure': $event })"
          />
          <AppToggle
            :model-value="site['same-tab']"
            label="Open in same tab"
            @update:model-value="updateSite(i, { 'same-tab': $event })"
          />
        </div>
      </div>
      <button class="add-item-btn" @click="addSite">
        <Plus :size="13" />
        <span>Add site</span>
      </button>
    </PanelSection>
  </div>
</template>

<style scoped>
.monitor-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.item-card {
  background: var(--color-ash);
  border: 1px solid var(--color-smoke);
  border-radius: 6px;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.item-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-card__index {
  font-size: var(--text-xs);
  color: var(--color-dusk);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.item-delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-dusk);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.item-delete-btn:hover {
  background: var(--color-smoke);
  color: var(--color-ember);
}

.add-item-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-sage);
  background: transparent;
  border: none;
  padding: var(--space-1) 0;
  cursor: pointer;
  transition: opacity 0.1s;
}

.add-item-btn:hover {
  opacity: 0.75;
}
</style>
