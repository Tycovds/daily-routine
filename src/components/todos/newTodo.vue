<template>
    <form @submit.prevent="handleSubmit" class="new-todo">
        <input ref="todoinput" type="text" v-model="newTodoText" />
    </form>
</template>

<script setup lang="ts">
import { useTodoStore } from "@/store/index";
import { ref, onMounted } from "vue";
import type Todo from "@/types/Todo";


const store = useTodoStore();


const todoinput = ref()
onMounted(() => {
    todoinput.value?.focus()

})

const newTodoText = ref<string>('');
const handleSubmit = (): void => {
    const todo: Todo = {
        id: Math.floor(Math.random() * 200 + 1),
        title: newTodoText.value,
        done: false
    }
    store.addTodo(todo);
    newTodoText.value = '';
    store.editingNewTodo = false;
}
</script>

<style lang="scss" scoped>
@import "@/assets/globals.scss";
$todo-font-size: 1.3rem;
.new-todo {
    position: relative;
    width: 100%;
    background-color: $accent-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 1rem;
    margin-bottom: 1rem;
    input {
        height: 100%;
        width: 100%;
        background-color: $accent-color;
        border: none;
        outline: none;
        border-radius: 5px;
        color: $font-color;
        font-size: 1.3rem;
        font-weight: 500;
        font-family: "Poppins", sans-serif;
    }
}
</style>