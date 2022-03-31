<template>
    <div class="login-view">
        <h1>Choose a username</h1>
        <form @submit.prevent="handleLogin">
            <input v-model="store.name" type="text" placeholder="name" />
            <button type="submit" class="submit-login">Pick name</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import router from "@/router/index";
import { useTodoStore } from '@/store';
const store = useTodoStore();

const handleLogin = () => {
    if (store.name !== '') {
        router.push('/');
    } else {
        alert('Pick a name')
    }
}
</script>

<style lang="scss">
@import "@/assets/globals.scss";

.login-view {
    padding: 1rem;
    font-family: "Poppins", sans-serif;
    h1 {
        color: $font-color;
        margin-bottom: 1rem;
    }

    form {
        input {
            background-color: $accent-color;
            padding: 0.4rem 1rem;
            color: $font-color;
            border: none;
            outline: none;
            font-size: 1rem;
            border-radius: 3px;
            margin-bottom: 1rem;
        }
        button {
            @include btn;
            border: none;
            outline: none;
            background-color: $main-color;
            display: block;
            width: fit-content;
        }
    }
}
</style>