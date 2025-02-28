import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { ShoppingBagIcon } from '@/components/icons/shopping-bag'
import { Suspense } from 'react'
import { CartLink } from '@/components/layout/headers/shop/cart/cart-link'
import { getCart } from '@/lib/data/cart'
import { formatMoney } from '@/lib/utils/formatMoney'

const CartFallback = () => (
  <div className="h-6 w-6 opacity-30">
    <ShoppingBagIcon className="h-6 w-6" />
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
          <div className="flex relative items-center justify-center min-w-10 min-h-10 rounded-full hover:bg-gray-100 transition-colors">
            <CartLink>
              <ShoppingBagIcon className="h-6 w-6" />
              <span className="absolute bottom-0 right-0 inline-flex h-4 w-4 translate-x-1/3 translate-y-1/3 items-center justify-center rounded-full border border-white bg-blue-600 text-[10px] font-medium text-white">
                <span className="sr-only">Items in cart: </span>
                {totalItems}
              </span>
              <span className="sr-only">
                Total: {formatMoney({ amount: total, currency: 'CAD' })}
              </span>
            </CartLink>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={30}>
          <p>Items: {totalItems}</p>
          <p>Total: {formatMoney({ amount: total, currency: 'CAD' })}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
