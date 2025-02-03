import { Media } from '@/components/payload/Media'
import { YnsLink } from '@/components/ui/link'
import { CartItem } from '@/lib/types/cart'
import React from 'react'

export function CartItemThumbnail({ item }: { item: CartItem }) {
  const product = typeof item.product === 'object' ? item.product : null
  const isVariant = item.isVariant
  // const thumbnail = isVariant
  //   ? (product?.variants.variantProducts.find((v) =>
  //       v.options.every((o, i) => o === item.variant[i].option),
  //     )?.images[0]?.image ?? null)
  //   : (product?.baseProduct?.images[0]?.image ?? null)

  return (
    <div className="sm:w-24 w-12">
      <YnsLink
        className="transition-colors hover:text-muted-foreground w-full"
        href={`/product/${product?.slug}`}
      >
        <div className="rounded-lg relative w-full overflow-hidden transition-shadow ease-in-out duration-150 aspect-[1/1] border border-muted">
          {/* {thumbnail ? (
            <Media
              imgClassName="object-cover w-full h-full absolute inset-0"
              resource={thumbnail}
            //   fill
            //   width={300}
            //   height={300}
            />
          ) : (
            <div className="aspect-square rounded-md object-cover bg-muted-foreground"></div>
          )} */}
          <div className="aspect-square rounded-md object-cover bg-muted-foreground"></div>
        </div>
      </YnsLink>
    </div>
  )
}

export default function CartItemDetails({ item }: { item: CartItem }) {
  const productTitle = typeof item.product === 'object' ? item.product.title : item.product
  const isVariant = item.isVariant
  const variantOptions = isVariant ? item.variant.map((v) => v.option).join(', ') : null

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
