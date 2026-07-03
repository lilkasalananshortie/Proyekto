// ============================================================
// Bookmark domain types
// ============================================================

export interface BookmarkCollection {
  id: string
  name: string
  description?: string
  paper_ids: string[]
  is_public: boolean
  paper_count: number
  created_at: string
}
