'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Address } from '@payload-types'
import { AddressElement, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { StripeAddress } from '@/lib/types/checkout'

interface BillingStepProps {
  initialAddress?: StripeAddress
  shippingAddress?: StripeAddress
  initialSameAsShipping: boolean
  onComplete: (data: { address?: StripeAddress; sameAsShipping: boolean }) => void
  onBack: () => void
}

export function BillingStep({
  initialAddress,
  shippingAddress,
  initialSameAsShipping,
  onComplete,
  onBack,
}: BillingStepProps) {
  const [sameAsShipping, setSameAsShipping] = useState(initialSameAsShipping)
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState<StripeAddress | null>(initialAddress)
  const elements = useElements()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      if (sameAsShipping) {
        // If same as shipping, we don't need to collect a new address
        await onComplete({
          sameAsShipping: true,
        })
        return
      }

      if (!elements) return

      // Get the complete address from the AddressElement
      const { error } = await elements.submit()

      if (error) {
        console.error('Error:', error)
        return
      }

      if (!address) {
        console.error('No address provided')
        return
      }

      await onComplete({
        address: address,
        sameAsShipping: false,
      })
    } catch (error) {
      console.error('Error submitting billing info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Billing Address</h2>
          <p className="text-sm text-gray-500">
            Enter the address associated with your payment method
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same-as-shipping"
              checked={sameAsShipping}
              onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
            />
            <Label htmlFor="same-as-shipping">Same as shipping address</Label>
          </div>

          {!sameAsShipping && (
            <AddressElement
              options={{
                mode: 'billing',
                defaultValues: initialAddress,
                allowedCountries: ['US', 'CA'],
              }}
              onChange={(event) => {
                if (event.complete) {
                  setAddress(event.value)
                }
              }}
            />
          )}

          {sameAsShipping && shippingAddress && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <p>{shippingAddress.address.line1}</p>
                {shippingAddress.address.line2 && <p>{shippingAddress.address.line2}</p>}
                <p>
                  {shippingAddress.address.city}, {shippingAddress.address.state}{' '}
                  {shippingAddress.address.postal_code}
                </p>
                <p>{shippingAddress.address.country}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between space-x-4">
          <Button type="button" variant="outline" onClick={onBack} className="w-full">
            Back
          </Button>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
