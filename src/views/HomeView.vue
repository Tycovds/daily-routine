<script setup lang="ts">
import { defineComponent } from "@vue/runtime-core";
import TodoList from "../components/todos/todoList.vue";

</script>

<template>
  <main>
    <h1>Carpe diem, Sabylla!</h1>
    <p>Hier zijn je taken.</p>

    <TodoList />
  </main>
</template>

<style lang="scss" scoped>
@import "@/assets/globals.scss";

main {
  padding: 1rem;

  h1,
  p {
    color: $font-color;
    font-family: "Poppins", sans-serif;
  }

  p {
    opacity: 0.6;
  }
}
</style>
