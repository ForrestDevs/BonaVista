import { getStoredCheckoutSession } from '@/lib/data/checkout'
import { CheckoutForm } from '@/components/shop/checkout/checkout-form'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { CheckoutProvider } from '@/components/shop/checkout/checkout-context'
import { getCustomer } from '@/lib/data/customer'
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Checkout',
  }
}

export default async function CheckoutPage() {
  const session = await getStoredCheckoutSession({ redirectTo: '/shop/cart' })
  const authenticatedCustomer = await getCustomer()

  if (!session) {
    redirect('/shop/cart')
  }

  return (
    <div className="container py-4">
      <div className="space-y-4">
        <div className="border-b pb-6 mb-2">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely in just a few steps.</p>
        </div>
        <CheckoutProvider initialSession={session} authenticatedCustomer={authenticatedCustomer}>
          <CheckoutForm />
        </CheckoutProvider>
      </div>
    </div>
  )
}
