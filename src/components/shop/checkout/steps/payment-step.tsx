'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getOrCreateStripeCustomer } from '@/lib/data/checkout'
import { CheckoutSession } from '@/lib/types/checkout'
import { formatMoney } from '@/lib/utils/formatMoney'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface PaymentStepProps {
  session: CheckoutSession
  onBack: () => void
}

export function PaymentStep({ session, onBack }: PaymentStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    try {
      setIsLoading(true)
      setError(null)

      // If we have an email but no customer ID, create or get the customer
      if (session.steps.email.value && !session.stripeCustomerId) {
        const customerId = await getOrCreateStripeCustomer(session.steps.email.value)
        if (!customerId) {
          throw new Error('Failed to create customer')
        }
      }

      // Confirm the payment
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw submitError
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/shop/confirmation?cartId=${session.cartId}`,
        },
        redirect: 'if_required',
      })

      if (paymentError) {
        throw paymentError
      }

      const params = new URLSearchParams({
        payment_intent: paymentIntent.id,
        payment_intent_client_secret: paymentIntent.client_secret ?? '',
        cart_id: session.cartId,
      })
      router.push('/shop/confirmation?' + params.toString())
    } catch (error: any) {
      console.error('Payment error:', error)
      setError(error.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Payment</h2>
          <p className="text-sm text-gray-500">Complete your purchase securely</p>
        </div>

        <div className="space-y-6">
          <PaymentElement />

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {session.amount}
                  {/* {formatMoney({ amount: session.amount, currency: session.currencyCode })} */}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {session.shippingTotal}
                  {/* {formatMoney({ amount: session.shippingTotal, currency: session.currencyCode })} */}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>
                  {session.taxAmount}
                  {/* {formatMoney({ amount: session.taxAmount, currency: session.currencyCode })} */}
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>
                  {session.amount + session.shippingTotal + session.taxAmount}
                  {/* {formatMoney({
                    amount: session.amount + session.shippingTotal + session.taxAmount,
                    currency: session.currencyCode,
                  })} */}
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <div className="flex justify-between space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full"
            disabled={isLoading}
          >
            Back
          </Button>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
