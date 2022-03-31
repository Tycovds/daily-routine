<template>
  <div id="app">
    <RouterView id="view" />
    <NavBar id="nav" />
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";

</script>

<style lang="scss">
@import "@/assets/globals.scss";

html,
body {
  overflow-x: hidden;
}
#app {
  background-color: $bg-color;
  width: 100vw;
  height: 100vh;
  #view {
    height: calc(100vh - 50px);
    overflow-y: scroll;
    background-color: $bg-color;
  }
  #nav {
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>
