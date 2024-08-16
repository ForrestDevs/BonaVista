import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'
import { ResponsiveDrawer } from '@/components/shop/layout/responsive-drawer'
import CartModalPage from './cart'
import CartClose from './cart-close'
import { DialogClose } from '@/components/ui/dialog'
import Link from 'next/link'

export default function CartOverlay() {
  return (
    <ResponsiveDrawer>
      <CartHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mt-8">
          <CartModalPage />
          {/* <ul role="list" className="-my-6 divide-y divide-neutral-200">
            <li className="grid grid-cols-[4rem,1fr,max-content] grid-rows-[auto,auto] gap-x-4 gap-y-2 py-6">
              <div className="relative aspect-square w-full">HELLO WORLD</div>
            </li>
          </ul> */}
        </div>
      </div>

      <CartFooter />
    </ResponsiveDrawer>
  )
}

function CartHeader() {
  return (
    <div className="px-4 py-6 border-b flex items-center justify-between">
      <h2 className="text-lg font-semibold">Your Cart</h2>
      <YnsLink href="/shop/cart" className="text-sm text-muted-foreground underline">
        Open full view
      </YnsLink>
    </div>
  )
}

function CartFooter() {
  return (
    <div className="p-4 border-t">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium">Subtotal</span>
        <span className="text-lg font-semibold">$137.21</span>
      </div>
      <Link href="/shop/checkout">
        <Button className="w-full mb-2">Proceed to Checkout</Button>
      </Link>
      <CartClose />
    </div>
  )
}
