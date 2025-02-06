'use client'

import { beginCheckoutSession } from '@/lib/data/checkout'
import { BeginCheckoutParams } from '@/lib/types/checkout'

export function CheckoutButton(props: BeginCheckoutParams) {
  const handleCheckout = async () => {
    await beginCheckoutSession(props)
  }

  return (
    <button
      onClick={() => handleCheckout()}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Proceed to Checkout
    </button>
  )
}
