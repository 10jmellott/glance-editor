<script setup lang="ts">
defineProps<{
  modelValue?: boolean
  label?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label class="toggle-row">
    <span v-if="label" class="toggle-row__label">{{ label }}</span>
    <button
      class="toggle"
      :class="{ 'toggle--on': modelValue }"
      role="switch"
      :aria-checked="modelValue"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span class="toggle__knob" />
    </button>
  </label>
</template>

<style scoped>
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  cursor: pointer;
}

.toggle-row__label {
  font-size: var(--text-sm);
  color: var(--color-fog);
}

.toggle {
  position: relative;
  width: 32px;
  height: 18px;
  border-radius: 9px;
  border: none;
  background: var(--color-smoke);
  flex-shrink: 0;
  transition: background 0.15s;
  cursor: pointer;
  padding: 0;
}

.toggle--on {
  background: var(--color-sage);
}

.toggle__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-cream);
  transition: transform 0.15s;
}

.toggle--on .toggle__knob {
  transform: translateX(14px);
}
</style>
