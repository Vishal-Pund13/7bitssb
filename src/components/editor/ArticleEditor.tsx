'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Article, CATEGORIES } from '@/types'
import { slugify } from '@/lib/utils'
import dynamic from 'next/dynamic'

const TipTapEditor = dynamic(() => import('./TipTapEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
      <div className="h-12 bg-gray-50 dark:bg-[#1a2535] border-b border-gray-200 dark:border-gray-600 animate-pulse" />
      <div className="h-64 bg-paper-DEFAULT dark:bg-[#1a2535] animate-pulse" />
    </div>
  ),
})
import { Save, X, Tag } from 'lucide-react'

interface ArticleEditorProps {
  article?: Article
  keyTerms?: { id: string; term: string }[]
}

export default function ArticleEditor({ article, keyTerms = [] }: ArticleEditorProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = Boolean(article)

  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [categories, setCategories] = useState<string[]>(article?.category || [])
  const [sourceName, setSourceName] = useState(article?.source_name || '')
  const [sourceUrl, setSourceUrl] = useState(article?.source_url || '')
  const [indiaAngle, setIndiaAngle] = useState(article?.india_angle || '')
  const [published, setPublished] = useState(article?.published || false)
  const [body, setBody] = useState<Record<string, unknown> | null>(article?.body || null)
  const [coverImageUrl, setCoverImageUrl] = useState(article?.cover_image_url || '')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [linkedTermIds, setLinkedTermIds] = useState<string[]>([])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isEditing) {
      setSlug(slugify(val))
    }
  }

  const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    const fileName = `covers/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { data, error } = await supabase.storage.from('article-images').upload(fileName, file)
    if (error) {
      alert('Upload failed: ' + error.message)
    } else {
      const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(data.path)
      setCoverImageUrl(urlData.publicUrl)
    }
    setUploadingCover(false)
  }, [supabase])

  const toggleCategory = (cat: string) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const toggleLinkedTerm = (id: string) => {
    setLinkedTermIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (!title || !slug) {
      setError('Title and slug are required.')
      return
    }
    setSaving(true)
    setError('')

    const wordCount = JSON.stringify(body || {}).split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      category: categories,
      source_name: sourceName || null,
      source_url: sourceUrl || null,
      india_angle: indiaAngle || null,
      published,
      body,
      cover_image_url: coverImageUrl || null,
      read_time_minutes: readTime,
    }

    let articleId = article?.id

    if (isEditing) {
      const { error: saveError } = await supabase
        .from('articles')
        .update(payload)
        .eq('id', article!.id)
      if (saveError) { setError(saveError.message); setSaving(false); return }
    } else {
      const { data: newArticle, error: saveError } = await supabase
        .from('articles')
        .insert(payload)
        .select('id')
        .single()
      if (saveError) { setError(saveError.message); setSaving(false); return }
      articleId = newArticle.id
    }

    // Link selected key terms to this article
    if (articleId && linkedTermIds.length > 0) {
      for (const termId of linkedTermIds) {
        // Fetch current article_ids and append this article (idempotent)
        const { data: termData } = await supabase
          .from('key_terms')
          .select('article_ids')
          .eq('id', termId)
          .single()

        const existing: string[] = termData?.article_ids || []
        if (!existing.includes(articleId)) {
          await supabase
            .from('key_terms')
            .update({ article_ids: [...existing, articleId] })
            .eq('id', termId)
        }
      }
    }

    router.push('/admin')
    router.refresh()
    setSaving(false)
  }

  const ic = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#0f1724] text-navy-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-steel'
  const lc = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5'

  return (
    <div className="space-y-6 pb-16">

      {/* ── TITLE ── */}
      <div>
        <label className={lc}>Title *</label>
        <input
          type="text"
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          className={ic + ' text-base font-medium'}
          placeholder="Article title..."
        />
      </div>

      {/* ── SLUG ── */}
      <div>
        <label className={lc}>Slug *</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">/articles/</span>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className={ic + ' font-mono'}
            placeholder="article-slug-here"
          />
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div>
        <label className={lc}>Categories</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                categories.includes(cat)
                  ? 'bg-navy-700 text-white border-navy-700'
                  : 'text-gray-600 border-gray-200 hover:border-gray-400 dark:text-gray-300 dark:border-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── SOURCE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={lc}>Source Name</label>
          <input
            type="text"
            value={sourceName}
            onChange={e => setSourceName(e.target.value)}
            className={ic}
            placeholder="e.g. World Economic Forum"
          />
        </div>
        <div>
          <label className={lc}>Source URL</label>
          <input
            type="url"
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            className={ic}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* ── EXCERPT ── */}
      <div>
        <label className={lc}>Excerpt</label>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={3}
          className={ic}
          placeholder="2–3 sentence summary shown on cards and in search results..."
        />
      </div>

      {/* ── COVER IMAGE ── */}
      <div>
        <label className={lc}>Cover Image</label>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-navy-700 file:text-white file:text-xs file:font-medium file:cursor-pointer"
          />
          {uploadingCover && (
            <span className="text-xs text-gray-400 animate-pulse">Uploading...</span>
          )}
          {coverImageUrl && (
            <div className="relative w-24 h-14 rounded-lg overflow-hidden border border-gray-200">
              <Image src={coverImageUrl} alt="Cover preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setCoverImageUrl('')}
                className="absolute top-1 right-1 p-0.5 bg-black/60 rounded text-white hover:bg-black/80 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── INDIA ANGLE ── */}
      <div>
        <label className={lc}>
          India Angle
          <span className="ml-2 text-gold-DEFAULT normal-case font-normal text-xs">
            (shown in the gold callout box on the article page)
          </span>
        </label>
        <textarea
          value={indiaAngle}
          onChange={e => setIndiaAngle(e.target.value)}
          rows={5}
          className={ic + ' font-serif text-base'}
          placeholder="India-specific insights: policy implications, strategic interest, SSB interview relevance, doctrine connections..."
        />
      </div>

      {/* ── KEY TERMS LINKING ── */}
      {keyTerms.length > 0 && (
        <div>
          <label className={lc}>
            <span className="flex items-center gap-1.5">
              <Tag size={12} />
              Link Key Terms to this Article
              <span className="font-normal text-gray-400 normal-case">(click to toggle)</span>
            </span>
          </label>
          <div className="flex flex-wrap gap-2 p-4 bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl border border-paper-line dark:border-gray-700">
            {keyTerms.map(term => (
              <button
                key={term.id}
                type="button"
                onClick={() => toggleLinkedTerm(term.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  linkedTermIds.includes(term.id)
                    ? 'bg-steel text-white border-steel'
                    : 'text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-600 hover:border-steel hover:text-steel'
                }`}
              >
                {term.term}
              </button>
            ))}
          </div>
          {linkedTermIds.length > 0 && (
            <p className="mt-1 text-xs text-steel">{linkedTermIds.length} term{linkedTermIds.length > 1 ? 's' : ''} selected</p>
          )}
        </div>
      )}

      {/* ── BODY ── */}
      <div>
        <label className={lc}>Article Body</label>
        <TipTapEditor content={body} onChange={setBody} />
      </div>

      {/* ── PUBLISH TOGGLE ── */}
      <div className="flex items-center gap-3 pt-2 pb-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setPublished(!published)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            published ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              published ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {published ? 'Published' : 'Draft'}
          </p>
          <p className="text-xs text-gray-400">
            {published ? 'Visible to all visitors' : 'Only visible to you in admin'}
          </p>
        </div>
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* ── ACTIONS ── */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-navy-700 text-white rounded-lg font-semibold text-sm hover:bg-navy-800 transition-colors disabled:opacity-60 shadow"
        >
          <Save size={16} />
          {saving ? 'Saving...' : isEditing ? 'Update Article' : 'Save Article'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
