import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

/**
 * EmptyState — reusable placeholder for lists/feeds with no results.
 * Replaces the inline empty-state JSX in FeedPage.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('card-glass p-8 text-center', className)}
    >
      {icon && (
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface-3 border border-border flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="font-display font-bold text-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-dim font-mono">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  )
}
