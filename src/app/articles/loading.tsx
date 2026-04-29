function SkeletonCard() {
  return (
    <div className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card overflow-hidden border-l-4 border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2 mt-2">
          <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-3 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-7 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export default function ArticlesLoading() {
  return (
    <div className="min-h-screen bg-warm-bg dark:bg-[#0f1724]">
      <div className="bg-navy-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 rounded bg-white/20 animate-pulse mb-2" />
          <div className="h-4 w-80 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
