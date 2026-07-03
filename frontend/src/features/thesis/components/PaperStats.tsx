import { Eye, Download, MessageSquare, FileText, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/format'
import type { Paper } from '@/types'

interface PaperStatsProps {
  paper: Paper
  className?: string
  variant?: 'inline' | 'grid'
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: number
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface-2/60 border border-border">
      <div className="text-flame flex-shrink-0">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs font-mono font-bold text-text tabular-nums leading-none">
          {formatNumber(value)}
        </span>
        <span className="text-[9px] font-mono text-text-dim uppercase tracking-wider mt-0.5">
          {label}
        </span>
      </div>
    </div>
  )
}

/**
 * PaperStats — renders engagement metrics (views, downloads, comments,
 * bookmarks) in either an inline row or a grid layout.
 */
export function PaperStats({ paper, className, variant = 'grid' }: PaperStatsProps) {
  const stats: StatItemProps[] = [
    { icon: <Eye className="w-3.5 h-3.5" />, label: 'Views', value: paper.view_count },
    { icon: <Download className="w-3.5 h-3.5" />, label: 'Downloads', value: paper.download_count },
    { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Comments', value: paper.comment_count },
    { icon: <Bookmark className="w-3.5 h-3.5" />, label: 'Bookmarks', value: paper.bookmarks_count },
  ]

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-1.5 text-text-dim">
            {stat.icon}
            <span className="text-[10px] sm:text-xs font-mono">{formatNumber(stat.value)}</span>
          </div>
        ))}
        <span className="hidden sm:flex items-center gap-1 text-text-dim">
          <FileText className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono">{paper.page_count}p</span>
        </span>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-2', className)}>
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  )
}
