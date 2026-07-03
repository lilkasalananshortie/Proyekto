import { Link } from 'react-router-dom'
import { Clock, FileText } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { timeAgo } from '@/lib/format'
import { thesisService } from '../services/thesis.service'
import type { Paper } from '@/types'

interface AuthorRowProps {
  paper: Paper
  size?: 'sm' | 'md' | 'lg'
  showTimestamp?: boolean
}

/**
 * AuthorRow — renders the primary author (avatar + name + institution + year)
 * as a link to the author's profile. Extracted from FeedCard's inline JSX
 * so it can be reused on the detail page and comment section.
 */
export function AuthorRow({ paper, size = 'md', showTimestamp = true }: AuthorRowProps) {
  const primaryAuthor = paper.authors.find((a) => a.is_primary) ?? paper.authors[0]
  if (!primaryAuthor) return null

  const institutionName = thesisService.getInstitutionName(paper.institution_id)

  return (
    <Link
      to={`/user/${primaryAuthor.user_id}`}
      className="flex items-center gap-2.5 group/author min-w-0"
    >
      <Avatar name={primaryAuthor.name} src={primaryAuthor.avatar_url} size={size} />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-mono font-medium text-text group-hover/author:text-flame transition-colors truncate">
          {primaryAuthor.name}
        </span>
        <span className="text-[11px] font-mono text-text-dim truncate">
          {institutionName} · {paper.year}
        </span>
      </div>
      {showTimestamp && (
        <span className="flex items-center gap-1 text-[10px] font-mono text-text-dim flex-shrink-0">
          <Clock className="w-3 h-3" />
          {timeAgo(paper.published_at ?? paper.created_at)}
        </span>
      )}
    </Link>
  )
}

/**
 * CoAuthorList — secondary authors (non-primary), rendered as inline links
 * below the primary author on the detail page.
 */
export function CoAuthorList({ paper }: { paper: Paper }) {
  const coAuthors = paper.authors.filter((a) => !a.is_primary)
  if (coAuthors.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-text-dim">
      <span className="inline-flex items-center gap-1">
        <FileText className="w-3 h-3" />
        Co-authors:
      </span>
      {coAuthors.map((author, i) => (
        <span key={author.user_id} className="inline-flex items-center gap-1">
          <Link
            to={`/user/${author.user_id}`}
            className="text-text-muted hover:text-flame transition-colors"
          >
            {author.name}
          </Link>
          {i < coAuthors.length - 1 && <span className="text-border">,</span>}
        </span>
      ))}
    </div>
  )
}
