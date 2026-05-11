import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, SlidersHorizontal, X } from 'lucide-react'
import { FeedCard } from '@/components/feed/FeedCard'
import { FeedSidebar } from '@/components/feed/FeedSidebar'
import { FilterDrawer } from '@/components/feed/FilterDrawer'
import { feedItems } from '@/lib/feed-data'
import { cn } from '@/lib/utils'
import type { FeedItem, VoteDirection } from '@/types'

export default function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>(feedItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('trending')
  const [selectedField, setSelectedField] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedDegree, setSelectedDegree] = useState('')
  const [selectedMethodology, setSelectedMethodology] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const hasActiveFilters = [selectedField, selectedType, selectedDegree, selectedMethodology].some(Boolean)

  const clearFilters = () => {
    setSelectedField('')
    setSelectedType('')
    setSelectedDegree('')
    setSelectedMethodology('')
  }

  const filteredItems = useMemo(() => {
    let result = [...items]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.paper.title.toLowerCase().includes(query) ||
          item.paper.abstract.toLowerCase().includes(query) ||
          item.paper.keywords.some((k) => k.toLowerCase().includes(query)) ||
          item.paper.authors.some((a) => a.name.toLowerCase().includes(query))
      )
    }

    if (selectedField) result = result.filter((item) => item.paper.research_field === selectedField)
    if (selectedType) result = result.filter((item) => item.paper.paper_type === selectedType)
    if (selectedDegree) result = result.filter((item) => item.paper.degree_level === selectedDegree)
    if (selectedMethodology) result = result.filter((item) => item.paper.methodology === selectedMethodology)

    switch (sortBy) {
      case 'trending':
        result.sort((a, b) => b.paper.vote_score - a.paper.vote_score)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.paper.published_at || b.paper.created_at).getTime() - new Date(a.paper.published_at || a.paper.created_at).getTime())
        break
      case 'most_upvoted':
        result.sort((a, b) => b.paper.vote_score - a.paper.vote_score)
        break
      case 'most_viewed':
        result.sort((a, b) => b.paper.view_count - a.paper.view_count)
        break
    }

    return result
  }, [items, searchQuery, sortBy, selectedField, selectedType, selectedDegree, selectedMethodology])

  function handleVote(paperId: string, direction: VoteDirection) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.paper.id !== paperId) return item
        const currentVote = item.user_vote
        let newScore = item.paper.vote_score
        if (currentVote === 'up') newScore -= 1
        if (currentVote === 'down') newScore += 1
        if (direction === 'up') newScore += 1
        if (direction === 'down') newScore -= 1
        return { ...item, user_vote: direction, paper: { ...item.paper, vote_score: newScore } }
      })
    )
  }

  function handleBookmark(paperId: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.paper.id !== paperId) return item
        const toggled = !item.is_bookmarked
        return {
          ...item,
          is_bookmarked: toggled,
          paper: { ...item.paper, bookmarks_count: toggled ? item.paper.bookmarks_count + 1 : item.paper.bookmarks_count - 1 },
        }
      })
    )
  }

  // Sidebar content — shared between desktop sidebar and mobile drawer
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-text-dim">
          {hasActiveFilters ? 'Filters active' : 'No filters'}
        </span>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-[10px] font-mono text-flame hover:text-flame-hover transition-colors">
            Clear all
          </button>
        )}
      </div>
      <FeedSidebar
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedField={selectedField}
        onFieldChange={setSelectedField}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedDegree={selectedDegree}
        onDegreeChange={setSelectedDegree}
        selectedMethodology={selectedMethodology}
        onMethodologyChange={setSelectedMethodology}
      />
    </>
  )

  return (
        <div className="min-h-screen">
      {/* === Top Bar === */}
      <header className="sticky top-0 z-40 bg-base/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-5">
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-flame/10 border border-flame/30 flex items-center justify-center">
              <span className="text-flame font-display font-bold text-sm">P</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-base text-text leading-none">Proyekto</h1>
              <p className="text-[8px] font-mono text-text-dim tracking-widest uppercase">Academic Research Library</p>
            </div>
          </a>

          <div className="flex-1 max-w-lg mx-3 sm:mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search papers, authors, keywords..."
                className="input-terminal pl-10 pr-4 py-2 text-xs sm:text-sm bg-surface border-border"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Filter toggle — drawer on mobile only, desktop sidebar is always visible */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={cn(
                'lg:hidden relative p-2.5 rounded-lg transition-colors',
                hasActiveFilters
                  ? 'bg-flame/15 text-flame border border-flame/30'
                  : 'text-text-dim hover:text-text hover:bg-surface-3 border border-transparent'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-flame border-2 border-base" />
              )}
            </button>

            <button className="btn-flame btn-flame-primary px-3 py-2 sm:px-4 text-xs sm:text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* === Layout: Desktop Sidebar + Feed === */}
      <div className="flex">

        {/* Desktop Sidebar — always visible on lg+ */}
        <aside className="hidden lg:flex lg:w-72 xl:w-80 flex-shrink-0 bg-surface/50 border-r border-border">
          <div className="w-full p-4 space-y-4 sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-flame" />
              <h3 className="font-display font-bold text-sm text-text">Filters</h3>
            </div>
            {sidebarContent}
          </div>
        </aside>

        {/* Mobile Drawer — only on screens below lg */}
        <FilterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {sidebarContent}
        </FilterDrawer>

        {/* === Feed === */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-3 sm:px-5 py-4 sm:py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-mono text-text-dim">
                  {filteredItems.length} {filteredItems.length === 1 ? 'paper' : 'papers'}
                </span>
              </div>
              {searchQuery && (
                <span className="text-xs font-mono text-flame">Results for &quot;{searchQuery}&quot;</span>
              )}
            </div>

            <div className="space-y-3">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <FeedCard
                    key={item.paper.id}
                    item={item}
                    index={index}
                    onVote={handleVote}
                    onBookmark={handleBookmark}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-glass p-8 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface-3 border border-border flex items-center justify-center">
                    <Search className="w-6 h-6 text-text-dim" />
                  </div>
                  <h3 className="font-display font-bold text-text mb-1">No papers found</h3>
                  <p className="text-sm text-text-dim font-mono">Try adjusting your search or filters</p>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}