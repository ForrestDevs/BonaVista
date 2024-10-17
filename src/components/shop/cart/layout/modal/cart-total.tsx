import React, { Suspense } from 'react'
import { getCart } from '@lib/data/cart'
import Spinner from '@components/ui/spinner'

export function CartTotal() {
  return (
    <Suspense fallback={<Spinner />}>
      <CartTotalContent />
    </Suspense>
  )
}

const CartTotalContent = async () => {
  const cart = await getCart()
  const cartTotal = cart?.subtotal

  if (!cart || !cartTotal) {
    return <div>Cart is empty</div>
  }

  return <span className="text-lg font-semibold">{cartTotal}</span>
}
