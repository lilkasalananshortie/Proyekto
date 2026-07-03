// ============================================================
// Profile service — networking layer for user profiles.
// ------------------------------------------------------------
// ⚠️ MOCK DATA MODE
// All methods return mock data so the frontend can be developed
// before the backend is ready. When the backend lands, replace
// each method body with a single `api.*` call — the signatures
// and return types already match the planned endpoints.
//
// Planned endpoint map:
//   getById        -> GET    /users/:id
//   getPapers      -> GET    /users/:id/papers?page=N
//   update         -> PATCH  /users/:id
//   follow         -> POST   /users/:id/follow
//   unfollow       -> DELETE /users/:id/follow
// ============================================================

import { api } from '@/lib/api'
import { feedItems, institutionNames } from '@/lib/feed-data'
import type {
  UserProfile,
  UpdateProfilePayload,
  FeedItem,
  DegreeLevel,
} from '@/types'
import type { ResearchField } from '@/types'

// ----- In-memory mock user store -----
// Maps the user_ids referenced in feed-data.ts to full UserProfile objects.
// Resets on page reload (same as thesis.service.ts).
const mockUsers: Record<string, UserProfile> = {
  u1: {
    id: 'u1',
    username: 'mhaku_manalili',
    email: 'mhaku.manalili@up.edu.ph',
    first_name: 'Mhaku',
    last_name: 'Manalili',
    avatar_url: undefined,
    bio: 'BS Computer Science student at UP Diliman. Research interests: IoT, environmental monitoring systems, and applied machine learning for agriculture. Currently working on a multi-region water quality study.',
    reputation: 487,
    badges: [
      { id: 'b1', name: 'Top Contributor', slug: 'top-contributor', description: 'Published 5+ papers', icon: 'award', earned_at: '2026-01-15T00:00:00Z' },
      { id: 'b2', name: 'First Paper', slug: 'first-paper', description: 'Published your first paper', icon: 'book', earned_at: '2025-08-20T00:00:00Z' },
      { id: 'b3', name: 'Verified Student', slug: 'verified-student', description: 'Verified .edu.ph email', icon: 'shield', earned_at: '2025-08-15T00:00:00Z' },
    ],
    institution_id: 'inst_1',
    department_id: 'dept_cs',
    degree_level: 'undergraduate',
    role: 'student',
    is_verified: true,
    is_verified_student: true,
    papers_count: 2,
    bookmarks_count: 18,
    created_at: '2025-08-15T09:00:00Z',
    updated_at: '2026-05-09T14:30:00Z',
    total_views: 5240,
    total_downloads: 790,
    total_upvotes: 309,
    followers_count: 42,
    is_followed_by_current_user: false,
  },
  u2: {
    id: 'u2',
    username: 'abersales',
    email: 'alwina.bersales@usc.edu.ph',
    first_name: 'Alwina',
    last_name: 'Bersales',
    avatar_url: undefined,
    bio: 'MS Biology student at University of San Carlos. Focused on antimicrobial resistance and water microbiology. Field researcher at heart.',
    reputation: 612,
    badges: [
      { id: 'b1', name: 'Top Contributor', slug: 'top-contributor', description: 'Published 5+ papers', icon: 'award', earned_at: '2026-02-01T00:00:00Z' },
      { id: 'b2', name: 'First Paper', slug: 'first-paper', description: 'Published your first paper', icon: 'book', earned_at: '2025-09-10T00:00:00Z' },
      { id: 'b4', name: 'Cited Author', slug: 'cited-author', description: 'Cited by 5+ papers', icon: 'quote', earned_at: '2026-03-05T00:00:00Z' },
    ],
    institution_id: 'inst_10',
    department_id: 'dept_natsci',
    degree_level: 'masteral',
    role: 'student',
    is_verified: true,
    is_verified_student: true,
    papers_count: 1,
    bookmarks_count: 47,
    created_at: '2025-09-10T11:00:00Z',
    updated_at: '2026-05-09T16:00:00Z',
    total_views: 3800,
    total_downloads: 567,
    total_upvotes: 184,
    followers_count: 89,
    is_followed_by_current_user: false,
  },
  u3: {
    id: 'u3',
    username: 'tbobots',
    email: 'tito.bobots@dlsu.edu.ph',
    first_name: 'Tito',
    last_name: 'Bobots',
    avatar_url: undefined,
    bio: 'BS Civil Engineering at DLSU. Sustainable construction materials research. Bamboo reinforcement enthusiast.',
    reputation: 298,
    badges: [
      { id: 'b2', name: 'First Paper', slug: 'first-paper', description: 'Published your first paper', icon: 'book', earned_at: '2026-02-18T00:00:00Z' },
      { id: 'b3', name: 'Verified Student', slug: 'verified-student', description: 'Verified .edu.ph email', icon: 'shield', earned_at: '2025-11-01T00:00:00Z' },
    ],
    institution_id: 'inst_2',
    department_id: 'dept_eng',
    degree_level: 'undergraduate',
    role: 'student',
    is_verified: true,
    is_verified_student: true,
    papers_count: 1,
    bookmarks_count: 12,
    created_at: '2025-11-01T08:00:00Z',
    updated_at: '2026-05-07T11:20:00Z',
    total_views: 2340,
    total_downloads: 456,
    total_upvotes: 98,
    followers_count: 23,
    is_followed_by_current_user: false,
  },
  u4: {
    id: 'u4',
    username: 'boy_bayani',
    email: 'boy.bayani@pup.edu.ph',
    first_name: 'Boy',
    last_name: 'Bayani',
    avatar_url: undefined,
    bio: 'BS Business Management at PUP. Micro-franchise and digital inclusion research for low-income communities.',
    reputation: 156,
    badges: [
      { id: 'b2', name: 'First Paper', slug: 'first-paper', description: 'Published your first paper', icon: 'book', earned_at: '2026-04-25T00:00:00Z' },
    ],
    institution_id: 'inst_5',
    department_id: 'dept_bus',
    degree_level: 'undergraduate',
    role: 'student',
    is_verified: false,
    is_verified_student: true,
    papers_count: 1,
    bookmarks_count: 5,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-05-10T15:00:00Z',
    total_views: 1560,
    total_downloads: 234,
    total_upvotes: 76,
    followers_count: 11,
    is_followed_by_current_user: false,
  },
  u6: {
    id: 'u6',
    username: 'prinsesa_mae',
    email: 'prinsesa.dimaculangan@adamson.edu.ph',
    first_name: 'Prinsesa Mae',
    last_name: 'Dimaculangan',
    avatar_url: undefined,
    bio: 'BE Education student at Adamson University. Researching post-pandemic learning modalities in Philippine public schools.',
    reputation: 203,
    badges: [
      { id: 'b2', name: 'First Paper', slug: 'first-paper', description: 'Published your first paper', icon: 'book', earned_at: '2026-04-12T00:00:00Z' },
      { id: 'b3', name: 'Verified Student', slug: 'verified-student', description: 'Verified .edu.ph email', icon: 'shield', earned_at: '2025-12-10T00:00:00Z' },
    ],
    institution_id: 'inst_9',
    department_id: 'dept_edu',
    degree_level: 'undergraduate',
    role: 'student',
    is_verified: true,
    is_verified_student: true,
    papers_count: 1,
    bookmarks_count: 22,
    created_at: '2025-12-10T09:00:00Z',
    updated_at: '2026-05-10T10:00:00Z',
    total_views: 2100,
    total_downloads: 298,
    total_upvotes: 119,
    followers_count: 31,
    is_followed_by_current_user: false,
  },
  u7: {
    id: 'u7',
    username: 'jekjek_luna',
    email: 'jekjek.luna@mapua.edu.ph',
    first_name: 'Jekjek',
    last_name: 'Luna',
    avatar_url: undefined,
    bio: 'BS Agricultural Engineering at Mapua University. Renewable energy systems for fishing communities. Solar power advocate.',
    reputation: 367,
    badges: [
      { id: 'b1', name: 'Top Contributor', slug: 'top-contributor', description: 'Published 5+ papers', icon: 'award', earned_at: '2025-09-01T00:00:00Z' },
      { id: 'b2', name: 'First Paper', slug: 'first-paper', description: 'Published your first paper', icon: 'book', earned_at: '2025-08-01T00:00:00Z' },
      { id: 'b5', name: 'Community Impact', slug: 'community-impact', description: 'Paper adopted by local community', icon: 'heart', earned_at: '2026-01-20T00:00:00Z' },
    ],
    institution_id: 'inst_6',
    department_id: 'dept_agri',
    degree_level: 'undergraduate',
    role: 'student',
    is_verified: true,
    is_verified_student: true,
    papers_count: 1,
    bookmarks_count: 33,
    created_at: '2025-06-15T09:00:00Z',
    updated_at: '2026-05-08T14:00:00Z',
    total_views: 4100,
    total_downloads: 623,
    total_upvotes: 203,
    followers_count: 67,
    is_followed_by_current_user: false,
  },
  u8: {
    id: 'u8',
    username: 'doro_delacruz',
    email: 'doro.delacruz@feu.edu.ph',
    first_name: 'Doro',
    last_name: 'De La Cruz',
    avatar_url: undefined,
    bio: 'BS Architecture at FEU. Heritage conservation and adaptive reuse. Intramuros restoration project lead.',
    reputation: 421,
    badges: [
      { id: 'b2', name: 'First Paper', slug: 'first-paper', description: 'Published your first paper', icon: 'book', earned_at: '2025-10-12T00:00:00Z' },
      { id: 'b6', name: 'Featured Research', slug: 'featured-research', description: 'Paper featured on homepage', icon: 'star', earned_at: '2025-11-01T00:00:00Z' },
    ],
    institution_id: 'inst_8',
    department_id: 'dept_archi',
    degree_level: 'undergraduate',
    role: 'student',
    is_verified: true,
    is_verified_student: true,
    papers_count: 1,
    bookmarks_count: 28,
    created_at: '2025-07-20T07:00:00Z',
    updated_at: '2026-05-10T09:00:00Z',
    total_views: 5200,
    total_downloads: 789,
    total_upvotes: 231,
    followers_count: 78,
    is_followed_by_current_user: false,
  },
}

