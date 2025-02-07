import { getStoredCheckoutSession } from '@/lib/data/checkout'
import { CheckoutForm } from '@/components/shop/checkout/checkout-form'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

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
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm initialSession={session} />
      </div>
    </div>
  )
}
