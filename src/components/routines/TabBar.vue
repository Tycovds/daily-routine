<script setup lang="ts">
defineProps<{ active: 'today' | 'routines' | null }>()
const emit = defineEmits<{ select: [id: 'today' | 'routines'] }>()

const tabs: { id: 'today' | 'routines'; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'routines', label: 'Routines' },
]
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 z-20 flex border-t px-4.5 pt-1.5"
    style="background: var(--surface2); border-color: rgba(255,255,255,.06); padding-bottom: calc(0.625rem + env(safe-area-inset-bottom))"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="emit('select', tab.id)"
      class="mt-0.5 flex-1 cursor-pointer border-0 border-t-2 bg-transparent py-2.5 font-meta text-[12.5px] font-semibold transition-all"
      :class="active === tab.id ? 'text-accent' : 'text-muted'"
      :style="{ borderTopColor: active === tab.id ? 'var(--accent)' : 'transparent' }"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
