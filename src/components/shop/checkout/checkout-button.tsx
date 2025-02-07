'use client'

import { Button } from '@/components/ui/button'
import { beginCheckoutSession } from '@/lib/data/checkout'
import { BeginCheckoutParams } from '@/lib/types/checkout'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CheckoutButtonProps extends BeginCheckoutParams {
  onError?: (error: Error) => void
  onSuccess?: () => void
  disabled?: boolean
}

export function CheckoutButton({
  onError,
  onSuccess,
  disabled,
  ...checkoutParams
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      await beginCheckoutSession({
        ...checkoutParams,
        metadata: {
          ...checkoutParams.metadata,
          timestamp: Date.now().toString(),
        },
      })
      onSuccess?.()
    } catch (error) {
      console.error('Error starting checkout:', error)
      onError?.(error as Error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || disabled}
      className="w-full"
      size="lg"
      variant="default"
    >
      {isLoading ? 'Processing...' : 'Proceed to Checkout'}
    </Button>
  )
}
