<template>
  <v-app theme="msToDoTheme">
    <router-view />
  </v-app>
</template>

<script setup>
</script>

<style>
.v-application {
  background: var(--bg-base);
  min-height: 100vh;
  color: var(--text-primary);
}

:root {
  /* Design tokens (enhanced, centralized) */
  /* Single accent color (blue) */
  --ms-primary: #3b82f6; /* accent */
  --ms-primary-dark: #2563eb;
  --ms-primary-08: rgba(59, 130, 246, 0.08);
  --ms-primary-12: rgba(59, 130, 246, 0.12);
  --ms-primary-15: rgba(59, 130, 246, 0.15);

  /* Surface / backgrounds */
  --bg-base: #FFFFFF; /* main app background */
  --bg-variant: #F8FAFC; /* sidebar / subtle panels (slate-50) */
  --panel-bg: #FFFFFF; /* cards and drawers */
  --ms-surface: var(--bg-base);
  --ms-surface-variant: var(--bg-variant);

  --ms-border: #e2e8f0; /* slate-200 */
  --ms-neutral-900: #334155; /* slate-700 */
  --ms-neutral-700: #94a3b8; /* slate-400 (faded text) */

  --text-primary: var(--ms-neutral-900);
  --text-muted: var(--ms-neutral-700);

  --ms-font-family: 'Segoe UI Variable', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;

  /* Typography scale */
  --body1-font-size: 14px;
  --body1-strong-weight: 600;
  --h1-size: 26px;
  --h2-size: 18px;
  --h3-size: 15px;

  /* Spacing (8px baseline) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --spacing-48: 48px;

  --sidebar-width: 250px;
  --detail-width: 380px;

  /* Radii & shadows */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Flatter UI: remove heavy shadows */
  --shadow-sm: none;
  --shadow-md: none;
  --shadow-focus: 0 4px 12px rgba(59,130,246,0.08);

  /* Motion */
  --transition-fast: 150ms;
  --transition-medium: 220ms;

  --hover-bg: #f1f5f9; /* very light slate for hover */
}

* {
  font-family: var(--ms-font-family);
  box-sizing: border-box;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  font-size: var(--body1-font-size);
  line-height: 1.5;
  margin: 0;
}
</style>

<style>
/* Global overrides for flatter, more rounded modern UI */
.v-card {
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  border-radius: 16px !important;
}

.v-btn {
  border-radius: 12px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.v-text-field .v-field {
  border-radius: 12px !important;
  box-shadow: none !important;
}

.v-list-item {
  border-radius: 12px !important;
}
</style>

<style>
/* Remove expansion panel shadows */
.v-expansion-panel {
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  border-radius: 16px !important;
  background-color: transparent !important;
}
.v-expansion-panel::before {
  box-shadow: none !important;
}
.v-expansion-panel-title {
  border-radius: 16px !important;
}

/* Make inputs and buttons same height if side by side */
.add-btn {
  height: 48px !important;
}
.search-input .v-field {
  min-height: 48px !important;
}
</style>

<style>
/* Fix Add a new task box size */
.new-input .v-field {
  min-height: 56px !important;
  display: flex;
  align-items: center;
}
.task-item {
  min-height: 56px !important;
}
</style>

<style>
/* More explicit fix for input heights */
.search-input .v-field__input {
  min-height: 48px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  align-items: center;
}
.new-input .v-field__input {
  min-height: 56px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  align-items: center;
}
</style>

<style>
/* Aggressively remove expansion panel shadows and backgrounds */
.v-expansion-panels {
  border-radius: 16px !important;
  box-shadow: none !important;
}
.v-expansion-panel {
  box-shadow: none !important;
  background-color: transparent !important;
}
.v-expansion-panel::after,
.v-expansion-panel::before {
  display: none !important;
  box-shadow: none !important;
}
.v-expansion-panel-title--active {
  background-color: rgba(0,0,0,0.02) !important;
}
</style>
