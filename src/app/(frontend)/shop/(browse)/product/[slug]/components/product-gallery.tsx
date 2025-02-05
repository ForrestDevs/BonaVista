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
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon } from 'lucide-react'
import { Button } from '@components/ui/button'

export function ProductGallery() {
  const { allImages, product, selectedVariant } = useProduct()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Scroll to first variant image when variant changes
  useEffect(() => {
    if (!api || !selectedVariant) return

    const variantImageIndex = allImages.findIndex((img) =>
      selectedVariant.images.some((variantImg) => variantImg.image === img.image),
    )

    if (variantImageIndex !== -1) {
      api.scrollTo(variantImageIndex)
    }
  }, [selectedVariant, api, allImages])

  const onSelect = (index: number) => {
    api?.scrollTo(index)
  }

  if (!allImages?.length) return null

  return (
    <div className="sticky top-8 space-y-6">
      <div className="relative rounded-lg bg-gray-100">
        <Carousel
          opts={{
            loop: true,
            duration: 50,
          }}
          className="w-full overflow-hidden"
          setApi={setApi}
        >
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative">
                  <AspectRatio ratio={1} className="bg-gray-100">
                    <Suspense
                      fallback={<div className="h-full w-full animate-pulse bg-gray-200" />}
                    >
                      <Media
                        resource={image.image}
                        imgClassName="object-contain hover:cursor-zoom-in"
                        fill
                        priority={index === 0}
                        alt={`${product.title} - Image ${index + 1}`}
                        onClick={() => setIsZoomed(true)}
                      />
                    </Suspense>
                  </AspectRatio>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsZoomed(true)}
            className="absolute bottom-5 right-4 rounded-full bg-background/80 p-2 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background"
            aria-label="Zoom image"
          >
            <ZoomInIcon className="h-5 w-5" />
          </Button>

          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-full bg-background/90 px-2 py-1 shadow-md backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => api?.scrollPrev()}
                className="rounded-full p-2 hover:bg-gray-100/20"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <div className="min-w-6 text-center text-sm font-medium">
                {current + 1}/{allImages.length}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => api?.scrollNext()}
                className="rounded-full p-2 hover:bg-gray-100/20"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
            </div>
          )}
        </Carousel>
      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={cn(
                'relative cursor-pointer overflow-hidden rounded-lg border-2 aspect-square transition-all bg-gray-100',
                current === index ? 'border-primary' : 'border-transparent hover:border-primary/50',
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={current === index}
            >
              <Media
                resource={image.image}
                imgClassName="h-full w-full object-cover"
                fill
                alt={`${product.title} - Thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        <DialogDescription className="sr-only">{product.description}</DialogDescription>
        <DialogContent className="max-w-screen-lg">
          <AspectRatio ratio={1} className="bg-background">
            <Media
              resource={allImages[current].image}
              imgClassName="object-contain"
              fill
              alt={`${product.title} - Zoomed Image ${current + 1}`}
            />
          </AspectRatio>
        </DialogContent>
      </Dialog>
    </div>
  )
}
