export type Freq = 'day' | 'week' | 'month'
export type Slot = 'morning' | 'afternoon' | 'evening'

export interface Routine {
  id: number
  name: string
  freq: Freq
  slots?: Slot[] // freq 'day' only
  days?: number[] // freq 'week' only — 0=Mon..6=Sun, can be multiple
  dom?: number // freq 'month' only — day-of-month
}
