'use client'

import { CheckoutSession } from '@/lib/types/checkout'
import { createContext, useContext, ReactNode, useState } from 'react'

interface CheckoutContextType {
  session: CheckoutSession
  updateSession: (session: CheckoutSession) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

interface CheckoutProviderProps {
  children: ReactNode
  initialSession: CheckoutSession
}

export function CheckoutProvider({ children, initialSession }: CheckoutProviderProps) {
  const [session, setSession] = useState<CheckoutSession>(initialSession)

  const updateSession = (newSession: CheckoutSession) => {
    setSession(newSession)
  }

  return (
    <CheckoutContext.Provider value={{ session, updateSession }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckoutContext must be used within a CheckoutProvider')
  }
  return context
} 


