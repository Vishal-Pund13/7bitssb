import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ArticlePageClient from './ArticlePageClient'
import { Article, KeyTerm } from '@/types'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('articles')
    .select('title, excerpt, cover_image_url')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Article Not Found' }

  return {
    title: data.title,
    description: data.excerpt || undefined,
    openGraph: {
      title: data.title,
      description: data.excerpt || undefined,
      images: data.cover_image_url ? [{ url: data.cover_image_url }] : [],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const supabase = createClient()

  const [{ data: article }, { data: keyTerms }] = await Promise.all([
    supabase
      .from('articles')
      .select('*')
      .eq('slug', params.slug)
      .eq('published', true)
      .single(),
    supabase.from('key_terms').select('*').order('term'),
  ])

  if (!article) notFound()

  const articleTerms = (keyTerms || []).filter((t: KeyTerm) =>
    t.article_ids?.includes(article.id)
  )

  return (
    <ArticlePageClient
      article={article as Article}
      keyTerms={articleTerms as KeyTerm[]}
    />
  )
}
