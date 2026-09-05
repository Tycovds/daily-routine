<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const confetti = Array.from({ length: 34 }, (_, i) => {
  const colors = ['var(--accent)', 'var(--ink)', 'var(--danger)']
  return {
    left: (i * 97) % 100,
    delay: (i % 11) * 0.11,
    dur: 1.5 + (i % 7) * 0.22,
    size: 6 + (i % 4) * 3,
    color: colors[i % 3],
    round: i % 3 === 0,
  }
})
</script>

<template>
  <div
    class="absolute inset-0 z-30 flex items-center justify-center p-7"
    style="background: rgba(0,0,0,.55); animation: fadeIn .2s ease both"
  >
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <span
        v-for="(c, i) in confetti"
        :key="i"
        class="absolute -top-5"
        :style="{
          left: c.left + '%',
          width: c.size + 'px',
          height: c.size + 'px',
          background: c.color,
          borderRadius: c.round ? '99px' : '2px',
          animation: `fall ${c.dur}s ${c.delay}s ease-in forwards`,
        }"
      ></span>
    </div>
    <div
      class="relative w-full rounded-3xl bg-surface px-5.5 pt-6.5 pb-5.5 text-center"
      style="animation: popIn .28s cubic-bezier(.2,.9,.3,1.2) both"
    >
      <div class="text-2xl leading-tight text-ink font-theme">Day complete</div>
      <p class="mt-2.5 font-meta text-[13px] leading-relaxed text-muted">Everything on today's list is done.</p>
      <button
        @click="emit('close')"
        class="mt-4.5 w-full cursor-pointer rounded-2xl border-0 bg-accent py-3.5 font-meta text-sm font-bold text-[color:var(--onAccent)]"
      >
        Nice
      </button>
    </div>
  </div>
</template>
