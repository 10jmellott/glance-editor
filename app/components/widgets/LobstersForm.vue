<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getTags(): string[] {
  return (store.selectedWidget?.tags as string[] | undefined) ?? []
}

const sortOptions = [
  { label: 'Hot', value: 'hot' },
  { label: 'New', value: 'new' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="lobsters-form">
    <WidgetsSharedFields />

    <PanelSection label="Source">
      <FormRow label="Instance URL" hint="Leave blank for lobste.rs">
        <AppInput
          :model-value="store.selectedWidget['instance-url'] as string"
          placeholder="https://lobste.rs/"
          @update:model-value="update({ 'instance-url': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Custom URL" hint="Overrides instance URL, sort-by, and tags.">
        <AppInput
          :model-value="store.selectedWidget['custom-url'] as string"
          placeholder="https://..."
          @update:model-value="update({ 'custom-url': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Tags" hint="Limit to posts with these tags.">
        <RepeatableList
          :items="getTags()"
          placeholder="go"
          add-label="Add tag"
          @update:items="update({ tags: $event })"
        />
      </FormRow>
    </PanelSection>

    <PanelSection label="Display">
      <FormRow label="Sort by">
        <AppDropdown
          :model-value="store.selectedWidget['sort-by'] as string"
          :options="sortOptions"
          @update:model-value="update({ 'sort-by': $event })"
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
    </PanelSection>
  </div>
</template>

<style scoped>
.lobsters-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
