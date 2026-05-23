<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}
</script>

<template>
  <div v-if="store.selectedWidget" class="extension-form">
    <WidgetsSharedFields />

    <PanelSection label="Extension">
      <FormRow label="URL *">
        <AppInput
          :model-value="store.selectedWidget.url as string"
          placeholder="https://domain.com/widget"
          @update:model-value="update({ url: $event })"
        />
      </FormRow>
      <FormRow label="Fallback content type" hint="Set to 'html' if the server doesn't return Widget-Content-Type.">
        <AppInput
          :model-value="store.selectedWidget['fallback-content-type'] as string"
          placeholder="html"
          @update:model-value="update({ 'fallback-content-type': $event || undefined })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['allow-potentially-dangerous-html'] as boolean"
        label="Allow potentially dangerous HTML"
        @update:model-value="update({ 'allow-potentially-dangerous-html': $event })"
      />
    </PanelSection>
  </div>
</template>

<style scoped>
.extension-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
