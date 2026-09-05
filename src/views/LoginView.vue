<template>
    <div class="flex h-dvh flex-col justify-center bg-bg p-6 font-theme">
        <h1 class="mb-4 text-2xl text-ink">Choose a username</h1>
        <form @submit.prevent="handleLogin">
            <input
                v-model="store.userName"
                type="text"
                placeholder="name"
                class="mb-4 block w-full rounded-[10px] bg-surface px-4 py-2.5 text-ink outline-none"
            />
            <button
                type="submit"
                class="block w-fit cursor-pointer rounded-[10px] bg-accent px-4 py-2.5 font-meta font-semibold text-[color:var(--onAccent)]"
            >
                Pick name
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import router from "@/router/index";
import { useRoutineStore } from '@/store';
const store = useRoutineStore();

const handleLogin = () => {
    if (store.userName !== '') {
        router.push('/');
    } else {
        alert('Pick a name')
    }
}
</script>
