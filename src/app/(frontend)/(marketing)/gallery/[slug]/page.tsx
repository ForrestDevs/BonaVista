import React from 'react'
import type { Metadata } from 'next'
import getPayload from '@/lib/utils/getPayload'
import { Media } from '@/components/payload/Media'
import { PayloadRedirects } from '@/components/payload/PayloadRedirects'
import { draftMode, headers } from 'next/headers'
import { StandardHero } from '@/components/payload/heros/Standard'
import { TypographyBlock } from '@/components/payload/blocks/Typography'
import { cn } from '@/lib/utils/cn'
import { RenderHero } from '@/components/payload/heros'
import { GALLERIES_SLUG } from '@/payload/collections/constants'
import { queryGalleryBySlug } from '@/lib/utils/queryBySlug'

export async function generateStaticParams() {
  const payload = await getPayload()

  const galleries = await payload.find({
    collection: GALLERIES_SLUG,
    draft: false,
    overrideAccess: false,
    select: {
      slug: true,
    },
  })

  return galleries.docs?.map(({ slug }) => ({
    slug: slug ?? '',
  }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const gallery = await queryGalleryBySlug(slug)

  return {
    title: gallery?.title + ` Gallery | BonaVista LeisureScapes`,
    description: gallery?.description,
  }
}

type Params = Promise<{ slug: string | undefined }>

export default async function Gallery({ params }: { params: Params }) {
  const { slug } = await params
  const url = '/gallery/' + slug
  const gallery = await queryGalleryBySlug(slug)

  if (!gallery) return <PayloadRedirects url={url} />

  return (
    <div className="flex flex-col min-h-screen space-y-10">
      <PayloadRedirects disableNotFound url={url} />
      <RenderHero {...gallery.hero} />

      <div className="container flex flex-col items-center max-w-3xl mx-auto py-8 text-center">
        <h3 className={cn('text-sm font-light tracking-widest uppercase text-gray-600/80 mb-3')}>
          {gallery.subtitle}
        </h3>
        <h2 className={cn('text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight')}>
          {gallery.title}
        </h2>
        <p className="text-lg text-gray-700/90 leading-relaxed max-w-2xl">{gallery.description}</p>
      </div>

      <div className="container pb-10">
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
          {gallery.images.map((image, index) => (
            <div className="col-span-4 aspect-square w-full h-full" key={index}>
              <Media
                resource={image}
                className="h-full w-full"
                imgClassName="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
