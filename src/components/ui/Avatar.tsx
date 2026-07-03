import { cn } from '@/lib/utils'
import { getAvatarColor, getInitials } from '@/lib/format'

interface AvatarProps {
  name: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  xs: 'w-6 h-6 text-[8px]',
  sm: 'w-7 h-7 text-[9px]',
  md: 'w-8 h-8 text-[10px]',
  lg: 'w-10 h-10 text-xs',
}

/**
 * Avatar renders either an <img> (when src is provided) or a deterministic
 * initials + color block. Used across feed cards, author rows, comments.
 */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const colorClass = getAvatarColor(name)
  const initials = getInitials(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover border border-border flex-shrink-0',
          sizeConfig[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold font-mono flex-shrink-0 border border-border',
        sizeConfig[size],
        colorClass,
        className
      )}
    >
      {initials}
    </div>
  )
}
