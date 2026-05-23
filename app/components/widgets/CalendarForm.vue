<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

const dayOptions = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="calendar-form">
    <WidgetsSharedFields />

    <PanelSection label="Calendar">
      <FormRow label="First day of week">
        <AppDropdown
          :model-value="store.selectedWidget['first-day-of-week'] as string"
          :options="dayOptions"
          @update:model-value="update({ 'first-day-of-week': $event })"
        />
      </FormRow>
    </PanelSection>
  </div>
</template>

<style scoped>
.calendar-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
