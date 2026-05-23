<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getExclude(): string[] {
  return (store.selectedWidget?.exclude as string[] | undefined) ?? []
}
</script>

<template>
  <div v-if="store.selectedWidget" class="twitch-top-games-form">
    <WidgetsSharedFields />

    <PanelSection label="Filters">
      <FormRow label="Exclude" hint="Category slugs from the Twitch URL.">
        <RepeatableList
          :items="getExclude()"
          placeholder="just-chatting"
          add-label="Add category"
          @update:items="update({ exclude: $event })"
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
.twitch-top-games-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
