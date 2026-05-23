<script setup lang="ts">
</script>

<template>
  <div class="editor-shell">
    <NuxtRouteAnnouncer />
    <AppTopBar />
    <div class="editor-shell__body">
      <PageListSidebar />
      <EditorCanvas />
      <SettingsPanel />
    </div>
    <YamlPreview />
  </div>
</template>

<style scoped>
.editor-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.editor-shell__body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
