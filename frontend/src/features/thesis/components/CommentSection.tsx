import { MessageSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { CommentItem } from './CommentItem'
import type { Comment } from '@/types'

interface CommentSectionProps {
  comments: Comment[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onAddComment: () => void
  onReply: (parentId: string) => void
  totalCount: number
}

/**
 * CommentSection — the full comment area on the paper detail page.
 * Handles loading / error / empty / success states and delegates
 * rendering of individual comments (and their replies) to CommentItem.
 */
export function CommentSection({
  comments,
  isLoading,
  isError,
  onRetry,
  onAddComment,
  onReply,
  totalCount,
}: CommentSectionProps) {
  const topLevelCount = comments.length

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-flame" />
          <h2 className="font-display font-bold text-sm text-text uppercase tracking-wider">
            Discussion
          </h2>
          <span className="text-xs font-mono text-text-dim">
            {totalCount} {totalCount === 1 ? 'comment' : 'comments'}
          </span>
        </div>
        <Button variant="subtle" size="sm" onClick={onAddComment}>
          <Plus className="w-3.5 h-3.5" />
          Comment
        </Button>
      </div>

      {/* Body */}
      {isLoading ? (
        <LoadingState label="Loading comments..." />
      ) : isError ? (
        <ErrorState
          title="Could not load comments"
          message="Failed to fetch the discussion thread."
          onRetry={onRetry}
        />
      ) : topLevelCount === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-6 h-6 text-text-dim" />}
          title="No comments yet"
          description="Start the discussion — be the first to comment."
          action={
            <Button variant="subtle" size="sm" onClick={onAddComment}>
              <Plus className="w-3.5 h-3.5" />
              Add comment
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={onReply} />
          ))}
        </div>
      )}
    </section>
  )
}
