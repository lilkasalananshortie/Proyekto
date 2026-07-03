import { Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { timeAgo, degreeShorthand } from '@/lib/format'
import {
  RESEARCH_FIELD_LABELS,
  PAPER_TYPE_LABELS,
  METHODOLOGY_LABELS,
} from '@/types'
import type { Paper } from '@/types'

interface PaperHeaderProps {
  paper: Paper
  className?: string
}

function Tag({ children, variant }: { children: React.ReactNode; variant: 'primary' | 'muted' | 'dim' }) {
  const styles = {
    primary: 'bg-flame/10 text-flame border-flame/20',
    muted: 'bg-surface-3 text-text-muted border-border',
    dim: 'bg-surface-3 text-text-dim border-border',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border',
        styles[variant]
      )}
    >
      {children}
    </span>
  )
}

/**
 * PaperHeader — title + tag row + status row for the detail page.
 * Renders the paper title, paper-type / field / degree / methodology
 * tags, plus publication date.
 */
export function PaperHeader({ paper, className }: PaperHeaderProps) {
  const publishedDate = paper.published_at ?? paper.created_at

  return (
    <header className={cn('space-y-3', className)}>
      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Tag variant="primary">{PAPER_TYPE_LABELS[paper.paper_type]}</Tag>
        <Tag variant="muted">{RESEARCH_FIELD_LABELS[paper.research_field]}</Tag>
        <Tag variant="dim">{degreeShorthand(paper.degree_level)}</Tag>
        <Tag variant="dim">{METHODOLOGY_LABELS[paper.methodology]}</Tag>
        {paper.status !== 'approved' && (
          <Tag variant="dim">{paper.status.replace('_', ' ')}</Tag>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-text leading-tight">
        {paper.title}
      </h1>

      {/* Publication meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-text-dim">
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Published {new Date(publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(publishedDate)}
        </span>
        <span className="inline-flex items-center gap-1">
          Year: <span className="text-text-muted">{paper.year}</span>
        </span>
      </div>
    </header>
  )
}
