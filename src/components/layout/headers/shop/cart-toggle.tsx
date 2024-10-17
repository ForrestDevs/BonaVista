import { ShoppingCartIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { YnsLink } from '@components/ui/link'
import { getCart } from '@lib/data/cart'

export async function CartToggle() {
  const cart = await getCart()
  const cartItemsCount = cart?.items?.length ?? 0
  const cartTotalAmount = cart?.subtotal ?? 0

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div>
            <YnsLink
              href="/shop/cart-overlay"
              scroll={false}
              className="relative mr-2.5 block h-6 w-6"
              prefetch={true}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute bottom-0 right-0 flex items-center justify-center w-3.5 h-3.5 text-xs text-center text-background bg-foreground rounded-full transform translate-x-1/3 translate-y-1/3">
                  <span className="sr-only">Items in cart: {cartItemsCount}</span>
                  <span className="sr-only">Total: ${cartTotalAmount}</span>
                  <span className="text-center text-xs pt-0.5">{cartItemsCount}</span>
                </span>
              )}
            </YnsLink>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={15} className="rounded-lg flex flex-col">
          <p>Items: {cartItemsCount}</p>
          <p>Total: ${cartTotalAmount}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
