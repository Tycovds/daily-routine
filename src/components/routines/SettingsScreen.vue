<script setup lang="ts">
import { computed } from 'vue'
import { useRoutineStore } from '@/store'
import { fonts, palettes, accents, ratio, safeInk, safeAccent, resolveTheme } from '@/utils/theme'

const store = useRoutineStore()
const theme = computed(() => resolveTheme(store.settings))

function paletteRatio(index: number): string {
  const p = palettes[index]
  return ratio(safeInk(p.ink, p.bg), p.bg).toFixed(1) + ':1 AA'
}
function paletteSwatch(index: number): string {
  const p = palettes[index]
  return `linear-gradient(135deg, ${p.bg} 50%, ${p.surface} 50%)`
}
function accentSwatch(hex: string): string {
  return safeAccent(hex, theme.value.bg)
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="px-6 pt-0.5">
      <h1 class="m-0 text-[28px] font-normal text-ink font-theme">Settings</h1>
      <p class="mt-1.5 font-meta text-[13px] text-muted">Contrast is checked for you. Unreadable pairs get corrected.</p>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-6 pt-5" style="padding-bottom: calc(6rem + env(safe-area-inset-bottom))">
      <div class="font-meta text-[11px] tracking-[.08em] text-muted uppercase">Typeface</div>
      <div class="mt-2.5 grid grid-cols-2 gap-2">
        <button
          v-for="f in fonts"
          :key="f.id"
          @click="store.settings.font = f.id"
          class="flex flex-col items-start gap-1.5 rounded-[14px] border px-3.5 py-3 text-left"
          :class="store.settings.font === f.id ? 'border-accent' : 'border-transparent'"
          style="background: var(--surface); color: var(--ink)"
        >
          <span class="font-meta text-[11px] tracking-[.06em] text-muted uppercase opacity-60">{{ f.label }}</span>
          <span :style="{ fontFamily: f.css, fontSize: '18px' }">Feed fish</span>
        </button>
      </div>

      <div class="mt-5.5 font-meta text-[11px] tracking-[.08em] text-muted uppercase">Background &amp; text</div>
      <div class="mt-2.5 flex flex-col gap-2">
        <button
          v-for="(p, i) in palettes"
          :key="p.label"
          @click="store.settings.palette = i"
          class="flex items-center gap-3 rounded-[14px] border px-3.5 py-2.5 text-left"
          :class="store.settings.palette === i ? 'border-accent' : 'border-transparent'"
          style="background: var(--surface); color: var(--ink)"
        >
          <span
            class="h-[22px] w-[34px] flex-none rounded-[7px] border"
            style="border-color: rgba(255,255,255,.14)"
            :style="{ background: paletteSwatch(i) }"
          ></span>
          <span class="min-w-0 flex-1 text-[15px]">{{ p.label }}</span>
          <span class="font-meta text-[11px] opacity-65">{{ paletteRatio(i) }}</span>
        </button>
      </div>

      <div class="mt-5.5 font-meta text-[11px] tracking-[.08em] text-muted uppercase">Accent</div>
      <div class="mt-2.5 flex flex-wrap gap-2.5">
        <button
          v-for="(a, i) in accents"
          :key="a.label"
          @click="store.settings.accent = i"
          :title="a.label"
          class="h-11 w-11 rounded-[13px] border-2"
          :style="{
            background: accentSwatch(a.hex),
            borderColor: store.settings.accent === i ? 'var(--ink)' : 'transparent',
            boxShadow: '0 0 0 1px rgba(255,255,255,.12) inset',
          }"
        ></button>
      </div>

      <div class="mt-3.5 rounded-xl bg-surface2 px-3.5 py-3 font-meta text-xs leading-relaxed text-muted">
        Text sits at {{ ratio(theme.ink, theme.bg).toFixed(1) }}:1 and the accent at {{ ratio(theme.accent, theme.bg).toFixed(1) }}:1 against
        the background. Anything below the readable minimum is nudged automatically, so icons and actions stay visible.
      </div>

      <div class="mt-5.5 rounded-2xl bg-surface p-4">
        <div class="font-meta text-[11px] tracking-[.08em] text-muted uppercase">Preview</div>
        <div class="mt-2.5 flex items-center gap-3">
          <div class="min-w-0 flex-1 text-[17px] text-ink">Clean kitchen</div>
          <span class="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-accent text-[color:var(--onAccent)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
          </span>
        </div>
      </div>

      <button
        @click="store.resetCompletions"
        class="mt-5.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border px-3 py-3.5 font-meta text-[12.5px] font-semibold text-muted hover:text-ink"
        style="border-color: rgba(255,255,255,.12); background: transparent"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4h-4" /></svg>
        Clear today's checkmarks
      </button>
      <p class="mt-2 text-center font-meta text-[11px] text-muted">The list clears itself at midnight.</p>
    </div>
  </div>
</template>
