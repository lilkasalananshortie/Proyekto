// ============================================================
// Search domain types
// ============================================================

import type {
  DegreeLevel,
  ResearchField,
  ResearchMethodology,
  PaperType,
} from './Thesis'

export type SearchSortBy =
  | 'relevance'
  | 'newest'
  | 'oldest'
  | 'most_upvoted'
  | 'most_downloaded'
  | 'most_viewed'

export interface SearchFilters {
  query?: string
  research_field?: ResearchField
  methodology?: ResearchMethodology
  paper_type?: PaperType
  degree_level?: DegreeLevel
  institution_id?: string
  department_id?: string
  year_from?: number
  year_to?: number
  sort_by?: SearchSortBy
  page?: number
  per_page?: number
}
