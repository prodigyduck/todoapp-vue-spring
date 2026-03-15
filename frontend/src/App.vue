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
.v-application {
  background: #FFFFFF;
  min-height: 100vh;
}

.v-main {
  padding: 0;
}

* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #222222;
  font-size: 14px;
  line-height: 1.5;
}
</style>
