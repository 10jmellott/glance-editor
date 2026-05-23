<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'

interface Market {
  symbol: string
  name?: string
  'symbol-link'?: string
  'chart-link'?: string
}

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

function getMarkets(): Market[] {
  return (store.selectedWidget?.markets as Market[] | undefined) ?? []
}

function updateMarket(index: number, patch: Partial<Market>) {
  const markets = getMarkets().map((m, i) => (i === index ? { ...m, ...patch } : m))
  update({ markets })
}

function addMarket() {
  update({ markets: [...getMarkets(), { symbol: '', name: '' }] })
}

function removeMarket(index: number) {
  const markets = getMarkets().filter((_, i) => i !== index)
  update({ markets })
}

const sortOptions = [
  { label: 'Default (definition order)', value: '' },
  { label: 'Change (% descending)', value: 'change' },
  { label: 'Absolute change ($ descending)', value: 'absolute-change' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="markets-form">
    <WidgetsSharedFields />

    <PanelSection label="Markets">
      <div class="item-list">
        <div v-for="(market, i) in getMarkets()" :key="i" class="item-card">
          <div class="item-card__header">
            <span class="item-card__index">{{ market.symbol || `Market ${i + 1}` }}</span>
            <button class="item-delete-btn" title="Remove" @click="removeMarket(i)">
              <Trash2 :size="13" />
            </button>
          </div>
          <FormRow label="Symbol *">
            <AppInput
              :model-value="market.symbol"
              placeholder="SPY"
              @update:model-value="updateMarket(i, { symbol: $event })"
            />
          </FormRow>
          <FormRow label="Name">
            <AppInput
              :model-value="market.name"
              placeholder="S&P 500"
              @update:model-value="updateMarket(i, { name: $event || undefined })"
            />
          </FormRow>
          <FormRow label="Symbol link">
            <AppInput
              :model-value="market['symbol-link']"
              placeholder="https://..."
              @update:model-value="updateMarket(i, { 'symbol-link': $event || undefined })"
            />
          </FormRow>
          <FormRow label="Chart link">
            <AppInput
              :model-value="market['chart-link']"
              placeholder="https://..."
              @update:model-value="updateMarket(i, { 'chart-link': $event || undefined })"
            />
          </FormRow>
        </div>
      </div>
      <button class="add-item-btn" @click="addMarket">
        <Plus :size="13" />
        <span>Add market</span>
      </button>
    </PanelSection>

    <PanelSection label="Display">
      <FormRow label="Sort by">
        <AppDropdown
          :model-value="store.selectedWidget['sort-by'] as string ?? ''"
          :options="sortOptions"
          @update:model-value="update({ 'sort-by': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Chart link template" hint="Use {SYMBOL} as placeholder.">
        <AppInput
          :model-value="store.selectedWidget['chart-link-template'] as string"
          placeholder="https://www.tradingview.com/chart/?symbol={SYMBOL}"
          @update:model-value="update({ 'chart-link-template': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Symbol link template" hint="Use {SYMBOL} as placeholder.">
        <AppInput
          :model-value="store.selectedWidget['symbol-link-template'] as string"
          placeholder="https://finance.yahoo.com/quote/{SYMBOL}"
          @update:model-value="update({ 'symbol-link-template': $event || undefined })"
        />
      </FormRow>
    </PanelSection>
  </div>
</template>

<style scoped>
.markets-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.item-card {
  background: var(--color-ash);
  border: 1px solid var(--color-smoke);
  border-radius: 6px;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.item-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-card__index {
  font-size: var(--text-xs);
  color: var(--color-dusk);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.item-delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-dusk);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.item-delete-btn:hover {
  background: var(--color-smoke);
  color: var(--color-ember);
}

.add-item-btn {
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

.add-item-btn:hover {
  opacity: 0.75;
}
</style>
