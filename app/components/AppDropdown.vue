<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

defineProps<{
  modelValue?: string
  options: Array<{ label: string; value: string }>
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="dropdown-wrap">
    <select
      class="app-select"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled :selected="!modelValue">
        {{ placeholder }}
      </option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <ChevronDown class="dropdown-chevron" :size="14" />
  </div>
</template>

<style scoped>
.dropdown-wrap {
  position: relative;
  width: 100%;
}

.app-select {
  height: 32px;
  width: 100%;
  background: var(--color-void);
  border: 1px solid var(--color-smoke);
  border-radius: 4px;
  color: var(--color-cream);
  font-size: var(--text-base);
  padding: 0 var(--space-8) 0 var(--space-2);
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.1s;
}

.app-select:focus {
  border-color: var(--color-periwinkle);
}

.dropdown-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-dusk);
  pointer-events: none;
}
</style>
