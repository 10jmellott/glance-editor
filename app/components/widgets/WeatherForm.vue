<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

const unitOptions = [
  { label: 'Metric (°C)', value: 'metric' },
  { label: 'Imperial (°F)', value: 'imperial' },
]

const hourOptions = [
  { label: '12-hour', value: '12h' },
  { label: '24-hour', value: '24h' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="weather-form">
    <WidgetsSharedFields />

    <PanelSection label="Weather">
      <FormRow label="Location *" hint="City, State/Region, Country">
        <AppInput
          :model-value="(store.selectedWidget.location as string) ?? ''"
          placeholder="Lancaster, Pennsylvania, United States"
          @update:model-value="update({ location: $event })"
        />
      </FormRow>
      <FormRow label="Units">
        <AppDropdown
          :model-value="store.selectedWidget.units as string"
          :options="unitOptions"
          @update:model-value="update({ units: $event })"
        />
      </FormRow>
      <FormRow label="Hour format">
        <AppDropdown
          :model-value="store.selectedWidget['hour-format'] as string"
          :options="hourOptions"
          @update:model-value="update({ 'hour-format': $event })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['hide-location'] as boolean"
        label="Hide location name"
        @update:model-value="update({ 'hide-location': $event })"
      />
      <AppToggle
        :model-value="store.selectedWidget['show-area-name'] as boolean"
        label="Show state/area name"
        @update:model-value="update({ 'show-area-name': $event })"
      />
    </PanelSection>
  </div>
</template>

<style scoped>
.weather-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
