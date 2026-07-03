import { type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
}

/**
 * Modal — base modal wrapper built on Radix Dialog, styled to match
 * the Proyekto terminal aesthetic.
 *
 * Feature-specific modals (ShareModal, CreateCommentModal, etc.) compose
 * this base and should NEVER be implemented inline in a screen.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full',
            sizeConfig[size],
            'bg-surface border border-border rounded-xl shadow-2xl shadow-black/50',
            'flex flex-col max-h-[90vh]',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            className
          )}
        >
          {title && (
            <div className="flex items-start justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div>
                <Dialog.Title className="font-display font-bold text-base text-text">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="text-xs font-mono text-text-dim mt-1">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  className="p-1.5 rounded-md text-text-dim hover:text-text hover:bg-surface-3 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border flex-shrink-0">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
