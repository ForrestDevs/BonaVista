'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LinkAuthenticationElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

interface EmailStepProps {
  initialEmail?: string
  onComplete: (data: { value: string }) => void
}

export function EmailStep({ initialEmail, onComplete }: EmailStepProps) {
  const [email, setEmail] = useState<string>(initialEmail || '')
  const [isLoading, setIsLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    try {
      setIsLoading(true)

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

      console.log('email', email)

      onComplete({ value: email })
    } catch (error) {
      console.error('Error submitting email:', error)
    } 
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <p className="text-sm text-gray-500">
            We&apos;ll use this email to send your order confirmation and updates
          </p>
        </div>

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
              }
            }}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Continue to Shipping'}
        </Button>
      </form>
    </Card>
  )
}
