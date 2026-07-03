import { cn } from '@/lib/utils'

type TabValue = 'papers' | 'about'

interface ProfileTabsProps {
  active: TabValue
  onChange: (value: TabValue) => void
  papersCount: number
  className?: string
}

const tabs: { value: TabValue; label: string }[] = [
  { value: 'papers', label: 'Papers' },
  { value: 'about', label: 'About' },
]

/**
 * ProfileTabs — switch between Papers and About views on the profile page.
 * Kept simple; extend with 'bookmarks' / 'activity' tabs as those features land.
 */
export function ProfileTabs({ active, onChange, papersCount, className }: ProfileTabsProps) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-border', className)}>
      {tabs.map((tab) => {
        const isActive = active === tab.value
        const label =
          tab.value === 'papers' ? `${tab.label} (${papersCount})` : tab.label
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative px-4 py-2.5 text-xs font-mono font-medium transition-colors',
              isActive
                ? 'text-flame'
                : 'text-text-dim hover:text-text-muted'
            )}
          >
            {label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flame" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export type { TabValue }
