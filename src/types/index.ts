export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: Record<string, unknown> | null
  category: string[]
  source_name: string | null
  source_url: string | null
  cover_image_url: string | null
  published: boolean
  read_time_minutes: number | null
  india_angle: string | null
  created_at: string
  updated_at: string
}

export interface KeyTerm {
  id: string
  term: string
  definition: string
  category: string | null
  article_ids: string[]
}

export interface GDTopic {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  suggested_points: string[]
  related_article_ids: string[]
  created_at: string
}

export type CategoryColor = {
  [key: string]: string
}

export const CATEGORY_COLORS: CategoryColor = {
  'Geopolitics': '#c0392b',
  'Defence': '#185fa5',
  'Economy': '#1e6b3c',
  'Science & Tech': '#6d28d9',
  'Environment': '#047857',
  'India Focus': '#b7950b',
  'Default': '#1a2a4a',
}

export const CATEGORIES = [
  'Geopolitics',
  'Defence',
  'Economy',
  'Science & Tech',
  'Environment',
  'India Focus',
]
