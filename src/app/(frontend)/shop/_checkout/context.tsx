'use client'

import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { type StripeElementLocale, StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import { invariant } from '@/lib/utils/invariant'
import { CustomerDTO } from '@/lib/data/customer'

type CheckoutFormData = {
  email: string
  shipping: {
    name: string
    phone: string
    address: {
      line1: string
      line2?: string
      city: string
      state?: string
      postal_code: string
      country: string
    }
  }
  billing: {
    same_as_shipping: boolean
    name?: string
    phone?: string
    address?: {
      line1: string
      line2?: string
      city: string
      state?: string
      postal_code: string
      country: string
    }
  }
  payment: {
    method?: string
  }
}

type CheckoutContextType = {
  isGuestCheckout: boolean
  setIsGuestCheckout: (value: boolean) => void
  clearCheckoutState: () => void
  step: 'email' | 'delivery' | 'payment' | 'confirm'
  setStep: (step: 'email' | 'delivery' | 'payment' | 'confirm') => void
  customer: CustomerDTO | null
  isReady: {
    linkAuthentication: boolean
    address: boolean
    payment: boolean
  }
  formErrorMessage: string | null
  setFormErrorMessage: (value: string | null) => void
  isBillingAddressPending: boolean
  isLoading: boolean
  isTransitioning: boolean
  setIsBillingAddressPending: (value: boolean) => void
  setIsLoading: (value: boolean) => void
  setIsTransitioning: (value: boolean) => void
  setIsReady: (key: keyof CheckoutContextType['isReady'], value: boolean) => void
  formData: CheckoutFormData
  updateFormData: (section: keyof CheckoutFormData, data: any) => void
  sameAsShipping: boolean
  setSameAsShipping: (value: boolean) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function CheckoutProvider({
  children,
  clientSecret,
  publishableKey,
  stripeAccount,
  currentLocale,
  customer,
}: {
  children: React.ReactNode
  clientSecret?: string
  publishableKey?: string
  stripeAccount?: string
  currentLocale: string
  customer: CustomerDTO | null
}) {
  const [isGuestCheckout, setIsGuestCheckout] = useState(false)
  const [step, setStep] = useState<'email' | 'delivery' | 'payment' | 'confirm'>('email')
  const [isReady, setIsReadyState] = useState({
    linkAuthentication: false,
    address: false,
    payment: false,
  })
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    shipping: {
      name: '',
      phone: '',
      address: {
        line1: '',
        city: '',
        postal_code: '',
        country: '',
      },
    },
    billing: {
      same_as_shipping: false,
    },
    payment: {
      method: '',
    },
  })
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)
  const [isBillingAddressPending, setIsBillingAddressPending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [sameAsShipping, setSameAsShipping] = useState(false)


  const updateFormData = (section: keyof CheckoutFormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const setIsReady = (key: keyof typeof isReady, value: boolean) => {
    setIsReadyState((prev) => ({ ...prev, [key]: value }))
  }

  const clearCheckoutState = () => {
    setIsGuestCheckout(false)
    setStep('email')
    setIsReadyState({
      linkAuthentication: false,
      address: false,
      payment: false,
    })
  }

  // Stripe setup
  const stripePublishableKey = publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  invariant(stripePublishableKey, 'Stripe publishable key is required')
  const stripePromise = useMemo(
    () => loadStripe(stripePublishableKey, { stripeAccount }),
    [stripePublishableKey, stripeAccount],
  )

  if (!clientSecret) {
    return null
  }

  const options = {
    clientSecret,
    appearance: {
      variables: {
        fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
        fontSizeSm: '0.875rem',
        colorDanger: 'hsl(0 84.2% 60.2%)',
      },
    },
    locale: currentLocale as StripeElementLocale,
  } satisfies StripeElementsOptions

  return (
    <CheckoutContext.Provider
      value={{
        formErrorMessage,
        setFormErrorMessage,
        isBillingAddressPending,
        setIsBillingAddressPending,
        isLoading,
        setIsLoading,
        isTransitioning,
        setIsTransitioning,
        isGuestCheckout,
        setIsGuestCheckout,
        clearCheckoutState,
        step,
        setStep,
        customer,
        isReady,
        setIsReady,
        formData,
        updateFormData,
        sameAsShipping,
        setSameAsShipping,
      }}
    >
      <Elements stripe={stripePromise} options={options}>
        {children}
      </Elements>
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
}
