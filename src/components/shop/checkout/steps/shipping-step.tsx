'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getAvailableShippingMethods } from '@/lib/data/shop'
import { ShippingOption } from '@payload-types'
import { AddressElement, useElements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { formatMoney } from '@/lib/utils/formatMoney'
import { StripeAddress } from '@/lib/types/checkout'
import { updatePaymentIntentWithDetails } from '@/lib/data/checkout'
import { useCheckoutContext } from '../checkout-context'
import { calculateTax } from '@/lib/data/checkout/tax'

interface ShippingStepProps {
  initialAddress?: StripeAddress
  onComplete: (data: { address: StripeAddress; method: ShippingOption }) => void
  onBack: () => void
}

export function ShippingStep({ initialAddress, onComplete, onBack }: ShippingStepProps) {
  const [address, setAddress] = useState<StripeAddress | null>(null)
  const [shippingMethods, setShippingMethods] = useState<ShippingOption[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const elements = useElements()
  const { session, updateSession } = useCheckoutContext()

  useEffect(() => {
    // Fetch shipping methods on initial load
    async function fetchShippingMethods() {
      try {
        const methods = await getAvailableShippingMethods()
        if (methods) {
          setShippingMethods(methods)
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error)
      }
    }

    void fetchShippingMethods()
  }, [])

  // Validate and update available shipping methods based on address and cart total
  // useEffect(() => {
  //   if (!address || !shippingMethods.length) return

  //   const cartSubtotal = session.amount
  //   const validMethods = shippingMethods.filter((method) => {
  //     // Check if method is valid for current cart total
  //     const minThreshold = method.shippingRules?.freeShippingThreshold ?? 0

  //     const meetsMinimum = cartSubtotal >= minThreshold

  //     // Check if shipping address is valid for this method
  //     const validPostalCode = method.shippingRules.regions?.some((region) =>
  //       new RegExp(region.postalCodePattern).test(address.address.postal_code),
  //     )

  //     return meetsMinimum && validPostalCode
  //   })

  //   // Update available methods and selected method
  //   setShippingMethods(validMethods)
  //   if (validMethods.length > 0) {
  //     // Keep current selection if still valid, otherwise select first available
  //     if (!selectedMethod || !validMethods.find((m) => m.id === selectedMethod)) {
  //       setSelectedMethod(validMethods[0].id)
  //     }
  //   } else {
  //     setSelectedMethod(null)
  //   }
  // }, [address, session.amount, shippingMethods, selectedMethod])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!elements || !address || !selectedMethod) return

    try {
      setIsLoading(true)

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

      const selectedShippingMethod = shippingMethods.find((method) => method.id === selectedMethod)

      if (!selectedShippingMethod) {
        console.error('No shipping method selected')
        return
      }

      // Calculate shipping and tax
      const shippingTotal = selectedShippingMethod.shippingRules.baseRate || 0

      // Create a temporary session with shipping info to calculate tax
      const tempSession = {
        ...session,
        shippingTotal,
        steps: {
          ...session.steps,
          shipping: {
            completed: true,
            address,
            method: selectedShippingMethod,
          },
        },
      }

      console.log('tempSession', tempSession)

      // Calculate tax
      const taxResult = await calculateTax(tempSession)

      console.log('taxResult', taxResult)

      // Update payment intent with new totals
      const updatedSession = await updatePaymentIntentWithDetails({
        ...tempSession,
        amount: Math.round(taxResult.newTotal * 100),
        taxAmount: taxResult?.taxAmount || 0,
        taxCalculationId: taxResult?.calculationId,
      })

      if (!updatedSession) {
        throw new Error('Failed to update payment intent')
      }

      // Update session in context
      updateSession(updatedSession)

      await onComplete({
        address,
        method: selectedShippingMethod,
      })
    } catch (error) {
      console.error('Error submitting shipping info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Shipping Address</h2>
          <p className="text-sm text-gray-500">
            Enter the address where you&apos;d like your order delivered
          </p>
        </div>

        <div className="space-y-6">
          <AddressElement
            options={{
              mode: 'shipping',
              defaultValues: initialAddress,
              allowedCountries: ['US', 'CA'],
            }}
            onReady={(e) => {
              console.log('ready', e)
              e.getValue().then((result) => {
                if (result.complete && result.value.address) {
                  console.log('setting address', result.value)
                  setAddress(result.value as StripeAddress)
                }
              })
            }}
            onChange={(event) => {
              if (event.complete) {
                setAddress(event.value)
              } else {
                setAddress(null)
              }
            }}
          />

          {address && shippingMethods.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shipping Method</h3>
              <RadioGroup value={selectedMethod || undefined} onValueChange={setSelectedMethod}>
                {shippingMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1">
                      <div className="flex justify-between">
                        <span>{method.name}</span>
                        <span>
                          {method.shippingRules.baseRate === 0 ||
                          method.shippingRules.baseRate === null
                            ? 'Free'
                            : formatMoney({
                                amount: Number(method.shippingRules.baseRate),
                                currency: session.currencyCode,
                              })}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>

        <div className="flex justify-between space-x-4">
          <Button type="button" variant="outline" onClick={onBack} className="w-full">
            Back
          </Button>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !address || !selectedMethod}
          >
            {isLoading ? 'Processing...' : 'Continue to Billing'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
