import { motion } from 'framer-motion'
import { Download, Share2, Bookmark, BookmarkCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VoteButton } from '@/components/feed/VoteButton'
import type { VoteDirection } from '@/types'

interface PaperActionsProps {
  voteScore: number
  userVote: VoteDirection
  isBookmarked: boolean
  onVote: (direction: VoteDirection) => void
  onBookmark: () => void
  onShare: () => void
  onDownload: () => void
  className?: string
}

/**
 * PaperActions — the primary action bar for the detail page.
 * Composes the existing VoteButton with bookmark, share, and download
 * buttons. Horizontal layout (vs. the vertical vote column on FeedCard).
 */
export function PaperActions({
  voteScore,
  userVote,
  isBookmarked,
  onVote,
  onBookmark,
  onShare,
  onDownload,
  className,
}: PaperActionsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 card-glass rounded-xl',
        className
      )}
    >
      {/* Vote — horizontal variant via the same VoteButton component */}
      <div className="flex items-center gap-1 px-2">
        <VoteButton
          score={voteScore}
          currentVote={userVote ?? null}
          onVote={onVote}
          size="sm"
        />
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Bookmark */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onBookmark}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono transition-colors',
          isBookmarked
            ? 'bg-flame/15 text-flame border border-flame/30'
            : 'text-text-dim hover:text-flame hover:bg-flame/5 border border-transparent'
        )}
      >
        {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        <span className="hidden sm:inline">
          {isBookmarked ? 'Saved' : 'Save'}
        </span>
      </motion.button>

      {/* Share */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onShare}
        aria-label="Share paper"
        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono text-text-dim hover:text-flame hover:bg-flame/5 transition-colors border border-transparent"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </motion.button>

      {/* Download */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onDownload}
        aria-label="Download paper"
        className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono bg-flame/10 text-flame hover:bg-flame/20 border border-flame/30 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Download</span>
      </motion.button>
    </div>
  )
}
