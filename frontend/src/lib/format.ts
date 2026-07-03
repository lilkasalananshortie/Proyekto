// ============================================================
// Formatting helpers — shared across feed, detail, comments, etc.
// ============================================================

/**
 * Human-readable "time ago" string (e.g. "3h ago", "2d ago").
 * Kept dependency-free; dayjs is available if we need i18n later.
 */
export function timeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`

  return `${Math.floor(months / 12)}y ago`
}

/**
 * Compact number formatter: 1234 -> "1.2k", 1500000 -> "1.5M".
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

/**
 * Human-readable file size: 4520000 -> "4.5 MB".
 */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(1)} KB`
  return `${bytes} B`
}

/**
 * Two-letter initials from a display name: "Juan Dela Cruz" -> "JD".
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Deterministic color class for an avatar based on the name hash.
 * Same name -> same color across the session.
 */
const AVATAR_COLORS = [
  'bg-flame/20 text-flame',
  'bg-emerald-500/20 text-emerald-400',
  'bg-violet-500/20 text-violet-400',
  'bg-cyan-500/20 text-cyan-400',
  'bg-rose-500/20 text-rose-400',
  'bg-amber-500/20 text-amber-400',
  'bg-blue-500/20 text-blue-400',
  'bg-pink-500/20 text-pink-400',
] as const

export function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/**
 * Short degree-level label for compact UI: "undergraduate" -> "BS".
 */
export function degreeShorthand(level: 'undergraduate' | 'masteral' | 'doctoral'): string {
  if (level === 'undergraduate') return 'BS'
  if (level === 'masteral') return 'MS'
  return 'PhD'
}
