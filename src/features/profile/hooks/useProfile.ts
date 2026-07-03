// ============================================================
// useProfile — React Query hooks for the profile feature.
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'
import type { UpdateProfilePayload } from '@/types'

const KEYS = {
  profile: (userId: string) => ['profile', 'detail', userId] as const,
  papers: (userId: string) => ['profile', 'papers', userId] as const,
}

/**
 * Fetch a user's public profile by id.
 */
export function useProfile(userId: string) {
  return useQuery({
    queryKey: KEYS.profile(userId),
    queryFn: () => profileService.getById(userId),
    enabled: Boolean(userId),
  })
}

/**
 * Fetch the papers authored by a user.
 */
export function useProfilePapers(userId: string) {
  return useQuery({
    queryKey: KEYS.papers(userId),
    queryFn: () => profileService.getPapers(userId),
    enabled: Boolean(userId),
  })
}

/**
 * Update the current user's profile (only for the profile owner).
 * Optimistically updates the profile cache.
 */
export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileService.update(userId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(KEYS.profile(userId), updated)
    },
  })
}

/**
 * Follow a user. Optimistic update.
 */
export function useFollow(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => profileService.follow(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: KEYS.profile(userId) })
      const previous = queryClient.getQueryData<ReturnType<typeof useProfile>['data']>(
        KEYS.profile(userId)
      )
      if (previous && !previous.is_followed_by_current_user) {
        queryClient.setQueryData(KEYS.profile(userId), {
          ...previous,
          is_followed_by_current_user: true,
          followers_count: previous.followers_count + 1,
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(KEYS.profile(userId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.profile(userId) })
    },
  })
}

/**
 * Unfollow a user. Optimistic update.
 */
export function useUnfollow(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => profileService.unfollow(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: KEYS.profile(userId) })
      const previous = queryClient.getQueryData<ReturnType<typeof useProfile>['data']>(
        KEYS.profile(userId)
      )
      if (previous && previous.is_followed_by_current_user) {
        queryClient.setQueryData(KEYS.profile(userId), {
          ...previous,
          is_followed_by_current_user: false,
          followers_count: Math.max(0, previous.followers_count - 1),
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(KEYS.profile(userId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.profile(userId) })
    },
  })
}
