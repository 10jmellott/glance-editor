<script setup lang="ts">
import { Trash2, Plus, Download, Hash } from '@lucide/vue'
import { useConfigStore } from '~/stores/config'
import { downloadEnv } from '~/utils/yaml'

const store = useConfigStore()
</script>

<template>
  <div class="global-config">
    <!-- Server -->
    <PanelSection label="Server">
      <FormRow label="Port">
        <AppInput
          type="number"
          placeholder="8080"
          :model-value="store.server.port?.toString() ?? ''"
          @update:model-value="store.updateServer({ port: $event ? Number($event) : undefined })"
        />
      </FormRow>
      <FormRow label="Host">
        <AppInput
          placeholder="0.0.0.0"
          :model-value="store.server.host ?? ''"
          @update:model-value="store.updateServer({ host: $event || undefined })"
        />
      </FormRow>
      <FormRow label="Base URL">
        <AppInput
          placeholder="/glance"
          :model-value="store.server['base-url'] ?? ''"
          @update:model-value="store.updateServer({ 'base-url': $event || undefined })"
        />
      </FormRow>
    </PanelSection>

    <!-- Theme -->
    <PanelSection label="Theme">
      <FormRow label="Background Color" hint="HSL triplet, e.g. 285 5 17">
        <AppInput
          placeholder="285 5 17"
          :model-value="store.theme['background-color'] ?? ''"
          @update:model-value="store.updateTheme({ 'background-color': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Primary Color">
        <AppInput
          placeholder="45 100 70"
          :model-value="store.theme['primary-color'] ?? ''"
          @update:model-value="store.updateTheme({ 'primary-color': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Positive Color">
        <AppInput
          placeholder="90 59 66"
          :model-value="store.theme['positive-color'] ?? ''"
          @update:model-value="store.updateTheme({ 'positive-color': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Negative Color">
        <AppInput
          placeholder="345 100 69"
          :model-value="store.theme['negative-color'] ?? ''"
          @update:model-value="store.updateTheme({ 'negative-color': $event || undefined })"
        />
      </FormRow>
      <AppToggle
        label="Disable color picker"
        :model-value="store.theme['disable-picker'] ?? false"
        @update:model-value="store.updateTheme({ 'disable-picker': $event || undefined })"
      />
    </PanelSection>

    <!-- Branding -->
    <PanelSection label="Branding">
      <FormRow label="Logo Text">
        <AppInput
          placeholder="GL"
          :model-value="store.branding['logo-text'] ?? ''"
          @update:model-value="store.updateBranding({ 'logo-text': $event || undefined })"
        />
      </FormRow>
      <FormRow label="App Name">
        <AppInput
          placeholder="My Dashboard"
          :model-value="store.branding['app-name'] ?? ''"
          @update:model-value="store.updateBranding({ 'app-name': $event || undefined })"
        />
      </FormRow>
      <FormRow label="Favicon URL">
        <AppInput
          placeholder="https://example.com/favicon.ico"
          :model-value="store.branding['favicon-url'] ?? ''"
          @update:model-value="store.updateBranding({ 'favicon-url': $event || undefined })"
        />
      </FormRow>
      <AppToggle
        label="Hide footer"
        :model-value="store.branding['hide-footer'] ?? false"
        @update:model-value="store.updateBranding({ 'hide-footer': $event || undefined })"
      />
    </PanelSection>

    <!-- Auth -->
    <PanelSection label="Authentication">
      <FormRow label="Secret Key" hint="Generate with: ./glance secret:make">
        <AppInput
          placeholder="(required to enable auth)"
          :model-value="store.authSecretKey"
          @update:model-value="store.setAuthSecretKey($event)"
        />
      </FormRow>

      <div v-if="store.authUsers.length > 0" class="auth-users">
        <div v-for="(user, index) in store.authUsers" :key="index" class="auth-user-row">
          <input
            class="env-input env-input--username"
            placeholder="username"
            :value="user.username"
            @input="store.updateAuthUser(index, { username: ($event.target as HTMLInputElement).value })"
          />
          <button
            class="auth-mode-toggle"
            :class="{ 'auth-mode-toggle--active': 'password-hash' in user }"
            :title="'password-hash' in user ? 'Using hashed password (click to switch to plain)' : 'Using plain password (click to switch to hash)'"
            @click="store.toggleAuthUserHashMode(index)"
          >
            <Hash :size="12" />
          </button>
          <input
            v-if="!('password-hash' in user)"
            class="env-input env-input--value"
            type="password"
            placeholder="password"
            :value="user.password ?? ''"
            @input="store.updateAuthUser(index, { password: ($event.target as HTMLInputElement).value })"
          />
          <input
            v-else
            class="env-input env-input--value"
            placeholder="password-hash"
            :value="user['password-hash']"
            @input="store.updateAuthUser(index, { 'password-hash': ($event.target as HTMLInputElement).value })"
          />
          <button class="env-delete" @click="store.removeAuthUser(index)">
            <Trash2 :size="13" />
          </button>
        </div>
      </div>

      <button class="add-row" @click="store.addAuthUser()">
        <Plus :size="13" />
        <span>Add user</span>
      </button>
    </PanelSection>

    <!-- Environment Variables -->
    <PanelSection label="Environment Variables">
      <p class="env-hint">
        Define variables here and reference them anywhere in your config with
        <code>${VAR_NAME}</code>. Download the <code>.env</code> file to place alongside
        your <code>glance.yml</code>.
      </p>

      <div class="env-list">
        <div v-for="(envVar, index) in store.envVars" :key="index" class="env-row">
          <input
            class="env-input env-input--name"
            placeholder="VAR_NAME"
            :value="envVar.name"
            @input="store.updateEnvVar(index, { name: ($event.target as HTMLInputElement).value })"
          />
          <span class="env-eq">=</span>
          <input
            class="env-input env-input--value"
            placeholder="value"
            :value="envVar.value"
            @input="store.updateEnvVar(index, { value: ($event.target as HTMLInputElement).value })"
          />
          <button class="env-delete" @click="store.removeEnvVar(index)">
            <Trash2 :size="13" />
          </button>
        </div>

        <button class="add-row" @click="store.addEnvVar()">
          <Plus :size="13" />
          <span>Add variable</span>
        </button>
      </div>

      <button
        v-if="store.envVars.length > 0"
        class="download-env-btn"
        @click="downloadEnv(store.envOutput)"
      >
        <Download :size="13" />
        Download .env
      </button>
    </PanelSection>
  </div>
