'use client'

import { useCallback, useEffect, useState } from 'react'
import { Media } from '@/components/payload/Media'
import { Media as MediaType } from '@/payload-types'
import { getCachedLineItemThumbnail } from '@/lib/data/media'

interface LineItemThumbnailProps {
  mediaId: number | null
  imgClassName?: string
  className?: string
}

export function LineItemThumbnail({
  mediaId,
  className = '',
  imgClassName = '',
}: LineItemThumbnailProps) {
  const [mediaResource, setMediaResource] = useState<MediaType | null>(null)
  const [isLoading, setIsLoading] = useState(mediaId !== null)

  // Memoize the fetch function to avoid unnecessary re-renders
  const getMedia = useCallback(async () => {
    if (!mediaId) return

    try {
      setIsLoading(true)
      const media = await getCachedLineItemThumbnail(mediaId)
      setMediaResource(media)
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setIsLoading(false)
    }
  }, [mediaId])

  // Fetch media on component mount
  useEffect(() => {
    if (mediaId) {
      getMedia()
    }
  }, [mediaId, getMedia])

  if (!mediaId || isLoading) {
    return (
      <div className={`flex items-center justify-center text-gray-400 ${className}`}>
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return <Media resource={mediaResource} className={className} imgClassName={imgClassName} />
}
