import { cn } from '@/lib/utils'
import { Tag } from 'lucide-react'
import type { Paper } from '@/types'

interface PaperKeywordsProps {
  paper: Paper
  className?: string
  onSelect?: (keyword: string) => void
}

/**
 * PaperKeywords — renders the keyword list as clickable chips.
 * onSelect fires when a keyword is clicked (used to drive search later).
 */
export function PaperKeywords({ paper, className, onSelect }: PaperKeywordsProps) {
  if (paper.keywords.length === 0) return null

  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-flame" />
        <h2 className="font-display font-bold text-sm text-text uppercase tracking-wider">
          Keywords
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {paper.keywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => onSelect?.(keyword)}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono',
              'bg-surface-2 text-text-muted border border-border',
              'hover:border-flame/40 hover:text-flame hover:bg-flame/5',
              'transition-colors'
            )}
          >
            <Tag className="w-3 h-3" />
            {keyword}
          </button>
        ))}
      </div>
    </section>
  )
}
