<script setup lang="ts">
import { computed } from 'vue'
import { useRoutineStore } from '@/store'
import { DAY_NAMES, SLOTS, todaysOccurrences, upcoming, summary, type Occurrence } from '@/utils/occurrences'

const props = defineProps<{ today: Date }>()
const store = useRoutineStore()

const occ = computed(() => todaysOccurrences(store.routines, props.today))
const overdueRows = computed(() => occ.value.overdueRows)
const todayRows = computed(() => occ.value.todayRows)
const upcomingRows = computed(() => upcoming(store.routines, props.today))

const allOcc = computed(() => [...overdueRows.value, ...todayRows.value])
const total = computed(() => allOcc.value.length)
const doneCount = computed(() => allOcc.value.filter((o) => store.completions[o.key]).length)
const frac = computed(() => (total.value ? doneCount.value / total.value : 0))
const pct = computed(() => Math.round(frac.value * 100))

const progressLabel = computed(() => `${doneCount.value} of ${total.value} done`)
const progressHint = computed(() => {
  if (total.value === 0) return 'Nothing scheduled today.'
  if (doneCount.value >= total.value) return 'Everything is done, overdue included.'
  return `${total.value - doneCount.value} left today`
})

const dateLabel = computed(() =>
  props.today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }),
)

function slotLabel(o: Occurrence): string {
  if (o.lateDays !== undefined) return o.lateDays === 1 ? '1 day late' : `${o.lateDays} days late`
  return o.slot ? SLOTS.find((s) => s.id === o.slot)!.label : ''
}
function hasBadge(o: Occurrence): boolean {
  return o.lateDays !== undefined || !!o.slot
}
function meta(o: Occurrence, late: boolean): string {
  if (late) {
    const wasDue = o.routine.freq === 'week' ? DAY_NAMES[o.dayIndex ?? 0] : `day ${o.routine.dom ?? 1}`
    return o.routine.freq === 'week' ? `Weekly · was due ${wasDue}` : `Monthly · was due ${wasDue}`
  }
  if (o.routine.freq === 'day') return 'Daily'
  return o.routine.freq === 'week' ? 'Weekly · today' : 'Monthly · today'
}
function isDone(o: Occurrence): boolean {
  return !!store.completions[o.key]
}
function toggle(o: Occurrence) {
  store.toggleOccurrence(o.key)
}
function tagLabel(routineFreq: 'day' | 'week' | 'month'): string {
  return routineFreq === 'month' ? 'M' : 'W'
}
function when(days: number): string {
  return days === 1 ? 'tomorrow' : `in ${days} days`
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="px-6 pt-0.5">
      <h1 class="m-0 text-[30px] leading-[1.18] font-normal text-ink font-theme">
        Carpe diem, {{ store.userName }}
      </h1>
      <p class="mt-1.5 font-meta text-[13px] text-muted">{{ dateLabel }}</p>

      <div class="mt-4.5 rounded-[20px] bg-surface px-4.5 pt-4.5 pb-4">
        <div class="flex items-center gap-4">
          <div v-if="store.settings.progressStyle === 'ring'" class="relative h-[62px] w-[62px] flex-none">
            <svg width="62" height="62" viewBox="0 0 62 62" class="-rotate-90">
              <circle cx="31" cy="31" r="26" fill="none" stroke="var(--surface2)" stroke-width="7" />
              <circle
                cx="31"
                cy="31"
                r="26"
                fill="none"
                stroke="var(--accent)"
                stroke-width="7"
                stroke-linecap="round"
                stroke-dasharray="163.4"
                :style="{ strokeDashoffset: `${(1 - frac) * 163.4}px`, transition: 'stroke-dashoffset .5s cubic-bezier(.3,.9,.3,1)' }"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center font-meta text-[13px] font-bold text-ink">
              {{ pct }}%
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline justify-between gap-2">
              <span class="text-[17px] text-ink">{{ progressLabel }}</span>
              <span class="font-meta text-[11px] tracking-[.08em] text-muted uppercase">today</span>
            </div>
            <div v-if="store.settings.progressStyle === 'bar'" class="mt-2.5 h-2 overflow-hidden rounded-full bg-surface2">
              <div
                class="h-full rounded-full bg-accent"
                :style="{ width: pct + '%', transition: 'width .5s cubic-bezier(.3,.9,.3,1)' }"
              ></div>
            </div>
            <p class="mt-2 font-meta text-xs text-muted">{{ progressHint }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-6 pt-4" style="padding-bottom: calc(6rem + env(safe-area-inset-bottom))">
      <div v-if="overdueRows.length" class="mb-2.5">
        <div class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-danger"></span>
          <h2 class="m-0 font-meta text-[11px] font-bold tracking-[.09em] text-danger uppercase">Overdue</h2>
          <span class="font-meta text-[11px] text-muted">{{ overdueRows.length === 1 ? 'carried over' : `${overdueRows.length} carried over` }}</span>
        </div>
        <div class="mt-2.5 flex flex-col gap-2">
          <div
            v-for="o in overdueRows"
            :key="o.key"
            @click="toggle(o)"
            class="flex cursor-pointer items-center gap-3.5 rounded-2xl border px-4 py-3.5 transition-all"
            :class="[isDone(o) ? 'opacity-55 border-transparent' : 'border-[rgba(224,120,95,.45)]']"
            style="background: var(--surface)"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[17px] text-ink" :class="{ 'line-through': isDone(o) }">{{ o.routine.name }}</span>
                <span
                  v-if="hasBadge(o)"
                  class="rounded-md border px-1.5 py-0.5 font-meta text-[10px] font-bold tracking-[.06em] uppercase"
                  :class="isDone(o) ? 'opacity-50' : 'opacity-95'"
                  style="border-color: var(--danger); color: var(--danger)"
                >
                  {{ slotLabel(o) }}
                </span>
              </div>
              <div class="mt-0.5 font-meta text-[11px] text-muted">{{ meta(o, true) }}</div>
            </div>
            <span
              v-if="isDone(o)"
              class="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-accent text-[color:var(--onAccent)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
            </span>
            <span v-else class="h-[30px] w-[30px] flex-none rounded-[9px] border-2 opacity-85" style="border-color: var(--danger)"></span>
          </div>
        </div>
        <h2 class="mt-5 mb-0 font-meta text-[11px] font-bold tracking-[.09em] text-muted uppercase">Today</h2>
      </div>

      <div class="flex flex-col gap-2">
        <div
          v-for="o in todayRows"
          :key="o.key"
          @click="toggle(o)"
          class="flex cursor-pointer items-center gap-3.5 rounded-2xl px-4 py-3.5 transition-all"
          :class="isDone(o) ? 'opacity-55' : ''"
          style="background: var(--surface)"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[17px] text-ink" :class="{ 'line-through': isDone(o) }">{{ o.routine.name }}</span>
              <span
                v-if="hasBadge(o)"
                class="rounded-md border px-1.5 py-0.5 font-meta text-[10px] font-bold tracking-[.06em] uppercase"
                :class="isDone(o) ? 'opacity-50' : 'opacity-95'"
                style="border-color: var(--accent); color: var(--accent)"
              >
                {{ slotLabel(o) }}
              </span>
            </div>
            <div class="mt-0.5 font-meta text-[11px] text-muted">{{ meta(o, false) }}</div>
          </div>
          <span
            v-if="isDone(o)"
            class="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-accent text-[color:var(--onAccent)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
          </span>
          <span v-else class="h-[30px] w-[30px] flex-none rounded-[9px] border-2 opacity-75" style="border-color: var(--accent)"></span>
        </div>
      </div>

      <div v-if="upcomingRows.length" class="mt-6.5">
        <div class="flex items-baseline justify-between">
          <h2 class="m-0 text-[15px] font-normal text-ink font-theme">Coming up</h2>
          <span class="font-meta text-[11px] text-muted">next {{ upcomingRows.length }}</span>
        </div>
        <div class="mt-2.5 flex flex-col gap-2">
          <div
            v-for="u in upcomingRows"
            :key="u.routine.id"
            class="flex items-center gap-3 rounded-2xl border border-dashed px-3.5 py-3"
            style="background: var(--surface2); border-color: rgba(255,255,255,.08)"
          >
            <span
              class="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg border font-meta text-[11px] font-bold"
              :style="
                u.routine.freq === 'month'
                  ? { background: 'var(--accent)', color: 'var(--onAccent)', borderColor: 'var(--accent)' }
                  : { background: 'transparent', color: 'var(--accent)', borderColor: 'var(--accent)' }
              "
            >
              {{ tagLabel(u.routine.freq) }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="text-[15px] text-ink">{{ u.routine.name }}</div>
              <div class="mt-0.5 font-meta text-[11px] text-muted">{{ summary(u.routine) }}</div>
            </div>
            <span class="flex-none font-meta text-[11px] text-muted">{{ when(u.daysUntil) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
