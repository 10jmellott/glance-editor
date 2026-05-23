<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getChannels(): string[] {
  return (store.selectedWidget?.channels as string[] | undefined) ?? []
}

function getPlaylists(): string[] {
  return (store.selectedWidget?.playlists as string[] | undefined) ?? []
}

const styleOptions = [
  { label: 'Horizontal cards', value: 'horizontal-cards' },
  { label: 'Vertical list', value: 'vertical-list' },
  { label: 'Grid cards', value: 'grid-cards' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="videos-form">
    <WidgetsSharedFields />

    <PanelSection label="Sources">
      <FormRow label="Channel IDs">
        <RepeatableList
          :items="getChannels()"
          placeholder="UCXuqSBlHAE6Xw-yeJA0Tunw"
          add-label="Add channel"
          @update:items="update({ channels: $event })"
        />
      </FormRow>
      <FormRow label="Playlist IDs">
        <RepeatableList
          :items="getPlaylists()"
          placeholder="PL8mG-RkN2uTy..."
          add-label="Add playlist"
          @update:items="update({ playlists: $event.length ? $event : undefined })"
        />
      </FormRow>
    </PanelSection>

    <PanelSection label="Display">
      <FormRow label="Style">
        <AppDropdown
          :model-value="store.selectedWidget.style as string"
          :options="styleOptions"
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
      <FormRow label="Collapse after" hint="Applies to vertical-list style.">
        <AppInput
          :model-value="store.selectedWidget['collapse-after'] as number"
          type="number"
          placeholder="7"
          @update:model-value="update({ 'collapse-after': Number($event) || undefined })"
        />
      </FormRow>
      <FormRow label="Collapse after rows" hint="Applies to grid-cards style.">
        <AppInput
          :model-value="store.selectedWidget['collapse-after-rows'] as number"
          type="number"
          placeholder="4"
          @update:model-value="update({ 'collapse-after-rows': Number($event) || undefined })"
        />
      </FormRow>
      <FormRow label="Video URL template" hint="Use {VIDEO-ID} as placeholder.">
        <AppInput
          :model-value="store.selectedWidget['video-url-template'] as string"
          placeholder="https://www.youtube.com/watch?v={VIDEO-ID}"
          @update:model-value="update({ 'video-url-template': $event || undefined })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['include-shorts'] as boolean"
        label="Include Shorts"
        @update:model-value="update({ 'include-shorts': $event })"
      />
    </PanelSection>
  </div>
</template>

<style scoped>
.videos-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
