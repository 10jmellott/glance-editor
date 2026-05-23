<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <button class="icon-btn" :title="title">
    <slot />
  </button>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--color-dusk);
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;
}

.icon-btn:hover {
  background: var(--color-ash);
}

.icon-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
