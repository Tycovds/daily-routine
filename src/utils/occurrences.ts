import type { Routine, Slot } from '@/types/Routine'

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const SLOTS: { id: Slot; label: string }[] = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
]

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function isoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7 // 0=Mon..6=Sun
}

export function mondayISO(date: Date): string {
  const monday = new Date(date)
  monday.setDate(date.getDate() - weekdayIndex(date))
  return isoDate(monday)
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export interface Occurrence {
  routine: Routine
  key: string
  slot?: Slot
  dayIndex?: number
  lateDays?: number
}

export function dailyKey(routine: Routine, slot: Slot | undefined, today: Date): string {
  return `${routine.id}:day:${slot ?? 'once'}:${isoDate(today)}`
}
export function weeklyKey(routine: Routine, dayIndex: number, today: Date): string {
  return `${routine.id}:week:${mondayISO(today)}:${dayIndex}`
}
export function monthlyKey(routine: Routine, today: Date): string {
  return `${routine.id}:month:${monthKey(today)}`
}

export function todaysOccurrences(
  routines: Routine[],
  today: Date,
): { todayRows: Occurrence[]; overdueRows: Occurrence[] } {
  const todayIdx = weekdayIndex(today)
  const todayDom = today.getDate()
  const todayRows: Occurrence[] = []
  const overdueRows: Occurrence[] = []

  for (const routine of routines) {
    if (routine.freq === 'day') {
      const slots = routine.slots?.length ? routine.slots : [undefined]
      for (const slot of slots) {
        todayRows.push({ routine, key: dailyKey(routine, slot, today), slot })
      }
    } else if (routine.freq === 'week') {
      for (const dayIndex of routine.days ?? []) {
        if (dayIndex === todayIdx) {
          todayRows.push({ routine, key: weeklyKey(routine, dayIndex, today), dayIndex })
        } else if (dayIndex < todayIdx) {
          overdueRows.push({
            routine,
            key: weeklyKey(routine, dayIndex, today),
            dayIndex,
            lateDays: todayIdx - dayIndex,
          })
        }
      }
    } else if (routine.freq === 'month') {
      if (routine.dom === todayDom) {
        todayRows.push({ routine, key: monthlyKey(routine, today) })
      } else if (routine.dom !== undefined && routine.dom < todayDom) {
        overdueRows.push({ routine, key: monthlyKey(routine, today), lateDays: todayDom - routine.dom })
      }
    }
  }

  const slotOrder: Record<string, number> = { morning: 0, afternoon: 1, evening: 2 }
  todayRows.sort((a, b) => (a.slot ? slotOrder[a.slot] : 1.5) - (b.slot ? slotOrder[b.slot] : 1.5))

  return { todayRows, overdueRows }
}

export function daysUntil(routine: Routine, today: Date): number | null {
  const todayIdx = weekdayIndex(today)
  if (routine.freq === 'week') {
    const ds = (routine.days ?? []).map((d) => ((d - todayIdx + 7) % 7) || 7)
    return ds.length ? Math.min(...ds) : null
  }
  if (routine.freq === 'month') {
    const dom = routine.dom ?? 1
    const todayDom = today.getDate()
    return dom > todayDom ? dom - todayDom : daysInMonth(today) - todayDom + dom
  }
  return null
}

export function upcoming(routines: Routine[], today: Date): { routine: Routine; daysUntil: number }[] {
  return routines
    .filter((r) => r.freq !== 'day')
    .map((r) => ({ routine: r, daysUntil: daysUntil(r, today) }))
    .filter((u): u is { routine: Routine; daysUntil: number } => u.daysUntil !== null && u.daysUntil > 0)
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

export function isCurrentPeriod(key: string, today: Date): boolean {
  const parts = key.split(':')
  const kind = parts[1]
  if (kind === 'day') return parts[3] === isoDate(today)
  if (kind === 'week') return parts[2] === mondayISO(today)
  if (kind === 'month') return parts[2] === monthKey(today)
  return false
}

export function summary(routine: Routine): string {
  if (routine.freq === 'day') {
    if (!routine.slots?.length) return 'Every day'
    return 'Every day · ' + routine.slots.map((s) => SLOTS.find((x) => x.id === s)!.label.toLowerCase()).join(' + ')
  }
  if (routine.freq === 'week') {
    const days = [...(routine.days ?? [])].sort((a, b) => a - b).map((d) => DAY_NAMES[d])
    return days.length ? 'Weekly · ' + days.join(', ') : 'No day set, it will not appear on any list'
  }
  return 'Monthly · day ' + (routine.dom ?? 1)
}
