import { createClient } from '@/lib/supabase/server'
import { Article, KeyTerm } from '@/types'
import ArticlesClient from './ArticlesClient'

export const metadata = {
  title: 'All Articles',
  description: 'Browse all strategic analysis articles in the SSB Research Journal.',
}

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const supabase = createClient()

  const [{ data: articles }, { data: keyTerms }] = await Promise.all([
    supabase.from('articles').select('*').eq('published', true).order('created_at', { ascending: false }),
    supabase.from('key_terms').select('*').order('term'),
  ])

  return (
    <ArticlesClient
      articles={(articles as Article[]) || []}
      keyTerms={(keyTerms as KeyTerm[]) || []}
    />
  )
}
