<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()
</script>

<template>
  <div v-if="store.selectedWidget" class="generic-form">
    <WidgetsSharedFields />
  </div>
</template>

<style scoped>
.generic-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
