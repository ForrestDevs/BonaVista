'use client'

import { Button } from '@/components/ui/button'
import { LinkAuthenticationElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRef, useState } from 'react'
import { useCheckoutSession } from '../checkout-context'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function EmailStep() {
  const stripe = useStripe()
  const elements = useElements()
  const { session, isPending, handleStepComplete, setError } = useCheckoutSession()
  const [email, setEmail] = useState<string>(session.steps.email.value || '')
  const [isLoading, setIsLoading] = useState(false)
  const loadedRef = useRef(false)

  const handleSubmit = async (e: React.FormEvent) => {
    if (!stripe || !elements || isPending) return

    try {
      setIsLoading(true)
      const { error } = await elements.submit()

      if (error) {
        setError(error.message)
        return
      }

      if (!email) {
        setError('Please enter an email address')
        return
      }

      handleStepComplete('email', { value: email })
    } catch (error) {
      console.error('Error submitting email:', error)
      setError('An error occurred while submitting your email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        We&apos;ll use this email to send your order confirmation and updates
      </p>

      <div className="h-fit transition-all duration-300 ease-in-out overflow-hidden">
        <div className={cn(loadedRef.current === true ? 'hidden' : 'flex flex-col')}>
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <LinkAuthenticationElement
          key={'email-step'}
          className={cn(loadedRef.current === false ? 'hidden' : '')}
          options={{
            defaultValues: {
              email: email ?? '',
            },
          }}
          onReady={(e) => {
            loadedRef.current = true
            e.focus()
          }}
          onChange={(event) => {
            if (event.complete) {
              setEmail(event.value.email)
            }
          }}
        />
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isPending || isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? <LoadingSpinner className="text-white" /> : 'Continue to Shipping'}
      </Button>
    </div>
  )
}
