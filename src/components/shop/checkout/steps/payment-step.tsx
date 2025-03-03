'use client'

import { Button } from '@/components/ui/button'
import { getOrCreateStripeCustomer, storeHashedPaymentIntent } from '@/lib/data/checkout'
import { CheckoutSession } from '@/lib/types/checkout'
import { formatStripeMoney } from '@/lib/utils/formatMoney'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface PaymentStepProps {
  session: CheckoutSession
  isProcessing?: boolean
  isDisabled?: boolean
}

export function PaymentStep({
  session,
  isProcessing = false,
  isDisabled = false,
}: PaymentStepProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || isProcessing || isDisabled || isPending) return

    try {
      startTransition(async () => {
        setError(null)

        // If we have an email but no customer ID, create or get the customer
        if (session.steps.email.value && !session.stripeCustomerId) {
          const customerId = await getOrCreateStripeCustomer(
            session.steps.email.value,
            session.steps.shipping.address,
          )
          if (!customerId) {
            throw new Error('Failed to create customer')
          }
        }

        // Confirm the payment
        const { error: submitError } = await elements.submit()
        if (submitError) {
          throw submitError
        }

        const hashedPaymentIntent = await storeHashedPaymentIntent(
          session.paymentIntentId,
          session.clientSecret,
        )

        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/shop/confirmation?cartId=${session.cartId}&pid=${hashedPaymentIntent}`,
          },
          redirect: 'if_required',
        })

        if (paymentError) {
          throw paymentError
        }

        const params = new URLSearchParams({
          pid: hashedPaymentIntent,
          cart_id: session.cartId.toString(),
        })
        router.push('/shop/confirmation?' + params.toString())
      })
    } catch (error: any) {
      console.error('Payment error:', error)
      setError(error.message || 'Something went wrong')
    }
  }

  return (
    <div className={`space-y-6 ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <p className="text-sm text-gray-500">Complete your purchase securely</p>

      <div className="space-y-6">
        <PaymentElement />
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <Button
        type="button"
        className="w-full"
        disabled={isProcessing || isDisabled || isPending || !stripe || !elements}
        onClick={handleSubmit}
      >
        {isPending ? 'Processing Payment...' : 'Pay Now'}
      </Button>
    </div>
  )
}
