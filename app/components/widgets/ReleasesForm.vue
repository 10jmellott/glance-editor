<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getRepos(): string[] {
  return (store.selectedWidget?.repositories as string[] | undefined) ?? []
}
</script>

<template>
  <div v-if="store.selectedWidget" class="releases-form">
    <WidgetsSharedFields />

    <PanelSection label="Repositories">
      <FormRow label="Repositories *" hint="owner/repo, gitlab:owner/repo, dockerhub:owner/repo, codeberg:owner/repo">
        <RepeatableList
          :items="getRepos()"
          placeholder="owner/repo"
          add-label="Add repository"
          @update:items="update({ repositories: $event })"
        />
      </FormRow>
      <FormRow label="GitHub token">
        <AppInput
          :model-value="store.selectedWidget.token as string"
          placeholder="${GITHUB_TOKEN}"
          @update:model-value="update({ token: $event || undefined })"
        />
      </FormRow>
      <FormRow label="GitLab token">
        <AppInput
          :model-value="store.selectedWidget['gitlab-token'] as string"
          placeholder="${GITLAB_TOKEN}"
          @update:model-value="update({ 'gitlab-token': $event || undefined })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['show-source-icon'] as boolean"
        label="Show source icon"
        @update:model-value="update({ 'show-source-icon': $event })"
      />
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
.releases-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
