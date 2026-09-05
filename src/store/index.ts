import { defineStore } from 'pinia'

import type { Routine } from '@/types/Routine'
import type { Settings } from '@/utils/theme'
import { isCurrentPeriod } from '@/utils/occurrences'

const STORAGE_KEY = 'routine-state'
const LEGACY_KEY = 'todos'

interface PersistedState {
  userName: string
  routines: Routine[]
  completions: Record<string, boolean>
  settings: Settings
}

const defaultSettings: Settings = { font: 'neat', palette: 0, accent: 0, progressStyle: 'bar' }

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>
      return {
        userName: parsed.userName ?? '',
        routines: parsed.routines ?? [],
        completions: parsed.completions ?? {},
        settings: { ...defaultSettings, ...parsed.settings },
      }
    }
  } catch {
    // fall through to legacy migration / defaults
  }

  // one-time migration from the old flat-todo shape
  try {
    const legacyRaw = localStorage.getItem(LEGACY_KEY)
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as { todos?: { id: number; title: string }[]; name?: string }
      if (legacy.todos?.length || legacy.name) {
        return {
          userName: legacy.name ?? '',
          routines: (legacy.todos ?? []).map((t) => ({ id: t.id, name: t.title, freq: 'day' as const })),
          completions: {},
          settings: { ...defaultSettings },
        }
      }
    }
  } catch {
    // ignore malformed legacy data
  }

  return { userName: '', routines: [], completions: {}, settings: { ...defaultSettings } }
}

const persisted = loadPersisted()

function prunedCompletions(completions: Record<string, boolean>): Record<string, boolean> {
  const today = new Date()
  const result: Record<string, boolean> = {}
  for (const [key, value] of Object.entries(completions)) {
    if (isCurrentPeriod(key, today)) result[key] = value
  }
  return result
}

export const useRoutineStore = defineStore('routine', {
  state: () => ({
    userName: persisted.userName,
    routines: persisted.routines,
    completions: prunedCompletions(persisted.completions),
    settings: persisted.settings,
  }),
  actions: {
    addRoutine(name: string) {
      const trimmed = name.trim()
      if (!trimmed) return
      this.routines.push({ id: Date.now(), name: trimmed, freq: 'day' })
    },
    removeRoutine(id: number) {
      this.routines = this.routines.filter((r) => r.id !== id)
    },
    patchRoutine(id: number, fields: Partial<Routine>) {
      const target = this.routines.find((r) => r.id === id)
      if (target) Object.assign(target, fields)
    },
    toggleOccurrence(key: string) {
      this.completions[key] = !this.completions[key]
    },
    resetCompletions() {
      this.completions = {}
    },
  },
})

export { STORAGE_KEY }
