'use client'

import { Media } from '@/components/payload/Media'
import { useProduct } from '../context/product-context'
import { Suspense, useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils/cn'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export function ProductGallery() {
  const { currentImages, product } = useProduct()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const onSelect = (index: number) => {
    api?.scrollTo(index)
  }

  if (!currentImages?.length) return null

  console.log(currentImages)

  return (
    <div className="space-y-4">
      <Carousel
        opts={{
          loop: true,
          duration: 50,
        }}
        className="w-full overflow-hidden rounded-lg"
        setApi={setApi}
      >
        <CarouselContent>
          {currentImages.map((image, index) => (
            <CarouselItem key={index}>
              <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-200" />}>
                <AspectRatio ratio={3/2} className='w-40vw'>
                  <Media
                    resource={image.image}
                    imgClassName='object-fill'
                    fill
                    alt={`${product.title} - Image ${index + 1}`}
                  />
                </AspectRatio>
              </Suspense>
            </CarouselItem>
          ))}
        </CarouselContent>
        {currentImages.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {currentImages.length > 1 && (
        <div className="flex gap-2 overflow-auto pb-2 scrollbar-hide">
          {currentImages.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={cn(
                'relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all',
                current === index ? 'border-primary' : 'border-transparent hover:border-primary/50',
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={current === index}
            >
              <AspectRatio ratio={1} className="h-20 w-20 bg-gray-100">
                <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-200" />}>
                  <Media
                    resource={image.image}
                    className="h-full w-full object-cover"
                    fill
                    alt={`${product.title} - Thumbnail ${index + 1}`}
                  />
                </Suspense>
              </AspectRatio>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
