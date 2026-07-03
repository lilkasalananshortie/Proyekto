import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, AlertCircle } from 'lucide-react'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { PaperHeader } from '../components/PaperHeader'
import { AuthorRow, CoAuthorList } from '../components/AuthorRow'
import { PaperAbstract } from '../components/PaperAbstract'
import { PaperKeywords } from '../components/PaperKeywords'
import { PaperMeta } from '../components/PaperMeta'
import { PaperStats } from '../components/PaperStats'
import { PaperActions } from '../components/PaperActions'
import { CommentSection } from '../components/CommentSection'
import { ShareModal } from '../modals/ShareModal'
import { CreateCommentModal } from '../modals/CreateCommentModal'
import {
  useThesis,
  useThesisVote,
  useThesisBookmark,
  useThesisViewIncrement,
  useThesisComments,
  useCreateComment,
} from '../hooks/useThesis'

/**
 * PaperDetailPage — the /paper/:id route.
 *
 * This screen is purely a coordinator:
 *   1. Reads the id from the URL
 *   2. Wires up the thesis + comments hooks
 *   3. Manages modal open/close state
 *   4. Composes the reusable PaperHeader / PaperActions / CommentSection
 *      components
 *
 * All business logic lives in the hooks; all networking lives in the
 * service; all presentation is delegated to small focused components.
 */
export default function PaperDetailPage() {
  const { id } = useParams<{ id: string }>()
  const paperId = id ?? ''

  const thesisQuery = useThesis(paperId)
  const commentsQuery = useThesisComments(paperId)
  const voteMutation = useThesisVote(paperId)
  const bookmarkMutation = useThesisBookmark(paperId)
  const viewMutation = useThesisViewIncrement(paperId)
  const createCommentMutation = useCreateComment()

  // Modal state
  const [shareOpen, setShareOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const [replyParentId, setReplyParentId] = useState<string | undefined>(undefined)

  // Fire view increment once on mount (after successful load)
  useEffect(() => {
    if (thesisQuery.isSuccess) {
      viewMutation.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thesisQuery.isSuccess, paperId])

  // ----- Loading / Error / Empty states -----
  if (thesisQuery.isLoading) {
    return <LoadingState label="Loading paper..." className="min-h-[60vh]" />
  }

  if (thesisQuery.isError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ErrorState
          title="Could not load paper"
          message={
            thesisQuery.error instanceof Error
              ? thesisQuery.error.message
              : 'The paper may have been removed or you may not have permission to view it.'
          }
          onRetry={() => thesisQuery.refetch()}
        />
      </div>
    )
  }

  if (!thesisQuery.data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <EmptyState
          icon={<AlertCircle className="w-6 h-6 text-text-dim" />}
          title="Paper not found"
          description="This paper may have been removed or never existed."
          action={
            <Link to="/feed">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to feed
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const { paper, user_vote, is_bookmarked } = thesisQuery.data

  // ----- Handlers -----
  function handleVote(direction: 'up' | 'down' | null) {
    voteMutation.mutate(direction)
  }

  function handleBookmark() {
    bookmarkMutation.mutate()
  }

  function handleDownload() {
    // Backend will return a signed URL; for now, open file_url in a new tab.
    if (paper.file_url && paper.file_url !== '#') {
      window.open(paper.file_url, '_blank', 'noopener,noreferrer')
    }
  }

  function handleOpenComment() {
    setReplyParentId(undefined)
    setCommentOpen(true)
  }

  function handleReply(parentId: string) {
    setReplyParentId(parentId)
    setCommentOpen(true)
  }

  async function handleCreateComment(content: string, parentId?: string) {
    await createCommentMutation.mutateAsync({ paper_id: paperId, content, parent_id: parentId })
  }

  function handleKeywordSelect(keyword: string) {
    // Future: navigate to /search?q=keyword
    void keyword
  }

  // Parent author lookup for the reply modal context
  const replyParent = replyParentId
    ? commentsQuery.data?.flatMap((c) => [c, ...(c.replies ?? [])]).find((c) => c.id === replyParentId)
    : undefined

  // ----- Render -----
  return (
    <div className="min-h-screen">
      {/* Top bar — matches the feed page header style */}
      <header className="sticky top-0 z-30 bg-base/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-5">
          <Link
            to="/feed"
            className="flex items-center gap-2 text-xs font-mono text-text-dim hover:text-flame transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to feed</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-flame/10 border border-flame/30 flex items-center justify-center">
              <span className="text-flame font-display font-bold text-sm">P</span>
            </div>
            <span className="hidden sm:block font-display font-bold text-sm text-text">Proyekto</span>
          </div>

          <Link
            to="/feed"
            className="p-2 text-text-dim hover:text-text hover:bg-surface-3 rounded-md transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-3 sm:px-5 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6"
        >
          {/* === Main column === */}
          <div className="space-y-5 min-w-0">
            <PaperHeader paper={paper} />

            <AuthorRow paper={paper} size="lg" />

            <CoAuthorList paper={paper} />

            <PaperActions
              voteScore={paper.vote_score}
              userVote={user_vote ?? null}
              isBookmarked={is_bookmarked}
              onVote={handleVote}
              onBookmark={handleBookmark}
              onShare={() => setShareOpen(true)}
              onDownload={handleDownload}
            />

            <PaperAbstract paper={paper} />

            <PaperKeywords paper={paper} onSelect={handleKeywordSelect} />

            <CommentSection
              comments={commentsQuery.data ?? []}
              isLoading={commentsQuery.isLoading}
              isError={commentsQuery.isError}
              onRetry={() => commentsQuery.refetch()}
              onAddComment={handleOpenComment}
              onReply={handleReply}
              totalCount={paper.comment_count}
            />
          </div>

          {/* === Sidebar (desktop only) === */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <PaperStats paper={paper} variant="grid" />
              <PaperMeta paper={paper} />
            </div>
          </aside>
        </motion.div>
      </main>

      {/* Mobile stats — below the main content */}
      <div className="lg:hidden max-w-6xl mx-auto px-3 sm:px-5 pb-8 space-y-4">
        <PaperStats paper={paper} variant="grid" />
        <PaperMeta paper={paper} />
      </div>

      {/* === Modals === */}
      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        paperId={paper.id}
        paperTitle={paper.title}
      />

      <CreateCommentModal
        open={commentOpen}
        onOpenChange={setCommentOpen}
        paperId={paper.id}
        paperTitle={paper.title}
        parentId={replyParentId}
        parentAuthor={replyParent?.user.username}
        onSubmit={handleCreateComment}
      />
    </div>
  )
}
