<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'ghost'
}>()
</script>

<template>
  <button :class="['app-btn', `app-btn--${variant ?? 'ghost'}`]">
    <slot />
  </button>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  height: 32px;
  padding: 0 var(--space-3);
  border-radius: 4px;
  font-size: var(--text-base);
  font-weight: 400;
  border: none;
  white-space: nowrap;
  transition: opacity 0.1s, background 0.1s;
}

.app-btn:active {
  transform: scale(0.97);
}

.app-btn--primary {
  background: var(--color-blossom);
  color: var(--color-void);
  font-weight: 500;
}

.app-btn--primary:hover {
  opacity: 0.85;
}

.app-btn--ghost {
  background: transparent;
  border: 1px solid var(--color-smoke);
  color: var(--color-fog);
  padding: 0 var(--space-3);
}

.app-btn--ghost:hover {
  background: var(--color-ash);
}
</style>
