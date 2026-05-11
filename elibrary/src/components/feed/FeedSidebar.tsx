import { motion } from 'framer-motion'
import { TrendingUp, Clock, Award, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fieldOptions, degreeOptions } from '@/lib/data'
import { PAPER_TYPE_LABELS, METHODOLOGY_LABELS } from '@/types'

interface FeedSidebarProps {
  sortBy: string
  onSortChange: (sort: string) => void
  selectedField: string
  onFieldChange: (field: string) => void
  selectedType: string
  onTypeChange: (type: string) => void
  selectedDegree: string
  onDegreeChange: (degree: string) => void
  selectedMethodology: string
  onMethodologyChange: (methodology: string) => void
}

const sortOptions = [
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'newest', label: 'Newest', icon: Clock },
  { value: 'most_upvoted', label: 'Most Upvoted', icon: Award },
  { value: 'most_viewed', label: 'Most Viewed', icon: BookOpen },
]

const typeOptions = Object.entries(PAPER_TYPE_LABELS).map(([value, label]) => ({ value, label }))
const methodologyOptions = Object.entries(METHODOLOGY_LABELS).map(([value, label]) => ({ value, label }))

function FilterGroup({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="space-y-2.5"
    >
      <h4 className="text-[10px] font-mono font-medium text-text-dim uppercase tracking-widest">{title}</h4>
      {children}
    </motion.div>
  )
}

function SortButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-mono transition-all',
        active
          ? 'bg-flame/15 text-flame border border-flame/30'
          : 'text-text-dim hover:text-text-muted hover:bg-surface-3 border border-transparent'
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}

function CheckboxButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-mono transition-all w-full text-left',
        active ? 'bg-flame/15 text-flame' : 'text-text-dim hover:text-text-muted hover:bg-surface-3'
      )}
    >
      <div
        className={cn(
          'w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors',
          active ? 'bg-flame border-flame' : 'border-border'
        )}
      >
        {active && <div className="w-1.5 h-1.5 rounded-sm bg-base" />}
      </div>
      {label}
    </button>
  )
}

export function FeedSidebar({
  sortBy,
  onSortChange,
  selectedField,
  onFieldChange,
  selectedType,
  onTypeChange,
  selectedDegree,
  onDegreeChange,
  selectedMethodology,
  onMethodologyChange,
}: FeedSidebarProps) {
  return (
    <>
      <FilterGroup title="Sort By" delay={0.05}>
        <div className="grid grid-cols-2 gap-1.5">
          {sortOptions.map((option) => (
            <SortButton
              key={option.value}
              active={sortBy === option.value}
              onClick={() => onSortChange(option.value)}
              icon={option.icon}
              label={option.label}
            />
          ))}
        </div>
      </FilterGroup>

      <div className="border-t border-border" />

      <FilterGroup title="Research Field" delay={0.1}>
        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {fieldOptions.map((option) => (
            <CheckboxButton
              key={option.value}
              active={selectedField === option.value}
              onClick={() => onFieldChange(selectedField === option.value ? '' : option.value)}
              label={option.label}
            />
          ))}
        </div>
      </FilterGroup>

      <div className="border-t border-border" />

      <FilterGroup title="Paper Type" delay={0.15}>
        <div className="space-y-0.5 max-h-36 overflow-y-auto">
          {typeOptions.map((option) => (
            <CheckboxButton
              key={option.value}
              active={selectedType === option.value}
              onClick={() => onTypeChange(selectedType === option.value ? '' : option.value)}
              label={option.label}
            />
          ))}
        </div>
      </FilterGroup>

      <div className="border-t border-border" />

      <FilterGroup title="Degree Level" delay={0.2}>
        <div className="space-y-0.5">
          {degreeOptions.map((option) => (
            <CheckboxButton
              key={option.value}
              active={selectedDegree === option.value}
              onClick={() => onDegreeChange(selectedDegree === option.value ? '' : option.value)}
              label={option.label}
            />
          ))}
        </div>
      </FilterGroup>

      <div className="border-t border-border" />

      <FilterGroup title="Methodology" delay={0.25}>
        <div className="space-y-0.5 max-h-36 overflow-y-auto">
          {methodologyOptions.map((option) => (
            <CheckboxButton
              key={option.value}
              active={selectedMethodology === option.value}
              onClick={() => onMethodologyChange(selectedMethodology === option.value ? '' : option.value)}
              label={option.label}
            />
          ))}
        </div>
      </FilterGroup>
    </>
  )
}