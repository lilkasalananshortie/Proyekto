import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VoteDirection } from '@/types'

interface VoteButtonProps {
  score: number
  currentVote: VoteDirection
  onVote: (direction: VoteDirection) => void
  size?: 'sm' | 'md' | 'lg'
}

export function VoteButton({ score, currentVote, onVote, size = 'md' }: VoteButtonProps) {
  const [justVoted, setJustVoted] = useState<'up' | 'down' | null>(null)

  const sizeConfig = {
    sm: { container: 'gap-0.5', btn: 'w-7 h-7', icon: 'w-3.5 h-3.5', text: 'text-xs' },
    md: { container: 'gap-0.5', btn: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' },
    lg: { container: 'gap-1', btn: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-base' },
  }

  const s = sizeConfig[size]

  function handleVote(direction: 'up' | 'down') {
    const newVote = currentVote === direction ? null : direction
    onVote(newVote)
    setJustVoted(direction)
    setTimeout(() => setJustVoted(null), 600)
  }

  return (
    <div className={cn('flex flex-col items-center', s.container)}>
      {/* Upvote */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => handleVote('up')}
        className={cn(
          s.btn,
          'flex items-center justify-center rounded-md transition-colors',
          currentVote === 'up'
            ? 'bg-flame/15 text-flame'
            : 'text-text-dim hover:text-flame hover:bg-flame/5'
        )}
      >
        <ChevronUp className={s.icon} />
      </motion.button>

      {/* Score — heartbeat pulse on vote */}
      <AnimatePresence mode="wait">
        <motion.span
          key={score}
          initial={justVoted === 'up' ? { y: -4, opacity: 0 } : justVoted === 'down' ? { y: 4, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className={cn(
            s.text,
            'font-mono font-bold tabular-nums leading-none',
            currentVote === 'up' && 'text-flame',
            currentVote === 'down' && 'text-danger',
            !currentVote && 'text-text-muted'
          )}
        >
          {score > 999 ? `${(score / 1000).toFixed(1)}k` : score}
        </motion.span>
      </AnimatePresence>

      {/* Downvote */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => handleVote('down')}
        className={cn(
          s.btn,
          'flex items-center justify-center rounded-md transition-colors',
          currentVote === 'down'
            ? 'bg-danger/15 text-danger'
            : 'text-text-dim hover:text-danger hover:bg-danger/5'
        )}
      >
        <ChevronDown className={s.icon} />
      </motion.button>
    </div>
  )
}