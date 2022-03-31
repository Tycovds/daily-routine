<template>
    <div @click="handleToggle" class="todo-item">
        <p :class="{ 'is-done-text': props.done }">{{ props.title }}</p>
        <div v-if="!store.deleteActive" class="checkbox">
            <input type="checkbox" />
            <span class="check" :class="{ 'is-done': props.done }"></span>
        </div>
        <img
            @click="handleDelete"
            class="delete-icon"
            v-else
            src="/icons/delete_task.svg"
            alt="delete todo"
        />
    </div>
</template>

<script setup lang="ts">
import { useTodoStore } from "@/store/index";
import { defineProps } from "vue"
interface Props {
    id: number,
    title: string,
    done: boolean,

}

const store = useTodoStore();
const props = defineProps<Props>();

const handleToggle = () => {
    if (!store.deleteActive) {
        store.toggleDone(props.id);
    }
    if (checkCompleted()) {
        store.modalActive = true;
    }
}

const handleDelete = () => {
    store.deleteTodo(props.id)
}

const checkCompleted = (): boolean | void => {

    if (store.deleteActive) {
        return
    }
    let temp = store.todos.find((todo) => {
        return todo.done === false
    })
    // temp returns a todo or undefined
    // tasks are completed if all tasks.done are true so temp == undefined
    return temp ? false : true


}
</script>

<style lang="scss" scoped>
@import "@/assets/globals.scss";
$todo-font-size: 1.3rem;
.is-done::before {
    content: " \2713 ";
}
.is-done-text {
    opacity: 0.6;
    text-decoration: line-through;
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
    .delete-icon {
        height: $todo-font-size;
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