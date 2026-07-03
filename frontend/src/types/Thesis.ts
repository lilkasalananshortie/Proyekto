// ============================================================
// Thesis / Paper domain types
// ============================================================

export type DegreeLevel = 'undergraduate' | 'masteral' | 'doctoral'

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

export type ContentLicense =
  | 'cc_by'
  | 'cc_by_sa'
  | 'cc_by_nc'
  | 'cc_by_nc_sa'
  | 'cc_by_nd'
  | 'cc_by_nc_nd'
  | 'all_rights_reserved'

export type VoteDirection = 'up' | 'down' | null

export interface PaperAuthor {
  user_id: string
  name: string
  avatar_url?: string
  is_primary: boolean
}

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

export interface FeedItem {
  paper: Paper
  user_vote?: VoteDirection
  is_bookmarked: boolean
}

export interface VotePayload {
  direction: VoteDirection
}

/**
 * Full paper detail — extends FeedItem with the threaded comment tree
 * and any other fields only the detail endpoint returns.
 */
import type { Comment } from './Comment'

export interface ThesisDetail extends FeedItem {
  comments: Comment[]
}

// ============================================================
// Label maps — kept alongside the enums they describe
// ============================================================

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

export const LICENSE_LABELS: Record<ContentLicense, string> = {
  cc_by: 'CC BY',
  cc_by_sa: 'CC BY-SA',
  cc_by_nc: 'CC BY-NC',
  cc_by_nc_sa: 'CC BY-NC-SA',
  cc_by_nd: 'CC BY-ND',
  cc_by_nc_nd: 'CC BY-NC-ND',
  all_rights_reserved: 'All Rights Reserved',
}

export const DEGREE_LEVEL_LABELS: Record<DegreeLevel, string> = {
  undergraduate: 'Undergraduate',
  masteral: "Masteral",
  doctoral: 'Doctoral',
}
