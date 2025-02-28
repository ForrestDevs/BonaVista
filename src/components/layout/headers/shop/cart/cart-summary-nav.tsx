import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { ShoppingBagIcon } from 'lucide-react'
import { Suspense } from 'react'
import { CartLink } from '@/components/layout/headers/shop/cart/cart-link'
import { getCart } from '@/lib/data/cart'
import { formatMoney } from '@/lib/utils/formatMoney'

const CartFallback = () => (
  <div className="h-6 w-6 opacity-30">
    <ShoppingBagIcon />
  </div>
)

export const CartSummaryNav = () => {
  return (
    <Suspense fallback={<CartFallback />}>
      <CartSummaryNavInner />
    </Suspense>
  )
}

const CartSummaryNavInner = async () => {
  const cart = await getCart()
  if (!cart) {
    return <CartFallback />
  }
  if (!cart.lineItems.length) {
    return <CartFallback />
  }

  const total = cart.lineItems.reduce(
    (acc, item) => acc + item.lineItem.price * item.lineItem.quantity,
    0,
  )
  const totalItems = cart.lineItems.reduce((acc, item) => acc + item.lineItem.quantity, 0)

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div>
            <CartLink>
              <ShoppingBagIcon />
              <span className="absolute bottom-0 right-0 inline-flex h-5 w-5 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-white text-center text-xs">
                <span className="sr-only">Items in cart: </span>
                {totalItems}
              </span>
              <span className="sr-only">
                Total: {formatMoney({ amount: total, currency: 'CAD' })}
              </span>
            </CartLink>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={25}>
          <p>Items: {totalItems}</p>
          <p>Total: {formatMoney({ amount: total, currency: 'CAD' })}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
