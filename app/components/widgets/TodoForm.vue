<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}
</script>

<template>
  <div v-if="store.selectedWidget" class="todo-form">
    <WidgetsSharedFields />

    <PanelSection label="To-Do">
      <FormRow label="List ID" hint="Unique ID to share tasks across multiple to-do widgets.">
        <AppInput
          :model-value="store.selectedWidget.id as string"
          placeholder="my-todo-list"
          @update:model-value="update({ id: $event })"
        />
      </FormRow>
    </PanelSection>
  </div>
</template>

<style scoped>
.todo-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
