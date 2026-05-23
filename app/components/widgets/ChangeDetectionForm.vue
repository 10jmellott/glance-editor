<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getWatches(): string[] {
  return (store.selectedWidget?.watches as string[] | undefined) ?? []
}
</script>

<template>
  <div v-if="store.selectedWidget" class="change-detection-form">
    <WidgetsSharedFields />

    <PanelSection label="Connection">
      <FormRow label="Instance URL">
        <AppInput
          :model-value="store.selectedWidget['instance-url'] as string"
          placeholder="https://changedetection.mydomain.com/"
          @update:model-value="update({ 'instance-url': $event || undefined })"
        />
      </FormRow>
      <FormRow label="API token">
        <AppInput
          :model-value="store.selectedWidget.token as string"
          placeholder="${CHANGE_DETECTION_TOKEN}"
          @update:model-value="update({ token: $event || undefined })"
        />
      </FormRow>
    </PanelSection>

    <PanelSection label="Watches">
      <FormRow label="Watch UUIDs" hint="Leave empty to show all watches.">
        <RepeatableList
          :items="getWatches()"
          placeholder="1abca041-6d4f-4554-aa19-..."
          add-label="Add watch UUID"
          @update:items="update({ watches: $event.length ? $event : undefined })"
        />
      </FormRow>
    </PanelSection>

    <PanelSection label="Display">
      <FormRow label="Limit">
        <AppInput
          :model-value="store.selectedWidget.limit as number"
          type="number"
          placeholder="10"
          @update:model-value="update({ limit: Number($event) || undefined })"
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
.change-detection-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
