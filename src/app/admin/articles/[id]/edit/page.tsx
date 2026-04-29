import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ArticleEditor from '@/components/editor/ArticleEditor'
import { Article } from '@/types'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export default async function EditArticlePage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const [{ data: article }, { data: keyTerms }] = await Promise.all([
    supabase.from('articles').select('*').eq('id', params.id).single(),
    supabase.from('key_terms').select('id, term').order('term'),
  ])

  if (!article) notFound()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a1220]">
      <div className="bg-navy-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-blue-200 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="font-semibold">Edit Article</p>
          <p className="text-xs text-blue-200 opacity-70 max-w-xs truncate">{article.title}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleEditor article={article as Article} keyTerms={keyTerms || []} />
      </div>
    </div>
  )
}
