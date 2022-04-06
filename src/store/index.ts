import { defineStore } from 'pinia'

import type Todo from "../types/Todo";

export const useTodoStore = defineStore({
  id: 'todos',
  state: () => ({
    todos: [] as Todo[],
    editingNewTodo: false as boolean,
    modalActive: false as boolean,
    deleteActive: false as boolean,
    name: '' as string
  }),
  actions: {
    addTodo(todo: Todo) {
      this.todos = [...this.todos, todo]
    },
    toggleDone(id: number) {
      const target = this.todos.find((todo) => {
        return todo["id"] == id;
      });
      if (target) {
        target.done = !target.done;
      }
    },
    deleteTodo(id: number): void {
      const target = this.todos.find((todo) => {
        return todo["id"] == id;
      });
      if (target) {
        const index = this.todos.indexOf(target);
        this.todos.splice(index, 1);
      }
    },
    resetTodos() {
      this.todos.forEach((todo) => {
        todo.done = false;
      })
    }
  }, persist: {
    enabled: true,
    strategies: [{ key: 'todos', storage: localStorage }]

  }
})