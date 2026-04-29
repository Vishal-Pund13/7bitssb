import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('published', true)

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/glossary`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/gd-bank`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const articlePages: MetadataRoute.Sitemap = (articles || []).map(article => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...articlePages]
}
