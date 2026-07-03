// ============================================================
// User domain types
// ============================================================

import type { DegreeLevel, ResearchField, FeedItem } from './Thesis'
import type { PaginatedResponse } from './Common'

export type UserRole = 'student' | 'faculty' | 'admin' | 'head'

export interface Badge {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  earned_at: string
}

export interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  avatar_url?: string
  bio?: string
  reputation: number
  badges: Badge[]
  institution_id: string
  department_id: string
  degree_level: DegreeLevel
  role: UserRole
  is_verified: boolean
  is_verified_student: boolean
  papers_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string
}

/**
 * Public profile view of a user — what other users see when visiting /user/:id.
 * May exclude private fields like email that the User interface includes.
 */
export interface UserProfile extends User {
  /** Total view_count summed across all the user's papers (computed by backend). */
  total_views: number
  /** Total download_count summed across all the user's papers. */
  total_downloads: number
  /** Total vote_score summed across all the user's papers. */
  total_upvotes: number
  /** Followers count (for future social features). */
  followers_count: number
  /** Whether the currently-authenticated user follows this profile. */
  is_followed_by_current_user: boolean
}

export interface AuthTokens {
  token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  password_confirmation: string
  institution_id: string
  department_id: string
  degree_level: DegreeLevel
  primary_field: ResearchField
}

/**
 * Update payload for the EditProfileModal — all fields optional.
 * Backend merges only the provided fields.
 */
export interface UpdateProfilePayload {
  first_name?: string
  last_name?: string
  username?: string
  bio?: string
  avatar_url?: string
  institution_id?: string
  department_id?: string
  degree_level?: DegreeLevel
  primary_field?: ResearchField
}

/**
 * Response shape for GET /users/:id/papers — paginated list of the user's papers.
 */
export type UserPapersResponse = PaginatedResponse<FeedItem>
