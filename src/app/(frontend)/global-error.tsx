'use client' // Error boundaries must be Client Components

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center space-y-6 p-8">
          <h2 className="text-3xl font-semibold text-gray-900">Something went wrong!</h2>
          <p className="text-gray-600">We apologize for the inconvenience. Please try again later.</p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/" 
              className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Go to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
