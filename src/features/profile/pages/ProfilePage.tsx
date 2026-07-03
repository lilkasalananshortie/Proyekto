import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, AlertCircle, Mail, Shield, GraduationCap } from 'lucide-react'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileStats } from '../components/ProfileStats'
import { ProfileBadges } from '../components/ProfileBadges'
import { ProfileTabs, type TabValue } from '../components/ProfileTabs'
import { ProfilePaperList } from '../components/ProfilePaperCard'
import { EditProfileModal } from '../modals/EditProfileModal'
import {
  useProfile,
  useProfilePapers,
  useUpdateProfile,
  useFollow,
  useUnfollow,
} from '../hooks/useProfile'
import { profileService } from '../services/profile.service'
import { DEGREE_LEVEL_LABELS } from '@/types'
import type { UpdateProfilePayload } from '@/types'

/**
 * ProfilePage — the /user/:id route.
 *
 * Purely a coordinator: reads :id from URL, wires up the profile + papers
 * hooks, manages the edit modal open/close state, and composes the
 * ProfileHeader / ProfileStats / ProfileBadges / ProfileTabs components.
 */
export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const userId = id ?? ''

  const profileQuery = useProfile(userId)
  const papersQuery = useProfilePapers(userId)
  const updateMutation = useUpdateProfile(userId)
  const followMutation = useFollow(userId)
  const unfollowMutation = useUnfollow(userId)

  const [activeTab, setActiveTab] = useState<TabValue>('papers')
  const [editOpen, setEditOpen] = useState(false)

  // ----- Loading / Error / Empty states -----
  if (profileQuery.isLoading) {
    return <LoadingState label="Loading profile..." className="min-h-[60vh]" />
  }

  if (profileQuery.isError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ErrorState
          title="Could not load profile"
          message={
            profileQuery.error instanceof Error
              ? profileQuery.error.message
              : 'This user may not exist or may have been removed.'
          }
          onRetry={() => profileQuery.refetch()}
        />
      </div>
    )
  }

  if (!profileQuery.data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <EmptyState
          icon={<AlertCircle className="w-6 h-6 text-text-dim" />}
          title="User not found"
          description="This profile may have been removed or never existed."
          action={
            <Link to="/feed">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to feed
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const profile = profileQuery.data
  const isOwnProfile = false // TODO: compare with current authenticated user id from useAuthStore

  // ----- Handlers -----
  async function handleUpdate(payload: UpdateProfilePayload) {
    await updateMutation.mutateAsync(payload)
  }

  function handleFollow() {
    followMutation.mutate()
  }

  function handleUnfollow() {
    unfollowMutation.mutate()
  }

  // ----- Render -----
  return (
    <div className="min-h-screen">
      {/* Top bar — matches detail page header style */}
      <header className="sticky top-0 z-30 bg-base/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-5">
          <Link
            to="/feed"
            className="flex items-center gap-2 text-xs font-mono text-text-dim hover:text-flame transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to feed</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-flame/10 border border-flame/30 flex items-center justify-center">
              <span className="text-flame font-display font-bold text-sm">P</span>
            </div>
            <span className="hidden sm:block font-display font-bold text-sm text-text">Proyekto</span>
          </div>

          <Link
            to="/feed"
            className="p-2 text-text-dim hover:text-text hover:bg-surface-3 rounded-md transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-4xl mx-auto px-3 sm:px-5 py-4 sm:py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileHeader
            profile={profile}
            isOwnProfile={isOwnProfile}
            onEdit={() => setEditOpen(true)}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            isFollowPending={followMutation.isPending}
            isUnfollowPending={unfollowMutation.isPending}
          />
        </motion.div>

        <ProfileStats profile={profile} />

        <ProfileBadges badges={profile.badges} />

        <ProfileTabs
          active={activeTab}
          onChange={setActiveTab}
          papersCount={profile.papers_count}
        />

        {/* Tab content */}
        {activeTab === 'papers' ? (
          <ProfilePaperList
            items={papersQuery.data ?? []}
            isLoading={papersQuery.isLoading}
            isError={papersQuery.isError}
            onRetry={() => papersQuery.refetch()}
            emptyTitle={isOwnProfile ? "You haven't published any papers" : 'No papers yet'}
            emptyDescription={
              isOwnProfile
                ? 'Upload your first thesis or capstone to share with the community.'
                : 'This user has not published any papers yet.'
            }
          />
        ) : (
          <AboutSection profile={profile} />
        )}
      </main>

      {/* === Modals === */}
      {isOwnProfile && (
        <EditProfileModal
          open={editOpen}
          onOpenChange={setEditOpen}
          profile={profile}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  )
}

// ----- About tab content (kept inline since it's small) -----

function AboutSection({ profile }: { profile: NonNullable<ReturnType<typeof useProfile>['data']> }) {
  const institutionName = profileService.getInstitutionName(profile.institution_id)
  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-4">
      <section className="card-glass p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-flame" />
          <h2 className="font-display font-bold text-sm text-text uppercase tracking-wider">
            About
          </h2>
        </div>

        {profile.bio && (
          <p className="text-sm text-text-muted font-body leading-relaxed">
            {profile.bio}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
          <InfoRow icon={<GraduationCap className="w-3.5 h-3.5" />} label="Degree" value={DEGREE_LEVEL_LABELS[profile.degree_level]} />
          <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Institution" value={institutionName} />
          <InfoRow icon={<Shield className="w-3.5 h-3.5" />} label="Role" value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} />
          <InfoRow icon={<AlertCircle className="w-3.5 h-3.5" />} label="Joined" value={joinedDate} />
        </div>
      </section>

      <section className="card-glass p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-flame" />
          <h2 className="font-display font-bold text-sm text-text uppercase tracking-wider">
            Reputation & Impact
          </h2>
        </div>
        <p className="text-xs font-mono text-text-dim leading-relaxed">
          {profile.first_name} has earned{' '}
          <span className="text-flame font-bold">{profile.reputation}</span> reputation points
          through {profile.papers_count} published{' '}
          {profile.papers_count === 1 ? 'paper' : 'papers'}, accumulating{' '}
          <span className="text-flame font-bold">{profile.total_views.toLocaleString()}</span> views
          and <span className="text-flame font-bold">{profile.total_downloads.toLocaleString()}</span>{' '}
          downloads across all publications.
        </p>
      </section>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="text-text-dim mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider">{label}</span>
        <span className="text-xs font-mono text-text truncate">{value}</span>
      </div>
    </div>
  )
}
