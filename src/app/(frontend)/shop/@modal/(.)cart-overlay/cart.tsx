'use client'

import { Fragment } from 'react'
import { useCart } from '@/lib/providers/Cart'

export default function CartModalPage() {
  const { cart } = useCart()
  return (
    <Fragment>
      {cart?.items?.map((item) => <pre key={item.id}>{JSON.stringify(item.product, null, 2)}</pre>)}
    </Fragment>
  )
}
