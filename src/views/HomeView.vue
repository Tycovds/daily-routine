<script setup lang="ts">
import TodoList from "../components/todos/todoList.vue";
import FinishedModal from "@/components/FinishedModal.vue";
import { useTodoStore } from "@/store";
import { computed } from "@vue/reactivity";

const store = useTodoStore();
let isActive = computed(() => {
  return store.modalActive;
})
</script>

<template>
  <main>
    <FinishedModal v-if="isActive" />
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
