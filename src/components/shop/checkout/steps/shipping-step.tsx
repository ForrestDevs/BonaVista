'use client'

import { Button } from '@/components/ui/button'
import { getAvailableShippingMethods } from '@/lib/data/shop'
import { ShippingOption } from '@payload-types'
import { AddressElement, useElements } from '@stripe/react-stripe-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { formatMoney } from '@/lib/utils/formatMoney'
import { StripeAddress } from '@/lib/types/checkout'
import { updateCheckoutSession, updatePaymentIntentWithDetails } from '@/lib/data/checkout'
import { useCheckoutSession } from '../checkout-context'
import { calculateTax } from '@/lib/data/checkout/tax'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton'

export function ShippingStep() {
  const elements = useElements()
  const { session, isPending, startTransition, handleStepComplete } = useCheckoutSession()
  const [address, setAddress] = useState<StripeAddress | null>(
    session.steps.shipping.address || null,
  )
  const [shippingMethods, setShippingMethods] = useState<ShippingOption[]>([])
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const loadedRef = useRef(false)

  const isDisabled = !session.steps.email.completed

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const methods = await getAvailableShippingMethods()
        if (methods && methods.length > 0) {
          setShippingMethods(methods)
        }

        if (session.steps.shipping.method?.id) {
          const matchingMethod = methods.find((m) => m.id === session.steps.shipping.method?.id)
          if (matchingMethod) {
            setSelectedMethod(matchingMethod.id)
          }
        }

        if (!selectedMethod && methods.length > 0) {
          setSelectedMethod(methods[0].id)
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error)
      }
    }

    void fetchShippingMethods()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    if (!elements || !address || !selectedMethod || isPending || isDisabled) return

    try {
      startTransition(async () => {
        setIsLoading(true)
        console.log('[ShippingStep] Starting form submission')

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

        const selectedShippingMethod = shippingMethods.find(
          (method) => method.id === selectedMethod,
        )

        if (!selectedShippingMethod) {
          console.error('No shipping method selected')
          return
        }

        // Determine if shipping should be free
        // Check if the method has regions defined
        const hasRegions =
          selectedShippingMethod.shippingRules?.regions &&
          selectedShippingMethod.shippingRules.regions.length > 0

        // Check if the address is in a free shipping zone
        const isInFreeShippingZone = hasRegions
          ? address?.address?.postal_code &&
            selectedShippingMethod.shippingRules?.regions?.some((region) => {
              return new RegExp(region.postalCodePattern).test(address.address.postal_code)
            })
          : true // Default to true if no regions

        // Check if order is above free shipping threshold
        const hasThreshold =
          typeof selectedShippingMethod.shippingRules?.freeShippingThreshold === 'number'
        const subtotalInCents = session.subtotal
        const isAboveThreshold = hasThreshold
          ? subtotalInCents >=
            (selectedShippingMethod.shippingRules?.freeShippingThreshold || 0) * 100
          : false

        // Determine if shipping is free
        const isFreeShipping =
          // Base rate is zero or null
          selectedShippingMethod.shippingRules?.baseRate === 0 ||
          selectedShippingMethod.shippingRules?.baseRate === null ||
          // Has threshold but no regions, and is above threshold
          (hasThreshold && !hasRegions && isAboveThreshold) ||
          // Has regions and is in free zone
          (hasRegions && isInFreeShippingZone && (!hasThreshold || isAboveThreshold))

        // Calculate shipping cost in cents
        const shippingCost = isFreeShipping
          ? 0
          : Math.round((selectedShippingMethod.shippingRules.baseRate || 0) * 100)

        console.log('[ShippingStep] Shipping cost calculated:', shippingCost)

        // Create a temporary session with updated shipping info
        const tempSession = {
          ...session,
          shippingTotal: shippingCost,
          steps: {
            ...session.steps,
            shipping: {
              ...session.steps.shipping,
              completed: true,
              address,
              method: selectedShippingMethod,
            },
          },
        }

        // Calculate tax
        console.log('[ShippingStep] Calculating tax')
        const taxResult = await calculateTax(tempSession)

        if (!taxResult) {
          throw new Error('Failed to calculate tax')
        }

        // Update session with new values
        console.log('[ShippingStep] Updating payment intent with details')
        const updatedSession = await updatePaymentIntentWithDetails({
          ...tempSession,
          // Use tax calculation results
          taxAmount: taxResult.taxAmount || 0,
          taxCalculationId: taxResult.calculationId,
          shippingTotal: taxResult.shippingCost,
          // Update total amount based on subtotal + shipping + tax
          amount: taxResult.totalAmount,
        })

        if (!updatedSession) {
          throw new Error('Failed to update payment intent')
        }

        // Call onComplete to notify parent component
        console.log('[ShippingStep] Notifying parent component of completion')
        handleStepComplete('shipping', {
          address,
          method: selectedShippingMethod,
        })
      })
    } catch (error) {
      console.error('Error submitting shipping info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`space-y-6 ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <p className="text-sm text-gray-500">
        Enter the address where you&apos;d like your order delivered
      </p>

      <div className="h-fit transition-all duration-300 ease-in-out overflow-hidden">
        <div className={cn(loadedRef.current === true ? 'hidden' : 'flex flex-col')}>
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-full rounded-md mb-4" />
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-full rounded-md mb-4" />
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <AddressElement
          key={'shipping-step'}
          className={cn(loadedRef.current === false ? 'hidden' : '')}
          options={{
            mode: 'shipping',
            defaultValues: address ?? {},
            allowedCountries: ['CA'],
          }}
          onReady={(e) => {
            loadedRef.current = true
            e.getValue().then((result) => {
              if (result.complete && result.value.address) {
                setAddress(result.value)
              }
            })
          }}
          onChange={(event) => {
            if (event.complete) {
              setAddress(event.value)
            }
          }}
        />
      </div>

      {address && shippingMethods.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Shipping Method</h3>
          <RadioGroup
            value={selectedMethod?.toString() || undefined}
            onValueChange={(value) => setSelectedMethod(parseInt(value))}
            className="grid grid-cols-1 gap-3"
          >
            {shippingMethods.map((method) => {
              // Determine if shipping should be free based on rules
              // Check if the shipping method has regions defined
              const hasRegions =
                method.shippingRules?.regions && method.shippingRules.regions.length > 0

              // Check if the address is in a free shipping zone (if regions are defined)
              const isInFreeShippingZone = hasRegions
                ? address?.address?.postal_code &&
                  method.shippingRules?.regions?.some((region) => {
                    return new RegExp(region.postalCodePattern).test(address.address.postal_code)
                  })
                : true // If no regions defined, consider it in a free zone for threshold-only rules

              // Check if the order amount is above the free shipping threshold
              const hasThreshold = typeof method.shippingRules?.freeShippingThreshold === 'number'
              const isAboveThreshold = hasThreshold
                ? session.subtotal >= (method.shippingRules?.freeShippingThreshold || 0) * 100
                : false

              // Determine if shipping is free based on multiple conditions
              const isFreeShipping =
                // Base rate is zero or null (always free)
                method.shippingRules?.baseRate === 0 ||
                method.shippingRules?.baseRate === null ||
                // Has threshold but no regions, and is above threshold
                (hasThreshold && !hasRegions && isAboveThreshold) ||
                // Has regions and is in free zone (with or without threshold)
                (hasRegions && isInFreeShippingZone && (!hasThreshold || isAboveThreshold))

              const isPickup = method.name.toLowerCase().includes('pickup')

              return (
                <div key={method.id} className="relative">
                  <RadioGroupItem
                    value={method.id.toString()}
                    id={method.id.toString()}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={method.id.toString()}
                    className="flex flex-col items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50"
                  >
                    <div className="flex flex-row items-start gap-3">
                      <div className="shrink-0 mt-1">
                        {isPickup ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="16" height="13" x="4" y="5" rx="2" />
                            <path d="M16 2v3" />
                            <path d="M8 2v3" />
                            <path d="M4 10h16" />
                            <path d="M15 14h1" />
                            <path d="M15 18h1" />
                            <path d="M8 14h1" />
                            <path d="M8 18h1" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 justify-start space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{method.name}</span>
                          <span
                            className={
                              isFreeShipping ? 'text-green-600 font-medium' : 'text-gray-700'
                            }
                          >
                            {isFreeShipping
                              ? 'Free'
                              : formatMoney({
                                  amount: Number(method.shippingRules.baseRate),
                                  currency: session.currencyCode,
                                })}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">
                            {isPickup
                              ? 'Available for pickup during business hours'
                              : isFreeShipping
                                ? 'Free shipping available for your order'
                                : `Standard shipping to ${address.address.postal_code}`}
                          </p>

                          {isPickup && (
                            <p className="text-xs text-blue-600">
                              Pickup location details will be provided after order completion
                            </p>
                          )}

                          {!isPickup && !isFreeShipping && isAboveThreshold === false && (
                            <p className="text-xs text-gray-500">
                              Spend{' '}
                              {formatMoney({
                                amount: method.shippingRules?.freeShippingThreshold || 0,
                                currency: session.currencyCode,
                              })}{' '}
                              to qualify for free shipping
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>
      )}

      <Button
        type="button"
        className="w-full"
        disabled={isPending || !address || !selectedMethod || isDisabled || isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? <LoadingSpinner className="text-white" /> : 'Continue to Billing'}
      </Button>
    </div>
  )
}
