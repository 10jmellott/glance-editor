<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' },
]

const bodyTypeOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'String', value: 'string' },
]

function getBearerToken(): string {
  const headers = store.selectedWidget?.headers as Record<string, string> | undefined
  const auth = headers?.Authorization ?? ''
  return auth.startsWith('Bearer ') ? auth.slice(7) : ''
}

function setBearerToken(token: string) {
  const existing = (store.selectedWidget?.headers as Record<string, string> | undefined) ?? {}
  if (token) {
    update({ headers: { ...existing, Authorization: `Bearer ${token}` } })
  } else {
    const { Authorization: _, ...rest } = existing
    update({ headers: Object.keys(rest).length ? rest : undefined })
  }
}
</script>

<template>
  <div v-if="store.selectedWidget" class="custom-api-form">
    <WidgetsSharedFields />

    <PanelSection label="Request">
      <FormRow label="URL">
        <AppInput
          :model-value="store.selectedWidget.url as string"
          placeholder="https://api.example.com/data"
          @update:model-value="update({ url: $event || undefined })"
        />
      </FormRow>
      <FormRow label="Method">
        <AppDropdown
          :model-value="store.selectedWidget.method as string"
          :options="methodOptions"
          @update:model-value="update({ method: $event })"
        />
      </FormRow>
      <FormRow label="Body type">
        <AppDropdown
          :model-value="store.selectedWidget['body-type'] as string"
          :options="bodyTypeOptions"
          @update:model-value="update({ 'body-type': $event })"
        />
      </FormRow>
      <FormRow label="Bearer token" hint="Sets Authorization: Bearer … header.">
        <AppInput
          :model-value="getBearerToken()"
          placeholder="${API_TOKEN}"
          @update:model-value="setBearerToken($event)"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['allow-insecure'] as boolean"
        label="Allow insecure certificate"
        @update:model-value="update({ 'allow-insecure': $event })"
      />
      <AppToggle
        :model-value="store.selectedWidget['skip-json-validation'] as boolean"
        label="Skip JSON validation"
        @update:model-value="update({ 'skip-json-validation': $event })"
      />
    </PanelSection>

    <PanelSection label="Template">
      <FormRow label="Template *" hint="Go html/template syntax. Use .JSON to access response data.">
        <AppTextarea
          :model-value="store.selectedWidget.template as string"
          placeholder="<p>{{ .JSON.String &quot;field&quot; }}</p>"
          :rows="8"
          @update:model-value="update({ template: $event })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget.frameless as boolean"
        label="Frameless"
        @update:model-value="update({ frameless: $event })"
      />
    </PanelSection>
  </div>
</template>

<style scoped>
.custom-api-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
