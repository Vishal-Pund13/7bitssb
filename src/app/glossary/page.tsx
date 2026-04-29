import { createClient } from '@/lib/supabase/server'
import { KeyTerm, Article } from '@/types'
import GlossaryClient from './GlossaryClient'

export const metadata = {
  title: 'Key Terms Glossary',
  description: 'Searchable glossary of all key defence, geopolitics, and strategic terms.',
}

export const dynamic = 'force-dynamic'

export default async function GlossaryPage() {
  const supabase = createClient()

  const [{ data: keyTerms }, { data: articles }] = await Promise.all([
    supabase.from('key_terms').select('*').order('term'),
    supabase.from('articles').select('id, title, slug').eq('published', true),
  ])

  return (
    <GlossaryClient
      keyTerms={(keyTerms as KeyTerm[]) || []}
      articles={(articles as Pick<Article, 'id' | 'title' | 'slug'>[]) || []}
    />
  )
}
