'use client'

import React from 'react'
import Image from 'next/image'
import { useCart } from '@/lib/providers/Cart'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { CartItem } from '@/lib/types/cart'
import { priceFromJSON } from '@/lib/utils/priceFromJSON'
import { DecreaseQuantityButton, IncreaseQuantityButton, RemoveItemButton } from './cart-actions'
import { Media } from '@/components/layout/media'
import type { Media as MediaType } from '@payload-types'

export function CartItems() {
  const { cart } = useCart()

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {cart?.items?.map((item) => <CartItemRow key={item.id} item={item} />)}
      </div>
    </ScrollArea>
  )
}

interface CartItemRowProps {
  item: CartItem
}

function CartItemRow({ item }: CartItemRowProps) {
  if (!item.product) {
    return null
  }

  if (typeof item.product === 'string') {
    return <div>{item.id}</div>
  }

  const { title, priceJSON, images } = item.product
  const price = priceFromJSON(priceJSON || '')

  return (
    <div className="flex items-center space-x-4">
      {images && images.length > 0 && (
        <div className="w-16 h-16">
          <Media resource={images[0].image as MediaType} imgClassName="object-cover" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{price}</p>
        <div className="flex items-center mt-1">
          <DecreaseQuantityButton item={item} />
          <span className="mx-2 text-sm">{item.quantity}</span>
          <IncreaseQuantityButton item={item} />
        </div>
      </div>
      <RemoveItemButton item={item} />
    </div>
  )
}
