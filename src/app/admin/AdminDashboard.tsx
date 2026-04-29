'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, FileText, BookOpen, MessageSquare, LogOut, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface DashboardProps {
  articles: {id: string; title: string; slug: string; published: boolean; created_at: string; category: string[]}[]
  keyTerms: {id: string; term: string; category: string | null}[]
  gdTopics: {id: string; title: string; difficulty: string}[]
  user: { email?: string }
}

export default function AdminDashboard({ articles, keyTerms, gdTopics, user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'terms' | 'gd'>('articles')
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return
    setDeleting(id)
    await supabase.from('articles').delete().eq('id', id)
    router.refresh()
    setDeleting(null)
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from('articles').update({ published: !current }).eq('id', id)
    router.refresh()
  }

  const handleDeleteTerm = async (id: string) => {
    if (!confirm('Delete this term?')) return
    await supabase.from('key_terms').delete().eq('id', id)
    router.refresh()
  }

  const handleDeleteGD = async (id: string) => {
    if (!confirm('Delete this GD topic?')) return
    await supabase.from('gd_topics').delete().eq('id', id)
    router.refresh()
  }

  const tabs = [
    { key: 'articles', label: 'Articles', icon: <FileText size={16} />, count: articles.length },
    { key: 'terms', label: 'Key Terms', icon: <BookOpen size={16} />, count: keyTerms.length },
    { key: 'gd', label: 'GD Topics', icon: <MessageSquare size={16} />, count: gdTopics.length },
  ] as const

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a1220]">
      {/* Admin nav */}
      <div className="bg-navy-700 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">Admin Dashboard</p>
          <p className="text-xs text-blue-200 opacity-70">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-blue-200 hover:text-white transition-colors">
            ← View Site
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Articles', value: articles.length, color: '#185fa5' },
            { label: 'Key Terms', value: keyTerms.length, color: '#1e6b3c' },
            { label: 'GD Topics', value: gdTopics.length, color: '#c0392b' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-[#1a2535] rounded-xl p-5 shadow-card border-l-4" style={{ borderLeftColor: stat.color }}>
              <p className="text-3xl font-bold text-navy-700 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-[#1a2535] rounded-xl p-1 mb-6 shadow-card w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-navy-700 text-white'
                  : 'text-gray-500 hover:text-navy-700 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className="text-xs opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Articles tab */}
        {activeTab === 'articles' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-navy-700 dark:text-white">Articles</h2>
              <Link
                href="/admin/articles/new"
                className="flex items-center gap-1.5 px-4 py-2 bg-navy-700 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors"
              >
                <Plus size={16} />
                New Article
              </Link>
            </div>
            <div className="bg-white dark:bg-[#1a2535] rounded-xl shadow-card overflow-hidden">
              {articles.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No articles yet.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-navy-700 text-white">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Title</th>
                      <th className="text-left px-4 py-3 font-semibold">Categories</th>
                      <th className="text-left px-4 py-3 font-semibold">Date</th>
                      <th className="text-center px-4 py-3 font-semibold">Status</th>
                      <th className="text-right px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-paper-line dark:divide-gray-700">
                    {articles.map(article => (
                      <tr key={article.id} className="hover:bg-paper-dark dark:hover:bg-[#1e2b40] transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-navy-700 dark:text-white line-clamp-1">{article.title}</p>
                          <p className="text-xs text-gray-400 font-mono">{article.slug}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {article.category.map(cat => (
                              <span key={cat} className="text-xs px-1.5 py-0.5 bg-navy-700/10 rounded text-navy-700 dark:text-blue-200">{cat}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(article.created_at)}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleTogglePublish(article.id, article.published)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              article.published
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            }`}
                          >
                            {article.published ? <><Eye size={11} />Live</> : <><EyeOff size={11} />Draft</>}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/articles/${article.id}/edit`}
                              className="p-1.5 text-gray-400 hover:text-steel transition-colors"
                            >
                              <Edit size={15} />
                            </Link>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              disabled={deleting === article.id}
                              className="p-1.5 text-gray-400 hover:text-crimson transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Key Terms tab */}
        {activeTab === 'terms' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-navy-700 dark:text-white">Key Terms</h2>
              <Link
                href="/admin/key-terms"
                className="flex items-center gap-1.5 px-4 py-2 bg-navy-700 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors"
              >
                <Plus size={16} />
                Manage Terms
              </Link>
            </div>
            <div className="bg-white dark:bg-[#1a2535] rounded-xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-navy-700 text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Term</th>
                    <th className="text-left px-4 py-3 font-semibold">Category</th>
                    <th className="text-right px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-line dark:divide-gray-700">
                  {keyTerms.map(term => (
                    <tr key={term.id} className="hover:bg-paper-dark dark:hover:bg-[#1e2b40] transition-colors">
                      <td className="px-4 py-3 font-medium text-navy-700 dark:text-white">{term.term}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{term.category || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDeleteTerm(term.id)}
                            className="p-1.5 text-gray-400 hover:text-crimson transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GD Topics tab */}
        {activeTab === 'gd' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-navy-700 dark:text-white">GD Topics</h2>
              <Link
                href="/admin/gd-topics"
                className="flex items-center gap-1.5 px-4 py-2 bg-navy-700 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors"
              >
                <Plus size={16} />
                Manage GD Topics
              </Link>
            </div>
            <div className="bg-white dark:bg-[#1a2535] rounded-xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-navy-700 text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Topic</th>
                    <th className="text-left px-4 py-3 font-semibold">Difficulty</th>
                    <th className="text-right px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-line dark:divide-gray-700">
                  {gdTopics.map(topic => (
                    <tr key={topic.id} className="hover:bg-paper-dark dark:hover:bg-[#1e2b40] transition-colors">
                      <td className="px-4 py-3 font-medium text-navy-700 dark:text-white line-clamp-1">{topic.title}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          topic.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                          topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {topic.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDeleteGD(topic.id)}
                            className="p-1.5 text-gray-400 hover:text-crimson transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
