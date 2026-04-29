'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Article, KeyTerm, CATEGORIES } from '@/types'
import { getCategoryColor } from '@/lib/utils'
import ArticleCard from '@/components/ui/ArticleCard'

interface ArticlesClientProps {
  articles: Article[]
  keyTerms: KeyTerm[]
}

const FILTERS = ['All', ...CATEGORIES]

export default function ArticlesClient({ articles, keyTerms }: ArticlesClientProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = articles.filter(a => {
    const matchesFilter = activeFilter === 'All' || a.category.includes(activeFilter)
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-[#0f1724]">
      {/* Page header */}
      <div className="bg-navy-700 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Articles & Analysis</h1>
          <p className="text-blue-200 opacity-70 text-sm">
            In-depth strategic analysis across geopolitics, defence, economy, and more.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + filters */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-line dark:border-gray-600 bg-white dark:bg-[#1a2535] text-navy-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-steel"
            />
          </div>
          {/* Horizontal scroll on mobile, wrap on desktop */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
            {FILTERS.map(filter => {
              const isActive = activeFilter === filter
              const color = filter === 'All' ? '#1a2a4a' : getCategoryColor(filter)
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap"
                  style={
                    isActive
                      ? { backgroundColor: color, color: 'white', borderColor: color }
                      : { backgroundColor: 'transparent', color: '#4a5a7a', borderColor: '#d1d8e0' }
                  }
                >
                  {filter}
                </button>
              )
            })}
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">{filtered.length} articles</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(article => (
            <ArticleCard key={article.id} article={article} keyTerms={keyTerms} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No matching articles</p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
