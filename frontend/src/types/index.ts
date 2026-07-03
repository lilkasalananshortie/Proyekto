// ============================================================
// Proyekto - Type Definitions (barrel)
// ------------------------------------------------------------
// Domain types are split into per-feature files to keep each
// concern isolated and avoid a giant monolithic module.
//
// Importing from `@/types` re-exports everything below, so
// existing call sites keep working:
//
//   import type { User, Paper } from '@/types'
//
// New code may also import directly from the domain file:
//
//   import type { Paper } from '@/types/Thesis'
// ============================================================

export * from './Common'
export * from './User'
export * from './Institution'
export * from './Thesis'
export * from './Comment'
export * from './Bookmark'
export * from './Notification'
export * from './Search'
