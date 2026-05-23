<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <section class="panel-section">
    <div class="panel-section__header">
      <span class="panel-section__label">{{ label }}</span>
    </div>
    <div class="panel-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel-section {
  display: flex;
  flex-direction: column;
}

.panel-section__header {
  display: flex;
  align-items: center;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-haze);
  margin-bottom: var(--space-3);
}

.panel-section__label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-dusk);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.panel-section__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
