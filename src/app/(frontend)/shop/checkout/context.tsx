'use client'

import { createContext, useContext, useState, useEffect, useMemo, useRef, useTransition } from 'react'
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { type StripeElementLocale, StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import { invariant } from '@/lib/utils/invariant'
import { CustomerDTO } from '@/lib/data/customer'
import { StripeElementsContainer } from '@/components/shop/stripe-elements-container'
import { CheckoutSession } from '@/lib/types/checkout'
import { useDebouncedValue } from '@/lib/hooks/useDebounce'

type CheckoutFormData = {
  email: string
  firstName: string
  lastName: string
  phone: string
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
  isReady: {
    linkAuthentication: boolean
    address: boolean
    payment: boolean
  }
  formErrorMessage: string | null
  setFormErrorMessage: (value: string | null) => void
  isBillingAddressPending: boolean
  debouncedBillingAddress: CheckoutFormData['billing']
  isLoading: boolean
  isTransitioning: boolean
  transition: (fn: () => Promise<void>) => void
  setIsLoading: (value: boolean) => void
  setIsReady: (key: keyof CheckoutContextType['isReady'], value: boolean) => void
  formData: CheckoutFormData
  updateFormData: (section: keyof CheckoutFormData, data: any) => void
  sameAsShipping: boolean
  setSameAsShipping: (value: boolean) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function CheckoutProvider({
  children,
  checkoutSession,
}: {
  children: React.ReactNode
  checkoutSession: CheckoutSession
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
    firstName: '',
    lastName: '',
    phone: '',
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

  const [isLoading, setIsLoading] = useState(false)
  const [isTransitioning, transition] = useTransition()
  const [sameAsShipping, setSameAsShipping] = useState(false)
  const [isBillingAddressPending, debouncedBillingAddress] = useDebouncedValue(
    formData.billing,
    1000,
  )
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

 

  return (
    <CheckoutContext.Provider
      value={{
        formErrorMessage,
        setFormErrorMessage,
        isBillingAddressPending,
        debouncedBillingAddress,
        isLoading,
        setIsLoading,
        isTransitioning,
        transition,
        isGuestCheckout,
        setIsGuestCheckout,
        clearCheckoutState,
        step,
        setStep,
        // customer,
        isReady,
        setIsReady,
        formData,
        updateFormData,
        sameAsShipping,
        setSameAsShipping,
      }}
    >
      <StripeElementsContainer clientSecret={checkoutSession.clientSecret}>
        {children}
      </StripeElementsContainer>
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
