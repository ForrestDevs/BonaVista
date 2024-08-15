import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'
import { ResponsiveDrawer } from '@/components/store/layout/responsive-drawer'

export default function CartModalPage() {
  return (
    <ResponsiveDrawer>
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cart</h2>
          <YnsLink href="/store/cart" className="text-sm text-muted-foreground underline">
            Open full view
          </YnsLink>
        </div>

        <div className="mt-8">
          <ul role="list" className="-my-6 divide-y divide-neutral-200">
            <li className="grid grid-cols-[4rem,1fr,max-content] grid-rows-[auto,auto] gap-x-4 gap-y-2 py-6">
              <div className="relative aspect-square w-full">HELLO WORLD</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t px-4 py-6 sm:px-6">
        <div
          id="cart-overlay-description"
          className="flex justify-between text-base font-medium"
        >
          <p>Total</p>
          <p>$100</p>
        </div>
        <p className="mt-0.5 text-sm text-neutral-500">Shipping and taxes info</p>
        <Button asChild={true} size={'lg'} className="mt-6 w-full rounded-full text-lg">
          <YnsLink href="/store/cart">Go to payment</YnsLink>
        </Button>
      </div>
    </ResponsiveDrawer>
  )
}
