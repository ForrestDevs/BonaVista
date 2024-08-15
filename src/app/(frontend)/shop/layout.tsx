import { Nav, StoreHeader } from '@/components/store/layout/nav/Nav'
import { TooltipProvider } from '@/components/ui/tooltip'

export default async function StoreLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <>
      <StoreHeader />
      <TooltipProvider>
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-6 sm:px-6 lg:px-8">
          {children}
          {modal}
        </main>
      </TooltipProvider>
    </>
  )
}
