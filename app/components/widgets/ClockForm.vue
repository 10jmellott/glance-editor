<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'

interface Timezone {
  timezone: string
  label?: string
}

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getTimezones(): Timezone[] {
  return (store.selectedWidget?.timezones as Timezone[] | undefined) ?? []
}

function updateTimezone(index: number, patch: Partial<Timezone>) {
  const tzs = getTimezones().map((t, i) => (i === index ? { ...t, ...patch } : t))
  update({ timezones: tzs })
}

function addTimezone() {
  update({ timezones: [...getTimezones(), { timezone: '', label: '' }] })
}

function removeTimezone(index: number) {
  const tzs = getTimezones().filter((_, i) => i !== index)
  update({ timezones: tzs.length ? tzs : undefined })
}

const hourOptions = [
  { label: '12-hour', value: '12h' },
  { label: '24-hour', value: '24h' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="clock-form">
    <WidgetsSharedFields />

    <PanelSection label="Clock">
      <FormRow label="Hour format">
        <AppDropdown
          :model-value="store.selectedWidget['hour-format'] as string"
          :options="hourOptions"
          @update:model-value="update({ 'hour-format': $event })"
        />
      </FormRow>
    </PanelSection>

    <PanelSection label="Additional Timezones">
      <div class="item-list">
        <div v-for="(tz, i) in getTimezones()" :key="i" class="item-card">
          <div class="item-card__header">
            <span class="item-card__index">Timezone {{ i + 1 }}</span>
            <button class="item-delete-btn" title="Remove" @click="removeTimezone(i)">
              <Trash2 :size="13" />
            </button>
          </div>
          <FormRow label="Timezone">
            <AppInput
              :model-value="tz.timezone"
              placeholder="Europe/Paris"
              @update:model-value="updateTimezone(i, { timezone: $event })"
            />
          </FormRow>
          <FormRow label="Label">
            <AppInput
              :model-value="tz.label"
              placeholder="Paris"
              @update:model-value="updateTimezone(i, { label: $event || undefined })"
            />
          </FormRow>
        </div>
      </div>
      <button class="add-item-btn" @click="addTimezone">
        <Plus :size="13" />
        <span>Add timezone</span>
      </button>
    </PanelSection>
  </div>
</template>

<style scoped>
.clock-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.item-card {
  background: var(--color-ash);
  border: 1px solid var(--color-smoke);
  border-radius: 6px;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.item-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-card__index {
  font-size: var(--text-xs);
  color: var(--color-dusk);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.item-delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-dusk);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.item-delete-btn:hover {
  background: var(--color-smoke);
  color: var(--color-ember);
}

.add-item-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-sage);
  background: transparent;
  border: none;
  padding: var(--space-1) 0;
  cursor: pointer;
  transition: opacity 0.1s;
}

.add-item-btn:hover {
  opacity: 0.75;
}
</style>
