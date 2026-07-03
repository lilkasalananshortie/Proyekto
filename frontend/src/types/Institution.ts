// ============================================================
// Institution domain types
// ============================================================

export interface Institution {
  id: string
  name: string
  slug: string
  acronym: string
  region: string
  city: string
  logo_url?: string
  is_partner: boolean
  departments_count: number
  papers_count: number
  created_at: string
}

export interface Department {
  id: string
  name: string
  slug: string
  institution_id: string
  college?: string
  programs: string[]
  papers_count: number
}
