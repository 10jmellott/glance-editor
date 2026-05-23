<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'

interface RssFeed {
  url: string
  title?: string
  'hide-categories'?: boolean
  'hide-description'?: boolean
  limit?: number
  'item-link-prefix'?: string
}

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getFeeds(): RssFeed[] {
  const raw = store.selectedWidget?.feeds
  if (!Array.isArray(raw)) return []
  return raw.map((f) =>
    typeof f === 'string' ? { url: f } : (f as RssFeed)
  )
}

function updateFeed(index: number, patch: Partial<RssFeed>) {
  const feeds = getFeeds().map((f, i) => (i === index ? { ...f, ...patch } : f))
  update({ feeds })
}

function addFeed() {
  update({ feeds: [...getFeeds(), { url: '' }] })
}

function removeFeed(index: number) {
  const feeds = getFeeds().filter((_, i) => i !== index)
  update({ feeds })
}

const styleOptions = [
  { label: 'Vertical list', value: 'vertical-list' },
  { label: 'Detailed list', value: 'detailed-list' },
  { label: 'Horizontal cards', value: 'horizontal-cards' },
  { label: 'Horizontal cards 2', value: 'horizontal-cards-2' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="rss-form">
    <WidgetsSharedFields />

    <PanelSection label="Feeds">
      <div class="item-list">
        <div v-for="(feed, i) in getFeeds()" :key="i" class="item-card">
          <div class="item-card__header">
            <span class="item-card__index">Feed {{ i + 1 }}</span>
            <button class="item-delete-btn" title="Remove" @click="removeFeed(i)">
              <Trash2 :size="13" />
            </button>
          </div>
          <FormRow label="URL *">
            <AppInput
              :model-value="feed.url"
              placeholder="https://example.com/feed.xml"
              @update:model-value="updateFeed(i, { url: $event })"
            />
          </FormRow>
          <FormRow label="Title">
            <AppInput
              :model-value="feed.title"
              placeholder="Feed title"
              @update:model-value="updateFeed(i, { title: $event || undefined })"
            />
          </FormRow>
          <FormRow label="Per-feed limit">
            <AppInput
              :model-value="feed.limit"
              type="number"
              placeholder="—"
              @update:model-value="updateFeed(i, { limit: Number($event) || undefined })"
            />
          </FormRow>
          <FormRow label="Item link prefix">
            <AppInput
              :model-value="feed['item-link-prefix']"
              placeholder="https://domain.com"
              @update:model-value="updateFeed(i, { 'item-link-prefix': $event || undefined })"
            />
          </FormRow>
          <AppToggle
            :model-value="feed['hide-categories']"
            label="Hide categories (detailed-list only)"
            @update:model-value="updateFeed(i, { 'hide-categories': $event })"
          />
          <AppToggle
            :model-value="feed['hide-description']"
            label="Hide description (detailed-list only)"
            @update:model-value="updateFeed(i, { 'hide-description': $event })"
          />
        </div>
      </div>
      <button class="add-item-btn" @click="addFeed">
        <Plus :size="13" />
        <span>Add feed</span>
      </button>
    </PanelSection>

    <PanelSection label="Display">
      <FormRow label="Style">
        <AppDropdown
          :model-value="store.selectedWidget.style as string"
          :options="styleOptions"
          placeholder="Pick a style"
          @update:model-value="update({ style: $event })"
        />
      </FormRow>
      <FormRow label="Limit">
        <AppInput
          :model-value="store.selectedWidget.limit as number"
          type="number"
          placeholder="25"
          @update:model-value="update({ limit: Number($event) || undefined })"
        />
      </FormRow>
      <FormRow label="Collapse after" hint="Set to -1 to never collapse.">
        <AppInput
          :model-value="store.selectedWidget['collapse-after'] as number"
          type="number"
          placeholder="5"
          @update:model-value="update({ 'collapse-after': Number($event) || undefined })"
        />
      </FormRow>
      <FormRow label="Thumbnail height (rem)" hint="Applies to horizontal-cards style.">
        <AppInput
          :model-value="store.selectedWidget['thumbnail-height'] as number"
          type="number"
          placeholder="10"
          @update:model-value="update({ 'thumbnail-height': Number($event) || undefined })"
        />
      </FormRow>
      <FormRow label="Card height (rem)" hint="Applies to horizontal-cards-2 style.">
        <AppInput
          :model-value="store.selectedWidget['card-height'] as number"
          type="number"
          placeholder="27"
          @update:model-value="update({ 'card-height': Number($event) || undefined })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['preserve-order'] as boolean"
        label="Preserve feed order"
        @update:model-value="update({ 'preserve-order': $event })"
      />
      <AppToggle
        :model-value="store.selectedWidget['single-line-titles'] as boolean"
        label="Single-line titles (vertical-list only)"
        @update:model-value="update({ 'single-line-titles': $event })"
      />
      <AppToggle
        :model-value="store.selectedWidget['new-tab'] as boolean"
        label="Open links in new tab"
        @update:model-value="update({ 'new-tab': $event })"
      />
    </PanelSection>
  </div>
</template>

<style scoped>
.rss-form {
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
