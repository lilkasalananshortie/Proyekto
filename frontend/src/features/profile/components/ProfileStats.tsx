import { motion } from 'framer-motion'
import { Eye, Download, ThumbsUp, FileText, Bookmark, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/format'
import type { UserProfile } from '@/types'

interface ProfileStatsProps {
  profile: UserProfile
  className?: string
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  delay: number
}

function StatCard({ icon, label, value, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="card-glass p-3 sm:p-4 flex flex-col items-center text-center"
    >
      <div className="text-flame mb-1.5">{icon}</div>
      <div className="text-lg sm:text-xl font-display font-bold text-text tabular-nums leading-none">
        {formatNumber(value)}
      </div>
      <div className="text-[9px] sm:text-[10px] font-mono text-text-dim uppercase tracking-wider mt-1">
        {label}
      </div>
    </motion.div>
  )
}

/**
 * ProfileStats — grid of engagement metrics for the user's full body of work.
 */
export function ProfileStats({ profile, className }: ProfileStatsProps) {
  const stats: StatCardProps[] = [
    { icon: <FileText className="w-4 h-4" />, label: 'Papers', value: profile.papers_count, delay: 0.05 },
    { icon: <ThumbsUp className="w-4 h-4" />, label: 'Upvotes', value: profile.total_upvotes, delay: 0.1 },
    { icon: <Eye className="w-4 h-4" />, label: 'Views', value: profile.total_views, delay: 0.15 },
    { icon: <Download className="w-4 h-4" />, label: 'Downloads', value: profile.total_downloads, delay: 0.2 },
    { icon: <Bookmark className="w-4 h-4" />, label: 'Bookmarks', value: profile.bookmarks_count, delay: 0.25 },
    { icon: <Users className="w-4 h-4" />, label: 'Followers', value: profile.followers_count, delay: 0.3 },
  ]

  return (
    <div className={cn('grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3', className)}>
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
