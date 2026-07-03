import { cn } from '@/lib/utils'
import type { Paper } from '@/types'

interface PaperAbstractProps {
  paper: Paper
  className?: string
}

/**
 * PaperAbstract — renders the abstract with a section header.
 * Keeps the "Abstract" label styled consistently with other detail sections.
 */
export function PaperAbstract({ paper, className }: PaperAbstractProps) {
  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-flame" />
        <h2 className="font-display font-bold text-sm text-text uppercase tracking-wider">
          Abstract
        </h2>
      </div>
      <div className="card-glass p-4 sm:p-5">
        <p className="text-sm sm:text-[15px] text-text-muted font-body leading-relaxed whitespace-pre-line">
          {paper.abstract}
        </p>
      </div>
    </section>
  )
}
