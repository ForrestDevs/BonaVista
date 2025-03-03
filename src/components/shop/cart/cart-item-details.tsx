import { Media } from '@/components/payload/Media'
import { YnsLink } from '@/components/ui/link'
import { CartItem } from '@/lib/types/cart'
import React from 'react'

export function CartItemThumbnail({ line }: { line: CartItem }) {
  const product = typeof line.lineItem.product === 'object' ? line.lineItem.product : null
  const isVariant = line.lineItem.isVariant
  const thumbnail = isVariant
    ? product?.variants.variantProducts.find((v) => v.sku === line.lineItem.sku)?.images[0]?.image
    : product?.baseProduct?.images[0]?.image

  return (
    <div className="sm:w-24 w-12">
      <YnsLink
        className="transition-colors hover:text-muted-foreground w-full"
        href={`/product/${product?.slug}`}
      >
        <div className="rounded-lg relative w-full overflow-hidden transition-shadow ease-in-out duration-150 aspect-1/1 border border-muted">
          {thumbnail ? (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-neutral-200">
              <Media
                resource={thumbnail}
                imgClassName="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="h-24 w-24 shrink-0 rounded-md bg-neutral-100" />
          )}
        </div>
      </YnsLink>
    </div>
  )
}

export default function CartItemDetails({ item }: { item: CartItem }) {
  const productTitle =
    typeof item.lineItem.product === 'object' ? item.lineItem.product.title : item.lineItem.product
  const isVariant = item.lineItem.isVariant
  const variantOptions = isVariant
    ? item.lineItem.variantOptions?.map((v) => v.value.label).join(', ')
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
