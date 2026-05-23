<script setup lang="ts">
import { ChevronUp, ChevronDown, Trash2, Plus } from '@lucide/vue'

const props = defineProps<{
  items: string[]
  placeholder?: string
  addLabel?: string
}>()

const emit = defineEmits<{
  'update:items': [items: string[]]
}>()

function updateItem(index: number, value: string) {
  const updated = [...props.items]
  updated[index] = value
  emit('update:items', updated)
}

function removeItem(index: number) {
  const updated = [...props.items]
  updated.splice(index, 1)
  emit('update:items', updated)
}

function moveItem(index: number, direction: -1 | 1) {
  const updated = [...props.items]
  const target = index + direction
  if (target < 0 || target >= updated.length) return
  ;[updated[index], updated[target]] = [updated[target], updated[index]]
  emit('update:items', updated)
}

function addItem() {
  emit('update:items', [...props.items, ''])
}
</script>

<template>
  <div class="repeatable-list">
    <div v-for="(item, index) in items" :key="index" class="repeatable-list__row">
      <div class="reorder-btns">
        <button class="reorder-btn" :disabled="index === 0" @click="moveItem(index, -1)">
          <ChevronUp :size="11" />
        </button>
        <button class="reorder-btn" :disabled="index === items.length - 1" @click="moveItem(index, 1)">
          <ChevronDown :size="11" />
        </button>
      </div>
      <input
        class="repeatable-list__input"
        :value="item"
        :placeholder="placeholder"
        @input="updateItem(index, ($event.target as HTMLInputElement).value)"
      />
      <button class="delete-btn" @click="removeItem(index)">
        <Trash2 :size="13" />
      </button>
    </div>
    <button class="add-row" @click="addItem">
      <Plus :size="13" />
      <span>{{ addLabel ?? 'Add item' }}</span>
    </button>
  </div>
</template>

<style scoped>
.repeatable-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.repeatable-list__row {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  height: 32px;
}

.reorder-btns {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex-shrink: 0;
}

.reorder-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 14px;
  border: none;
  border-radius: 2px;
  background: transparent;
  color: var(--color-dusk);
  cursor: pointer;
  padding: 0;
  transition: background 0.1s, color 0.1s;
}

.reorder-btn:disabled {
  opacity: 0.2;
  cursor: default;
}

.reorder-btn:not(:disabled):hover {
  background: var(--color-smoke);
  color: var(--color-fog);
}

.repeatable-list__input {
  flex: 1;
  height: 100%;
  background: var(--color-void);
  border: 1px solid var(--color-smoke);
  border-radius: 4px;
  color: var(--color-cream);
  font-size: var(--text-base);
  font-family: inherit;
  padding: 0 var(--space-2);
  outline: none;
  transition: border-color 0.1s;
}

.repeatable-list__input:focus {
  border-color: var(--color-periwinkle);
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-dusk);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;
}

.delete-btn:hover {
  background: var(--color-ash);
  color: var(--color-ember);
}

.add-row {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-sage);
  background: transparent;
  border: none;
  padding: var(--space-1) 0;
  cursor: pointer;
  transition: opacity 0.1s;
}

.add-row:hover {
  opacity: 0.75;
}
</style>
