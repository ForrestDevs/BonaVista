'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { CheckoutSession } from '@/lib/types/checkout'

interface CheckoutContextType {
  session: CheckoutSession
  updateSession: (session: CheckoutSession) => void
}

// Create context with default values
const CheckoutContext = createContext<CheckoutContextType>({
  session: {} as CheckoutSession,
  updateSession: () => {},
})

interface CheckoutProviderProps {
  initialSession: CheckoutSession
  children: React.ReactNode
}

export function CheckoutProvider({ initialSession, children }: CheckoutProviderProps) {
  const [session, setSession] = useState<CheckoutSession>(initialSession)

  // Update the session state, preserving completion status
  const updateSession = (newSession: CheckoutSession) => {
    console.log('[CheckoutContext] Updating session:', newSession);
    
    // Check if any step completion statuses are being inadvertently reset
    if (session.steps.email.completed && !newSession.steps.email.completed) {
      console.log('[CheckoutContext] Email step was reset, preserving completion status');
      newSession.steps.email.completed = true;
    }
    
    if (session.steps.shipping.completed && !newSession.steps.shipping.completed) {
      console.log('[CheckoutContext] Shipping step was reset, preserving completion status');
      newSession.steps.shipping.completed = true;
    }
    
    if (session.steps.billing.completed && !newSession.steps.billing.completed) {
      console.log('[CheckoutContext] Billing step was reset, preserving completion status');
      newSession.steps.billing.completed = true;
    }
    
    setSession(newSession)
  }

  return (
    <CheckoutContext.Provider value={{ session, updateSession }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckoutContext = () => useContext(CheckoutContext)
