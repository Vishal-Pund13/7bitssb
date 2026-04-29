'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          There was an error loading this page. This may be a temporary connectivity issue.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-navy-700 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-paper-line dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-paper-dark transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
