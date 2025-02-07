'use client'

import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { CheckoutSession } from '@/lib/types/checkout'
import { EmailStep } from './steps/email-step'
import { useRouter } from 'next/navigation'
import { updateCheckoutStep } from '@/lib/data/checkout'
import { PaymentStep } from './steps/payment-step'
import { BillingStep } from './steps/billing-step'
import { ShippingStep } from './steps/shipping-step'
import { CheckoutProvider } from './checkout-context'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  initialSession: CheckoutSession
}

export function CheckoutForm({ initialSession }: CheckoutFormProps) {
  const [session, setSession] = useState<CheckoutSession>(initialSession)
  const [currentStep, setCurrentStep] = useState<number>(getInitialStep(initialSession))
  const router = useRouter()

  // Update session when steps are completed
  const handleStepComplete = async (
    step: keyof CheckoutSession['steps'],
    data: Partial<CheckoutSession['steps'][typeof step]>,
  ) => {
    const updatedSession = await updateCheckoutStep({
      cartId: session.cartId,
      step,
      data: {
        ...data,
        completed: true,
      },
    })

    if (updatedSession) {
      setSession(updatedSession)
      setCurrentStep((prev) => prev + 1)
    }
  }

  // Handle step back
  const handleStepBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  // // Redirect to cart if session expires
  // useEffect(() => {
  //   const checkExpiry = () => {
  //     if (Date.now() > session.expiresAt) {
  //       router.push('/shop/cart')
  //     }
  //   }

  //   const interval = setInterval(checkExpiry, 1000)
  //   return () => clearInterval(interval)
  // }, [session.expiresAt, router])

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: session.clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <CheckoutProvider initialSession={session}>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Steps currentStep={currentStep} />
          </div>

          <div className="space-y-8">
            {currentStep === 0 && (
              <EmailStep
                initialEmail={session.steps.email.value}
                onComplete={(data) => handleStepComplete('email', data)}
              />
            )}

            {currentStep === 1 && (
              <ShippingStep
                initialAddress={session.steps.shipping.address}
                onComplete={(data) => handleStepComplete('shipping', data)}
                onBack={handleStepBack}
              />
            )}

            {currentStep === 2 && (
              <BillingStep
                initialAddress={session.steps.billing.address}
                shippingAddress={session.steps.shipping.address}
                initialSameAsShipping={session.steps.billing.sameAsShipping}
                onComplete={(data) => handleStepComplete('billing', data)}
                onBack={handleStepBack}
              />
            )}

            {currentStep === 3 && <PaymentStep session={session} onBack={handleStepBack} />}
          </div>
        </div>
      </CheckoutProvider>
    </Elements>
  )
}

function getInitialStep(session: CheckoutSession): number {
  if (!session.steps.email.completed) return 0
  if (!session.steps.shipping.completed) return 1
  if (!session.steps.billing.completed) return 2
  if (!session.steps.payment.completed) return 3
  return 0
}

function Steps({ currentStep }: { currentStep: number }) {
  const steps = ['Email', 'Shipping', 'Billing', 'Payment']

  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex items-center ${index === steps.length - 1 ? '' : 'flex-1'}`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index === currentStep
                ? 'border-blue-600 bg-blue-600 text-white'
                : index < currentStep
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 text-gray-500'
            }`}
          >
            {index < currentStep ? '✓' : index + 1}
          </div>
          <div
            className={`flex-1 h-0.5 mx-2 ${
              index === steps.length - 1
                ? 'hidden'
                : index < currentStep
                  ? 'bg-green-600'
                  : 'bg-gray-300'
            }`}
          />
          <span
            className={`absolute mt-10 text-sm ${
              index === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  )
}
