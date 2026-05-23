<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}
</script>

<template>
  <div v-if="store.selectedWidget" class="html-form">
    <WidgetsSharedFields />

    <PanelSection label="Content">
      <FormRow label="HTML source" hint="Raw HTML rendered inside the widget.">
        <AppTextarea
          :model-value="store.selectedWidget.source as string"
          placeholder="<p>Hello world</p>"
          :rows="8"
          @update:model-value="update({ source: $event })"
        />
      </FormRow>
    </PanelSection>
  </div>
</template>

<style scoped>
.html-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
