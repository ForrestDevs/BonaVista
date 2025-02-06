'use client'

import { invariant } from '@/lib/utils/invariant'
import { Elements } from '@stripe/react-stripe-js'
import { type StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import { type ReactNode, useMemo } from 'react'

export const StripeElementsContainer = ({
  children,
  clientSecret,
}: {
  children: ReactNode
  clientSecret: string
}) => {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  invariant(stripePublishableKey, 'Stripe publishable key is required')
  const stripePromise = useMemo(() => loadStripe(stripePublishableKey), [stripePublishableKey])

  const options = {
    clientSecret: clientSecret,
    appearance: {
      variables: {
        fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
        fontSizeSm: '0.875rem',
        colorDanger: 'hsl(0 84.2% 60.2%)',
      },
    },
    locale: 'en-CA',
  } satisfies StripeElementsOptions

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
