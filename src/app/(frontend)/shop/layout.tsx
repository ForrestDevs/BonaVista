import { ShopFooter } from '@components/layout/footers/shop'
import { ShopHeader } from '@components/layout/headers/shop'
import { TooltipProvider } from '@components/ui/tooltip'

export default async function StoreLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <div>
      <ShopHeader />
      <TooltipProvider>
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-6 sm:px-6 lg:px-8">
          {children}
          {modal}
        </main>
      </TooltipProvider>
      {/* <ShopFooter /> */}
    </div>
  )
}
