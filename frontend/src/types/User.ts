// ============================================================
// User domain types
// ============================================================

import type { DegreeLevel } from './Thesis'

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

// Forward declaration to avoid circular import — ResearchField lives in Thesis.ts
// but RegisterPayload needs it. Re-exported below via the barrel.
import type { ResearchField } from './Thesis'
