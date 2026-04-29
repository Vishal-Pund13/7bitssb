import { getCategoryColor, hexToRgba } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CategoryChipProps {
  category: string
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export default function CategoryChip({
  category,
  active = false,
  onClick,
  size = 'md',
}: CategoryChipProps) {
  const color = getCategoryColor(category)

  const base = cn(
    'inline-flex items-center rounded-full font-medium transition-all cursor-pointer border',
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm',
    onClick ? 'hover:opacity-90' : ''
  )

  const style = active
    ? { backgroundColor: color, color: 'white', borderColor: color }
    : {
        backgroundColor: hexToRgba(color, 0.08),
        color,
        borderColor: hexToRgba(color, 0.25),
      }

  if (onClick) {
    return (
      <button onClick={onClick} className={base} style={style}>
        {category}
      </button>
    )
  }

  return (
    <span className={base} style={style}>
      {category}
    </span>
  )
}
