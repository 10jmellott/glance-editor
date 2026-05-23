<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'

interface BookmarkLink {
  title: string
  url: string
  description?: string
  icon?: string
  'same-tab'?: boolean
  'hide-arrow'?: boolean
  target?: string
}

interface BookmarkGroup {
  title?: string
  color?: string
  'same-tab'?: boolean
  'hide-arrow'?: boolean
  target?: string
  links: BookmarkLink[]
}

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getGroups(): BookmarkGroup[] {
  return (store.selectedWidget?.groups as BookmarkGroup[] | undefined) ?? []
}

function updateGroup(gi: number, patch: Partial<BookmarkGroup>) {
  const groups = getGroups().map((g, i) => (i === gi ? { ...g, ...patch } : g))
  update({ groups })
}

function addGroup() {
  update({ groups: [...getGroups(), { title: '', links: [] }] })
}

function removeGroup(gi: number) {
  const groups = getGroups().filter((_, i) => i !== gi)
  update({ groups })
}

function updateLink(gi: number, li: number, patch: Partial<BookmarkLink>) {
  const groups = getGroups().map((g, i) => {
    if (i !== gi) return g
    const links = g.links.map((l, j) => (j === li ? { ...l, ...patch } : l))
    return { ...g, links }
  })
  update({ groups })
}

function addLink(gi: number) {
  const groups = getGroups().map((g, i) => {
    if (i !== gi) return g
    return { ...g, links: [...g.links, { title: '', url: '' }] }
  })
  update({ groups })
}

function removeLink(gi: number, li: number) {
  const groups = getGroups().map((g, i) => {
    if (i !== gi) return g
    return { ...g, links: g.links.filter((_, j) => j !== li) }
  })
  update({ groups })
}

const targetOptions = [
  { label: 'Default', value: '' },
  { label: '_blank (new tab)', value: '_blank' },
  { label: '_self (same tab)', value: '_self' },
  { label: '_parent', value: '_parent' },
  { label: '_top', value: '_top' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="bookmarks-form">
    <WidgetsSharedFields />

    <PanelSection label="Groups">
      <div class="group-list">
        <div v-for="(group, gi) in getGroups()" :key="gi" class="group-card">
          <div class="group-card__header">
            <span class="group-card__index">Group {{ gi + 1 }}</span>
            <button class="item-delete-btn" title="Remove group" @click="removeGroup(gi)">
              <Trash2 :size="13" />
            </button>
          </div>

          <FormRow label="Title">
            <AppInput
              :model-value="group.title"
              placeholder="Entertainment"
              @update:model-value="updateGroup(gi, { title: $event || undefined })"
            />
          </FormRow>
          <FormRow label="Color" hint="HSL e.g. 10 70 50">
            <AppInput
              :model-value="group.color"
              placeholder="10 70 50"
              @update:model-value="updateGroup(gi, { color: $event || undefined })"
            />
          </FormRow>
          <FormRow label="Target">
            <AppDropdown
              :model-value="group.target ?? ''"
              :options="targetOptions"
              @update:model-value="updateGroup(gi, { target: $event || undefined })"
            />
          </FormRow>
          <AppToggle
            :model-value="group['same-tab']"
            label="Open all links in same tab"
            @update:model-value="updateGroup(gi, { 'same-tab': $event })"
          />
          <AppToggle
            :model-value="group['hide-arrow']"
            label="Hide arrows on all links"
            @update:model-value="updateGroup(gi, { 'hide-arrow': $event })"
          />

          <div class="links-section">
            <span class="links-section__label">Links</span>
            <div class="item-list">
              <div v-for="(link, li) in group.links" :key="li" class="item-card">
                <div class="item-card__header">
                  <span class="item-card__index">{{ link.title || `Link ${li + 1}` }}</span>
                  <button class="item-delete-btn" title="Remove link" @click="removeLink(gi, li)">
                    <Trash2 :size="13" />
                  </button>
                </div>
                <FormRow label="Title *">
                  <AppInput
                    :model-value="link.title"
                    placeholder="Gmail"
                    @update:model-value="updateLink(gi, li, { title: $event })"
                  />
                </FormRow>
                <FormRow label="URL *">
                  <AppInput
                    :model-value="link.url"
                    placeholder="https://mail.google.com"
                    @update:model-value="updateLink(gi, li, { url: $event })"
                  />
                </FormRow>
                <FormRow label="Description">
                  <AppInput
                    :model-value="link.description"
                    placeholder="Short description"
                    @update:model-value="updateLink(gi, li, { description: $event || undefined })"
                  />
                </FormRow>
                <FormRow label="Icon" hint="URL or si:name, sh:name, di:name, mdi:name">
                  <AppInput
                    :model-value="link.icon"
                    placeholder="si:gmail"
                    @update:model-value="updateLink(gi, li, { icon: $event || undefined })"
                  />
                </FormRow>
                <FormRow label="Target">
                  <AppDropdown
                    :model-value="link.target ?? ''"
                    :options="targetOptions"
                    @update:model-value="updateLink(gi, li, { target: $event || undefined })"
                  />
                </FormRow>
                <AppToggle
                  :model-value="link['same-tab']"
                  label="Open in same tab"
                  @update:model-value="updateLink(gi, li, { 'same-tab': $event })"
                />
                <AppToggle
                  :model-value="link['hide-arrow']"
                  label="Hide arrow"
                  @update:model-value="updateLink(gi, li, { 'hide-arrow': $event })"
                />
              </div>
            </div>
            <button class="add-item-btn" @click="addLink(gi)">
              <Plus :size="13" />
              <span>Add link</span>
            </button>
          </div>
        </div>
      </div>
      <button class="add-item-btn" @click="addGroup">
        <Plus :size="13" />
        <span>Add group</span>
      </button>
    </PanelSection>
  </div>
</template>

<style scoped>
.bookmarks-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.group-card {
  background: color-mix(in srgb, var(--color-ash) 60%, var(--color-charcoal));
  border: 1px solid var(--color-smoke);
  border-radius: 6px;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.group-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-haze);
}

.group-card__index {
  font-size: var(--text-xs);
  color: var(--color-fog);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.links-section {
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-haze);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.links-section__label {
  font-size: var(--text-xs);
  color: var(--color-dusk);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.item-card {
  background: var(--color-void);
  border: 1px solid var(--color-smoke);
  border-radius: 5px;
  padding: var(--space-2);
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
