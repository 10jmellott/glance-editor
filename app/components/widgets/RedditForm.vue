<script setup lang="ts">
import { useConfigStore } from '~/stores/config'

const store = useConfigStore()

function update(patch: Record<string, unknown>) {
  if (!store.selectedWidgetId) return
  store.updateWidget(store.selectedWidgetId, patch)
}

const styleOptions = [
  { label: 'Vertical list', value: 'vertical-list' },
  { label: 'Horizontal cards', value: 'horizontal-cards' },
  { label: 'Vertical cards', value: 'vertical-cards' },
]

const sortOptions = [
  { label: 'Hot', value: 'hot' },
  { label: 'New', value: 'new' },
  { label: 'Top', value: 'top' },
  { label: 'Rising', value: 'rising' },
]

const topPeriodOptions = [
  { label: 'Hour', value: 'hour' },
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: 'All time', value: 'all' },
]

const extraSortOptions = [
  { label: 'None', value: '' },
  { label: 'Engagement', value: 'engagement' },
]
</script>

<template>
  <div v-if="store.selectedWidget" class="reddit-form">
    <WidgetsSharedFields />

    <PanelSection label="Source">
      <FormRow label="Subreddit *">
        <AppInput
          :model-value="store.selectedWidget.subreddit as string"
          placeholder="technology"
          @update:model-value="update({ subreddit: $event })"
        />
      </FormRow>
      <FormRow label="Search keywords">
        <AppInput
          :model-value="store.selectedWidget.search as string"
          placeholder="keyword"
          @update:model-value="update({ search: $event || undefined })"
        />
      </FormRow>
    </PanelSection>

    <PanelSection label="Display">
      <FormRow label="Style">
        <AppDropdown
          :model-value="store.selectedWidget.style as string"
          :options="styleOptions"
          @update:model-value="update({ style: $event })"
        />
      </FormRow>
      <FormRow label="Sort by">
        <AppDropdown
          :model-value="store.selectedWidget['sort-by'] as string"
          :options="sortOptions"
          @update:model-value="update({ 'sort-by': $event })"
        />
      </FormRow>
      <FormRow v-if="store.selectedWidget['sort-by'] === 'top'" label="Top period">
        <AppDropdown
          :model-value="store.selectedWidget['top-period'] as string"
          :options="topPeriodOptions"
          @update:model-value="update({ 'top-period': $event })"
        />
      </FormRow>
      <FormRow label="Extra sort by">
        <AppDropdown
          :model-value="store.selectedWidget['extra-sort-by'] as string"
          :options="extraSortOptions"
          @update:model-value="update({ 'extra-sort-by': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Limit">
        <AppInput
          :model-value="store.selectedWidget.limit as number"
          type="number"
          placeholder="15"
          @update:model-value="update({ limit: Number($event) || undefined })"
        />
      </FormRow>
      <FormRow label="Collapse after">
        <AppInput
          :model-value="store.selectedWidget['collapse-after'] as number"
          type="number"
          placeholder="5"
          @update:model-value="update({ 'collapse-after': Number($event) || undefined })"
        />
      </FormRow>
      <FormRow label="Comments URL template" hint="Use {POST-PATH} or {POST-ID} or {SUBREDDIT}.">
        <AppInput
          :model-value="store.selectedWidget['comments-url-template'] as string"
          placeholder="https://www.reddit.com/{POST-PATH}"
          @update:model-value="update({ 'comments-url-template': $event || undefined })"
        />
      </FormRow>
      <AppToggle
        :model-value="store.selectedWidget['show-thumbnails'] as boolean"
        label="Show thumbnails"
        @update:model-value="update({ 'show-thumbnails': $event })"
      />
      <AppToggle
        :model-value="store.selectedWidget['show-flairs'] as boolean"
        label="Show flairs"
        @update:model-value="update({ 'show-flairs': $event })"
      />
    </PanelSection>
  </div>
</template>

<style scoped>
.reddit-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
