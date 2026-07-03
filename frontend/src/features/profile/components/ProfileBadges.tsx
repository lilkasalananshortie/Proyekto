import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { timeAgo } from '@/lib/format'
import type { Badge } from '@/types'

interface ProfileBadgesProps {
  badges: Badge[]
  className?: string
}

// Map badge.icon (string from backend) -> emoji-like lucide icon substitute.
// We use Award for all since lucide doesn't have a 1:1 mapping per badge type.
// When the backend returns actual icon URLs/SVGs, swap this out.

/**
 * ProfileBadges — horizontal scroll of earned badges with descriptions.
 */
export function ProfileBadges({ badges, className }: ProfileBadgesProps) {
  if (badges.length === 0) return null

  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-flame" />
        <h2 className="font-display font-bold text-sm text-text uppercase tracking-wider">
          Badges
        </h2>
        <span className="text-xs font-mono text-text-dim">
          {badges.length} earned
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            className="flex-shrink-0 w-44 card-glass p-3 hover:border-flame/30 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-flame/10 border border-flame/30 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-flame" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-xs text-text leading-tight">
                  {badge.name}
                </h3>
                <p className="text-[10px] font-mono text-text-dim mt-0.5 leading-snug line-clamp-2">
                  {badge.description}
                </p>
                <p className="text-[9px] font-mono text-text-dim/70 mt-1">
                  {timeAgo(badge.earned_at)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
