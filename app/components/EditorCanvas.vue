<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, X, Maximize2, Minimize2 } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

const pickerColumnId = ref<string | null>(null)

function openPicker(columnId: string) {
  pickerColumnId.value = columnId
}

function onPickType(type: string) {
  if (pickerColumnId.value) {
    store.addWidget(pickerColumnId.value, type)
  }
  pickerColumnId.value = null
}

function duplicateWidget(widgetId: string) {
  for (const page of store.pages) {
    for (const col of page.columns) {
      const idx = col.widgets.findIndex((w) => w.id === widgetId)
      if (idx !== -1) {
        const original = col.widgets[idx]
        const copy = { ...original, id: Math.random().toString(36).slice(2, 10) }
        col.widgets.splice(idx + 1, 0, copy)
        return
      }
    }
  }
}

function toggleColumnSize(columnId: string, currentSize: 'full' | 'small') {
  store.setColumnSize(columnId, currentSize === 'full' ? 'small' : 'full')
}

function canShrink(columnId: string): boolean {
  const page = store.activePage
  const col = page.columns.find((c) => c.id === columnId)
  if (!col || col.size === 'small') return false
  return page.columns.filter((c) => c.size === 'full').length > 1
}

const canAddColumn = computed(() => store.activePage.columns.length < 3)
</script>

<template>
  <main class="canvas" @click.self="store.selectWidget(null)">
    <div class="canvas__inner" @click.self="store.selectWidget(null)">
      <div class="canvas__columns">
        <div
          v-for="(col, colIndex) in store.activePage.columns"
          :key="col.id"
          class="canvas__column"
          :class="`canvas__column--${col.size}`"
        >
          <div class="canvas__column-header">
            <span class="canvas__column-label">{{ col.size === 'full' ? 'Full' : 'Small' }}</span>
            <div class="canvas__column-actions">
              <IconButton
                :title="col.size === 'full' ? 'Switch to small' : 'Switch to full'"
                :disabled="col.size === 'full' && !canShrink(col.id)"
                @click="toggleColumnSize(col.id, col.size)"
              >
                <Minimize2 v-if="col.size === 'full'" :size="13" />
                <Maximize2 v-else :size="13" />
              </IconButton>
              <IconButton
                title="Remove column"
                :disabled="store.activePage.columns.length <= 1"
                @click="store.removeColumn(col.id)"
              >
                <X :size="13" />
              </IconButton>
            </div>
          </div>
          <div class="canvas__widgets">
            <WidgetCard
              v-for="(widget, index) in col.widgets"
              :key="widget.id"
              :widget="widget"
              :selected="store.selectedWidgetId === widget.id"
              :is-first="index === 0"
              :is-last="index === col.widgets.length - 1"
              :can-move-left="colIndex > 0"
              :can-move-right="colIndex < store.activePage.columns.length - 1"
              @select="store.selectWidget(widget.id)"
              @remove="store.removeWidget(widget.id)"
              @duplicate="duplicateWidget(widget.id)"
              @move-up="store.moveWidgetUp(widget.id)"
              @move-down="store.moveWidgetDown(widget.id)"
              @move-left="store.moveWidgetToColumn(widget.id, 'left')"
              @move-right="store.moveWidgetToColumn(widget.id, 'right')"
            />
            <button class="add-widget-btn" @click="openPicker(col.id)">
              <Plus :size="13" />
              Add widget
            </button>
          </div>
        </div>

        <button
          v-if="canAddColumn"
          class="add-column-btn"
          title="Add column"
          @click="store.addColumn(store.activePage.id)"
        >
          <Plus :size="14" />
        </button>
      </div>
    </div>

    <WidgetTypePicker
      v-if="pickerColumnId"
      @pick="onPickType"
      @cancel="pickerColumnId = null"
    />
  </main>
</template>

<style scoped>
.canvas {
  flex: 1;
  background: var(--color-void);
  overflow-y: auto;
  padding: var(--space-4);
}

.canvas__inner {
  max-width: 1600px;
  margin: 0 auto;
}

.canvas__columns {
  display: flex;
  gap: 23px;
  align-items: flex-start;
  min-height: 100%;
}

.canvas__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.canvas__column--full {
  flex: 1;
}

.canvas__column--small {
  width: 300px;
  flex-shrink: 0;
}

.canvas__column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-haze);
  margin-bottom: var(--space-1);
}

.canvas__column-label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-dusk);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.canvas__column-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s;
}

.canvas__column:hover .canvas__column-actions {
  opacity: 1;
}

.canvas__widgets {
  display: flex;
  flex-direction: column;
  gap: 23px;
}

.add-widget-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-family: inherit;
  color: var(--color-sage);
  background: transparent;
  border: 1px dashed color-mix(in srgb, var(--color-sage) 40%, transparent);
  border-radius: 6px;
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
  width: 100%;
  justify-content: center;
  transition: background 0.1s;
}

.add-widget-btn:hover {
  background: color-mix(in srgb, var(--color-sage) 8%, transparent);
}

.add-column-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  align-self: stretch;
  flex-shrink: 0;
  border: 1px dashed color-mix(in srgb, var(--color-dusk) 35%, transparent);
  border-radius: 6px;
  background: transparent;
  color: var(--color-dusk);
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.1s, color 0.1s, background 0.1s;
}

.add-column-btn:hover {
  border-color: color-mix(in srgb, var(--color-fog) 50%, transparent);
  color: var(--color-fog);
  background: color-mix(in srgb, var(--color-fog) 5%, transparent);
}
</style>
