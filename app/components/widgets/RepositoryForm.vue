<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}
</script>

<template>
  <div v-if="store.selectedWidget" class="repository-form">
    <WidgetsSharedFields />

    <PanelSection label="Repository">
      <FormRow label="Repository *" hint="owner/repo — e.g. glanceapp/glance">
        <AppInput
          :model-value="store.selectedWidget.repository as string"
          placeholder="owner/repo"
          @update:model-value="update({ repository: $event })"
        />
      </FormRow>
      <FormRow label="GitHub token" hint="Read-only token to avoid rate limits.">
        <AppInput
          :model-value="store.selectedWidget.token as string"
          placeholder="${GITHUB_TOKEN}"
          @update:model-value="update({ token: $event || undefined })"
        />
      </FormRow>
    </PanelSection>

    <PanelSection label="Display">
      <FormRow label="Pull requests limit" hint="Set to -1 to hide.">
        <AppInput
          :model-value="store.selectedWidget['pull-requests-limit'] as number"
          type="number"
          placeholder="3"
          @update:model-value="update({ 'pull-requests-limit': Number($event) || undefined })"
        />
      </FormRow>
      <FormRow label="Issues limit" hint="Set to -1 to hide.">
        <AppInput
          :model-value="store.selectedWidget['issues-limit'] as number"
          type="number"
          placeholder="3"
          @update:model-value="update({ 'issues-limit': Number($event) || undefined })"
        />
      </FormRow>
      <FormRow label="Commits limit" hint="Set to -1 to hide.">
        <AppInput
          :model-value="store.selectedWidget['commits-limit'] as number"
          type="number"
          placeholder="-1"
          @update:model-value="update({ 'commits-limit': Number($event) || undefined })"
        />
      </FormRow>
    </PanelSection>
  </div>
</template>

<style scoped>
.repository-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
