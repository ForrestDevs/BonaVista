import { Suspense } from 'react'
import { ShoppingBagIcon } from 'lucide-react'
// import { getLocale, getTranslations } from 'next-intl/server'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { YnsLink } from '@/components/ui/link'
import Link from 'next/link'
// import { formatMoney } from '@/lib/utils/formatMoney'
// import { useCart } from '@/lib/providers/Cart'

// const CartFallback = () => (
//   <div className="mr-2.5 h-6 w-6 opacity-30">
//     <ShoppingBagIcon />
//   </div>
// )

// export const CartSummaryNav = () => {
//   return (
//     <Suspense fallback={<CartFallback />}>
//       <CartSummaryNavInner />
//     </Suspense>
//   )
// }

export function CartSummaryNavInner() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div>
            <Link
              href="/store/cart-overlay"
              scroll={false}
              className="relative mr-2.5 block h-6 w-6"
              prefetch={true}
            >
              <ShoppingBagIcon />
              <span className="absolute bottom-0 right-0 inline-flex h-5 w-5 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-white text-center text-xs">
                <span className="sr-only">Items in cart</span>
                <span>1</span>
              </span>
              <span className="sr-only">Total: $100</span>
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={25}>
          <p>Cart</p>
          <p>Total: $100</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
