'use client'

import { Button } from '@/components/ui/button'
import { LinkAuthenticationElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRef, useState, useCallback, useEffect } from 'react'
import { useCheckoutSession } from '../checkout-context'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { findCustomerByEmail } from '@/lib/data/customer'
import { AccountEmailAlert } from '../notifications/account-email-alert'
import { DifferentEmailAlert } from '../notifications/different-email-alert'
import { useRouter } from 'next/navigation'

export function EmailStep() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { authCustomer, session, isPending, handleStepComplete, setError } = useCheckoutSession()
  const [email, setEmail] = useState<string>(session.steps.email.value || '')
  const [isLoading, setIsLoading] = useState(false)
  const elementLoadedRef = useRef(false)

  const [showAccountAlert, setShowAccountAlert] = useState(false)
  const [showDifferentEmailAlert, setShowDifferentEmailAlert] = useState(false)
  const [emailHasAccount, setEmailHasAccount] = useState(false)

  const handleLoginRedirect = useCallback(() => {
    const returnUrl = `/checkout?email=${encodeURIComponent(email)}`
    router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }, [router, email])

  const validateEmail = useCallback(async () => {
    setIsLoading(true)

    try {
      // Signed-in customer case
      if (authCustomer) {
        // Different email than account
        if (email !== authCustomer.email) {
          // Check if email is associated with an account
          const customer = await findCustomerByEmail(email)
          // If it is, show the different email alert
          setEmailHasAccount(!!customer?.has_account)
          setShowDifferentEmailAlert(true)
          return false
        }
        return true
      } else {
        // guest customer case
        // Check if email has an account
        const customer = await findCustomerByEmail(email)

        if (customer?.has_account) {
          setShowAccountAlert(true)
          return false
        }
        return true
      }
    } catch (error) {
      console.error('Error validating email:', error)
      setError('An error occurred while validating your email')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [email, authCustomer, setError])

  async function handleSubmit() {
    if (
      !stripe ||
      !elements ||
      isPending ||
      !email ||
      isLoading
    )
      return

    try {
      console.log('[EmailStep] Submitting email:', email)
      setIsLoading(true)

      if (!email) {
        setError('Please enter an email address')
        return
      }

      const isValid = await validateEmail()
      if (!isValid) {
        return
      }

      console.log('[EmailStep] Valid email:', email)
      handleStepComplete('email', { value: email })
    } catch (error) {
      console.error('Error submitting email:', error)
      setError('An error occurred while submitting your email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueAsGuest = useCallback(() => {
    setShowAccountAlert(false)
    handleStepComplete('email', { value: email })
  }, [email, handleStepComplete])

  const handleChangeEmail = useCallback(() => {
    setShowAccountAlert(false)
    setShowDifferentEmailAlert(false)
    if (elements) {
      const emailElement = elements.getElement('linkAuthentication')
      if (emailElement) {
        emailElement.clear()
        emailElement.focus()
      }
    }
  }, [elements])

  const handleUseAccountEmail = useCallback(() => {
    if (authCustomer) {
      setEmail(authCustomer.email)
      const emailElement = elements?.getElement('linkAuthentication')
      if (emailElement) {
        emailElement.clear()
      }
      setShowDifferentEmailAlert(false)
      handleStepComplete('email', { value: authCustomer.email })
    }
  }, [authCustomer, handleStepComplete])

  // Use state instead of ref to trigger re-renders
  const [isLinkAuthReady, setIsLinkAuthReady] = useState(false)

  useEffect(() => {
    console.log('[EmailStep] Link auth ready state changed:', isLinkAuthReady)
  }, [isLinkAuthReady])

  const handleLinkAuthReady = (element) => {
    console.log('[EmailStep] Email element ready - about to update state')

    // Set a very short timeout to ensure the DOM has time to update
    // This helps avoid the layout shift
    setTimeout(() => {
      setIsLinkAuthReady(true)

      // Focus after a slight delay to ensure element is visible
      setTimeout(() => {
        if (element) {
          console.log('[EmailStep] Focusing email element')
          element.focus()
        }
      }, 50)
    }, 0)
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        We&apos;ll use this email to send your order confirmation and updates
      </p>

      {/* <div className="h-fit relative transition-all duration-300 ease-in-out overflow-hidden">
        <div
          className={cn(
            'absolute top-0 left-0 w-full z-10 transition-opacity duration-300',
            isLinkAuthReady ? 'opacity-0 pointer-events-none' : 'opacity-100',
          )}
          aria-hidden={isLinkAuthReady}
        >
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div
          className={cn(
            'transition-opacity duration-300',
            isLinkAuthReady ? 'opacity-100' : 'opacity-0',
          )}
        >
          <LinkAuthenticationElement
            key={'email-step'}
            className="p-1"
            options={{
              defaultValues: {
                email: email ?? '',
              },
            }}
            onReady={handleLinkAuthReady}
            onChange={(event) => {
              if (event.complete) {
                setEmail(event.value.email)
              }
            }}
          />
        </div>
      </div> */}

      {/* Container with Tailwind v4 @container */}
      <div className="@container relative">
        {/* Using CSS grid to maintain container size */}
        <div className="grid grid-cols-1 auto-animate">
          {/* Skeleton */}
          <div
            className={cn(
              'col-start-1 row-start-1 w-full transition-opacity duration-300 ease-in-out',
              isLinkAuthReady ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative',
            )}
            aria-hidden={isLinkAuthReady}
          >
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Link Auth Element */}
          <div
            className={cn(
              'col-start-1 row-start-1 w-full transition-opacity duration-300 ease-in-out',
              !isLinkAuthReady ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative',
            )}
          >
            <LinkAuthenticationElement
              key="email-step"
              
              options={{
                defaultValues: {
                  email: email ?? '',
                },
                
              }}
              onReady={handleLinkAuthReady}
              onChange={(event) => {
                if (event.complete) {
                  setEmail(event.value.email)
                }
              }}
            />
          </div>
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isPending || isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? <LoadingSpinner className="text-white" /> : 'Continue to Shipping'}
      </Button>

      <AccountEmailAlert
        isOpen={showAccountAlert}
        email={email}
        onContinue={handleContinueAsGuest}
        onChangeEmail={handleChangeEmail}
        onLogin={handleLoginRedirect}
        onClose={() => setShowAccountAlert(false)}
      />

      {authCustomer && (
        <DifferentEmailAlert
          isOpen={showDifferentEmailAlert}
          email={email}
          suggestedEmail={authCustomer.email}
          hasExistingAccount={emailHasAccount}
          onContinue={() => {
            setShowDifferentEmailAlert(false)
            handleStepComplete('email', { value: email })
          }}
          onChangeEmail={handleChangeEmail}
          onUseAccountEmail={handleUseAccountEmail}
          onClose={() => setShowDifferentEmailAlert(false)}
        />
      )}
    </div>
  )
}
