<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}
</script>

<template>
  <PanelSection label="General">
    <FormRow label="Title">
      <AppInput
        :model-value="store.selectedWidget?.title as string"
        placeholder="Widget title"
        @update:model-value="update({ title: $event })"
      />
    </FormRow>
    <FormRow label="Title URL">
      <AppInput
        :model-value="store.selectedWidget?.['title-url'] as string"
        placeholder="https://"
        @update:model-value="update({ 'title-url': $event })"
      />
    </FormRow>
    <FormRow label="Cache" hint="e.g. 30s, 5m, 2h, 1d">
      <AppInput
        :model-value="store.selectedWidget?.cache as string"
        placeholder="5m"
        @update:model-value="update({ cache: $event })"
      />
    </FormRow>
    <FormRow label="CSS Class">
      <AppInput
        :model-value="store.selectedWidget?.['css-class'] as string"
        placeholder="my-widget"
        @update:model-value="update({ 'css-class': $event })"
      />
    </FormRow>
    <AppToggle
      :model-value="store.selectedWidget?.['hide-header'] as boolean"
      label="Hide header"
      @update:model-value="update({ 'hide-header': $event })"
    />
  </PanelSection>
</template>
