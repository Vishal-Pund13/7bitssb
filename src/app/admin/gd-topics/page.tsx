import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GDTopicsManager from './GDTopicsManager'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function GDTopicsAdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ data: gdTopics }, { data: articles }] = await Promise.all([
    supabase.from('gd_topics').select('*').order('created_at', { ascending: false }),
    supabase.from('articles').select('id, title').eq('published', true),
  ])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a1220]">
      <div className="bg-navy-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-blue-200 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="font-semibold">Manage GD Topics</p>
          <p className="text-xs text-blue-200 opacity-70">{gdTopics?.length || 0} topics in bank</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <GDTopicsManager gdTopics={gdTopics || []} articles={articles || []} />
      </div>
    </div>
  )
}
