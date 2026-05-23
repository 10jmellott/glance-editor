<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}
</script>

<template>
  <div v-if="store.selectedWidget" class="iframe-form">
    <WidgetsSharedFields />

    <PanelSection label="Frame">
      <FormRow label="Source URL *">
        <AppInput
          :model-value="store.selectedWidget.source as string"
          placeholder="https://example.com"
          @update:model-value="update({ source: $event })"
        />
      </FormRow>
      <FormRow label="Height (px)">
        <AppInput
          :model-value="store.selectedWidget.height as number"
          type="number"
          placeholder="300"
          @update:model-value="update({ height: Number($event) || undefined })"
        />
      </FormRow>
    </PanelSection>
  </div>
</template>

<style scoped>
.iframe-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
