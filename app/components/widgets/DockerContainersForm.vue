<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}
</script>

<template>
  <div v-if="store.selectedWidget" class="docker-form">
    <WidgetsSharedFields />

    <PanelSection label="Docker">
      <FormRow label="Socket path">
        <AppInput
          :model-value="store.selectedWidget['sock-path'] as string"
          placeholder="/var/run/docker.sock"
          @update:model-value="update({ 'sock-path': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Category" hint="Filter by glance.category label.">
        <AppInput
          :model-value="store.selectedWidget.category as string"
          placeholder="media"
          @update:model-value="update({ category: $event || undefined })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['hide-by-default'] as boolean"
        label="Hide by default"
        @update:model-value="update({ 'hide-by-default': $event })"
      />
      <AppToggle
        :model-value="store.selectedWidget['format-container-names'] as boolean"
        label="Format container names"
        @update:model-value="update({ 'format-container-names': $event })"
      />
      <AppToggle
        :model-value="store.selectedWidget['running-only'] as boolean"
        label="Running containers only"
        @update:model-value="update({ 'running-only': $event })"
      />
    </PanelSection>
  </div>
</template>

<style scoped>
.docker-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
