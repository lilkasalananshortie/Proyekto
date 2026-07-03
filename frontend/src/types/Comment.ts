// ============================================================
// Comment domain types
// ============================================================

import type { User } from './User'

export interface Comment {
  id: string
  paper_id: string
  user_id: string
  user: Pick<User, 'id' | 'username' | 'avatar_url' | 'reputation'>
  content: string
  parent_id?: string
  replies?: Comment[]
  vote_score: number
  created_at: string
  updated_at: string
}

export interface CreateCommentPayload {
  paper_id: string
  content: string
  parent_id?: string
}
