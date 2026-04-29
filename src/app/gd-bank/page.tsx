import { createClient } from '@/lib/supabase/server'
import { GDTopic, Article } from '@/types'
import GDBankClient from './GDBankClient'

export const metadata = {
  title: 'GD Topic Bank',
  description: 'Curated Group Discussion topics with suggested points for SSB preparation.',
}

export const dynamic = 'force-dynamic'

export default async function GDBankPage() {
  const supabase = createClient()

  const [{ data: topics }, { data: articles }] = await Promise.all([
    supabase.from('gd_topics').select('*').order('created_at', { ascending: false }),
    supabase.from('articles').select('id, title, slug').eq('published', true),
  ])

  return (
    <GDBankClient
      topics={(topics as GDTopic[]) || []}
      articles={(articles as Pick<Article, 'id' | 'title' | 'slug'>[]) || []}
    />
  )
}
