import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const [{ data: articles }, { data: keyTerms }, { data: gdTopics }] = await Promise.all([
    supabase.from('articles').select('id, title, slug, published, created_at, category').order('created_at', { ascending: false }),
    supabase.from('key_terms').select('id, term, category').order('term'),
    supabase.from('gd_topics').select('id, title, difficulty').order('created_at', { ascending: false }),
  ])

  return (
    <AdminDashboard
      articles={articles || []}
      keyTerms={keyTerms || []}
      gdTopics={gdTopics || []}
      user={user}
    />
  )
}
