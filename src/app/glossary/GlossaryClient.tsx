'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { KeyTerm, Article, CATEGORIES } from '@/types'
import { getCategoryColor, hexToRgba } from '@/lib/utils'

interface GlossaryClientProps {
  keyTerms: KeyTerm[]
  articles: Pick<Article, 'id' | 'title' | 'slug'>[]
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function GlossaryClient({ keyTerms, articles }: GlossaryClientProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLetter, setActiveLetter] = useState('')

  const filtered = useMemo(() => {
    return keyTerms.filter(t => {
      const matchSearch =
        !search ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'All' || t.category === activeCategory
      const matchLetter = !activeLetter || t.term.toUpperCase().startsWith(activeLetter)
      return matchSearch && matchCat && matchLetter
    })
  }, [keyTerms, search, activeCategory, activeLetter])

  const grouped = useMemo(() => {
    const groups: Record<string, KeyTerm[]> = {}
    filtered.forEach(t => {
      const letter = t.term[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(t)
    })
    return groups
  }, [filtered])

  const presentLetters = new Set(Object.keys(grouped))
  const articleMap = new Map(articles.map(a => [a.id, a]))

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-[#0f1724]">
      {/* Header */}
      <div className="bg-navy-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Key Terms Glossary</h1>
          <p className="text-blue-200 opacity-70 text-sm">
            {keyTerms.length} terms across defence, geopolitics, economy, and strategic affairs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search terms..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-line dark:border-gray-600 bg-white dark:bg-[#1a2535] text-navy-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-steel"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map(cat => {
              const isActive = activeCategory === cat
              const color = cat === 'All' ? '#1a2a4a' : getCategoryColor(cat)
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                  style={
                    isActive
                      ? { backgroundColor: color, color: 'white', borderColor: color }
                      : { backgroundColor: 'transparent', color: '#4a5a7a', borderColor: '#d1d8e0' }
                  }
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Alphabet index */}
        <div className="flex flex-wrap gap-1 mb-6">
          <button
            onClick={() => setActiveLetter('')}
            className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors ${
              !activeLetter
                ? 'bg-navy-700 text-white'
                : 'text-gray-400 hover:text-navy-700 dark:hover:text-white'
            }`}
          >
            ALL
          </button>
          {ALPHABET.map(letter => (
            <button
              key={letter}
              onClick={() => setActiveLetter(letter === activeLetter ? '' : letter)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-mono font-bold transition-colors ${
                presentLetters.has(letter)
                  ? activeLetter === letter
                    ? 'bg-navy-700 text-white'
                    : 'text-navy-700 dark:text-blue-200 hover:bg-navy-700/10'
                  : 'text-gray-300 dark:text-gray-600 cursor-default'
              }`}
              disabled={!presentLetters.has(letter)}
            >
              {letter}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 mb-6">{filtered.length} terms</p>

        {/* Grouped terms */}
        {Object.keys(grouped)
          .sort()
          .map(letter => (
            <div key={letter} id={`letter-${letter}`} className="mb-8">
              <h2 className="text-2xl font-bold text-navy-700 dark:text-white mb-4 font-serif border-b border-paper-line dark:border-gray-700 pb-2">
                {letter}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {grouped[letter].map(term => {
                  const color = getCategoryColor(term.category || 'Default')
                  const relatedArticles = (term.article_ids || [])
                    .map(id => articleMap.get(id))
                    .filter(Boolean)

                  return (
                    <div
                      key={term.id}
                      className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl p-4 shadow-card border-l-4"
                      style={{ borderLeftColor: color }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-navy-700 dark:text-white text-sm">{term.term}</h3>
                        {term.category && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full shrink-0"
                            style={{
                              color,
                              backgroundColor: hexToRgba(color, 0.1),
                            }}
                          >
                            {term.category}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-3">
                        {term.definition}
                      </p>
                      {relatedArticles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-gray-400">In:</span>
                          {relatedArticles.map(article => (
                            <Link
                              key={article!.id}
                              href={`/articles/${article!.slug}`}
                              className="text-xs text-steel hover:underline"
                            >
                              {article!.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No matching terms</p>
            <p className="text-sm mt-1">Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
