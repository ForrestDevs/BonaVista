import type { ReactNode } from 'react'
import { CartAsideDrawer } from './CartAsideDrawer'

export const CartAsideContainer = ({
  children,
}: {
  children: ReactNode
  withAnimations: boolean
}) => {
  return (
    <CartAsideDrawer>
      <div className="flex h-full min-h-[80vh] flex-col">{children}</div>
    </CartAsideDrawer>
  )
}
