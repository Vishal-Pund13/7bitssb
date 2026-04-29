'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, FileText, Globe, ChevronRight, BarChart3, Tag } from 'lucide-react'
import { Article, KeyTerm, CATEGORIES } from '@/types'
import { getCategoryColor, formatDate } from '@/lib/utils'
import ArticleCard from '@/components/ui/ArticleCard'

interface HomeClientProps {
  articles: Article[]
  keyTerms: KeyTerm[]
  topicCounts: Record<string, number>
  totalGDTopics?: number
}

const FILTERS = ['All', ...CATEGORIES]

export default function HomeClient({
  articles,
  keyTerms,
  topicCounts,
}: HomeClientProps) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? articles
      : articles.filter(a => a.category.includes(activeFilter))

  const recentArticles = articles.slice(0, 5)
  const totalTerms = keyTerms.length
  const totalTopics = Object.keys(topicCounts).length

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-navy-700 overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-DEFAULT to-transparent opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-0.5 bg-gold-DEFAULT" />
              <span className="text-gold-DEFAULT text-xs font-semibold uppercase tracking-widest">
                Research Journal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 font-sans">
              Strategic Analysis<br />
              <span className="text-blue-200 font-serif font-normal italic">for the Thinking Officer</span>
            </h1>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 opacity-85">
              Curated defence, geopolitics, and strategic affairs analysis — built for SSB aspirants
              who want depth over headlines.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/articles"
                className="flex items-center gap-2 px-5 py-2.5 bg-gold-DEFAULT text-white rounded-lg text-sm font-semibold hover:bg-gold-muted transition-colors shadow-lg"
              >
                <FileText size={16} />
                Browse All Articles
              </Link>
              <Link
                href="/glossary"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                <BookOpen size={16} />
                Key Terms Glossary
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-navy-800 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { icon: <FileText size={16} />, value: articles.length, label: 'Articles' },
              { icon: <Tag size={16} />, value: totalTerms, label: 'Key Terms' },
              { icon: <Globe size={16} />, value: totalTopics, label: 'Topics' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
                <div className="text-gold-DEFAULT opacity-70 hidden xs:block sm:block">{stat.icon}</div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white leading-none">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-blue-200 opacity-60 leading-tight mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0">

            {/* Topics with counts */}
            <div className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card p-4">
              <h3 className="font-semibold text-navy-700 dark:text-white text-sm mb-3 flex items-center gap-2">
                <BarChart3 size={14} />
                Topics
              </h3>
              <ul className="space-y-2">
                {CATEGORIES.map(cat => {
                  const count = topicCounts[cat] || 0
                  const color = getCategoryColor(cat)
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => setActiveFilter(cat)}
                        className="w-full flex items-center justify-between text-sm hover:text-navy-700 dark:hover:text-white transition-colors group"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-gray-600 dark:text-gray-300 group-hover:text-navy-700 dark:group-hover:text-white">
                            {cat}
                          </span>
                        </span>
                        <span className="text-xs text-gray-400 font-mono">{count}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card p-4">
              <h3 className="font-semibold text-navy-700 dark:text-white text-sm mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { href: '/glossary', label: 'Terms Glossary', icon: <BookOpen size={14} /> },
                  { href: '/gd-bank', label: 'GD Topic Bank', icon: <FileText size={14} /> },
                  { href: '/articles?filter=India+Focus', label: 'India Angle', icon: <Globe size={14} /> },
                ].map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-steel transition-colors group"
                    >
                      <span className="text-steel opacity-70 group-hover:opacity-100">{link.icon}</span>
                      {link.label}
                      <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent articles */}
            <div className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card p-4">
              <h3 className="font-semibold text-navy-700 dark:text-white text-sm mb-3">Recent</h3>
              <ul className="space-y-3">
                {recentArticles.map(article => (
                  <li key={article.id}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="block text-xs text-gray-600 dark:text-gray-300 hover:text-navy-700 dark:hover:text-white transition-colors leading-snug"
                    >
                      <p className="font-medium line-clamp-2 mb-1">{article.title}</p>
                      <p className="text-gray-400 text-[11px]">{formatDate(article.created_at)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── MAIN FEED ── */}
          <div className="flex-1 min-w-0">

            {/* Filter chips — horizontal scroll on mobile, wrap on desktop */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
              {FILTERS.map(filter => {
                const isActive = activeFilter === filter
                const color = filter === 'All' ? '#1a2a4a' : getCategoryColor(filter)
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap"
                    style={
                      isActive
                        ? { backgroundColor: color, color: 'white', borderColor: color }
                        : {
                            backgroundColor: 'transparent',
                            color: '#4a5a7a',
                            borderColor: '#d1d8e0',
                          }
                    }
                  >
                    {filter}
                    {filter !== 'All' && topicCounts[filter] !== undefined && (
                      <span className="ml-1 opacity-60 text-xs">({topicCounts[filter]})</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Results count */}
            <p className="text-xs text-gray-400 mb-4">
              {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
              {activeFilter !== 'All' && ` in ${activeFilter}`}
            </p>

            {/* Article grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No articles yet in this category</p>
                <p className="text-sm mt-1">Check back soon — analysis is being added regularly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map(article => (
                  <ArticleCard key={article.id} article={article} keyTerms={keyTerms} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
