import { TooltipProvider } from '@components/ui/tooltip'
import { ShopHeader } from '@components/layout/headers/shop'
import { CartDrawer } from '@/components/shop/cart/drawer/cart-drawer'
import { CartDrawerProvider } from '@/components/shop/cart/drawer/cart-drawer-context'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <CartDrawerProvider>
        <ShopHeader />
        <TooltipProvider>
          <div className="flex-1">
            {children}
            <CartDrawer />
          </div>
        </TooltipProvider>
      </CartDrawerProvider>
    </div>
  )
}
