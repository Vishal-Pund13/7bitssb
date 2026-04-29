import { createClient } from '@/lib/supabase/server'
import HomeClient from '@/components/layout/HomeClient'
import { Article, KeyTerm } from '@/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: articles }, { data: keyTerms }, { data: gdTopics }] = await Promise.all([
    supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false }),
    supabase.from('key_terms').select('*').order('term'),
    supabase.from('gd_topics').select('id'),
  ])

  const topicCounts: Record<string, number> = {}
  ;(articles || []).forEach((a: Article) => {
    a.category.forEach((cat: string) => {
      topicCounts[cat] = (topicCounts[cat] || 0) + 1
    })
  })

  return (
    <HomeClient
      articles={(articles as Article[]) || []}
      keyTerms={(keyTerms as KeyTerm[]) || []}
      topicCounts={topicCounts}
      totalGDTopics={gdTopics?.length || 0}
    />
  )
}
