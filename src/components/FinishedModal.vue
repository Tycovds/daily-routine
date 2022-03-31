<template>
    <div class="modal">
        <img @click="handleClose" id="close_modal" src="/icons/close_modal.svg" alt="close modal" />
        <h1>Good job!</h1>
        <p>Finished all task for today</p>

        <p>Done all tasks by</p>
        <h2>{{ time }}</h2>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTodoStore } from "@/store/index";
const store = useTodoStore();


const time = ref<string>()
onMounted(() => {
    const today = new Date();
    const hours = today.getHours();
    let minutes: number | string = today.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    time.value = `${hours}:${minutes}`;
})

const handleClose = () => {
    store.modalActive = false;
}
</script>

<style lang="scss" scoped>
@import "@/assets/globals.scss";
.modal {
    position: absolute;
    inset: 1rem 1rem 4.5rem 1rem;
    background-color: $accent-color;
    z-index: 5;
    padding: 1rem;

    #close_modal {
        position: absolute;
        top: 1rem;
        right: 1rem;
        height: 1.5rem;
    }
    h1,
    h2,
    p {
        color: $font-color;
        font-family: "Poppins", sans-serif;
    }

    h1 {
        font-size: 3rem;
    }
    h2 {
        font-size: 3rem;
        font-weight: 400;
    }
    p {
        font-size: 1rem;

        &:first-of-type {
            margin-bottom: 2rem;
            opacity: 0.6;
        }
    }
}
</style>