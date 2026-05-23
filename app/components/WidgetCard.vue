<script setup lang="ts">
import { computed } from 'vue'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Copy, Trash2 } from '@lucide/vue'
import type { Widget } from '~/types/glance'
import { getWidgetIcon } from '~/utils/widgetIcons'

const props = defineProps<{
  widget: Widget
  selected?: boolean
  isFirst?: boolean
  isLast?: boolean
  canMoveLeft?: boolean
  canMoveRight?: boolean
}>()

const emit = defineEmits<{
  select: []
  remove: []
  duplicate: []
  moveUp: []
  moveDown: []
  moveLeft: []
  moveRight: []
}>()

const icon = computed(() => getWidgetIcon(props.widget.type))
</script>

<template>
  <div
    class="widget-card"
    :class="{ 'widget-card--selected': selected }"
    @click="emit('select')"
  >
    <div class="widget-card__header">
      <component :is="icon" class="widget-card__icon" :size="14" />
      <span class="widget-card__type-chip">{{ widget.type }}</span>
      <span v-if="widget.title" class="widget-card__title">{{ widget.title }}</span>
    </div>
    <div class="widget-card__actions">
      <button class="action-btn" :disabled="!canMoveLeft" title="Move to left column" @click.stop="emit('moveLeft')">
        <ChevronLeft :size="13" />
      </button>
      <button class="action-btn" :disabled="isFirst" title="Move up" @click.stop="emit('moveUp')">
        <ChevronUp :size="13" />
      </button>
      <button class="action-btn" :disabled="isLast" title="Move down" @click.stop="emit('moveDown')">
        <ChevronDown :size="13" />
      </button>
      <button class="action-btn" :disabled="!canMoveRight" title="Move to right column" @click.stop="emit('moveRight')">
        <ChevronRight :size="13" />
      </button>
      <div class="widget-card__actions-spacer" />
      <button class="action-btn action-btn--duplicate" title="Duplicate" @click.stop="emit('duplicate')">
        <Copy :size="13" />
      </button>
      <button class="action-btn action-btn--delete" title="Delete" @click.stop="emit('remove')">
        <Trash2 :size="13" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.widget-card {
  background: var(--color-ash);
  border: 1px solid var(--color-smoke);
  border-radius: 6px;
  padding: var(--space-3);
  cursor: pointer;
  transition: border-color 0.1s;
}

.widget-card:hover {
  border-color: color-mix(in srgb, var(--color-blossom) 60%, transparent);
}

.widget-card--selected {
  border-color: var(--color-blossom);
}

.widget-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.widget-card__icon {
  color: var(--color-dusk);
  flex-shrink: 0;
}

.widget-card__title {
  font-size: var(--text-base);
  color: var(--color-fog);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.widget-card__type-chip {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-periwinkle);
  border: 1px solid color-mix(in srgb, var(--color-periwinkle) 40%, transparent);
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.widget-card__actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.widget-card__actions-spacer {
  flex: 1;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--color-dusk);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.action-btn:disabled {
  opacity: 0.25;
  cursor: default;
}

.action-btn:not(:disabled):hover {
  background: var(--color-ash);
  color: var(--color-fog);
}

.action-btn--duplicate:not(:disabled):hover {
  background: var(--color-ash);
  color: var(--color-sage);
}

.action-btn--delete:not(:disabled):hover {
  background: var(--color-ash);
  color: var(--color-blossom);
}
</style>
