import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  action?: ReactNode
  className?: string
}

/**
 * ErrorState — reusable error placeholder with optional retry CTA.
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('card-glass p-8 text-center', className)}
    >
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-danger/10 border border-danger/30 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-danger" />
      </div>
      <h3 className="font-display font-bold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-dim font-mono mb-4">{message}</p>
      {action}
      {onRetry && !action && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </Button>
      )}
    </motion.div>
  )
}
