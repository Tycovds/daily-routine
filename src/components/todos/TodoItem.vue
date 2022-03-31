<template>
    <div @click="handleClick" class="todo-item">
        <p>{{ props.title }}</p>
        <div class="checkbox">
            <input type="checkbox" />
            <span class="check" :class="{ 'is-done': props.done }"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTodoStore } from "@/store/index";
import { defineProps } from "vue"
import type Todo from "@/types/Todo";
interface Props {
    id: number,
    title: string,
    done: boolean,

}

const store = useTodoStore();
const props = defineProps<Props>();


const handleClick = () => {
    store.toggleDone(props.id);
    if (checkCompleted()) {
        store.modalActive = true;
    }
}

const checkCompleted = (): boolean => {
    let temp = store.todos.find((todo) => {
        return todo.done === false
    })
    // temp returns a todo or undefined
    // tasks are completed if all tasks.done are true
    return temp ? false : true;

}
</script>

<style lang="scss" scoped>
@import "@/assets/globals.scss";
$todo-font-size: 1.3rem;
.is-done::before {
    content: " \2713 ";
}
.todo-item {
    position: relative;
    width: 100%;
    background-color: $accent-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    p {
        font-family: "Poppins", sans-serif;
        font-size: $todo-font-size;
        font-weight: 500;
        color: $font-color;
        width: 100%;
    }

    .checkbox {
        position: relative;
        height: $todo-font-size;
        width: $todo-font-size;
        cursor: pointer;
        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            opacity: 0;
        }
        .check {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: $main-color;
            display: grid;
            place-items: center;
        }
    }
}
</style>