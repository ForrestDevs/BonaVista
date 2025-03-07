'use client'

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react'
import { CheckoutSession } from '@/lib/types/checkout'
import { updateCheckoutSession, updateCheckoutStep } from '@/lib/data/checkout'
import { Customer } from '@payload-types'
import { findCustomerByEmail, findOrCreateCheckoutCustomer, getCustomer } from '@/lib/data/customer'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutContextType {
  authCustomer: Customer | null
  session: CheckoutSession
  currentStep: keyof CheckoutSession['steps']
  handleStepComplete: (
    step: keyof CheckoutSession['steps'],
    data: Partial<CheckoutSession['steps'][typeof step]>,
  ) => void
  handleEditStep: (step: keyof CheckoutSession['steps']) => void
  isPending: boolean
  startTransition: (callback: () => void) => void
  error: string | null
  setError: (error: string | null) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

interface CheckoutProviderProps {
  authenticatedCustomer: Customer | null
  initialSession: CheckoutSession
  children: React.ReactNode
}

export function CheckoutProvider({
  initialSession,
  authenticatedCustomer,
  children,
}: CheckoutProviderProps) {
  const [authCustomer, setAuthCustomer] = useState<Customer | null>(authenticatedCustomer)
  const [session, setSession] = useState<CheckoutSession>(initialSession)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Step order for navigation
  const stepOrder: (keyof CheckoutSession['steps'])[] = ['email', 'shipping', 'billing', 'payment']

  // Helper function to update both server and client session
  const updateSessionState = async (updatedSession: CheckoutSession) => {
    console.log('[CheckoutContext] Updating session state:', updatedSession)

    // Update local state
    setSession(updatedSession)
  }

  const advanceStep = async (
    step: keyof CheckoutSession['steps'],
    data: Partial<CheckoutSession['steps'][typeof step]>,
  ) => {
    // Determine the next step
    const currentIndex = stepOrder.indexOf(step)
    const nextStep =
      currentIndex < stepOrder.length - 1 ? stepOrder[currentIndex + 1] : stepOrder[currentIndex]

    // Preserve completion states of other steps
    const updatedSession: CheckoutSession = {
      ...session,
      currentStep: nextStep || step,
      steps: {
        ...session.steps,
        [step]: {
          ...session.steps[step],
          ...data,
          completed: true,
        },
      },
      lastUpdated: Date.now(),
    }

    await updateSessionState(updatedSession)
  }

  // Handle completing a step
  const handleStepComplete = async (
    step: keyof CheckoutSession['steps'],
    data: Partial<CheckoutSession['steps'][typeof step]>,
  ) => {
    try {
      switch (step) {
        case 'email':
          startTransition(async () => {
            await advanceStep(step, data)
          })
          break
        case 'shipping':
          startTransition(async () => {
            await advanceStep(step, data)
          })
          break
        case 'billing':
          startTransition(async () => {
            await advanceStep(step, data)
          })
          break
        case 'payment':
          startTransition(async () => {
            await advanceStep(step, data)
          })
          break
        default:
          break
      }

      // startTransition(async () => {
      //   setError(null)
      //   console.log(`[CheckoutContext] Completing step: ${step} with data:`, data)

      //   let customer: Customer | null = null

      //   // If this is the email step, handle customer creation/lookup
      //   if (step === 'email' && 'value' in data && data.value) {
      //     const email = data.value
      //     const customerResult = await findOrCreateCheckoutCustomer(email)

      //     customer = customerResult.customer

      //     if (customerResult.needsLogin) {
      //       setError('This email is associated with an account. Please log in to continue.')
      //       return
      //     }
      //   }

      //   // First update customer info if needed
      //   if (customer) {
      //     await updateCheckoutSession({
      //       cartId: session.cartId,
      //       customerId: customer.id,
      //       customerEmail: customer.email,
      //     })
      //   }

      //   // Determine the next step
      //   const currentIndex = stepOrder.indexOf(step)
      //   const nextStep =
      //     currentIndex < stepOrder.length - 1
      //       ? stepOrder[currentIndex + 1]
      //       : stepOrder[currentIndex]

      //   // Update step data on server
      //   const updatedSession = await updateCheckoutStep({
      //     cartId: session.cartId,
      //     step,
      //     data: {
      //       ...data,
      //       completed: true,
      //     },
      //     nextStep,
      //   })

      //   if (updatedSession) {
      //     console.log(`[CheckoutContext] Step ${step} completed. Updated session:`, updatedSession)

      //     // Update client state with server response
      //     await updateSessionState(updatedSession)

      //     // If we need to update the current step on the server separately
      //     // we would do that here with another API call
      //   }
      // })
    } catch (error) {
      console.error(`Error completing ${step} step:`, error)
      setError(
        `Failed to complete the ${step.charAt(0).toUpperCase() + step.slice(1)} step. Please try again.`,
      )
    }
  }

  // Handle editing a previously completed step
  const handleEditStep = (step: keyof CheckoutSession['steps']) => {
    console.log(`[CheckoutContext] Editing step: ${step}`)

    // update client session state
    updateSessionState({
      ...session,
      currentStep: step,
      steps: {
        ...session.steps,
        [step]: {
          ...session.steps[step],
          completed: false,
        },
      },
    })

    // startTransition(async () => {
    //   setError(null)

    //   try {
    //     // For steps that affect totals, we need to mark them as incomplete on the server
    //     if ((step === 'shipping' || step === 'billing') && session.steps[step].completed) {
    //       // Mark the step as incomplete in the session but keep the data
    //       const updatedSession = await updateCheckoutStep({
    //         cartId: session.cartId,
    //         step,
    //         data: {
    //           ...session.steps[step],
    //           // We're setting completed to false but not clearing other data
    //           completed: false,
    //         },
    //       })

    //       if (updatedSession) {
    //         // Store the current step in the updated session
    //         const sessionWithEditStep = {
    //           ...updatedSession,
    //           currentStep: step,
    //         }

    //         console.log(
    //           `[CheckoutContext] Updated session after preparing ${step} for edit:`,
    //           sessionWithEditStep,
    //         )
    //         await updateSessionState(sessionWithEditStep)
    //       }
    //     } else {
    //       // For steps that don't affect totals, just update the current step in client state
    //       const updatedSession = {
    //         ...session,
    //         currentStep: step,
    //       }

    //       console.log(`[CheckoutContext] Updated current step to ${step}:`, updatedSession)
    //       await updateSessionState(updatedSession)
    //     }
    //   } catch (error) {
    //     console.error('[CheckoutContext] Error preparing step for edit:', error)
    //     setError('Failed to edit this step. Please try again.')
    //   }
    // })
  }

  // Determine the active step based on session state
  const getActiveStep = (): keyof CheckoutSession['steps'] => {
    // First use the server-stored current step
    if (session.currentStep) {
      return session.currentStep
    }

    // Otherwise, find the first incomplete step
    for (const step of stepOrder) {
      if (!session.steps[step].completed) {
        return step
      }
    }

    // If all steps are completed, default to payment
    return 'payment'
  }

  // Get current step from session if available, otherwise calculate it
  const currentStep = session.currentStep || getActiveStep()

  return (
    <CheckoutContext.Provider
      value={{
        authCustomer,
        session,
        currentStep,
        handleStepComplete,
        handleEditStep,
        isPending,
        startTransition,
        error,
        setError,
      }}
    >
      <Elements
        stripe={stripePromise}
        options={{
          loader: 'never',
          clientSecret: session.clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0F172A',
              colorBackground: '#ffffff',
              colorText: '#1e293b',
              colorDanger: '#ef4444',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
          },
        }}
      >
        {children}
      </Elements>
    </CheckoutContext.Provider>
  )
}

export function useCheckoutSession() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckoutSession must be used within a CheckoutProvider')
  }
  return context
}
