import { Suspense } from 'react'
import { ShoppingBagIcon } from 'lucide-react'
// import { getLocale, getTranslations } from 'next-intl/server'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { YnsLink } from '@/components/ui/link'
import Link from 'next/link'
import { CartBadge, CartTooltipData } from './cart-tooltip-data'

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
            <YnsLink
              href="/shop/cart-overlay"
              scroll={false}
              className="relative mr-2.5 block h-6 w-6"
              prefetch={true}
            >
              <ShoppingBagIcon />
              <CartBadge />
            </YnsLink>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={25}>
          <CartTooltipData />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
