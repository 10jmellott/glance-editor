<script setup lang="ts">
defineProps<{
  label?: string
  hint?: string
}>()
</script>

<template>
  <div class="form-row">
    <label v-if="label" class="form-row__label">{{ label }}</label>
    <slot />
    <p v-if="hint" class="form-row__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form-row__label {
  font-size: var(--text-sm);
  color: var(--color-fog);
  line-height: 1.2;
}

.form-row__hint {
  font-size: var(--text-sm);
  color: var(--color-dusk);
  line-height: 1.4;
}
</style>
