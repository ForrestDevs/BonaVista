import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-28 h-screen text-center bg-white">
      <div className="prose max-w-none">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">Oops!</h1>
        <h2 className="text-3xl mb-2 text-gray-800">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          We couldn&apos;t find the page you&apos;re looking for. Don&apos;t worry though,
          let&apos;s get you back on track!
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/">Return Home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
