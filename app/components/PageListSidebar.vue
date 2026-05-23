<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Plus, Trash2, Copy, ChevronUp, ChevronDown } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

const editingPageId = ref<string | null>(null)
const editingName = ref('')
let pendingFocus: HTMLInputElement | null = null

function addPage() {
  const name = `Page ${store.pages.length + 1}`
  store.addPage(name)
}

async function startRename(pageId: string, currentName: string) {
  editingPageId.value = pageId
  editingName.value = currentName
  await nextTick()
  pendingFocus?.select()
}

function setRenameInput(el: HTMLInputElement | null) {
  pendingFocus = el
}

function commitRename() {
  if (editingPageId.value) {
    store.renamePage(editingPageId.value, editingName.value)
  }
  editingPageId.value = null
}

function cancelRename() {
  editingPageId.value = null
}

function onRenameKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') commitRename()
  if (e.key === 'Escape') cancelRename()
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__section-label">Pages</div>
    <nav class="sidebar__list">
      <div
        v-for="page in store.pages"
        :key="page.id"
        class="sidebar__page-item"
        :class="{ 'sidebar__page-item--active': page.id === store.activePageId }"
        role="button"
        tabindex="0"
        @click="store.setActivePage(page.id)"
        @dblclick.prevent="startRename(page.id, page.name)"
        @keydown.enter="store.setActivePage(page.id)"
      >
        <input
          v-if="editingPageId === page.id"
          :ref="(el) => setRenameInput(el as HTMLInputElement | null)"
          class="sidebar__rename-input"
          :value="editingName"
          @input="editingName = ($event.target as HTMLInputElement).value"
          @blur="commitRename"
          @keydown="onRenameKeydown"
          @click.stop
        />
        <span v-else class="sidebar__page-name">{{ page.name }}</span>
        <div v-if="editingPageId !== page.id" class="sidebar__page-actions">
          <button
            class="sidebar__page-btn"
            title="Move up"
            :disabled="store.pages.indexOf(page) === 0"
            @click.stop="store.movePage(page.id, 'up')"
          >
            <ChevronUp :size="11" />
          </button>
          <button
            class="sidebar__page-btn"
            title="Move down"
            :disabled="store.pages.indexOf(page) === store.pages.length - 1"
            @click.stop="store.movePage(page.id, 'down')"
          >
            <ChevronDown :size="11" />
          </button>
          <button
            class="sidebar__page-btn"
            title="Duplicate page"
            @click.stop="store.duplicatePage(page.id)"
          >
            <Copy :size="11" />
          </button>
          <button
            v-if="store.pages.length > 1"
            class="sidebar__page-btn sidebar__page-btn--delete"
            title="Delete page"
            @click.stop="store.removePage(page.id)"
          >
            <Trash2 :size="11" />
          </button>
        </div>
      </div>
    </nav>
    <div class="sidebar__footer">
      <AppButton variant="ghost" @click="addPage">
        <Plus :size="14" />
        Add page
      </AppButton>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 320px;
  flex-shrink: 0;
  background: var(--color-charcoal);
  border-right: 1px solid var(--color-smoke);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar__section-label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-dusk);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: var(--space-4) var(--space-4) var(--space-2);
}

.sidebar__list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 var(--space-2);
}

.sidebar__page-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 var(--space-2);
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--color-fog);
  font-size: var(--text-base);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;
  position: relative;
}

.sidebar__page-item:hover {
  background: var(--color-ash);
}

.sidebar__page-item--active {
  color: var(--color-cream);
}

.sidebar__page-item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 2px;
  border-radius: 2px;
  background: var(--color-blossom);
}

.sidebar__page-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__rename-input {
  flex: 1;
  height: 24px;
  background: var(--color-void);
  border: 1px solid var(--color-periwinkle);
  border-radius: 3px;
  color: var(--color-cream);
  font-size: var(--text-base);
  font-family: inherit;
  padding: 0 var(--space-1);
  outline: none;
  min-width: 0;
}

.sidebar__page-actions {
  display: flex;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
}

.sidebar__page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: var(--color-dusk);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
  padding: 0;
}

.sidebar__page-btn:disabled {
  opacity: 0.2;
  cursor: default;
}

.sidebar__page-btn:not(:disabled):hover {
  background: var(--color-smoke);
  color: var(--color-fog);
}

.sidebar__page-btn--delete:not(:disabled):hover {
  background: var(--color-smoke);
  color: var(--color-blossom);
}

.sidebar__footer {
  padding: var(--space-3) var(--space-2) var(--space-4);
  border-top: 1px solid var(--color-haze);
}

.sidebar__footer .app-btn {
  width: 100%;
  justify-content: center;
}
</style>
