<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

const sortOptions = [
  { label: 'Top', value: 'top' },
  { label: 'New', value: 'new' },
  { label: 'Best', value: 'best' },
]

const extraSortOptions = [
  { label: 'None', value: '' },
  { label: 'Engagement', value: 'engagement' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="hackernews-form">
    <WidgetsSharedFields />

    <PanelSection label="Display">
      <FormRow label="Sort by">
        <AppDropdown
          :model-value="store.selectedWidget['sort-by'] as string"
          :options="sortOptions"
          @update:model-value="update({ 'sort-by': $event })"
        />
      </FormRow>
      <FormRow label="Extra sort by">
        <AppDropdown
          :model-value="store.selectedWidget['extra-sort-by'] as string"
          :options="extraSortOptions"
          @update:model-value="update({ 'extra-sort-by': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Limit">
        <AppInput
          :model-value="store.selectedWidget.limit as number"
          type="number"
          placeholder="15"
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
      <FormRow label="Comments URL template" hint="Use {POST-ID} as placeholder.">
        <AppInput
          :model-value="store.selectedWidget['comments-url-template'] as string"
          placeholder="https://news.ycombinator.com/item?id={POST-ID}"
          @update:model-value="update({ 'comments-url-template': $event || undefined })"
        />
      </FormRow>
    </PanelSection>
  </div>
</template>

<style scoped>
.hackernews-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
