export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-navy-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-sans">Loading analysis...</p>
      </div>
    </div>
  )
}
