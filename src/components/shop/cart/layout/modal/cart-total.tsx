'use client'

import React from 'react'
import { useCart } from '@/lib/providers/Cart'

export function CartTotal() {
  const { cartTotal } = useCart()

  if (!cartTotal) {
    return <div>Cart is empty</div>
  }

  return <span className="text-lg font-semibold">{cartTotal.formatted}</span>
}
