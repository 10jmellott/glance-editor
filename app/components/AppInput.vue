<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  placeholder?: string
  type?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    class="app-input"
    :type="type ?? 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.app-input {
  height: 32px;
  width: 100%;
  background: var(--color-void);
  border: 1px solid var(--color-smoke);
  border-radius: 4px;
  color: var(--color-cream);
  font-size: var(--text-base);
  padding: 0 var(--space-2);
  outline: none;
  transition: border-color 0.1s;
}

.app-input::placeholder {
  color: var(--color-dusk);
  font-size: var(--text-sm);
}

.app-input:focus {
  border-color: var(--color-periwinkle);
}
</style>
