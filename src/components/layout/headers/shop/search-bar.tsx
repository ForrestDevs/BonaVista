'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/lib/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const searchParamQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(searchParamQuery)
  const [_isQueryPending, debouncedQuery] = useDebouncedValue(query, 100)

  useEffect(() => {
    router.prefetch(`/shop/search?q=${encodeURIComponent(query)}`)
  }, [query, router])

  useEffect(() => {
    if (debouncedQuery) {
      // const params = new URLSearchParams(searchParams)
      // params.set('q', encodeURIComponent(debouncedQuery))
      router.push(`/shop/search?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false })
    }
  }, [debouncedQuery, router])

  // if the pathname is /shop/search and the query is empty, redirect to /shop
  useEffect(() => {
    if (pathname === '/shop/search' && !query) {
      router.push(`/shop`, { scroll: true })
    }
  }, [pathname, query, router])

  // if the pathname is not /shop/search, set the query to empty
  useEffect(() => {
    if (pathname !== '/shop/search') {
      setQuery('')
    }
  }, [pathname])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(`/shop/search?q=${encodeURIComponent(query)}`, { scroll: false })
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={cn(className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
          <div ref={searchRef} className="bg-white p-4 rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <form onSubmit={handleSubmit} className="flex items-center">
              <Input
                placeholder="Search products..."
                className="flex-grow"
                autoFocus
                type="search"
                enterKeyHint="search"
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="icon" className="ml-2">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
