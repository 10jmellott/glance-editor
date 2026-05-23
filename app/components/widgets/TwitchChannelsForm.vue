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

const sortOptions = [
  { label: 'Viewers', value: 'viewers' },
  { label: 'Live', value: 'live' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="twitch-channels-form">
    <WidgetsSharedFields />

    <PanelSection label="Channels">
      <RepeatableList
        :items="getChannels()"
        placeholder="channel-name"
        add-label="Add channel"
        @update:items="update({ channels: $event })"
      />
    </PanelSection>

    <PanelSection label="Display">
      <FormRow label="Sort by">
        <AppDropdown
          :model-value="store.selectedWidget['sort-by'] as string"
          :options="sortOptions"
          @update:model-value="update({ 'sort-by': $event })"
        />
      </FormRow>
      <FormRow label="Collapse after">
        <AppInput
          :model-value="store.selectedWidget['collapse-after'] as number"
          type="number"
          placeholder="5"
          @update:model-value="update({ 'collapse-after': Number($event) || undefined })"
        />
      </FormRow>
    </PanelSection>
  </div>
</template>

<style scoped>
.twitch-channels-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
