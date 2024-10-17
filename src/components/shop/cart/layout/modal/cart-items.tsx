import React, { Suspense } from 'react'
import { ScrollArea } from '@components/ui/scroll-area'
import type { CartItem } from '@lib/types/cart'
import { Media } from '@components/payload/Media'
import type { Media as MediaType } from '@payload-types'
import { CartEmpty } from './cart-empty'
import { CartItemQuantity } from '../../components/cart-item-quantity'
import { getCart } from '@lib/data/cart'
import Spinner from '@components/ui/spinner'

export async function CartItems() {
  const cart = await getCart()

  return (
    <Suspense fallback={<Spinner />}>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {cart && cart.items?.length > 0 ? (
            <React.Fragment>
              {cart.items?.map((item) => <CartItemRow key={item.id} item={item} />)}
            </React.Fragment>
          ) : (
            <CartEmpty />
          )}
        </div>
      </ScrollArea>
    </Suspense>
  )
}

function CartItemRow({ item }: { item: CartItem }) {
  if (!item.product) {
    return null
  }

  if (typeof item.product === 'string') {
    return <div>{item.id}</div>
  }

  const { title, gallery, enableVariants, variants, baseProduct } = item.product

  const price = enableVariants ? variants.variantProducts[0].price : baseProduct?.price

  return (
    <div className="flex items-center space-x-4">
      {gallery && gallery.length > 0 && (
        <div className="w-16 h-16">
          <Media resource={gallery[0].image as MediaType} imgClassName="object-cover" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{price}</p>
        <CartItemQuantity item={item} />
        {/* <div className="flex items-center mt-1">
          <EditItemQuantityButton item={item} type="minus" />
          <span className="mx-2 text-sm">{item.quantity}</span>
          <EditItemQuantityButton item={item} type="plus" />
        </div> */}
      </div>
      {/* <RemoveItemButton item={item} /> */}
    </div>
  )
}
