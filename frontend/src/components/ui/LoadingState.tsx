import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  label?: string
  className?: string
}

/**
 * LoadingState — centered spinner with optional label.
 * Use for full-section loading (page load, list fetch).
 */
export function LoadingState({ label = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 gap-3', className)}>
      <Loader2 className="w-6 h-6 text-flame animate-spin" />
      <p className="text-xs font-mono text-text-dim">{label}</p>
    </div>
  )
}

/**
 * LoadingCard — skeleton-style placeholder matching the FeedCard shape.
 * Use inside lists to prevent layout shift while fetching.
 */
export function LoadingCard() {
  return (
    <div className="card-glass p-4 sm:p-5 animate-pulse">
      <div className="flex gap-3">
        <div className="w-8 h-16 bg-surface-3 rounded-md" />
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-surface-3" />
            <div className="h-3 w-32 bg-surface-3 rounded" />
          </div>
          <div className="h-4 w-3/4 bg-surface-3 rounded" />
          <div className="h-3 w-full bg-surface-3 rounded" />
          <div className="h-3 w-5/6 bg-surface-3 rounded" />
          <div className="flex gap-3 pt-2">
            <div className="h-3 w-12 bg-surface-3 rounded" />
            <div className="h-3 w-12 bg-surface-3 rounded" />
            <div className="h-3 w-12 bg-surface-3 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
