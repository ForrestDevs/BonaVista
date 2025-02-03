import Stripe from 'stripe'
import { getCart } from '@/lib/data/cart'
import type { Metadata } from 'next/types'
import { getCustomerDTO } from '@/lib/data/customer'
import { StripePayment } from '@/components/shop/stripe-payment'
import { CartEmpty } from '@/components/shop/cart/cart-empty'
import { SignInPrompt } from '@/components/shop/cart/sign-in-prompt'
import { CartSummaryTable } from '@/components/shop/cart/cart-summary-table'
import { StripeElementsContainer } from '@/components/shop/stripe-elements-container'
import { Suspense } from 'react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Shopping Cart | BonaVista LeisureScapes',
    description: 'Your shopping cart',
  }
}

export default async function CartPage() {
  const cart = await getCart(2)
  const customer = await getCustomerDTO()
  const locale = 'en-CA'

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100dvh-7rem)] container">
        <CartEmpty />
      </div>
    )
  }

  const paymentIntent = cart.payment_intent as unknown as Stripe.PaymentIntent
  const clientSecret = paymentIntent.client_secret

  return (
    <StripeElementsContainer clientSecret={clientSecret} currentLocale={locale}>
      <SignInPrompt />
      <div className="min-h-[calc(100dvh-7rem)] lg:grid lg:grid-cols-12 lg:gap-x-8 container mx-auto">
        <div className="my-8 lg:col-span-7">
          <div className="sticky top-24">
            <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight">Cart</h1>
            <CartSummaryTable cart={structuredClone(cart)} />
          </div>
        </div>
        <div className="my-8 w-full lg:col-span-5">
          <section className="flex flex-col max-w-md pb-12 gap-4">
            <h2 className="text-3xl font-bold leading-none tracking-tight">Checkout</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <StripePayment
                cartShippingRateId={''}
                shippingRates={[]}
                allProductsDigital={false}
                locale={locale}
                customer={customer}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </StripeElementsContainer>
  )
}
