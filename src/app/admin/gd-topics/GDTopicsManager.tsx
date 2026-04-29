'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GDTopic } from '@/types'
import { Plus, Trash2, X } from 'lucide-react'

interface Props {
  gdTopics: GDTopic[]
  articles: { id: string; title: string }[]
}

export default function GDTopicsManager({ gdTopics, articles }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
  const [pointInput, setPointInput] = useState('')
  const [points, setPoints] = useState<string[]>([])
  const [relatedArticles, setRelatedArticles] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addPoint = () => {
    if (pointInput.trim()) {
      setPoints(prev => [...prev, pointInput.trim()])
      setPointInput('')
    }
  }

  const handleAdd = async () => {
    if (!title) { setError('Title is required.'); return }
    setSaving(true)
    setError('')

    const { error: err } = await supabase.from('gd_topics').insert({
      title,
      difficulty,
      suggested_points: points,
      related_article_ids: relatedArticles,
    })

    if (err) { setError(err.message) } else {
      setTitle(''); setDifficulty('Medium'); setPoints([]); setRelatedArticles([])
      router.refresh()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this GD topic?')) return
    await supabase.from('gd_topics').delete().eq('id', id)
    router.refresh()
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#0f1724] text-navy-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-steel'

  return (
    <div className="space-y-8">
      {/* Add form */}
      <div className="bg-white dark:bg-[#1a2535] rounded-xl shadow-card p-6">
        <h2 className="font-semibold text-navy-700 dark:text-white mb-4">Add New GD Topic</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Topic Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="GD topic statement..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Difficulty</label>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    difficulty === d ? 'bg-navy-700 text-white border-navy-700' : 'text-gray-600 border-gray-200 dark:text-gray-300 dark:border-gray-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Suggested Points</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={pointInput}
                onChange={e => setPointInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPoint())}
                className={inputClass + ' flex-1'}
                placeholder="Add a point and press Enter or Add..."
              />
              <button
                type="button"
                onClick={addPoint}
                className="px-3 py-2 bg-navy-700 text-white rounded-lg text-sm hover:bg-navy-800 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {points.length > 0 && (
              <ul className="space-y-1.5">
                {points.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-navy-700/10 text-navy-700 dark:text-white text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                    <span className="flex-1">{p}</span>
                    <button onClick={() => setPoints(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-crimson">
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Related Articles</label>
            <div className="flex flex-wrap gap-2">
              {articles.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setRelatedArticles(prev =>
                    prev.includes(a.id) ? prev.filter(id => id !== a.id) : [...prev, a.id]
                  )}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    relatedArticles.includes(a.id)
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
            {saving ? 'Adding...' : 'Add GD Topic'}
          </button>
        </div>
      </div>

      {/* Existing topics */}
      <div>
        <h2 className="font-semibold text-navy-700 dark:text-white mb-4">{gdTopics.length} Topics</h2>
        <div className="space-y-3">
          {gdTopics.map(topic => (
            <div key={topic.id} className="bg-white dark:bg-[#1a2535] rounded-xl p-4 shadow-card flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    topic.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                    topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>{topic.difficulty}</span>
                </div>
                <p className="text-sm text-navy-700 dark:text-white font-medium">{topic.title}</p>
                <p className="text-xs text-gray-400 mt-1">{topic.suggested_points?.length || 0} points</p>
              </div>
              <button onClick={() => handleDelete(topic.id)} className="text-gray-400 hover:text-crimson transition-colors shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
