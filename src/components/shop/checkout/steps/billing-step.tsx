'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AddressElement, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { StripeAddress } from '@/lib/types/checkout'
import { useCheckoutSession } from '../checkout-context'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function BillingStep() {
  const elements = useElements()
  const { session, isPending, handleStepComplete } = useCheckoutSession()
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(
    session.steps.billing.sameAsShipping ?? true,
  )
  const [address, setAddress] = useState<StripeAddress | null>(
    session.steps.billing.address || null,
  )

  const isDisabled = !session.steps.shipping.completed
  const shippingAddress = session.steps.shipping.address

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!elements || isPending || isDisabled || (sameAsShipping === false && !address)) {
      return
    }

    try {
      // If we're using the shipping address, no need to validate the billing address form
      if (!sameAsShipping) {
        // Validate the address form
        const { error } = await elements.submit()
        if (error) {
          console.error('[BillingStep] Error validating form:', error)
          return
        }
      }

      // Complete the step
      handleStepComplete('billing', {
        // If same as shipping, we don't need to store a separate address
        address: sameAsShipping ? undefined : address || undefined,
        sameAsShipping,
      })
    } catch (error) {
      console.error('[BillingStep] Error submitting billing info:', error)
    }
  }

  return (
    <div className={`space-y-6 ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="space-y-6">
        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200 shadow-xs transition-all hover:border-blue-300">
          <Checkbox
            id="same-as-shipping"
            checked={sameAsShipping}
            onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
            className="h-6 w-6 text-blue-600 focus:ring-blue-500"
          />
          <Label
            htmlFor="same-as-shipping"
            className="ml-3 font-medium text-gray-700 cursor-pointer"
          >
            Same as shipping address
          </Label>
        </div>

        {!sameAsShipping && (
          <div className="transition-all duration-300 ease-in-out">
            <AddressElement
              options={{
                mode: 'billing',
                defaultValues: address ?? {},
                allowedCountries: ['US', 'CA'],
              }}
              onChange={(event) => {
                if (event.complete) {
                  setAddress(event.value)
                }
              }}
            />
          </div>
        )}

        {sameAsShipping && shippingAddress && (
          <div className="transition-all duration-300 ease-in-out">
            <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
                Shipping Address
              </h4>
              <div className="text-sm text-gray-600 space-y-1.5">
                <p className="font-medium">{shippingAddress.name}</p>
                <p>{shippingAddress.address.line1}</p>
                {shippingAddress.address.line2 && <p>{shippingAddress.address.line2}</p>}
                <p>
                  {shippingAddress.address.city}, {shippingAddress.address.state}{' '}
                  {shippingAddress.address.postal_code}
                </p>
                <p className="uppercase">{shippingAddress.address.country}</p>
                {shippingAddress.phone && (
                  <p className="flex items-center pt-2 text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isPending || (!sameAsShipping && !address) || isDisabled}
        onClick={handleSubmit}
      >
        {isPending ? <LoadingSpinner className="text-white" /> : 'Continue to Payment'}
      </Button>
    </div>
  )
}