// ============================================================
// Public service API
// ============================================================

export const profileService = {
  /**
   * Fetch a user's public profile.
   * GET /users/:id
   */
  async getById(userId: string): Promise<UserProfile> {
    // TODO: replace mock with -> return api.get<UserProfile>(`/users/${userId}`)
    await simulateLatency()
    const user = mockUsers[userId]
    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }
    // Return a shallow clone so callers can't mutate the mock store directly.
    return { ...user }
  },

  /**
   * Fetch the papers authored by a user (paginated).
   * GET /users/:id/papers?page=N
   */
  async getPapers(userId: string, page = 1, perPage = 10): Promise<FeedItem[]> {
    // TODO: replace mock with -> return api.get<UserPapersResponse>(`/users/${userId}/papers?page=${page}`).then(r => r.data)
    void page
    void perPage
    await simulateLatency()
    return feedItems.filter((item) =>
      item.paper.authors.some((a) => a.user_id === userId)
    )
  },

  /**
   * Update the current user's profile (only callable by the profile owner).
   * PATCH /users/:id
   */
  async update(userId: string, payload: UpdateProfilePayload): Promise<UserProfile> {
    // TODO: replace mock with -> return api.patch<UserProfile>(`/users/${userId}`, payload)
    await simulateLatency()
    const existing = mockUsers[userId]
    if (!existing) {
      throw new Error(`User not found: ${userId}`)
    }
    const updated: UserProfile = {
      ...existing,
      ...payload,
      updated_at: new Date().toISOString(),
    }
    mockUsers[userId] = updated
    return { ...updated }
  },

  /**
   * Follow a user. Returns the new follower state.
   * POST /users/:id/follow
   */
  async follow(userId: string): Promise<boolean> {
    // TODO: replace mock with -> return api.post<{ is_following: boolean }>(`/users/${userId}/follow`)
    await simulateLatency()
    const user = mockUsers[userId]
    if (!user) return false
    user.is_followed_by_current_user = true
    user.followers_count += 1
    return true
  },

  /**
   * Unfollow a user. Returns the new follower state.
   * DELETE /users/:id/follow
   */
  async unfollow(userId: string): Promise<boolean> {
    // TODO: replace mock with -> return api.delete<{ is_following: boolean }>(`/users/${userId}/follow`)
    await simulateLatency()
    const user = mockUsers[userId]
    if (!user) return false
    user.is_followed_by_current_user = false
    user.followers_count = Math.max(0, user.followers_count - 1)
    return false
  },

  /**
   * Helper to resolve institution name from id (same as thesisService).
   * Will consolidate into an institution.service.ts once that feature is built.
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

// Re-export api so this file is the single import surface for profile networking.
// (Silences unused-import warnings during mock mode.)
void api

// Re-export types used by callers for convenience.
export type { DegreeLevel, ResearchField }
