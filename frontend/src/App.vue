<template>
  <v-app theme="msToDoTheme">
    <router-view />
  </v-app>
</template>

<script setup>
</script>

<style>
.v-application {
  background: #FFFFFF;
  min-height: 100vh;
}

* {
  font-family: 'Segoe UI Variable', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #242424;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}
</style>
