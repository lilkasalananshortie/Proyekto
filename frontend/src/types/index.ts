// ============================================================
// Proyekto - Type Definitions
// ============================================================

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

export type UserRole = 'student' | 'faculty' | 'admin' | 'head'

export type DegreeLevel = 'undergraduate' | 'masteral' | 'doctoral'

export interface Badge {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  earned_at: string
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

export interface LoginPayload {
  email: string
  password: string
}

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

export type ResearchField =
  | 'architecture_and_engineering'
  | 'arts_and_humanities'
  | 'business_and_management'
  | 'education'
  | 'health_sciences'
  | 'information_technology'
  | 'law_and_political_science'
  | 'natural_sciences'
  | 'social_sciences'
  | 'criminology_and_criminal_justice'
  | 'maritime_and_naval'
  | 'agriculture_and_fisheries'
  | 'hospitality_and_tourism'
  | 'communication_and_media'
  | 'mathematics_and_statistics'
  | 'other'

export type ResearchMethodology =
  | 'qualitative'
  | 'quantitative'
  | 'mixed_method'
  | 'prototype'
  | 'case_study'
  | 'experimental'
  | 'design_and_development'

export type PaperStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'flagged'

export type PaperType =
  | 'thesis'
  | 'dissertation'
  | 'capstone'
  | 'research_paper'
  | 'feasibility_study'
  | 'business_proposal'
  | 'architectural_model'
  | 'engineering_project'
  | 'case_study'
  | 'other'

export interface Paper {
  id: string
  title: string
  abstract: string
  authors: PaperAuthor[]
  institution_id: string
  department_id: string
  degree_level: DegreeLevel
  paper_type: PaperType
  research_field: ResearchField
  methodology: ResearchMethodology
  year: number
  keywords: string[]
  file_url: string
  file_size: number
  page_count: number
  cover_image_url?: string
  license: ContentLicense
  status: PaperStatus
  vote_score: number
  vote_count: number
  comment_count: number
  view_count: number
  download_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface PaperAuthor {
  user_id: string
  name: string
  avatar_url?: string
  is_primary: boolean
}

export type ContentLicense =
  | 'cc_by'
  | 'cc_by_sa'
  | 'cc_by_nc'
  | 'cc_by_nc_sa'
  | 'cc_by_nd'
  | 'cc_by_nc_nd'
  | 'all_rights_reserved'

export interface FeedItem {
  paper: Paper
  user_vote?: VoteDirection
  is_bookmarked: boolean
}

export type VoteDirection = 'up' | 'down' | null

export interface VotePayload {
  direction: VoteDirection
}

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

export interface BookmarkCollection {
  id: string
  name: string
  description?: string
  paper_ids: string[]
  is_public: boolean
  paper_count: number
  created_at: string
}

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
  sort_by?: 'relevance' | 'newest' | 'oldest' | 'most_upvoted' | 'most_downloaded' | 'most_viewed'
  page?: number
  per_page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  data: Record<string, unknown>
  is_read: boolean
  created_at: string
}

export const RESEARCH_FIELD_LABELS: Record<ResearchField, string> = {
  architecture_and_engineering: 'Architecture & Engineering',
  arts_and_humanities: 'Arts & Humanities',
  business_and_management: 'Business & Management',
  education: 'Education',
  health_sciences: 'Health Sciences',
  information_technology: 'Information Technology',
  law_and_political_science: 'Law & Political Science',
  natural_sciences: 'Natural Sciences',
  social_sciences: 'Social Sciences',
  criminology_and_criminal_justice: 'Criminology & Criminal Justice',
  maritime_and_naval: 'Maritime & Naval',
  agriculture_and_fisheries: 'Agriculture & Fisheries',
  hospitality_and_tourism: 'Hospitality & Tourism',
  communication_and_media: 'Communication & Media',
  mathematics_and_statistics: 'Mathematics & Statistics',
  other: 'Other',
}

export const PAPER_TYPE_LABELS: Record<PaperType, string> = {
  thesis: 'Thesis',
  dissertation: 'Dissertation',
  capstone: 'Capstone Project',
  research_paper: 'Research Paper',
  feasibility_study: 'Feasibility Study',
  business_proposal: 'Business Proposal',
  architectural_model: 'Architectural Model',
  engineering_project: 'Engineering Project',
  case_study: 'Case Study',
  other: 'Other',
}

export const METHODOLOGY_LABELS: Record<ResearchMethodology, string> = {
  qualitative: 'Qualitative',
  quantitative: 'Quantitative',
  mixed_method: 'Mixed Method',
  prototype: 'Prototype / Design & Development',
  case_study: 'Case Study',
  experimental: 'Experimental',
  design_and_development: 'Design & Development',
}