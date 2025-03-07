import { Media } from '@/components/payload/Media'
import { YnsLink } from '@/components/ui/link'
import { OrderItem } from '@/lib/types/order'
import React from 'react'
import getPayload from '@/lib/utils/getPayload'
import { Suspense } from 'react'

function ThumbnailSkeleton() {
  return <div className="h-24 w-24 shrink-0 rounded-md bg-neutral-100 animate-pulse" />
}

async function ThumbnailImage({ id }: { id: number }) {
  const payload = await getPayload()
  const media = await payload.findByID({
    collection: 'media',
    id,
  })

  return (
    <Suspense fallback={<ThumbnailSkeleton />}>
      <Media
        resource={media}
        imgClassName="absolute inset-0 h-full w-full object-cover object-center"
        className="relative h-full w-full"
      />
    </Suspense>
  )
}

export async function OrderItemThumbnail({ lineItem }: { lineItem: OrderItem }) {
  const product = typeof lineItem.product === 'object' ? lineItem.product : null
  const mediaId =
    typeof lineItem.thumbnail === 'object' ? lineItem.thumbnail?.id : lineItem.thumbnail

  return (
    <div className="w-16 sm:w-24">
      <YnsLink
        className="block w-full transition-all duration-200 hover:opacity-80"
        href={`/shop/product/${product?.slug}`}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xs">
          {mediaId ? (
            <div className="absolute inset-0">
              <ThumbnailImage id={mediaId} />
            </div>
          ) : (
            <div className="bg-neutral-100 rounded-lg h-full w-full" />
          )}
        </div>
      </YnsLink>
    </div>
  )
}

export default function OrderItemDetails({ lineItem }: { lineItem: OrderItem }) {
  const productTitle =
    typeof lineItem.product === 'object' ? lineItem.product.title : lineItem.product
  const isVariant = lineItem.isVariant
  const variantOptions = isVariant
    ? lineItem.variantOptions.map((v) => v.value.label).join(', ')
    : null

  return (
    <div className="">
      <p className="font-normal font-sans">{productTitle}</p>
      {isVariant && (
        <p className="font-normal font-sans inline-block w-full overflow-hidden text-ellipsis text-muted-foreground">
          Variant: {variantOptions}
        </p>
      )}
    </div>
  )
}
