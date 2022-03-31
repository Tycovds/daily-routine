<template>
  <div id="app">
    <RouterView id="view" />
    <NavBar id="nav"></NavBar>
  </div>
</template>

<script setup lang="ts">
// import { defineComponent } from 'vue';
import NavBar from "@/components/NavBar.vue";

</script>

<style lang="scss">
@import "@/assets/globals.scss";

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
