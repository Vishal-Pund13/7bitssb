import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
  }

  // Validate size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`

  const { data, error } = await supabase.storage
    .from('article-images')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage
    .from('article-images')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: urlData.publicUrl })
}
