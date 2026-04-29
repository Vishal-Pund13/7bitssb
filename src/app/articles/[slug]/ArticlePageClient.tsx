'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Calendar, Clock, ExternalLink, Download, Share2, ArrowLeft } from 'lucide-react'
import { Article, KeyTerm } from '@/types'
import { getCategoryColor, formatDate, hexToRgba } from '@/lib/utils'

const TipTapRenderer = dynamic(() => import('@/components/editor/TipTapRenderer'), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`h-4 rounded bg-paper-line dark:bg-gray-700 ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  ),
})

interface ArticlePageClientProps {
  article: Article
  keyTerms: KeyTerm[]
}

export default function ArticlePageClient({ article, keyTerms }: ArticlePageClientProps) {
  const primaryCategory = article.category[0] || 'Default'
  const categoryColor = getCategoryColor(primaryCategory)

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied!')
    }
  }

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-[#0f1724]">
      {/* Article header */}
      <div
        className="border-l-4 bg-white dark:bg-[#141e2e]"
        style={{ borderLeftColor: categoryColor }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy-700 dark:hover:text-white transition-colors mb-6 print-hide"
          >
            <ArrowLeft size={14} />
            Back to Journal
          </Link>

          {/* Category badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.category.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
                style={{
                  color: getCategoryColor(cat),
                  backgroundColor: hexToRgba(getCategoryColor(cat), 0.08),
                  borderColor: hexToRgba(getCategoryColor(cat), 0.3),
                }}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-700 dark:text-white leading-tight mb-4 font-sans">
            {article.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(article.created_at)}
            </span>
            {article.read_time_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {article.read_time_minutes} min read
              </span>
            )}
            {article.source_name && (
              <span className="flex items-center gap-1.5">
                Source:&nbsp;
                {article.source_url ? (
                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-steel hover:underline flex items-center gap-1"
                  >
                    {article.source_name}
                    <ExternalLink size={11} />
                  </a>
                ) : (
                  article.source_name
                )}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 print-hide">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-paper-line dark:border-gray-600 text-gray-500 dark:text-gray-300 rounded-md text-xs font-medium hover:bg-paper-dark dark:hover:bg-gray-700 transition-colors"
            >
              <Download size={13} />
              Download PDF
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-paper-line dark:border-gray-600 text-gray-500 dark:text-gray-300 rounded-md text-xs font-medium hover:bg-paper-dark dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 size={13} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {article.cover_image_url && (
        <div className="relative w-full h-48 sm:h-72 md:h-[420px] overflow-hidden">
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Excerpt / intro */}
        {article.excerpt && (
          <div
            className="mb-6 p-4 rounded-lg border-l-4 italic text-gray-600 dark:text-gray-300 font-serif text-base"
            style={{
              borderLeftColor: categoryColor,
              backgroundColor: hexToRgba(categoryColor, 0.04),
            }}
          >
            {article.excerpt}
          </div>
        )}

        {/* Main body */}
        <div className="article-body shadow-card rounded-lg mb-8">
          {article.body ? (
            <TipTapRenderer content={article.body} />
          ) : (
            <p className="text-gray-400 italic">No content yet.</p>
          )}
        </div>

        {/* India Angle */}
        {article.india_angle && (
          <div className="india-angle-box mb-8" id="india-angle">
            <p className="font-serif text-base leading-relaxed text-navy-700 dark:text-blue-100">
              {article.india_angle}
            </p>
          </div>
        )}

        {/* Key Terms section */}
        {keyTerms.length > 0 && (
          <section id="key-terms" className="mb-8">
            <h2 className="text-lg font-bold text-navy-700 dark:text-white mb-4 font-sans flex items-center gap-2">
              <span className="w-1 h-6 rounded" style={{ backgroundColor: categoryColor }} />
              Key Terms from this Article
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keyTerms.map(term => (
                <div
                  key={term.id}
                  className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-lg p-4 shadow-card border-l-2"
                  style={{ borderLeftColor: getCategoryColor(term.category || 'Default') }}
                >
                  <p className="font-semibold text-navy-700 dark:text-white text-sm mb-1">{term.term}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">{term.definition}</p>
                  {term.category && (
                    <span
                      className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full"
                      style={{
                        color: getCategoryColor(term.category),
                        backgroundColor: hexToRgba(getCategoryColor(term.category), 0.1),
                      }}
                    >
                      {term.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
