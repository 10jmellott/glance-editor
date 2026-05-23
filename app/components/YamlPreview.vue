<script setup lang="ts">
import { X, Clipboard, Download } from '@lucide/vue'
import { ref } from 'vue'
import { useConfigStore } from '~/stores/config'
import { downloadYaml } from '~/utils/yaml'

const store = useConfigStore()
const copied = ref(false)

async function copyToClipboard() {
  await navigator.clipboard.writeText(store.yamlOutput)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.showYamlPreview" class="yaml-overlay" @click.self="store.showYamlPreview = false">
      <div class="yaml-panel">
        <div class="yaml-panel__header">
          <span class="yaml-panel__title">YAML Preview</span>
          <div class="yaml-panel__actions">
            <AppButton variant="ghost" @click="downloadYaml(store.glanceConfig)">
              <Download :size="14" />
              Download
            </AppButton>
            <IconButton title="Close" @click="store.showYamlPreview = false">
              <X :size="16" />
            </IconButton>
          </div>
        </div>
        <div class="yaml-panel__code-wrap">
          <button class="yaml-panel__copy" :class="{ 'yaml-panel__copy--done': copied }" @click="copyToClipboard">
            <Clipboard :size="13" />
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
          <pre class="yaml-panel__code">{{ store.yamlOutput }}</pre>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.yaml-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--color-void) 70%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--space-8);
}

.yaml-panel {
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  background: var(--color-charcoal);
  border: 1px solid var(--color-smoke);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.yaml-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-haze);
  flex-shrink: 0;
}

.yaml-panel__title {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-cream);
}

.yaml-panel__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.yaml-panel__code-wrap {
  position: relative;
  flex: 1;
  overflow: auto;
}

.yaml-panel__copy {
  position: sticky;
  top: var(--space-3);
  float: right;
  margin: var(--space-3) var(--space-3) 0 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-family: inherit;
  color: var(--color-fog);
  background: var(--color-ash);
  border: 1px solid var(--color-smoke);
  border-radius: 4px;
  padding: var(--space-1) var(--space-2);
  cursor: pointer;
  z-index: 1;
  transition: background 0.1s, color 0.1s;
}

.yaml-panel__copy--done {
  color: var(--color-sage);
}

.yaml-panel__code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-fog);
  line-height: 1.6;
  padding: var(--space-4);
  white-space: pre;
  background: var(--color-void);
  min-height: 100%;
}
</style>
