export interface Palette {
  label: string
  bg: string
  surface: string
  surface2: string
  ink: string
  muted: string
}

export interface FontOption {
  id: string
  label: string
  css: string
}

export interface AccentOption {
  label: string
  hex: string
}

export interface Settings {
  font: string
  palette: number
  accent: number
  progressStyle: 'bar' | 'ring'
}

export interface ResolvedTheme extends Palette {
  accent: string
  onAccent: string
  danger: string
  font: string
}

export const fonts: FontOption[] = [
  { id: 'modern', label: 'Modern', css: "'Manrope',sans-serif" },
  { id: 'neat', label: 'Neat', css: "'Marcellus',serif" },
  { id: 'playful', label: 'Playful', css: "'Baloo 2',cursive" },
  { id: 'messy', label: 'Messy', css: "'Caveat',cursive" },
  { id: 'retro', label: 'Retro', css: "'Space Mono',monospace" },
]

export const palettes: Palette[] = [
  { label: 'Midnight', bg: '#0e1a22', surface: '#1b2f35', surface2: '#16262c', ink: '#f2f5f2', muted: '#93a7ad' },
  { label: 'Paper', bg: '#f5f2eb', surface: '#e9e4d8', surface2: '#efebe1', ink: '#21201b', muted: '#6c665b' },
  { label: 'Forest', bg: '#101f19', surface: '#1d3227', surface2: '#182a21', ink: '#eef4ee', muted: '#93ad9f' },
  { label: 'Plum', bg: '#191320', surface: '#2a2133', surface2: '#221a2b', ink: '#f4f0f6', muted: '#a596b0' },
]

export const accents: AccentOption[] = [
  { label: 'Cream', hex: '#dfe0ab' },
  { label: 'Terracotta', hex: '#e08a5f' },
  { label: 'Sky', hex: '#8fc2e8' },
  { label: 'Rose', hex: '#e6a2bb' },
  { label: 'Lime', hex: '#b6dd8b' },
]

export function lum(hex: string): number {
  const n = hex.replace('#', '')
  const v = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
}

export function ratio(a: string, b: string): number {
  const l1 = lum(a)
  const l2 = lum(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

function mix(hex: string, target: number, amt: number): string {
  const n = hex.replace('#', '')
  return (
    '#' +
    [0, 2, 4]
      .map((i) => {
        const c = parseInt(n.slice(i, i + 2), 16)
        return Math.round(c + (target - c) * amt)
          .toString(16)
          .padStart(2, '0')
      })
      .join('')
  )
}

export function safeInk(ink: string, bg: string): string {
  return ratio(ink, bg) >= 4.5 ? ink : ratio('#ffffff', bg) >= ratio('#111111', bg) ? '#ffffff' : '#111111'
}

export function safeAccent(hex: string, bg: string): string {
  return ratio(hex, bg) >= 3 ? hex : mix(hex, lum(bg) > 0.4 ? 0 : 255, 0.45)
}

export function resolveTheme(settings: Settings): ResolvedTheme {
  const p = palettes[settings.palette]
  const accent = safeAccent(accents[settings.accent].hex, p.bg)
  const ink = safeInk(p.ink, p.bg)
  const muted = ratio(p.muted, p.bg) >= 3.2 ? p.muted : safeInk(p.muted, p.bg)
  const onAccent = ratio('#111111', accent) >= ratio('#ffffff', accent) ? '#111111' : '#ffffff'
  const font = fonts.find((f) => f.id === settings.font)?.css ?? fonts[1].css
  const danger = lum(p.bg) > 0.4 ? '#b4452c' : '#e0785f'
  return { ...p, ink, muted, accent, onAccent, font, danger }
}

export function applyTheme(theme: ResolvedTheme): void {
  const r = document.documentElement.style
  r.setProperty('--bg', theme.bg)
  r.setProperty('--surface', theme.surface)
  r.setProperty('--surface2', theme.surface2)
  r.setProperty('--ink', theme.ink)
  r.setProperty('--muted', theme.muted)
  r.setProperty('--accent', theme.accent)
  r.setProperty('--onAccent', theme.onAccent)
  r.setProperty('--danger', theme.danger)
  r.setProperty('--font', theme.font)
}
