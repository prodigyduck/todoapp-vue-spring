<template>
  <v-app theme="myCustomLightTheme">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
</script>

<style>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Global styles for Zen Garden theme */
.v-application {
  background: #FAFAFA;
  min-height: 100vh;
}

/* Font loading styles */
body.fonts-loading {
  opacity: 0;
  transition: opacity 0.3s ease;
}

body.fonts-loading * {
  visibility: hidden;
}

.v-main {
  padding: 20px;
}

/* Router transition */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* Loading spinner and app content */
#app {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease;
}

#app.loading {
  visibility: hidden;
  opacity: 0;
}

/* Force font rendering */
.v-text-field input,
.v-btn,
.v-card-title,
body {
  font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif !important;
}

/* Ensure Inter font is loaded */
* {
  font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}
</style>
