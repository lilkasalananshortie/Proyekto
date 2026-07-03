import { Building2, Calendar, GraduationCap, FlaskConical, Scale, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/format'
import { thesisService } from '../services/thesis.service'
import {
  RESEARCH_FIELD_LABELS,
  PAPER_TYPE_LABELS,
  METHODOLOGY_LABELS,
  LICENSE_LABELS,
  DEGREE_LEVEL_LABELS,
} from '@/types'
import type { Paper } from '@/types'

interface PaperMetaProps {
  paper: Paper
  className?: string
}

interface MetaRowProps {
  icon: React.ReactNode
  label: string
  value: string
}

function MetaRow({ icon, label, value }: MetaRowProps) {
  return (
    <div className="flex items-start gap-2.5 py-2 px-3 rounded-md hover:bg-surface-2/60 transition-colors">
      <div className="text-text-dim mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono text-text-dim uppercase tracking-wider">
          {label}
        </div>
        <div className="text-xs font-mono text-text truncate">{value}</div>
      </div>
    </div>
  )
}

/**
 * PaperMeta — structured metadata grid for the detail page.
 * Renders institution, department, year, degree level, paper type,
 * research field, methodology, license, page count, and file size.
 */
export function PaperMeta({ paper, className }: PaperMetaProps) {
  const institutionName = thesisService.getInstitutionName(paper.institution_id)

  return (
    <div className={cn('card-glass p-3 space-y-0.5', className)}>
      <MetaRow
        icon={<Building2 className="w-3.5 h-3.5" />}
        label="Institution"
        value={institutionName}
      />
      <MetaRow
        icon={<GraduationCap className="w-3.5 h-3.5" />}
        label="Degree Level"
        value={DEGREE_LEVEL_LABELS[paper.degree_level]}
      />
      <MetaRow
        icon={<FileText className="w-3.5 h-3.5" />}
        label="Paper Type"
        value={PAPER_TYPE_LABELS[paper.paper_type]}
      />
      <MetaRow
        icon={<FlaskConical className="w-3.5 h-3.5" />}
        label="Research Field"
        value={RESEARCH_FIELD_LABELS[paper.research_field]}
      />
      <MetaRow
        icon={<FlaskConical className="w-3.5 h-3.5" />}
        label="Methodology"
        value={METHODOLOGY_LABELS[paper.methodology]}
      />
      <MetaRow
        icon={<Calendar className="w-3.5 h-3.5" />}
        label="Published"
        value={String(paper.year)}
      />
      <MetaRow
        icon={<Scale className="w-3.5 h-3.5" />}
        label="License"
        value={LICENSE_LABELS[paper.license]}
      />
      <MetaRow
        icon={<FileText className="w-3.5 h-3.5" />}
        label="File"
        value={`${paper.page_count} pages · ${formatFileSize(paper.file_size)}`}
      />
    </div>
  )
}
