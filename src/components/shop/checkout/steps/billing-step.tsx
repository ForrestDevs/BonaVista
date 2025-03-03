'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AddressElement, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { StripeAddress } from '@/lib/types/checkout'

interface BillingStepProps {
  initialAddress?: StripeAddress
  shippingAddress?: StripeAddress
  initialSameAsShipping: boolean
  onComplete: (data: { address?: StripeAddress; sameAsShipping: boolean }) => void
  isProcessing?: boolean
  isDisabled?: boolean
}

export function BillingStep({
  initialAddress,
  shippingAddress,
  initialSameAsShipping,
  onComplete,
  isProcessing = false,
  isDisabled = false,
}: BillingStepProps) {
  const [sameAsShipping, setSameAsShipping] = useState(initialSameAsShipping)
  const [address, setAddress] = useState<StripeAddress | null>(initialAddress)
  const elements = useElements()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isProcessing || isDisabled) return

    try {
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
    }
  }

  return (
    <div className={`space-y-6 ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-6">
        <p className="text-sm text-slate-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Enter the address associated with your payment method
        </p>
      </div>

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
                defaultValues: initialAddress,
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
        disabled={isProcessing || (!sameAsShipping && !address) || isDisabled}
        onClick={handleSubmit}
      >
        {isProcessing ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            Continue to Payment
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        )}
      </Button>
    </div>
  )
}
