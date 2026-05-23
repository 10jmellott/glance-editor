<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'

interface Server {
  type: 'local' | 'remote'
  name?: string
  'hide-swap'?: boolean
  url?: string
  token?: string
  timeout?: string
}

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getServers(): Server[] {
  return (store.selectedWidget?.servers as Server[] | undefined) ?? []
}

function updateServer(index: number, patch: Partial<Server>) {
  const servers = getServers().map((s, i) => (i === index ? { ...s, ...patch } : s))
  update({ servers })
}

function addServer() {
  update({ servers: [...getServers(), { type: 'local', name: '' }] })
}

function removeServer(index: number) {
  const servers = getServers().filter((_, i) => i !== index)
  update({ servers: servers.length ? servers : undefined })
}

const typeOptions = [
  { label: 'Local', value: 'local' },
  { label: 'Remote', value: 'remote' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="server-stats-form">
    <WidgetsSharedFields />

    <PanelSection label="Servers">
      <div class="item-list">
        <div v-for="(server, i) in getServers()" :key="i" class="item-card">
          <div class="item-card__header">
            <span class="item-card__index">{{ server.name || server.type || `Server ${i + 1}` }}</span>
            <button class="item-delete-btn" title="Remove" @click="removeServer(i)">
              <Trash2 :size="13" />
            </button>
          </div>
          <FormRow label="Type">
            <AppDropdown
              :model-value="server.type"
              :options="typeOptions"
              @update:model-value="updateServer(i, { type: $event as 'local' | 'remote' })"
            />
          </FormRow>
          <FormRow label="Name">
            <AppInput
              :model-value="server.name"
              placeholder="Services"
              @update:model-value="updateServer(i, { name: $event || undefined })"
            />
          </FormRow>
          <template v-if="server.type === 'remote'">
            <FormRow label="URL *">
              <AppInput
                :model-value="server.url"
                placeholder="http://server:7655"
                @update:model-value="updateServer(i, { url: $event })"
              />
            </FormRow>
            <FormRow label="Token">
              <AppInput
                :model-value="server.token"
                placeholder="${AGENT_TOKEN}"
                @update:model-value="updateServer(i, { token: $event || undefined })"
              />
            </FormRow>
            <FormRow label="Timeout">
              <AppInput
                :model-value="server.timeout"
                placeholder="3s"
                @update:model-value="updateServer(i, { timeout: $event || undefined })"
              />
            </FormRow>
          </template>
          <AppToggle
            :model-value="server['hide-swap']"
            label="Hide swap usage"
            @update:model-value="updateServer(i, { 'hide-swap': $event })"
          />
        </div>
      </div>
      <button class="add-item-btn" @click="addServer">
        <Plus :size="13" />
        <span>Add server</span>
      </button>
    </PanelSection>
  </div>
</template>

<style scoped>
.server-stats-form {
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
