<script setup lang="ts">
defineProps<{
  modelValue?: string
  placeholder?: string
  rows?: number
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <textarea
    class="app-textarea"
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows ?? 4"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<style scoped>
.app-textarea {
  width: 100%;
  background: var(--color-void);
  border: 1px solid var(--color-smoke);
  border-radius: 4px;
  color: var(--color-cream);
  font-size: var(--text-base);
  padding: var(--space-2);
  outline: none;
  resize: vertical;
  transition: border-color 0.1s;
  line-height: 1.5;
}

.app-textarea::placeholder {
  color: var(--color-dusk);
  font-size: var(--text-sm);
}

.app-textarea:focus {
  border-color: var(--color-periwinkle);
}
</style>
