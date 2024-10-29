import React, { cache } from 'react'
import type { Metadata } from 'next'
import getPayload from '@/lib/utils/getPayload'
import { Media } from '@/components/payload/Media'
import { PayloadRedirects } from '@/components/payload/PayloadRedirects'
import { draftMode, headers } from 'next/headers'
import { StandardHero } from '@/components/payload/heros/Standard'
import { TypographyBlock } from '@/components/payload/blocks/Typography'
import { cn } from '@/lib/utils/cn'
import { RenderHero } from '@/components/payload/heros'

// export async function generateStaticParams() {
//   const payload = await getPayload()
//   const posts = await payload.find({
//     collection: 'posts',
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//   })

//   return posts.docs?.map(({ slug }) => slug)
// }

type Params = Promise<{ slug: string | undefined }>

export default async function Gallery({ params }: { params: Params }) {
  const { slug } = await params
  const url = '/gallery/' + slug
  const gallery = await queryGalleryBySlug({ slug })

  if (!gallery) return <PayloadRedirects url={url} />

  return (
    <div className="flex flex-col min-h-screen space-y-10">
      <PayloadRedirects disableNotFound url={url} />
      <RenderHero {...gallery.hero} />

      <div className="container flex flex-col items-center">
        <h3 className={cn('text-sm font-light tracking-widest mb-2 uppercase text-gray-600')}>
          {gallery.subtitle}
        </h3>
        <h2 className={cn('text-3xl lg:text-4xl font-bold mb-4 text-gray-900')}>{gallery.title}</h2>
        <p className="text-gray-700"> {gallery.description}</p>
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

const queryGalleryBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload()

  const result = await payload.find({
    collection: 'galleries',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const gallery = await queryGalleryBySlug({ slug })

  return {
    title: gallery?.title,
    description: gallery?.description,
  }

  //   return generateMeta({ doc: post, collectionSlug: 'posts' })
}
