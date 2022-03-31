<script setup lang="ts">
import { computed } from "vue";
import { useTodoStore } from "@/store/index";
import TodoItem from "./TodoItem.vue";
import type Todo from "@/types/Todo";
import NewTodo from "./newTodo.vue";


const store = useTodoStore();
const editingNewTodo = computed(() => (store.editingNewTodo))
const todos = computed(() => {
    return [...store.todos].sort((a: Todo, b: Todo) => {
        return a.done > b.done ? 1 : -1;
    })

})
</script>
<template>
    <div class="todo-list">
        <TransitionGroup name="list">
            <TodoItem
                v-for="todo in todos"
                :id="todo.id"
                :title="todo.title"
                :done="todo.done"
                :key="todo.id"
                :new-todo="false"
            />
        </TransitionGroup>
        <NewTodo v-if="editingNewTodo"></NewTodo>
    </div>
</template>

<style lang="scss" scoped>
.todo-list {
    margin-top: 4rem;
}
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-4rem);
}
.list-leave-active {
    position: absolute;
}
</style>
