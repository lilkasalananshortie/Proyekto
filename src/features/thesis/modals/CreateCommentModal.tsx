import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface CreateCommentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paperId: string
  paperTitle: string
  parentId?: string
  parentAuthor?: string
  onSubmit: (content: string, parentId?: string) => Promise<void>
}

const commentSchema = z.object({
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(2000, 'Comment must be 2000 characters or fewer'),
})

type CommentForm = z.infer<typeof commentSchema>

const MAX_LENGTH = 2000

/**
 * CreateCommentModal — form for posting a new top-level comment or a reply.
 *
 * Strongly typed via zod + react-hook-form. Manages only presentation
 * and local form state; the actual creation is delegated to the parent
 * via onSubmit (which calls the useCreateComment hook).
 */
export function CreateCommentModal({
  open,
  onOpenChange,
  paperId,
  paperTitle,
  parentId,
  parentAuthor,
  onSubmit,
}: CreateCommentModalProps) {
  const isReply = Boolean(parentId)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  })

  const contentValue = watch('content')
  const remaining = MAX_LENGTH - (contentValue?.length ?? 0)

  async function handleValid(data: CommentForm) {
    await onSubmit(data.content, parentId)
    reset({ content: '' })
    onOpenChange(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      reset({ content: '' })
    }
    onOpenChange(next)
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={isReply ? `Reply to @${parentAuthor}` : 'Add a comment'}
      description={paperTitle}
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form={`comment-form-${paperId}`}
            size="sm"
            loading={isSubmitting}
          >
            {isReply ? 'Post reply' : 'Post comment'}
          </Button>
        </>
      }
    >
      <form
        id={`comment-form-${paperId}`}
        onSubmit={handleSubmit(handleValid)}
        className="space-y-3"
      >
        {isReply && parentAuthor && (
          <div className="px-3 py-2 rounded-md bg-flame/5 border border-flame/20 text-xs font-mono text-flame">
            Replying to @{parentAuthor}
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="comment-content"
            className="block text-[10px] font-mono text-text-dim uppercase tracking-wider"
          >
            Your {isReply ? 'reply' : 'comment'}
          </label>
          <textarea
            id="comment-content"
            rows={6}
            placeholder="Share your thoughts, ask a question, or suggest improvements..."
            className={cn(
              'input-terminal resize-y min-h-[120px]',
              errors.content && 'border-danger focus:border-danger focus:ring-danger/20'
            )}
            {...register('content')}
          />
          <div className="flex items-center justify-between">
            {errors.content ? (
              <p className="text-xs text-danger font-mono">{errors.content.message}</p>
            ) : (
              <span />
            )}
            <span
              className={cn(
                'text-[10px] font-mono tabular-nums',
                remaining < 100 ? 'text-warning' : 'text-text-dim'
              )}
            >
              {remaining} chars left
            </span>
          </div>
        </div>
      </form>
    </Modal>
  )
}
