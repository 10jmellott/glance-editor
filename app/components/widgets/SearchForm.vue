<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'

interface Bang {
  title?: string
  shortcut: string
  url: string
}

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getBangs(): Bang[] {
  return (store.selectedWidget?.bangs as Bang[] | undefined) ?? []
}

function updateBang(index: number, patch: Partial<Bang>) {
  const bangs = getBangs().map((b, i) => (i === index ? { ...b, ...patch } : b))
  update({ bangs })
}

function addBang() {
  update({ bangs: [...getBangs(), { title: '', shortcut: '', url: '' }] })
}

function removeBang(index: number) {
  const bangs = getBangs().filter((_, i) => i !== index)
  update({ bangs: bangs.length ? bangs : undefined })
}

const engineOptions = [
  { label: 'DuckDuckGo', value: 'duckduckgo' },
  { label: 'Google', value: 'google' },
  { label: 'Bing', value: 'bing' },
  { label: 'Perplexity', value: 'perplexity' },
  { label: 'Kagi', value: 'kagi' },
  { label: 'Startpage', value: 'startpage' },
  { label: 'Custom URL', value: 'custom' },
]

const targetOptions = [
  { label: '_blank (new tab)', value: '_blank' },
  { label: '_self (same tab)', value: '_self' },
  { label: '_parent', value: '_parent' },
  { label: '_top', value: '_top' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="search-form">
    <WidgetsSharedFields />

    <PanelSection label="Search">
      <FormRow label="Search engine" hint="Or enter a custom URL with {QUERY}.">
        <AppInput
          :model-value="store.selectedWidget['search-engine'] as string"
          placeholder="duckduckgo"
          @update:model-value="update({ 'search-engine': $event })"
        />
      </FormRow>
      <FormRow label="Placeholder text">
        <AppInput
          :model-value="store.selectedWidget.placeholder as string"
          placeholder="Type here to search…"
          @update:model-value="update({ placeholder: $event || undefined })"
        />
      </FormRow>
      <FormRow label="New tab target">
        <AppDropdown
          :model-value="store.selectedWidget.target as string"
          :options="targetOptions"
          @update:model-value="update({ target: $event })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['new-tab'] as boolean"
        label="Open results in new tab by default"
        @update:model-value="update({ 'new-tab': $event })"
      />
      <AppToggle
        :model-value="store.selectedWidget.autofocus as boolean"
        label="Autofocus on page load"
        @update:model-value="update({ autofocus: $event })"
      />
    </PanelSection>

    <PanelSection label="Bangs">
      <div class="item-list">
        <div v-for="(bang, i) in getBangs()" :key="i" class="item-card">
          <div class="item-card__header">
            <span class="item-card__index">Bang {{ i + 1 }}</span>
            <button class="item-delete-btn" title="Remove" @click="removeBang(i)">
              <Trash2 :size="13" />
            </button>
          </div>
          <FormRow label="Shortcut *">
            <AppInput
              :model-value="bang.shortcut"
              placeholder="!yt"
              @update:model-value="updateBang(i, { shortcut: $event })"
            />
          </FormRow>
          <FormRow label="URL *" hint="Use {QUERY} as placeholder.">
            <AppInput
              :model-value="bang.url"
              placeholder="https://www.youtube.com/results?search_query={QUERY}"
              @update:model-value="updateBang(i, { url: $event })"
            />
          </FormRow>
          <FormRow label="Title">
            <AppInput
              :model-value="bang.title"
              placeholder="YouTube"
              @update:model-value="updateBang(i, { title: $event || undefined })"
            />
          </FormRow>
        </div>
      </div>
      <button class="add-item-btn" @click="addBang">
        <Plus :size="13" />
        <span>Add bang</span>
      </button>
    </PanelSection>
  </div>
</template>

<style scoped>
.search-form {
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
