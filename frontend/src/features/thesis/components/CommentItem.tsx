import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Reply, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { timeAgo, formatNumber } from '@/lib/format'
import type { Comment } from '@/types'

interface CommentItemProps {
  comment: Comment
  depth?: number
  onReply?: (commentId: string) => void
}

/**
 * CommentItem — a single comment with optional nested replies.
 * Supports one level of threading (replies render recursively but the
 * "Reply" button only appears on top-level comments to keep the UX clean).
 */
export function CommentItem({ comment, depth = 0, onReply }: CommentItemProps) {
  const [collapsed, setCollapsed] = useState(false)
  const hasReplies = (comment.replies?.length ?? 0) > 0
  const isTopLevel = depth === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('space-y-2', depth > 0 && 'ml-4 sm:ml-6 pl-3 border-l border-border')}
    >
      <div className="card-glass p-3 sm:p-4">
        {/* Author row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <Link
            to={`/user/${comment.user_id}`}
            className="flex items-center gap-2 group/author min-w-0"
          >
            <Avatar name={comment.user.username} src={comment.user.avatar_url} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-mono font-medium text-text group-hover/author:text-flame transition-colors truncate">
                @{comment.user.username}
              </span>
              <span className="text-[10px] font-mono text-text-dim">
                {formatNumber(comment.user.reputation)} reputation
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-[10px] font-mono text-text-dim flex-shrink-0">
            <span>{timeAgo(comment.created_at)}</span>
            {hasReplies && (
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="p-1 rounded hover:bg-surface-3 transition-colors"
                aria-label={collapsed ? 'Expand replies' : 'Collapse replies'}
              >
                {collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed whitespace-pre-line">
          {comment.content}
        </p>

        {/* Footer actions */}
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border">
          <span className="text-[10px] font-mono text-text-dim">
            ▲ {formatNumber(comment.vote_score)}
          </span>
          {isTopLevel && onReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="inline-flex items-center gap-1 text-[10px] font-mono text-text-dim hover:text-flame transition-colors"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Nested replies */}
      <AnimatePresence initial={false}>
        {hasReplies && !collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                onReply={onReply}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
