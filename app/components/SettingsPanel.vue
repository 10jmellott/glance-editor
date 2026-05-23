<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { X } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'
import WidgetsRssForm from '~/components/widgets/RssForm.vue'
import WidgetsBookmarksForm from '~/components/widgets/BookmarksForm.vue'
import WidgetsHtmlForm from '~/components/widgets/HtmlForm.vue'
import WidgetsWeatherForm from '~/components/widgets/WeatherForm.vue'
import WidgetsClockForm from '~/components/widgets/ClockForm.vue'
import WidgetsMonitorForm from '~/components/widgets/MonitorForm.vue'
import WidgetsSearchForm from '~/components/widgets/SearchForm.vue'
import WidgetsVideosForm from '~/components/widgets/VideosForm.vue'
import WidgetsHackerNewsForm from '~/components/widgets/HackerNewsForm.vue'
import WidgetsRedditForm from '~/components/widgets/RedditForm.vue'
import WidgetsMarketsForm from '~/components/widgets/MarketsForm.vue'
import WidgetsTodoForm from '~/components/widgets/TodoForm.vue'
import WidgetsReleasesForm from '~/components/widgets/ReleasesForm.vue'
import WidgetsServerStatsForm from '~/components/widgets/ServerStatsForm.vue'
import WidgetsDockerContainersForm from '~/components/widgets/DockerContainersForm.vue'
import WidgetsIframeForm from '~/components/widgets/IframeForm.vue'
import WidgetsCalendarForm from '~/components/widgets/CalendarForm.vue'
import WidgetsLobstersForm from '~/components/widgets/LobstersForm.vue'
import WidgetsRepositoryForm from '~/components/widgets/RepositoryForm.vue'
import WidgetsDnsStatsForm from '~/components/widgets/DnsStatsForm.vue'
import WidgetsChangeDetectionForm from '~/components/widgets/ChangeDetectionForm.vue'
import WidgetsTwitchChannelsForm from '~/components/widgets/TwitchChannelsForm.vue'
import WidgetsTwitchTopGamesForm from '~/components/widgets/TwitchTopGamesForm.vue'
import WidgetsExtensionForm from '~/components/widgets/ExtensionForm.vue'
import WidgetsCustomApiForm from '~/components/widgets/CustomApiForm.vue'
import WidgetsGenericForm from '~/components/widgets/GenericForm.vue'

const store = useConfigStore()

const formComponent = computed(() => {
  const type = store.selectedWidget?.type
  switch (type) {
    case 'rss': return WidgetsRssForm
    case 'bookmarks': return WidgetsBookmarksForm
    case 'html': return WidgetsHtmlForm
    case 'weather': return WidgetsWeatherForm
    case 'clock': return WidgetsClockForm
    case 'monitor': return WidgetsMonitorForm
    case 'search': return WidgetsSearchForm
    case 'videos': return WidgetsVideosForm
    case 'hacker-news': return WidgetsHackerNewsForm
    case 'reddit': return WidgetsRedditForm
    case 'markets': return WidgetsMarketsForm
    case 'to-do': return WidgetsTodoForm
    case 'releases': return WidgetsReleasesForm
    case 'server-stats': return WidgetsServerStatsForm
    case 'docker-containers': return WidgetsDockerContainersForm
    case 'iframe': return WidgetsIframeForm
    case 'calendar': return WidgetsCalendarForm
    case 'calendar-legacy': return WidgetsCalendarForm
    case 'lobsters': return WidgetsLobstersForm
    case 'repository': return WidgetsRepositoryForm
    case 'dns-stats': return WidgetsDnsStatsForm
    case 'change-detection': return WidgetsChangeDetectionForm
    case 'twitch-channels': return WidgetsTwitchChannelsForm
    case 'twitch-top-games': return WidgetsTwitchTopGamesForm
    case 'extension': return WidgetsExtensionForm
    case 'custom-api': return WidgetsCustomApiForm
    default: return WidgetsGenericForm
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && store.selectedWidgetId) {
    store.selectWidget(null)
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <aside class="settings-panel">
    <template v-if="store.selectedWidget">
      <div class="settings-panel__header">
        <span class="settings-panel__title">{{ store.selectedWidget.title }}</span>
        <span class="settings-panel__type-chip">{{ store.selectedWidget.type }}</span>
        <button class="settings-panel__close" title="Back to config (Esc)" @click="store.selectWidget(null)">
          <X :size="14" />
        </button>
      </div>
      <div class="settings-panel__body">
        <component :is="formComponent" />
      </div>
    </template>
    <template v-else>
      <div class="settings-panel__header">
        <span class="settings-panel__title">Config</span>
      </div>
      <div class="settings-panel__body">
        <GlobalConfigPanel />
      </div>
    </template>
  </aside>
</template>

<style scoped>
.settings-panel {
  width: 320px;
  flex-shrink: 0;
  background: var(--color-charcoal);
  border-left: 1px solid var(--color-smoke);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.settings-panel__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-haze);
  flex-shrink: 0;
}

.settings-panel__title {
  flex: 1;
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-cream);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-panel__type-chip {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-periwinkle);
  border: 1px solid color-mix(in srgb, var(--color-periwinkle) 40%, transparent);
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.settings-panel__body {
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
}

.settings-panel__close {
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
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;
}

.settings-panel__close:hover {
  background: var(--color-ash);
  color: var(--color-fog);
}
</style>
