import { useState } from 'react'
import { Link as LinkIcon, Check, Mail, Send, Share2, Briefcase } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paperId: string
  paperTitle: string
}

/**
 * ShareModal — copy-link + social share buttons.
 * Purely presentational; the URL is constructed from window.location
 * so it works regardless of the deployment domain.
 *
 * Note: lucide-react v1 removed brand icons (Twitter, Facebook, Linkedin)
 * due to trademark concerns, so we use generic icons + text labels.
 */
export function ShareModal({ open, onOpenChange, paperId, paperTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/paper/${paperId}`
  const shareText = `Check out "${paperTitle}" on Proyekto`

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may be unavailable in insecure contexts; fallback below.
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function openShareWindow(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500')
  }

  const socialButtons = [
    {
      label: 'X',
      icon: Send,
      onClick: () =>
        openShareWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        ),
    },
    {
      label: 'Facebook',
      icon: Share2,
      onClick: () =>
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        ),
    },
    {
      label: 'LinkedIn',
      icon: Briefcase,
      onClick: () =>
        openShareWindow(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        ),
    },
    {
      label: 'Email',
      icon: Mail,
      onClick: () =>
        (window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`),
    },
  ]

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Share paper"
      description="Spread the knowledge — share this thesis with your network."
      size="sm"
    >
      <div className="space-y-5">
        {/* Copy link */}
        <div className="space-y-2">
          <label className="block text-[10px] font-mono text-text-dim uppercase tracking-wider">
            Paper link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-border min-w-0">
              <LinkIcon className="w-3.5 h-3.5 text-text-dim flex-shrink-0" />
              <span className="text-xs font-mono text-text-muted truncate">{shareUrl}</span>
            </div>
            <Button variant={copied ? 'subtle' : 'primary'} size="sm" onClick={handleCopyLink}>
              {copied ? <Check className="w-3.5 h-3.5" /> : null}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Social share */}
        <div className="space-y-2">
          <label className="block text-[10px] font-mono text-text-dim uppercase tracking-wider">
            Share via
          </label>
          <div className="grid grid-cols-4 gap-2">
            {socialButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                className="flex flex-col items-center gap-1.5 p-3 rounded-md bg-surface-2 border border-border hover:border-flame/30 hover:bg-flame/5 transition-colors"
              >
                <btn.icon className="w-4 h-4 text-text-muted" />
                <span className="text-[10px] font-mono text-text-dim">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
