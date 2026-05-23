<script setup lang="ts">
import { ref } from 'vue'
import { Code } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'
import { downloadYaml } from '~/utils/yaml'

const store = useConfigStore()
const fileInput = ref<HTMLInputElement | null>(null)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      store.loadConfig(ev.target?.result as string)
    } catch {
      alert('Failed to parse YAML. Make sure the file is a valid Glance config.')
    }
  }
  reader.readAsText(file)
  ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <header class="top-bar">
    <div class="top-bar__left">
      <Code :size="16" class="top-bar__logo-icon" />
      <span class="top-bar__name">Glance Editor</span>
    </div>
    <div class="top-bar__right">
      <input ref="fileInput" type="file" accept=".yml,.yaml" class="file-input" @change="onFileChange" />
      <AppButton variant="ghost" @click="fileInput?.click()">Import YAML</AppButton>
      <AppButton variant="ghost" @click="store.showYamlPreview = true">Preview YAML</AppButton>
      <AppButton variant="primary" @click="downloadYaml(store.glanceConfig)">Export</AppButton>
    </div>
  </header>
</template>

<style scoped>
.file-input {
  display: none;
}
</style>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 var(--space-4);
  background: var(--color-charcoal);
  border-bottom: 1px solid var(--color-smoke);
  flex-shrink: 0;
}

.top-bar__left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.top-bar__logo-icon {
  color: var(--color-blossom);
}

.top-bar__name {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-cream);
}

.top-bar__right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
</style>
