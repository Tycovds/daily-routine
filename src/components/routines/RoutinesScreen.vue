<script setup lang="ts">
import { ref } from 'vue'
import { useRoutineStore } from '@/store'
import { DAY_NAMES, SLOTS, summary, weekdayIndex } from '@/utils/occurrences'
import type { Freq, Routine, Slot } from '@/types/Routine'

const store = useRoutineStore()
const expanded = ref<number | null>(null)
const newName = ref('')

const FREQS: { id: Freq; label: string }[] = [
  { id: 'day', label: 'Daily' },
  { id: 'week', label: 'Weekly' },
  { id: 'month', label: 'Monthly' },
]
const MONTH_DAYS = [1, 5, 10, 14, 20, 25]

function toggleExpand(id: number) {
  expanded.value = expanded.value === id ? null : id
}
function isUnscheduled(r: Routine): boolean {
  return r.freq === 'week' && !(r.days ?? []).length
}
function setFreq(r: Routine, freq: Freq) {
  store.patchRoutine(r.id, {
    freq,
    days: freq === 'week' ? (r.days?.length ? r.days : [weekdayIndex(new Date())]) : r.days,
    dom: freq === 'month' ? (r.dom ?? 14) : r.dom,
  })
}
function toggleSlot(r: Routine, slot: Slot) {
  const slots = r.slots ?? []
  store.patchRoutine(r.id, {
    slots: slots.includes(slot) ? slots.filter((s) => s !== slot) : [...slots, slot].sort((a, b) => SLOTS.findIndex((s) => s.id === a) - SLOTS.findIndex((s) => s.id === b)),
  })
}
function toggleDay(r: Routine, day: number) {
  const days = r.days ?? []
  store.patchRoutine(r.id, { days: days.includes(day) ? days.filter((d) => d !== day) : [...days, day] })
}
function setDom(r: Routine, dom: number) {
  store.patchRoutine(r.id, { dom })
}
function addRoutine() {
  const name = newName.value.trim()
  if (!name) return
  store.addRoutine(name)
  newName.value = ''
  expanded.value = store.routines[store.routines.length - 1]?.id ?? null
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="px-6 pt-0.5">
      <h1 class="m-0 text-[28px] font-normal text-ink font-theme">Routines</h1>
      <p class="mt-1.5 font-meta text-[13px] text-muted">Pick when each one shows up. Every entry is one check.</p>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-6 pt-4.5" style="padding-bottom: calc(6rem + env(safe-area-inset-bottom))">
      <div class="flex flex-col gap-2.5">
        <div v-for="r in store.routines" :key="r.id" class="rounded-2xl bg-surface p-3.5">
          <div class="flex items-center gap-2.5">
            <div class="min-w-0 flex-1 text-base text-ink">{{ r.name }}</div>
            <button
              @click="toggleExpand(r.id)"
              class="flex h-[30px] w-[30px] flex-none cursor-pointer items-center justify-center rounded-[9px] border-0 bg-surface2 text-muted transition-transform"
              :style="{ transform: `rotate(${expanded === r.id ? 180 : 0}deg)` }"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <button
              @click="store.removeRoutine(r.id)"
              class="flex h-[30px] w-[30px] flex-none cursor-pointer items-center justify-center rounded-[9px] border-0 bg-surface2 text-muted hover:text-danger"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
            </button>
          </div>
          <div
            v-if="isUnscheduled(r)"
            class="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-meta text-[11.5px] font-semibold"
            style="background: rgba(224,120,95,.14); border: 1px solid var(--danger); color: var(--danger)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 3l9 16H3z" /><path d="M12 9v5M12 17v.01" /></svg>
            {{ summary(r) }}
          </div>
          <div v-else class="mt-1.5 font-meta text-[11.5px] text-muted">{{ summary(r) }}</div>

          <div v-if="expanded === r.id" class="mt-3" style="animation: slideDown .16s ease both">
            <div class="flex gap-1.5 rounded-xl bg-surface2 p-1">
              <button
                v-for="f in FREQS"
                :key="f.id"
                @click="setFreq(r, f.id)"
                class="flex-1 rounded-[9px] border-0 px-1.5 py-2 font-meta text-xs font-semibold transition-all"
                :class="r.freq === f.id ? 'bg-accent text-[color:var(--onAccent)]' : 'bg-transparent text-muted'"
              >
                {{ f.label }}
              </button>
            </div>
            <div class="mt-2.5 font-meta text-[11px] tracking-[.07em] text-muted uppercase">
              {{ r.freq === 'day' ? 'Times of day (optional)' : r.freq === 'week' ? 'On these days' : 'On this date' }}
            </div>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <template v-if="r.freq === 'day'">
                <button
                  v-for="s in SLOTS"
                  :key="s.id"
                  @click="toggleSlot(r, s.id)"
                  class="rounded-[10px] border px-2.5 py-2 font-meta text-xs font-semibold transition-all"
                  :class="r.slots?.includes(s.id) ? 'border-transparent bg-accent text-[color:var(--onAccent)]' : 'border-[rgba(255,255,255,.10)] bg-surface2 text-ink'"
                >
                  {{ s.label }}
                </button>
              </template>
              <template v-else-if="r.freq === 'week'">
                <button
                  v-for="(d, i) in DAY_NAMES"
                  :key="d"
                  @click="toggleDay(r, i)"
                  class="rounded-[10px] border px-2.5 py-2 font-meta text-xs font-semibold transition-all"
                  :class="r.days?.includes(i) ? 'border-transparent bg-accent text-[color:var(--onAccent)]' : 'border-[rgba(255,255,255,.10)] bg-surface2 text-ink'"
                >
                  {{ d }}
                </button>
              </template>
              <template v-else>
                <button
                  v-for="d in MONTH_DAYS"
                  :key="d"
                  @click="setDom(r, d)"
                  class="rounded-[10px] border px-2.5 py-2 font-meta text-xs font-semibold transition-all"
                  :class="(r.dom ?? 1) === d ? 'border-transparent bg-accent text-[color:var(--onAccent)]' : 'border-[rgba(255,255,255,.10)] bg-surface2 text-ink'"
                >
                  Day {{ d }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 rounded-2xl border border-dashed p-3.5" style="background: var(--surface2); border-color: rgba(255,255,255,.14)">
        <div class="font-meta text-[11px] tracking-[.08em] text-muted uppercase">Add routine</div>
        <div class="mt-2.5 flex gap-2">
          <input
            v-model="newName"
            @keydown.enter="addRoutine"
            placeholder="Name"
            class="min-w-0 flex-1 rounded-[10px] border px-3 py-2.5 text-base outline-none font-theme"
            style="background: var(--bg); border-color: rgba(255,255,255,.09); color: var(--ink)"
          />
          <button
            @click="addRoutine"
            class="flex-none cursor-pointer rounded-[10px] border-0 bg-accent px-4 py-2.5 font-meta text-[13px] font-bold text-[color:var(--onAccent)]"
          >
            Add
          </button>
        </div>
        <p class="mt-2 font-meta text-[11px] text-muted">Starts as daily. Open it to change the schedule.</p>
      </div>
    </div>
  </div>
</template>
