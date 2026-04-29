import Link from 'next/link'
import { FileSearch, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-navy-700/10 flex items-center justify-center mx-auto mb-6">
          <FileSearch size={28} className="text-navy-700 dark:text-blue-200" />
        </div>
        <h1 className="text-4xl font-bold text-navy-700 dark:text-white mb-2 font-serif">404</h1>
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">Page Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          The article or page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-navy-700 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Journal
          </Link>
          <Link
            href="/articles"
            className="px-5 py-2.5 border border-paper-line dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-paper-dark dark:hover:bg-gray-700 transition-colors"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  )
}
