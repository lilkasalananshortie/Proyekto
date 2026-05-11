import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-base bg-grid flex items-center justify-center px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-5xl flex flex-col lg:flex-row rounded-xl overflow-hidden card-glass"
      >
        {/* Left decorative panel — hidden on mobile, visible on large screens */}
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-8 bg-gradient-to-br from-surface via-surface-2 to-surface border-r border-border relative overflow-hidden">
          {/* Scan line decoration */}
          <div className="absolute inset-0 scan-line pointer-events-none" />

          {/* Branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-flame/10 border border-flame/30 flex items-center justify-center">
                <span className="text-flame font-display font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-text tracking-tight">
                  Proyekto
                </h1>
                <p className="text-[10px] text-text-dim font-mono tracking-widest uppercase">
                  Academic Research Library
                </p>
              </div>
            </div>
            <p className="text-sm text-text-muted mt-4 leading-relaxed font-body max-w-xs">
              The Philippine academic research hub. Upload, discover, and collaborate
              on theses, capstones, and research across all disciplines.
            </p>
          </div>

          {/* Terminal-style stats */}
          <div className="relative z-10 space-y-3 mt-8">
            <div className="text-xs font-mono text-text-dim">
              <span className="text-flame">&gt;</span> system.status
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Research Papers', value: '12,480+' },
                { label: 'Institutions', value: '340+' },
                { label: 'Researchers', value: '8,200+' },
                { label: 'Disciplines', value: '16' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-base/50 rounded-lg p-3 border border-border"
                >
                  <div className="text-flame font-display font-bold text-lg leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-text-dim font-mono mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Version tag */}
          <div className="relative z-10 mt-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-mono text-text-dim">
              v0.1.0-beta &middot; Philippine Universities
            </span>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full lg:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          {/* Mobile-only branding */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-flame/10 border border-flame/30 flex items-center justify-center">
              <span className="text-flame font-display font-bold text-base">E</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-text tracking-tight">
                Proyekto
              </h1>
              <p className="text-[9px] text-text-dim font-mono tracking-widest uppercase">
                Academic Research Library
              </p>
            </div>
          </div>

          {children}
        </div>
      </motion.div>
    </div>
  )
}