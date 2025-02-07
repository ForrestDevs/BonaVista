'use client'

import { useCartModal } from '@/components/shop/cart/drawer/cart-drawer-context'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { YnsLink } from '@components/ui/link'

export const CartLink = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const { setOpen } = useCartModal()
  return (
    <YnsLink
      href="/shop/cart"
      onClick={(e) => {
        e.preventDefault()
        if (pathname === '/shop/cart') {
          return
        }
        const buttonElement = document.activeElement as HTMLElement // Get the currently focused element
        buttonElement.blur()
        setOpen(true)
      }}
      scroll={false}
      className="relative block h-6 w-6"
      prefetch={true}
    >
      {children}
    </YnsLink>
  )
}
