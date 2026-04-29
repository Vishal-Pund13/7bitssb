'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { KeyTerm, CATEGORIES } from '@/types'
import { Plus, Trash2 } from 'lucide-react'

interface Props {
  keyTerms: KeyTerm[]
  articles: { id: string; title: string }[]
}

export default function KeyTermsManager({ keyTerms: initialTerms, articles }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [term, setTerm] = useState('')
  const [definition, setDefinition] = useState('')
  const [category, setCategory] = useState('')
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    if (!term || !definition) { setError('Term and definition required.'); return }
    setSaving(true)
    setError('')

    const { error: err } = await supabase.from('key_terms').insert({
      term,
      definition,
      category: category || null,
      article_ids: selectedArticles,
    })

    if (err) { setError(err.message) } else {
      setTerm(''); setDefinition(''); setCategory(''); setSelectedArticles([])
      router.refresh()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this term?')) return
    await supabase.from('key_terms').delete().eq('id', id)
    router.refresh()
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#0f1724] text-navy-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-steel'

  return (
    <div className="space-y-8">
      {/* Add new term form */}
      <div className="bg-white dark:bg-[#1a2535] rounded-xl shadow-card p-6">
        <h2 className="font-semibold text-navy-700 dark:text-white mb-4">Add New Term</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Term *</label>
              <input type="text" value={term} onChange={e => setTerm(e.target.value)} className={inputClass} placeholder="e.g. Blue Water Navy" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                <option value="">— Select category —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Definition *</label>
            <textarea value={definition} onChange={e => setDefinition(e.target.value)} rows={3} className={inputClass} placeholder="Clear, concise definition..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Appears in Articles</label>
            <div className="flex flex-wrap gap-2">
              {articles.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedArticles(prev =>
                    prev.includes(a.id) ? prev.filter(id => id !== a.id) : [...prev, a.id]
                  )}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    selectedArticles.includes(a.id)
                      ? 'bg-navy-700 text-white border-navy-700'
                      : 'text-gray-600 border-gray-200 dark:text-gray-300 dark:border-gray-600'
                  }`}
                >
                  {a.title}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={handleAdd}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-navy-700 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors disabled:opacity-60"
          >
            <Plus size={15} />
            {saving ? 'Adding...' : 'Add Term'}
          </button>
        </div>
      </div>

      {/* Existing terms */}
      <div>
        <h2 className="font-semibold text-navy-700 dark:text-white mb-4">{initialTerms.length} Terms</h2>
        <div className="space-y-2">
          {initialTerms.map(t => (
            <div key={t.id} className="bg-white dark:bg-[#1a2535] rounded-xl p-4 shadow-card flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-navy-700 dark:text-white text-sm">{t.term}</p>
                  {t.category && (
                    <span className="text-xs px-1.5 py-0.5 bg-navy-700/10 rounded text-navy-700 dark:text-blue-200">{t.category}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{t.definition}</p>
              </div>
              <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-crimson transition-colors shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
