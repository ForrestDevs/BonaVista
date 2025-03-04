import { getStoredCheckoutSession } from '@/lib/data/checkout'
import { CheckoutForm } from '@/components/shop/checkout/checkout-form'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Checkout',
  }
}

export default async function CheckoutPage() {
  const session = await getStoredCheckoutSession({ redirectTo: '/shop/cart' })

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
        <CheckoutForm initialSession={session} />
      </div>
    </div>
  )
}
