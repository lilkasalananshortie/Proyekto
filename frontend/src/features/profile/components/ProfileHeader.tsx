import { motion } from 'framer-motion'
import { MapPin, Calendar, Shield, ShieldCheck, GraduationCap, Award, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { formatNumber } from '@/lib/format'
import { profileService } from '../services/profile.service'
import { DEGREE_LEVEL_LABELS } from '@/types'
import type { UserProfile } from '@/types'

interface ProfileHeaderProps {
  profile: UserProfile
  isOwnProfile: boolean
  onEdit: () => void
  onFollow: () => void
  onUnfollow: () => void
  isFollowPending: boolean
  isUnfollowPending: boolean
  className?: string
}

/**
 * ProfileHeader — avatar, name, username, bio, institution, badges,
 * and the action row (Edit Profile / Follow / Unfollow).
 */
export function ProfileHeader({
  profile,
  isOwnProfile,
  onEdit,
  onFollow,
  onUnfollow,
  isFollowPending,
  isUnfollowPending,
  className,
}: ProfileHeaderProps) {
  const institutionName = profileService.getInstitutionName(profile.institution_id)
  const fullName = `${profile.first_name} ${profile.last_name}`.trim()
  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('card-glass p-5 sm:p-6', className)}
    >
      {/* Top row: avatar + name + actions */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <Avatar name={fullName} src={profile.avatar_url} size="lg" className="w-20 h-20 sm:w-24 sm:h-24 text-2xl" />
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <h1 className="font-display font-bold text-xl sm:text-2xl text-text leading-tight">
              {fullName}
            </h1>
            {profile.is_verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-success/10 text-success border border-success/30 self-center">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
            {profile.is_verified_student && !profile.is_verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-info/10 text-info border border-info/30 self-center">
                <Shield className="w-3 h-3" />
                Student
              </span>
            )}
          </div>

          <p className="text-sm font-mono text-text-dim mt-0.5">@{profile.username}</p>

          {/* Institution + degree */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-2 text-[11px] font-mono text-text-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {institutionName}
            </span>
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              {DEGREE_LEVEL_LABELS[profile.degree_level]}
            </span>
          </div>

          {/* Reputation */}
          <div className="flex items-center justify-center sm:justify-start gap-1 mt-2 text-xs font-mono">
            <Award className="w-3.5 h-3.5 text-flame" />
            <span className="text-text font-bold">{formatNumber(profile.reputation)}</span>
            <span className="text-text-dim">reputation</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex justify-center sm:justify-end">
          {isOwnProfile ? (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </Button>
          ) : profile.is_followed_by_current_user ? (
            <Button
              variant="subtle"
              size="sm"
              onClick={onUnfollow}
              loading={isUnfollowPending}
            >
              Following
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onFollow}
              loading={isFollowPending}
            >
              Follow
            </Button>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="mt-4 text-sm text-text-muted font-body leading-relaxed text-center sm:text-left">
          {profile.bio}
        </p>
      )}

      {/* Joined date */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-mono text-text-dim">
        <Calendar className="w-3 h-3" />
        Joined {joinedDate}
        <span className="mx-1.5">·</span>
        <Link to="/feed" className="hover:text-flame transition-colors">
          {formatNumber(profile.papers_count)} papers
        </Link>
        <span className="mx-1.5">·</span>
        <span>{formatNumber(profile.followers_count)} followers</span>
      </div>
    </motion.header>
  )
}
