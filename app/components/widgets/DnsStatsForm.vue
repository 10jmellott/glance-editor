<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

const serviceOptions = [
  { label: 'AdGuard Home', value: 'adguard' },
  { label: 'Pi-hole (v5 and below)', value: 'pihole' },
  { label: 'Pi-hole (v6 and above)', value: 'pihole-v6' },
  { label: 'Technitium', value: 'technitium' },
]

const hourOptions = [
  { label: '12-hour', value: '12h' },
  { label: '24-hour', value: '24h' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="dns-form">
    <WidgetsSharedFields />

    <PanelSection label="Connection">
      <FormRow label="Service">
        <AppDropdown
          :model-value="store.selectedWidget.service as string"
          :options="serviceOptions"
          @update:model-value="update({ service: $event })"
        />
      </FormRow>
      <FormRow label="URL *">
        <AppInput
          :model-value="store.selectedWidget.url as string"
          placeholder="https://adguard.domain.com/"
          @update:model-value="update({ url: $event })"
        />
      </FormRow>
      <FormRow label="Username" hint="Required for AdGuard Home.">
        <AppInput
          :model-value="store.selectedWidget.username as string"
          placeholder="admin"
          @update:model-value="update({ username: $event || undefined })"
        />
      </FormRow>
      <FormRow label="Password" hint="Required for AdGuard Home and Pi-hole v6.">
        <AppInput
          :model-value="store.selectedWidget.password as string"
          placeholder="${DNS_PASSWORD}"
          @update:model-value="update({ password: $event || undefined })"
        />
      </FormRow>
      <FormRow label="Token" hint="Required for Pi-hole v5 and Technitium.">
        <AppInput
          :model-value="store.selectedWidget.token as string"
          placeholder="${DNS_TOKEN}"
          @update:model-value="update({ token: $event || undefined })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['allow-insecure'] as boolean"
        label="Allow insecure certificate"
        @update:model-value="update({ 'allow-insecure': $event })"
      />
    </PanelSection>

    <PanelSection label="Display">
      <FormRow label="Hour format">
        <AppDropdown
          :model-value="store.selectedWidget['hour-format'] as string"
          :options="hourOptions"
          @update:model-value="update({ 'hour-format': $event })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['hide-graph'] as boolean"
        label="Hide graph"
        @update:model-value="update({ 'hide-graph': $event })"
      />
      <AppToggle
        :model-value="store.selectedWidget['hide-top-domains'] as boolean"
        label="Hide top domains"
        @update:model-value="update({ 'hide-top-domains': $event })"
      />
    </PanelSection>
  </div>
</template>

<style scoped>
.dns-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
