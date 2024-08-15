import { type ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
// import { getCartFromCookiesAction } from '@/actions/cartActions'

// import { CartSummaryTable } from '@/components/shop/checkout/CartSummaryTable'
// import { CartEmpty } from '@/components/shop/checkout/CartEmpty'
// import { StripeElementsContainer } from '@/components/shop/checkout/StripeElementsContainer'

export default async function CartLayout({ children }: { children: ReactNode }) {
  // const cart = await getCartFromCookiesAction()
  // if (!cart?.cart.client_secret || cart.lines.length === 0) {
  //   return <CartEmpty />
  // }
  // const t = await getTranslations('/cart.page')

  return (
    <div className="min-h-[calc(100dvh-7rem)] xl:grid xl:grid-cols-12 xl:gap-x-8">
      <div className="my-8 xl:col-span-7">
        <div className="sticky top-1">
          <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight">Cart</h1>
          {/* <CartSummaryTable cart={structuredClone(cart)} /> */}
        </div>
      </div>
      <div className="my-8 max-w-[65ch] xl:col-span-5">{children}</div>
    </div>
    // <StripeElementsContainer client_secret={cart.cart.client_secret}>

    // </StripeElementsContainer>
  )
}
