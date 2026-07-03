// ============================================================
// Thesis service — networking layer for papers + comments.
// ------------------------------------------------------------
// ⚠️ MOCK DATA MODE
// All methods currently return mock data so the frontend can be
// developed before the backend is ready. When the backend lands,
// replace each method body with a single `api.*` call — the
// signatures and return types already match the planned endpoints.
//
// Planned endpoint map:
//   getById          -> GET    /papers/:id
//   vote             -> POST   /papers/:id/vote
//   bookmark         -> POST   /papers/:id/bookmark
//   incrementView    -> POST   /papers/:id/views
//   getComments      -> GET    /papers/:id/comments
//   createComment    -> POST   /papers/:id/comments
//   download         -> POST   /papers/:id/downloads
// ============================================================

import { api } from '@/lib/api'
import { feedItems, institutionNames } from '@/lib/feed-data'
import type {
  ThesisDetail,
  VoteDirection,
  Comment,
  CreateCommentPayload,
} from '@/types'

// ----- In-memory mock store (resets on page reload) -----
// This lets vote/bookmark mutations feel realistic without a backend.
const mockStore: {
  detailOverrides: Record<string, Partial<ThesisDetail>>
  commentsByPaper: Record<string, Comment[]>
} = {
  detailOverrides: {},
  commentsByPaper: {},
}

function buildMockDetail(paperId: string): ThesisDetail | null {
  const feedItem = feedItems.find((item) => item.paper.id === paperId)
  if (!feedItem) return null

  const override = mockStore.detailOverrides[paperId] ?? {}
  const comments = mockStore.commentsByPaper[paperId] ?? buildMockComments(paperId)
  mockStore.commentsByPaper[paperId] = comments

  return {
    ...feedItem,
    ...override,
    paper: { ...feedItem.paper, ...override.paper },
    comments,
  }
}

function buildMockComments(paperId: string): Comment[] {
  const feedItem = feedItems.find((item) => item.paper.id === paperId)
  if (!feedItem) return []

  // Two top-level comments, one with a nested reply.
  return [
    {
      id: `c_${paperId}_1`,
      paper_id: paperId,
      user_id: 'u2',
      user: {
        id: 'u2',
        username: 'abersales',
        avatar_url: undefined,
        reputation: 412,
      },
      content:
        'Excellent methodology section. The sample size justification on page 34 is particularly well-reasoned — have you considered extending this to a multi-region cohort for the next iteration?',
      vote_score: 18,
      created_at: '2026-03-22T09:30:00Z',
      updated_at: '2026-03-22T09:30:00Z',
      replies: [
        {
          id: `c_${paperId}_1_r1`,
          paper_id: paperId,
          user_id: 'u1',
          user: {
            id: 'u1',
            username: feedItem.paper.authors[0]?.name.split(' ')[0].toLowerCase() || 'author',
            avatar_url: undefined,
            reputation: 87,
          },
          content:
            'Thank you! Multi-region is exactly what we are planning for the follow-up study. Will reach out via DM to discuss collaboration.',
          parent_id: `c_${paperId}_1`,
          vote_score: 9,
          created_at: '2026-03-22T14:15:00Z',
          updated_at: '2026-03-22T14:15:00Z',
        },
      ],
    },
    {
      id: `c_${paperId}_2`,
      paper_id: paperId,
      user_id: 'u3',
      user: {
        id: 'u3',
        username: 'tbobots',
        avatar_url: undefined,
        reputation: 256,
      },
      content:
        'Would it be possible to share the raw sensor dataset used in Chapter 4? I am working on a related project and the data would significantly accelerate our validation phase. Happy to cite this work formally.',
      vote_score: 7,
      created_at: '2026-03-25T11:00:00Z',
      updated_at: '2026-03-25T11:00:00Z',
    },
  ]
}

// ============================================================
// Public service API
// ============================================================

