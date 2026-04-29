'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { GDTopic, Article } from '@/types'

interface GDBankClientProps {
  topics: GDTopic[]
  articles: Pick<Article, 'id' | 'title' | 'slug'>[]
}

const DIFFICULTY_STYLES = {
  Easy: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-700',
  },
  Medium: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-700',
  },
  Hard: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-700',
  },
}

function GDTopicCard({ topic, articles }: { topic: GDTopic; articles: Pick<Article, 'id' | 'title' | 'slug'>[] }) {
  const [expanded, setExpanded] = useState(false)
  const difficulty = topic.difficulty as 'Easy' | 'Medium' | 'Hard'
  const styles = DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.Medium
  const articleMap = new Map(articles.map(a => [a.id, a]))
  const relatedArticles = (topic.related_article_ids || []).map(id => articleMap.get(id)).filter(Boolean)

  return (
    <div className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-3 hover:bg-paper-dark dark:hover:bg-[#1e2b40] transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles.bg} ${styles.text} ${styles.border}`}
            >
              {difficulty}
            </span>
            {relatedArticles.length > 0 && (
              <span className="text-xs text-gray-400">{relatedArticles.length} source{relatedArticles.length > 1 ? 's' : ''}</span>
            )}
          </div>
          <h3 className="font-semibold text-navy-700 dark:text-white text-base leading-snug">
            {topic.title}
          </h3>
        </div>
        <div className="text-gray-400 mt-1 shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-paper-line dark:border-gray-700">
          {/* Suggested points */}
          {topic.suggested_points && topic.suggested_points.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Suggested Points to Cover
              </h4>
              <ul className="space-y-2">
                {topic.suggested_points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-navy-700/10 dark:bg-white/10 text-navy-700 dark:text-white text-xs flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-4 pt-3 border-t border-paper-line dark:border-gray-700">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Read for Background
              </h4>
              <div className="flex flex-wrap gap-2">
                {relatedArticles.map(article => (
                  <Link
                    key={article!.id}
                    href={`/articles/${article!.slug}`}
                    className="text-xs px-3 py-1.5 bg-steel/10 text-steel rounded-md hover:bg-steel/20 transition-colors border border-steel/20"
                  >
                    {article!.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GDBankClient({ topics, articles }: GDBankClientProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All')

  const filtered = topics.filter(t =>
    difficultyFilter === 'All' || t.difficulty === difficultyFilter
  )

  const counts = {
    Easy: topics.filter(t => t.difficulty === 'Easy').length,
    Medium: topics.filter(t => t.difficulty === 'Medium').length,
    Hard: topics.filter(t => t.difficulty === 'Hard').length,
  }

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-[#0f1724]">
      {/* Header */}
      <div className="bg-navy-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">GD Topic Bank</h1>
          <p className="text-blue-200 opacity-70 text-sm">
            Curated Group Discussion topics derived from current affairs analysis.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats + filter */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map(level => {
            const isActive = difficultyFilter === level
            return (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-navy-700 text-white border-navy-700'
                    : 'text-gray-600 border-gray-200 hover:border-gray-400 dark:text-gray-300 dark:border-gray-600'
                }`}
              >
                {level}
                {level !== 'All' && (
                  <span className="ml-1.5 opacity-60 text-xs">
                    ({counts[level]})
                  </span>
                )}
              </button>
            )
          })}
          <span className="ml-auto text-xs text-gray-400">
            {filtered.length} topics
          </span>
        </div>

        {/* Topic list */}
        <div className="space-y-3">
          {filtered.map(topic => (
            <GDTopicCard key={topic.id} topic={topic} articles={articles} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No topics yet</p>
            <p className="text-sm mt-1">GD topics will be added regularly.</p>
          </div>
        )}

        {/* Tips box */}
        <div className="mt-10 p-5 bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl border-l-4 border-gold-DEFAULT shadow-card">
          <h3 className="font-semibold text-navy-700 dark:text-white text-sm mb-2">
            How to Use the GD Topic Bank
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5 list-disc list-inside">
            <li>Each topic has numbered points — use these as your speaking framework</li>
            <li>Read the linked articles for depth and data to quote in GDs</li>
            <li>Hard topics require policy knowledge — build it through the glossary</li>
            <li>Practice structure: Opening → 2-3 key points → India angle → Conclusion</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
