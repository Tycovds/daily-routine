<template>
    <menu>
        <li @click="deleteTask" :class="{ 'icon-slide': !menuOpen }">
            <img src="/icons/delete_task.svg" alt="delete tasks" />
        </li>
        <li @click="resetTodos" :class="{ 'icon-slide': !menuOpen }">
            <img src="/icons/reset_tasks.svg" alt="reset tasks" />
        </li>
        <li @click="addTask" :class="{ 'icon-slide': !menuOpen }">
            <img src="/icons/add_task.svg" alt="add task" />
        </li>
        <li>
            <img @click="menuOpen = !menuOpen" src="/icons/hamburger.svg" alt="hamburger menu" />
        </li>
    </menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from "@/store/index";

const menuOpen = ref<boolean>(false);

const store = useTodoStore();

const deleteTask = () => {
    store.deleteActive = !store.deleteActive;
}
const addTask = () => {
    store.editingNewTodo = !store.editingNewTodo;
}

const resetTodos = () => {
    store.resetTodos();
}

</script>

<style lang="scss">
@import "@/assets/globals.scss";
$icon-size: 2rem;
.icon-slide {
    right: 1rem !important;
    opacity: 0;
    pointer-events: none;
}
menu {
    width: 100%;
    height: calc($icon-size + 1.5rem);
    list-style: none;
    background-color: $accent-color;
    li {
        position: absolute;
        bottom: 0.5rem;
        transition: 300ms ease-out;
        transition-property: opacity right;
        cursor: pointer;
        &:nth-of-type(1) {
            right: calc(100% - 1rem - 2rem);
        }
        &:nth-of-type(2) {
            right: 65%;
            transform: translateX(50%);
        }
        &:nth-of-type(3) {
            right: 35%;
            transform: translateX(50%);
        }
        &:nth-of-type(4) {
            right: 1rem;
        }
        img {
            height: $icon-size;
            width: auto;
        }
    }
}
</style>