export const thesisService = {
  /**
   * Fetch full paper detail (paper + user_vote + is_bookmarked + comments).
   * GET /papers/:id
   */
  async getById(paperId: string): Promise<ThesisDetail> {
    // TODO: replace mock with -> return api.get<ThesisDetail>(`/papers/${paperId}`)
    await simulateLatency()
    const detail = buildMockDetail(paperId)
    if (!detail) {
      throw new Error(`Paper not found: ${paperId}`)
    }
    return detail
  },

  /**
   * Cast / toggle / remove a vote on a paper.
   * POST /papers/:id/vote
   */
  async vote(paperId: string, direction: VoteDirection): Promise<void> {
    // TODO: replace mock with -> return api.post(`/papers/${paperId}/vote`, { direction })
    await simulateLatency()
    const current = buildMockDetail(paperId)
    if (!current) return

    const prevVote = current.user_vote ?? null
    let newScore = current.paper.vote_score
    if (prevVote === 'up') newScore -= 1
    if (prevVote === 'down') newScore += 1
    if (direction === 'up') newScore += 1
    if (direction === 'down') newScore -= 1

    mockStore.detailOverrides[paperId] = {
      ...mockStore.detailOverrides[paperId],
      user_vote: direction,
      paper: { ...current.paper, vote_score: newScore },
    }
  },

  /**
   * Toggle bookmark on a paper. Returns the new bookmarked state.
   * POST /papers/:id/bookmark
   */
  async bookmark(paperId: string): Promise<boolean> {
    // TODO: replace mock with -> return api.post<{ is_bookmarked: boolean }>(`/papers/${paperId}/bookmark`)
    await simulateLatency()
    const current = buildMockDetail(paperId)
    if (!current) return false

    const toggled = !current.is_bookmarked
    mockStore.detailOverrides[paperId] = {
      ...mockStore.detailOverrides[paperId],
      is_bookmarked: toggled,
      paper: {
        ...current.paper,
        bookmarks_count: toggled
          ? current.paper.bookmarks_count + 1
          : current.paper.bookmarks_count - 1,
      },
    }
    return toggled
  },

  /**
   * Record a view on a paper (fire-and-forget on detail mount).
   * POST /papers/:id/views
   */
  async incrementView(paperId: string): Promise<void> {
    // TODO: replace mock with -> return api.post(`/papers/${paperId}/views`)
    await simulateLatency()
    const current = buildMockDetail(paperId)
    if (!current) return
    mockStore.detailOverrides[paperId] = {
      ...mockStore.detailOverrides[paperId],
      paper: { ...current.paper, view_count: current.paper.view_count + 1 },
    }
  },

  /**
   * Fetch the threaded comment tree for a paper.
   * GET /papers/:id/comments
   */
  async getComments(paperId: string): Promise<Comment[]> {
    // TODO: replace mock with -> return api.get<Comment[]>(`/papers/${paperId}/comments`)
    await simulateLatency()
    return mockStore.commentsByPaper[paperId] ?? buildMockComments(paperId)
  },

  /**
   * Create a new comment (top-level or reply).
   * POST /papers/:id/comments
   */
  async createComment(payload: CreateCommentPayload): Promise<Comment> {
    // TODO: replace mock with -> return api.post<Comment>(`/papers/${payload.paper_id}/comments`, payload)
    await simulateLatency()
    const now = new Date().toISOString()
    const newComment: Comment = {
      id: `c_${payload.paper_id}_${Date.now()}`,
      paper_id: payload.paper_id,
      user_id: 'u_current',
      user: {
        id: 'u_current',
        username: 'you',
        avatar_url: undefined,
        reputation: 0,
      },
      content: payload.content,
      parent_id: payload.parent_id,
      vote_score: 0,
      created_at: now,
      updated_at: now,
      replies: [],
    }

    const existing = mockStore.commentsByPaper[payload.paper_id] ?? []
    if (payload.parent_id) {
      // Append as a reply to the parent comment
      const updated = existing.map((c) =>
        c.id === payload.parent_id
          ? { ...c, replies: [...(c.replies ?? []), newComment] }
          : c
      )
      mockStore.commentsByPaper[payload.paper_id] = updated
    } else {
      mockStore.commentsByPaper[payload.paper_id] = [...existing, newComment]
    }

    return newComment
  },

  /**
   * Helper used by the detail page to resolve institution name from id.
   * Will move to an institution.service.ts once that feature is built.
   */
  getInstitutionName(institutionId: string): string {
    return institutionNames[institutionId] ?? 'Unknown Institution'
  },
}

// Simulate network latency so loading states are visible during development.
// REMOVE when wiring real API.
function simulateLatency(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Re-export api so this file is the single import surface for thesis networking.
// (Silences unused-import warnings during mock mode.)
void api
