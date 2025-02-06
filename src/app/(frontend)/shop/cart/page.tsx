import { getCart } from '@/lib/data/cart'
import type { Metadata } from 'next/types'
import { CartEmpty } from '@/components/shop/cart/cart-empty'
import { SignInPrompt } from '@/components/shop/cart/sign-in-prompt'
import { CartSummaryList } from '@/components/shop/cart/summary/cart-summary-list'
import { Suspense } from 'react'
import SkeletonCartPage from '@/components/shop/skeletons/layout/skeleton-cart-page'
import { CheckoutButton } from '@/components/shop/cart/checkout-button'
import { getCustomerDTO } from '@/lib/data/customer'

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

  const handleCheckout = () => {
    console.log('handleCheckout')
  }

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingCost = 25.0 // This should come from your shipping configuration
  const taxRate = 0.13 // This should come from your tax configuration
  const taxCost = (subtotal + shippingCost) * taxRate
  const total = subtotal + shippingCost + taxCost

  return (
    <Suspense fallback={<SkeletonCartPage />}>
      <SignInPrompt />
      <div className="min-h-[calc(100dvh-7rem)] lg:grid lg:grid-cols-12 lg:gap-x-8 container mx-auto">
        <div className="my-8 lg:col-span-7">
          <div className="sticky top-24">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
              <CartSummaryList items={structuredClone(cart.items)} />
            </div>
          </div>
        </div>
        <div className="my-8 lg:col-span-5">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cart.subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${cart.subtotal}</span>
                  </div>
                </div>

                <CheckoutButton
                  amount={total}
                  currencyCode="CAD"
                  cartId={cart.id}
                  redirectTo="/shop/checkout"
                  lineItems={cart.items.map((item) => ({
                    price: item.price.toString(),
                    quantity: item.quantity,
                  }))}
                  customerEmail={customer?.email}
                  customerId={customer?.id}
                  stripeCustomerId={customer?.stripeCustomerId}
                  shippingMethod="pickup"
                  shippingTotal={shippingCost}
                  taxAmount={taxCost}
                  description="Thank you for shopping at BonaVista LeisureScapes"
                  key={cart.id}
                />
              </div>
              {/* <Suspense fallback={<div>Loading...</div>}>
                <StripePayment
                  cartShippingRateId={''}
                  shippingRates={[]}
                  allProductsDigital={false}
                  locale={locale}
                  customer={customer}
                />
              </Suspense> */}
            </section>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