</template>

<style scoped>
.global-config {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.env-hint {
  font-size: var(--text-sm);
  color: var(--color-dusk);
  line-height: 1.5;
}

.env-hint code {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-saffron);
  background: color-mix(in srgb, var(--color-saffron) 10%, transparent);
  border-radius: 3px;
  padding: 1px 4px;
}

.auth-mode-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-smoke);
  border-radius: 4px;
  background: transparent;
  color: var(--color-dusk);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}

.auth-mode-toggle:hover {
  border-color: var(--color-periwinkle);
  color: var(--color-periwinkle);
}

.auth-mode-toggle--active {
  border-color: var(--color-saffron);
  color: var(--color-saffron);
  background: color-mix(in srgb, var(--color-saffron) 10%, transparent);
}

.auth-users {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
}

.auth-user-row {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
}

.env-input--username {
  flex: 2;
  text-transform: none;
}

.env-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.env-row {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
}

.env-input {
  height: 100%;
  background: var(--color-void);
  border: 1px solid var(--color-smoke);
  border-radius: 4px;
  color: var(--color-cream);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  padding: 0 var(--space-2);
  outline: none;
  transition: border-color 0.1s;
  min-width: 0;
}

.env-input:focus {
  border-color: var(--color-periwinkle);
}

.env-input--name {
  flex: 2;
  text-transform: uppercase;
}

.env-input--value {
  flex: 3;
}

.env-eq {
  font-size: var(--text-sm);
  color: var(--color-dusk);
  flex-shrink: 0;
}

.env-delete {
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

.env-delete:hover {
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

.download-env-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  height: 28px;
  padding: 0 var(--space-3);
  border: 1px solid var(--color-smoke);
  border-radius: 4px;
  background: transparent;
  color: var(--color-fog);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: border-color 0.1s, color 0.1s;
}

.download-env-btn:hover {
  border-color: var(--color-periwinkle);
  color: var(--color-periwinkle);
}
</style>
