// ============================================================
// Notification domain types
// ============================================================

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  data: Record<string, unknown>
  is_read: boolean
  created_at: string
}
