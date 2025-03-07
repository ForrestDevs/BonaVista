'use client'

import type { Media as MediaType } from '@payload-types'
import { Media } from '@components/payload/Media'
// import { GridTileImage } from '@components/shop/grid/tile'
import { createUrl } from '@lib/search/search'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'
import { GridTileImage } from '@components/payload/grid/tile'
import { useProduct } from '@/app/(frontend)/shop/(browse)/product/[slug]/context/product-context'

export function Gallery({ images }: { images?: MediaType[] }) {
  const { currentImages } = useProduct()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const imageSearchParam = searchParams.get('image')
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0

  const nextSearchParams = new URLSearchParams(searchParams.toString())
  const nextImageIndex = imageIndex + 1 < currentImages.length ? imageIndex + 1 : 0
  nextSearchParams.set('image', nextImageIndex.toString())
  const nextUrl = createUrl(pathname, nextSearchParams)

  const previousSearchParams = new URLSearchParams(searchParams.toString())
  const previousImageIndex = imageIndex === 0 ? currentImages.length - 1 : imageIndex - 1
  previousSearchParams.set('image', previousImageIndex.toString())
  const previousUrl = createUrl(pathname, previousSearchParams)

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center'

  return (
    <React.Fragment>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {currentImages[imageIndex] && <Media resource={currentImages[imageIndex].image} />}

        {currentImages.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80">
              <Link
                aria-label="Previous product image"
                className={buttonClassName}
                href={previousUrl}
                scroll={false}
              >
                <ArrowLeftIcon className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-neutral-500" />
              <Link
                aria-label="Next product image"
                className={buttonClassName}
                href={nextUrl}
                scroll={false}
              >
                <ArrowRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {currentImages.length > 1 ? (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {currentImages.map((image, index) => {
            const isActive = index === imageIndex
            const imageSearchParams = new URLSearchParams(searchParams.toString())

            imageSearchParams.set('image', index.toString())

            return (
              <li className="h-20 w-20" key={image.id}>
                <Link
                  aria-label="Enlarge product image"
                  className="h-full w-full"
                  href={createUrl(pathname, imageSearchParams)}
                  scroll={false}
                >
                  <GridTileImage active={isActive} media={image.image as MediaType} />
                </Link>
              </li>
            )
          })}
        </ul>
      ) : null}
    </React.Fragment>
  )
}
