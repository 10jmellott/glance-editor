<script setup lang="ts">
import { X } from '@lucide/vue'
import { getWidgetIcon } from '~/utils/widgetIcons'

const emit = defineEmits<{
  pick: [type: string]
  cancel: []
}>()

const WIDGET_TYPES = [
  { type: 'rss', label: 'RSS' },
  { type: 'bookmarks', label: 'Bookmarks' },
  { type: 'html', label: 'HTML' },
  { type: 'weather', label: 'Weather' },
  { type: 'clock', label: 'Clock' },
  { type: 'monitor', label: 'Monitor' },
  { type: 'search', label: 'Search' },
  { type: 'videos', label: 'Videos' },
  { type: 'hacker-news', label: 'Hacker News' },
  { type: 'lobsters', label: 'Lobsters' },
  { type: 'reddit', label: 'Reddit' },
  { type: 'markets', label: 'Markets' },
  { type: 'to-do', label: 'To-do' },
  { type: 'calendar', label: 'Calendar' },
  { type: 'releases', label: 'Releases' },
  { type: 'repository', label: 'Repository' },
  { type: 'server-stats', label: 'Server Stats' },
  { type: 'docker-containers', label: 'Docker Containers' },
  { type: 'dns-stats', label: 'DNS Stats' },
  { type: 'change-detection', label: 'Change Detection' },
  { type: 'twitch-channels', label: 'Twitch Channels' },
  { type: 'twitch-top-games', label: 'Twitch Top Games' },
  { type: 'iframe', label: 'iFrame' },
  { type: 'extension', label: 'Extension' },
  { type: 'custom-api', label: 'Custom API' },
  { type: 'group', label: 'Group' },
  { type: 'split-column', label: 'Split Column' },
]
</script>

<template>
  <Teleport to="body">
    <div class="picker-overlay" @click.self="emit('cancel')">
      <div class="picker-panel">
        <div class="picker-panel__header">
          <span class="picker-panel__title">Add Widget</span>
          <IconButton title="Close" @click="emit('cancel')">
            <X :size="16" />
          </IconButton>
        </div>
        <div class="picker-panel__grid">
          <button
            v-for="item in WIDGET_TYPES"
            :key="item.type"
            class="picker-item"
            @click="emit('pick', item.type)"
          >
            <component :is="getWidgetIcon(item.type)" class="picker-item__icon" :size="16" />
            <span class="picker-item__label">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.picker-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--color-void) 70%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--space-8);
}

.picker-panel {
  width: 100%;
  max-width: 560px;
  background: var(--color-charcoal);
  border: 1px solid var(--color-smoke);
  border-radius: 8px;
  overflow: hidden;
}

.picker-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-haze);
}

.picker-panel__title {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-cream);
}

.picker-panel__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
  padding: var(--space-4);
  max-height: 70vh;
  overflow-y: auto;
}

.picker-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-ash);
  border: 1px solid var(--color-smoke);
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.1s, background 0.1s;
}

.picker-item:hover {
  border-color: color-mix(in srgb, var(--color-periwinkle) 60%, transparent);
  background: color-mix(in srgb, var(--color-periwinkle) 6%, var(--color-ash));
}

.picker-item__icon {
  color: var(--color-periwinkle);
  flex-shrink: 0;
}

.picker-item__label {
  font-size: var(--text-sm);
  color: var(--color-fog);
}
</style>
