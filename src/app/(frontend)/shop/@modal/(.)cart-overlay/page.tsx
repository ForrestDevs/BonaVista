import React from 'react'
import { ResponsiveDrawer } from '@/components/shop/layout/responsive-drawer'
import { CartItems } from '@/components/shop/cart/layout/modal/cart-items'
import { CartHeader } from '@/components/shop/cart/layout/modal/cart-header'
import { CartFooter } from '@/components/shop/cart/layout/modal/cart-footer'

export default function CartOverlay() {
  return (
    <ResponsiveDrawer>
      <CartHeader />
      <CartItems />
      <CartFooter />
    </ResponsiveDrawer>
  )
}
