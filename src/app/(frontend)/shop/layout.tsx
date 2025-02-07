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

function Test() {
  // <!-- Note :
  // - You can modify the font style and form style to suit your website.
  // - Code lines with comments Do not remove this code are required for the form to work properly, make sure that you do not remove these lines of code.
  // - The Mandatory check script can modified as to suit your business needs.
  // - It is important that you test the modified form before going live.-->

  return <></>
}
