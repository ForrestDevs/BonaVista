'use client'

import { Button } from '@/components/ui/button'
import { LinkAuthenticationElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

interface EmailStepProps {
  initialEmail?: string
  onComplete: (data: { value: string }) => void
  isProcessing?: boolean
  isDisabled?: boolean
}

export function EmailStep({ initialEmail, onComplete, isProcessing = false, isDisabled = false }: EmailStepProps) {
  const [email, setEmail] = useState<string>(initialEmail || '')
  const [isValid, setIsValid] = useState<boolean>(!!initialEmail)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || isProcessing || isDisabled) return

    try {
      // Get the email from the LinkAuthenticationElement
      const { error } = await elements.submit()

      if (error) {
        console.error('Error:', error)
        return
      }

      if (!email) {
        console.error('No email provided')
        return
      }

      onComplete({ value: email })
    } catch (error) {
      console.error('Error submitting email:', error)
    }
  }

  return (
    <div className={`space-y-6 ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <p className="text-sm text-gray-500">
        We&apos;ll use this email to send your order confirmation and updates
      </p>

      <div className="space-y-4">
        <LinkAuthenticationElement
          options={{
            defaultValues: {
              email: initialEmail ?? '',
            },
          }}
          onChange={(event) => {
            if (event.complete) {
              setEmail(event.value.email)
              setIsValid(true)
            } else {
              setIsValid(false)
            }
          }}
        />
      </div>

      <Button 
        type="button" 
        className="w-full" 
        disabled={isProcessing || !isValid || isDisabled}
        onClick={handleSubmit}
      >
        {isProcessing ? 'Processing...' : 'Continue to Shipping'}
      </Button>
    </div>
  )
}
