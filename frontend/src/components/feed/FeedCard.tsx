import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  MessageSquare,
  Eye,
  Download,
  Bookmark,
  BookmarkCheck,
  Clock,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { VoteButton } from './VoteButton'
import { institutionNames } from '@/lib/feed-data'
import { RESEARCH_FIELD_LABELS, PAPER_TYPE_LABELS } from '@/types'
import type { FeedItem, VoteDirection } from '@/types'

interface FeedCardProps {
  item: FeedItem
  index: number
  onVote: (paperId: string, direction: VoteDirection) => void
  onBookmark: (paperId: string) => void
}

function timeAgo(dateString: string): string {
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

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-flame/20 text-flame',
    'bg-emerald-500/20 text-emerald-400',
    'bg-violet-500/20 text-violet-400',
    'bg-cyan-500/20 text-cyan-400',
    'bg-rose-500/20 text-rose-400',
    'bg-amber-500/20 text-amber-400',
    'bg-blue-500/20 text-blue-400',
    'bg-pink-500/20 text-pink-400',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const coverPatterns = [
  'bg-gradient-to-br from-flame/20 via-orange-900/10 to-surface-3',
  'bg-gradient-to-br from-emerald-500/15 via-teal-900/10 to-surface-3',
  'bg-gradient-to-br from-violet-500/15 via-purple-900/10 to-surface-3',
  'bg-gradient-to-br from-cyan-500/15 via-sky-900/10 to-surface-3',
  'bg-gradient-to-br from-rose-500/15 via-red-900/10 to-surface-3',
  'bg-gradient-to-br from-amber-500/15 via-yellow-900/10 to-surface-3',
  'bg-gradient-to-br from-blue-500/15 via-indigo-900/10 to-surface-3',
  'bg-gradient-to-br from-pink-500/15 via-fuchsia-900/10 to-surface-3',
]

const thumbPatterns = [
  'from-flame/20 to-orange-900/10',
  'from-emerald-500/15 to-teal-900/10',
  'from-violet-500/15 to-purple-900/10',
  'from-cyan-500/15 to-sky-900/10',
  'from-rose-500/15 to-red-900/10',
  'from-amber-500/15 to-yellow-900/10',
  'from-blue-500/15 to-indigo-900/10',
  'from-pink-500/15 to-fuchsia-900/10',
]

export function FeedCard({ item, index, onVote, onBookmark }: FeedCardProps) {
  const { paper, user_vote, is_bookmarked } = item
  const primaryAuthor = paper.authors.find((a) => a.is_primary) || paper.authors[0]
  const authorInitials = primaryAuthor ? getInitials(primaryAuthor.name) : '??'
  const authorColor = primaryAuthor ? getAvatarColor(primaryAuthor.name) : 'bg-flame/20 text-flame'
  const hasCoverImage = !!paper.cover_image_url
  const coverPattern = coverPatterns[index % coverPatterns.length]
  const thumbPattern = thumbPatterns[index % thumbPatterns.length]

  const handleVote = (direction: VoteDirection) => {
    onVote(paper.id, direction)
  }

  const handleBookmark = () => {
    onBookmark(paper.id)
  }

  // === NO COVER IMAGE: side thumbnail layout ===
  if (!hasCoverImage) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
        className="group card-glass hover:bg-surface-2/80 transition-all duration-200"
      >
        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 md:p-5">
          {/* Vote */}
          <div className="flex-shrink-0">
            <VoteButton
              score={paper.vote_score}
              currentVote={user_vote ?? null}
              onVote={handleVote}
              size="sm"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Author */}
            {primaryAuthor && (
              <Link
                to={`/user/${primaryAuthor.user_id}`}
                className="flex items-center gap-2 mb-2 group/author"
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold font-mono flex-shrink-0 border border-border',
                    authorColor
                  )}
                >
                  {authorInitials}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono min-w-0">
                  <span className="text-text-muted group-hover/author:text-flame transition-colors truncate">
                    {primaryAuthor.name}
                  </span>
                  <span className="text-border flex-shrink-0">·</span>
                  <span className="text-text-dim truncate">
                    {institutionNames[paper.institution_id] || 'Unknown'} · {paper.year}
                  </span>
                  <span className="text-border hidden sm:inline flex-shrink-0">·</span>
                  <span className="text-text-dim hidden sm:inline flex-shrink-0">
                    {timeAgo(paper.published_at || paper.created_at)}
                  </span>
                </div>
              </Link>
            )}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-flame/10 text-flame border border-flame/20">
                {PAPER_TYPE_LABELS[paper.paper_type]}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-surface-3 text-text-muted border border-border">
                {RESEARCH_FIELD_LABELS[paper.research_field]}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-surface-3 text-text-dim border border-border">
                {paper.degree_level === 'undergraduate' ? 'BS' : paper.degree_level === 'masteral' ? 'MS' : 'PhD'}
              </span>
              <span className="inline-flex items-center gap-1 sm:hidden text-[10px] font-mono text-text-dim">
                <Clock className="w-3 h-3" />
                {timeAgo(paper.published_at || paper.created_at)}
              </span>
            </div>

            {/* Title */}
            <Link
              to={`/paper/${paper.id}`}
              className="block font-display font-bold text-sm sm:text-base md:text-lg text-text leading-snug group-hover:text-flame transition-colors line-clamp-2"
            >
              {paper.title}
            </Link>

            {/* Abstract */}
            <p className="mt-1.5 text-xs sm:text-sm text-text-muted font-body leading-relaxed line-clamp-2">
              {paper.abstract}
            </p>

            {/* Keywords */}
            <div className="hidden md:flex flex-wrap gap-1.5 mt-2.5">
              {paper.keywords.slice(0, 4).map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-0.5 rounded text-[10px] font-mono text-text-dim bg-base border border-border hover:border-flame/30 hover:text-flame/60 transition-colors cursor-pointer"
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2.5 sm:gap-4">
                <button className="flex items-center gap-1 text-text-dim hover:text-text-muted transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:text-xs font-mono">{formatNumber(paper.comment_count)}</span>
                </button>
                <button className="flex items-center gap-1 text-text-dim hover:text-text-muted transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:text-xs font-mono">{formatNumber(paper.view_count)}</span>
                </button>
                <button className="flex items-center gap-1 text-text-dim hover:text-text-muted transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:text-xs font-mono">{formatNumber(paper.download_count)}</span>
                </button>
                <span className="hidden sm:flex items-center gap-1 text-text-dim">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono">{paper.page_count}p</span>
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleBookmark}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  is_bookmarked ? 'text-flame bg-flame/10' : 'text-text-dim hover:text-flame hover:bg-flame/5'
                )}
              >
                {is_bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>

          {/* Side thumbnail */}
          <Link
            to={`/paper/${paper.id}`}
            className="hidden sm:flex flex-shrink-0 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg overflow-hidden items-center justify-center"
          >
            <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center border border-border group/thumb hover:border-flame/30 transition-colors', thumbPattern)}>
              <div className="text-center">
                <FileText className="w-8 h-8 md:w-9 md:h-9 text-text-dim/30 mx-auto" />
                <span className="text-[8px] md:text-[9px] font-mono text-text-dim/40 mt-1 block">
                  {paper.page_count} pages
                </span>
              </div>
            </div>
          </Link>
        </div>
      </motion.article>
    )
  }

  // === WITH COVER IMAGE: sandwich layout ===
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
      className="group card-glass overflow-hidden hover:bg-surface-2/80 transition-all duration-200"
    >
      {/* TOP: Author + Title + Tags + Vote */}
      <div className="p-3 sm:p-4 md:p-5 pb-0 sm:pb-0 md:pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {primaryAuthor && (
              <Link
                to={`/user/${primaryAuthor.user_id}`}
                className="flex items-center gap-2 mb-2 group/author"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 border border-border',
                    authorColor
                  )}
                >
                  {authorInitials}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 min-w-0">
                  <span className="text-xs sm:text-sm font-mono font-medium text-text group-hover/author:text-flame transition-colors truncate">
                    {primaryAuthor.name}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-text-dim truncate">
                    {institutionNames[paper.institution_id] || 'Unknown'} · {paper.year}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono text-text-dim flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {timeAgo(paper.published_at || paper.created_at)}
                </span>
              </Link>
            )}

            <Link
              to={`/paper/${paper.id}`}
              className="block font-display font-bold text-sm sm:text-base md:text-lg text-text leading-snug group-hover:text-flame transition-colors"
            >
              {paper.title}
            </Link>
          </div>

          <div className="hidden sm:flex flex-shrink-0">
            <VoteButton
              score={paper.vote_score}
              currentVote={user_vote ?? null}
              onVote={handleVote}
              size="sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-flame/10 text-flame border border-flame/20">
            {PAPER_TYPE_LABELS[paper.paper_type]}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-surface-3 text-text-muted border border-border">
            {RESEARCH_FIELD_LABELS[paper.research_field]}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-surface-3 text-text-dim border border-border">
            {paper.degree_level === 'undergraduate' ? 'BS' : paper.degree_level === 'masteral' ? 'MS' : 'PhD'}
          </span>
        </div>
      </div>

      {/* MIDDLE: Cover Image */}
      <Link to={`/paper/${paper.id}`} className="block mx-3 sm:mx-4 md:mx-5 my-3 sm:my-4">
        <div
          className={cn(
            'w-full h-40 sm:h-48 md:h-56 rounded-lg overflow-hidden border border-border relative',
            coverPattern
          )}
        >
          <div className="absolute inset-0 bg-grid opacity-50" />
          <div className="absolute inset-0 scan-line opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img
              src={paper.cover_image_url}
              alt={paper.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-base/60 to-transparent" />
        </div>
      </Link>

      {/* BOTTOM: Abstract + Stats */}
      <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5">
        <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed line-clamp-2">
          {paper.abstract}
        </p>

        <div className="hidden md:flex flex-wrap gap-1.5 mt-2.5">
          {paper.keywords.slice(0, 4).map((keyword) => (
            <span
              key={keyword}
              className="px-2 py-0.5 rounded text-[10px] font-mono text-text-dim bg-base border border-border hover:border-flame/30 hover:text-flame/60 transition-colors cursor-pointer"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="flex sm:hidden">
              <VoteButton
                score={paper.vote_score}
                currentVote={user_vote ?? null}
                onVote={handleVote}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-2.5 sm:gap-4">
              <button className="flex items-center gap-1 text-text-dim hover:text-text-muted transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-xs font-mono">{formatNumber(paper.comment_count)}</span>
              </button>
              <button className="flex items-center gap-1 text-text-dim hover:text-text-muted transition-colors">
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-xs font-mono">{formatNumber(paper.view_count)}</span>
              </button>
              <button className="flex items-center gap-1 text-text-dim hover:text-text-muted transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-xs font-mono">{formatNumber(paper.download_count)}</span>
              </button>
              <span className="hidden sm:flex items-center gap-1 text-text-dim">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">{paper.page_count}p</span>
              </span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleBookmark}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              is_bookmarked ? 'text-flame bg-flame/10' : 'text-text-dim hover:text-flame hover:bg-flame/5'
            )}
          >
            {is_bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}