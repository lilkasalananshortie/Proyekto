// ============================================================
// useThesis — React Query hooks for the thesis feature.
// ------------------------------------------------------------
// Screens should consume these hooks, never call thesisService
// directly. This keeps data-fetching logic, cache keys, and
// mutation invalidation in one place.
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { thesisService } from '../services/thesis.service'
import type { VoteDirection, CreateCommentPayload } from '@/types'

const KEYS = {
  detail: (paperId: string) => ['thesis', 'detail', paperId] as const,
  comments: (paperId: string) => ['thesis', 'comments', paperId] as const,
}

/**
 * Fetch full paper detail by id.
 */
export function useThesis(paperId: string) {
  return useQuery({
    queryKey: KEYS.detail(paperId),
    queryFn: () => thesisService.getById(paperId),
    enabled: Boolean(paperId),
  })
}

/**
 * Vote (up / down / remove) on a paper. Optimistically updates the
 * detail cache and rolls back on failure.
 */
export function useThesisVote(paperId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (direction: VoteDirection) => thesisService.vote(paperId, direction),
    onMutate: async (direction) => {
      await queryClient.cancelQueries({ queryKey: KEYS.detail(paperId) })
      const previous = queryClient.getQueryData<ReturnType<typeof useThesis>['data']>(
        KEYS.detail(paperId)
      )
      if (previous) {
        const prevVote = previous.user_vote ?? null
        let newScore = previous.paper.vote_score
        if (prevVote === 'up') newScore -= 1
        if (prevVote === 'down') newScore += 1
        if (direction === 'up') newScore += 1
        if (direction === 'down') newScore -= 1
        queryClient.setQueryData(KEYS.detail(paperId), {
          ...previous,
          user_vote: direction,
          paper: { ...previous.paper, vote_score: newScore },
        })
      }
      return { previous }
    },
    onError: (_err, _direction, context) => {
      if (context?.previous) {
        queryClient.setQueryData(KEYS.detail(paperId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.detail(paperId) })
    },
  })
}

/**
 * Toggle bookmark. Optimistic update + invalidate.
 */
export function useThesisBookmark(paperId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => thesisService.bookmark(paperId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: KEYS.detail(paperId) })
      const previous = queryClient.getQueryData<ReturnType<typeof useThesis>['data']>(
        KEYS.detail(paperId)
      )
      if (previous) {
        const toggled = !previous.is_bookmarked
        queryClient.setQueryData(KEYS.detail(paperId), {
          ...previous,
          is_bookmarked: toggled,
          paper: {
            ...previous.paper,
            bookmarks_count: toggled
              ? previous.paper.bookmarks_count + 1
              : previous.paper.bookmarks_count - 1,
          },
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(KEYS.detail(paperId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.detail(paperId) })
    },
  })
}

/**
 * Fire-and-forget view increment. Called once on detail page mount.
 */
export function useThesisViewIncrement(paperId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => thesisService.incrementView(paperId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.detail(paperId) })
    },
  })
}

/**
 * Fetch the threaded comment tree for a paper.
 */
export function useThesisComments(paperId: string) {
  return useQuery({
    queryKey: KEYS.comments(paperId),
    queryFn: () => thesisService.getComments(paperId),
    enabled: Boolean(paperId),
  })
}

/**
 * Create a new comment (top-level or reply). Invalidates the comment
 * tree and the paper detail (comment_count changes).
 */
export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => thesisService.createComment(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.comments(variables.paper_id) })
      queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.paper_id) })
    },
  })
}
