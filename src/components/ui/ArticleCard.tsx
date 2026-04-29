'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Calendar, ExternalLink, FileText, BookOpen, Download } from 'lucide-react'
import { Article, KeyTerm } from '@/types'
import { getCategoryColor, formatDate, hexToRgba } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  keyTerms?: KeyTerm[]
}

function CategoryTag({ category }: { category: string }) {
  const color = getCategoryColor(category)
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
      style={{
        color,
        backgroundColor: hexToRgba(color, 0.08),
        borderColor: hexToRgba(color, 0.25),
      }}
    >
      {category}
    </span>
  )
}

function KeyTermChip({ term, definition }: { term: string; definition: string }) {
  const [showDef, setShowDef] = useState(false)

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setShowDef(!showDef)}
        onBlur={() => setShowDef(false)}
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-pointer hover:opacity-80"
        style={{
          color: '#185fa5',
          backgroundColor: 'rgba(24,95,165,0.08)',
          borderColor: 'rgba(24,95,165,0.25)',
        }}
      >
        {term}
      </button>
      {showDef && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 max-w-[85vw] bg-navy-700 text-white text-xs rounded-lg p-3 shadow-xl border border-white/10">
          <p className="font-semibold text-gold-DEFAULT mb-1">{term}</p>
          <p className="leading-relaxed opacity-90">{definition}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-700 rotate-45 -mt-1" />
        </div>
      )}
    </span>
  )
}

export default function ArticleCard({ article, keyTerms = [] }: ArticleCardProps) {
  const primaryCategory = article.category[0] || 'Default'
  const borderColor = getCategoryColor(primaryCategory)

  const articleTerms = keyTerms.filter(t =>
    t.article_ids?.includes(article.id)
  ).slice(0, 6)

  return (
    <article
      className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden group hover:-translate-y-0.5"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      {/* Cover image */}
      {article.cover_image_url && (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="p-5">
        {/* Categories + meta */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {article.category.map(cat => (
              <CategoryTag key={cat} category={cat} />
            ))}
          </div>
          {article.read_time_minutes && (
            <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap shrink-0">
              <Clock size={11} />
              {article.read_time_minutes} min
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/articles/${article.slug}`}>
          <h2 className="font-bold text-navy-700 dark:text-white text-base leading-snug mb-2 hover:text-steel transition-colors line-clamp-3">
            {article.title}
          </h2>
        </Link>

        {/* Date + source */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(article.created_at)}
          </span>
          {article.source_name && (
            <>
              <span>·</span>
              {article.source_url ? (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-steel transition-colors"
                >
                  {article.source_name}
                  <ExternalLink size={10} />
                </a>
              ) : (
                <span>{article.source_name}</span>
              )}
            </>
          )}
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2 font-serif">
            {article.excerpt}
          </p>
        )}

        {/* Key term chips */}
        {articleTerms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {articleTerms.map(term => (
              <KeyTermChip key={term.id} term={term.term} definition={term.definition} />
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-paper-line dark:border-gray-700">
          <Link
            href={`/articles/${article.slug}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-navy-700 text-white rounded-md text-xs font-medium hover:bg-navy-800 transition-colors flex-1 justify-center sm:flex-none sm:justify-start"
          >
            <FileText size={13} />
            Read Notes
          </Link>
          <Link
            href={`/articles/${article.slug}#key-terms`}
            className="flex items-center gap-1.5 px-3 py-2 border border-paper-line dark:border-gray-600 text-navy-700 dark:text-gray-200 rounded-md text-xs font-medium hover:bg-paper-dark dark:hover:bg-gray-700 transition-colors flex-1 justify-center sm:flex-none sm:justify-start"
          >
            <BookOpen size={13} />
            Key Terms
          </Link>
          <Link
            href={`/articles/${article.slug}`}
            onClick={e => { e.preventDefault(); window.open(`/articles/${article.slug}`, '_blank') }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-paper-line dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-md text-xs font-medium hover:bg-paper-dark dark:hover:bg-gray-700 transition-colors ml-auto"
          >
            <Download size={13} />
            PDF
          </Link>
        </div>
      </div>
    </article>
  )
}
