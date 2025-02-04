import { TooltipProvider } from '@components/ui/tooltip'
import { ShopHeader } from '@components/layout/headers/shop'
import { CartModalPage } from '@components/shop/cart/drawer/cart-modal'
import { CartModalProvider } from '@components/shop/cart/context/cart-context'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <CartModalProvider>
        <ShopHeader />
        <TooltipProvider>
          <div className="flex-1">
            {children}
            <CartModalPage />
          </div>
        </TooltipProvider>
      </CartModalProvider>
    </div>
  )
}
