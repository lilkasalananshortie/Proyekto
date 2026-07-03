import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, Eye, Download, Clock, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { timeAgo, formatNumber, degreeShorthand } from '@/lib/format'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { RESEARCH_FIELD_LABELS, PAPER_TYPE_LABELS } from '@/types'
import type { FeedItem } from '@/types'

interface ProfilePaperCardProps {
  item: FeedItem
  index: number
  className?: string
}

/**
 * ProfilePaperCard — compact horizontal paper card for the profile page.
 * Lighter than FeedCard (no vote column, no cover image) since the
 * profile context already establishes ownership.
 */
export function ProfilePaperCard({ item, index, className }: ProfilePaperCardProps) {
  const { paper } = item

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={cn('card-glass p-4 hover:bg-surface-2/80 transition-all', className)}
    >
      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-flame/10 text-flame border border-flame/20">
          {PAPER_TYPE_LABELS[paper.paper_type]}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-surface-3 text-text-muted border border-border">
          {RESEARCH_FIELD_LABELS[paper.research_field]}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-surface-3 text-text-dim border border-border">
          {degreeShorthand(paper.degree_level)}
        </span>
      </div>

      {/* Title */}
      <Link
        to={`/paper/${paper.id}`}
        className="block font-display font-bold text-sm sm:text-base text-text leading-snug hover:text-flame transition-colors line-clamp-2"
      >
        {paper.title}
      </Link>

      {/* Abstract */}
      <p className="mt-1.5 text-xs sm:text-sm text-text-muted font-body leading-relaxed line-clamp-2">
        {paper.abstract}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-text-dim">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">{formatNumber(paper.comment_count)}</span>
          </span>
          <span className="flex items-center gap-1 text-text-dim">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">{formatNumber(paper.view_count)}</span>
          </span>
          <span className="flex items-center gap-1 text-text-dim">
            <Download className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">{formatNumber(paper.download_count)}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 text-text-dim">
            <FileText className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">{paper.page_count}p</span>
          </span>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-mono text-text-dim">
          <Clock className="w-3 h-3" />
          {timeAgo(paper.published_at ?? paper.created_at)}
        </span>
      </div>
    </motion.article>
  )
}

interface ProfilePaperListProps {
  items: FeedItem[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

/**
 * ProfilePaperList — handles loading / error / empty / success states for
 * the list of papers on the profile page.
 */
export function ProfilePaperList({
  items,
  isLoading,
  isError,
  onRetry,
  emptyTitle = 'No papers yet',
  emptyDescription = 'This user has not published any papers.',
  className,
}: ProfilePaperListProps) {
  if (isLoading) {
    return <LoadingState label="Loading papers..." className={className} />
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load papers"
        message="Failed to fetch this user's papers."
        onRetry={onRetry}
        className={className}
      />
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-6 h-6 text-text-dim" />}
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, i) => (
        <ProfilePaperCard key={item.paper.id} item={item} index={i} />
      ))}
    </div>
  )
}
