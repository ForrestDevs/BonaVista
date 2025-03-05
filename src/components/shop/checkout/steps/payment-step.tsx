'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useCheckoutSession } from '../checkout-context'
import { getOrCreateStripeCustomer, storeHashedPaymentIntent } from '@/lib/data/checkout'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function PaymentStep() {
  const stripe = useStripe()
  const router = useRouter()
  const elements = useElements()
  const { session, isPending, startTransition, setError, handleStepComplete } = useCheckoutSession()
  const [isLoading, setIsLoading] = useState(false)

  const isDisabled = !session.steps.billing.completed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || isPending || isDisabled) {
      return
    }

    try {
      startTransition(async () => {
        setIsLoading(true)
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
            return_url: `${process.env.NEXT_PUBLIC_URL}/shop/confirmation?cartId=${session.cartId}&pid=${hashedPaymentIntent}`,
          },
          redirect: 'if_required',
        })

        if (paymentError) {
          throw paymentError
        }

        handleStepComplete('payment', {
          method: paymentIntent.status,
          completed: true,
        })

        const params = new URLSearchParams({
          pid: hashedPaymentIntent,
          cart_id: session.cartId.toString(),
        })
        router.push('/shop/confirmation?' + params.toString())
      })
    } catch (error: any) {
      console.error('[PaymentStep] Unexpected error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`space-y-6 ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <p className="text-sm text-gray-500">Complete your purchase securely</p>

      <div className="space-y-6">
        <PaymentElement />
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isDisabled || isPending || !stripe || !elements || isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? <LoadingSpinner className="text-white" /> : 'Complete Order'}
      </Button>
    </div>
  )
}
