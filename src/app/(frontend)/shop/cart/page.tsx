import { getCart } from '@/lib/data/cart'
import type { Metadata } from 'next/types'
import { CartEmpty } from '@/components/shop/cart/cart-empty'
import { SignInPrompt } from '@/components/shop/cart/sign-in-prompt'
import { CartSummaryList } from '@/components/shop/cart/summary/cart-summary-list'
import { CartSummaryTotals } from '@/components/shop/cart/summary/cart-summary-totals'
import { Suspense } from 'react'
import SkeletonCartPage from '@/components/shop/skeletons/layout/skeleton-cart-page'
import { getCustomerDTO } from '@/lib/data/customer'
import { CartSummaryProvider } from '@/components/shop/cart/summary/cart-summary-context'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Shopping Cart | BonaVista LeisureScapes',
    description: 'Your shopping cart',
  }
}

export default async function CartPage() {
  const cart = await getCart(2)
  const customer = await getCustomerDTO()

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100dvh-7rem)] container">
        <CartEmpty />
      </div>
    )
  }

  return (
    <Suspense fallback={<SkeletonCartPage />}>
      <SignInPrompt />
      <CartSummaryProvider>
        <div className="min-h-[calc(100dvh-7rem)] lg:grid lg:grid-cols-12 lg:gap-x-8 container mx-auto">
          <div className="my-8 lg:col-span-7">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
                <CartSummaryList cart={cart} />
              </div>
            </div>
          </div>
          <div className="my-8 lg:col-span-5">
            <div className="sticky top-24">
              <CartSummaryTotals cart={cart} customer={customer} />
            </div>
          </div>
        </div>
      </CartSummaryProvider>
    </Suspense>
  )
}
