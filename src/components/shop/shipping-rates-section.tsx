// import { useTranslations } from '@/i18n/client'
import { cn } from '@/lib/utils/cn'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useOptimistic, useTransition } from 'react'
import type Stripe from 'stripe'
import { useEffect, useState } from 'react'
import { ShippingOption } from '@payload-types'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/currency'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ShippingRatesSectionProps {
  shippingOptions: ShippingOption[] | null
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
  postalCode: string | null
  cartTotal: number
  isLoading?: boolean
}

export function ShippingRatesSection({
  shippingOptions,
  selectedOptionId,
  onSelect,
  postalCode,
  cartTotal,
  isLoading = false,
}: ShippingRatesSectionProps) {
  const [availableOptions, setAvailableOptions] = useState<ShippingOption[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shippingOptions || !postalCode) {
      setAvailableOptions([])
      setError('Please enter your shipping address to see available shipping options.')
      return
    }

    // Filter active shipping options
    const activeOptions = shippingOptions.filter((option) => option.isActive)

    // Filter options based on postal code and shipping rules
    const filteredOptions = activeOptions.filter((option) => {
      // If no regions specified, option is available everywhere
      if (!option.shippingRules?.regions || option.shippingRules.regions.length === 0) {
        return true
      }

      // Check if postal code matches any region's pattern
      return option.shippingRules.regions.some((region) => {
        const pattern = new RegExp(region.postalCodePattern, 'i')
        return pattern.test(postalCode)
      })
    })

    if (filteredOptions.length === 0) {
      setError('No shipping options available for your location.')
      setAvailableOptions([])
      return
    }

    setAvailableOptions(filteredOptions)
    setError(null)
  }, [shippingOptions, postalCode])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Shipping Not Available</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Shipping Method</h3>
      <RadioGroup
        value={selectedOptionId || undefined}
        onValueChange={onSelect}
        className="space-y-4"
      >
        {availableOptions.map((option) => {
          const rate = calculateShippingRate(option, cartTotal)
          return (
            <div key={option.id} className="flex items-center space-x-3">
              <RadioGroupItem value={option.id.toString()} id={option.id.toString()} />
              <Label htmlFor={option.id.toString()} className="flex-1">
                <div className="flex justify-between items-center">
                  <span>{option.name}</span>
                  <span className="font-medium">{rate === 0 ? 'FREE' : formatCurrency(rate)}</span>
                </div>
                {option.shippingRules?.freeShippingThreshold &&
                  cartTotal < option.shippingRules.freeShippingThreshold && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Spend {formatCurrency(option.shippingRules.freeShippingThreshold - cartTotal)}{' '}
                      more for free shipping
                    </p>
                  )}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </Card>
  )
}

function calculateShippingRate(option: ShippingOption, cartTotal: number): number {
  if (!option.shippingRules) return 0

  const { baseRate, freeShippingThreshold } = option.shippingRules

  // Check if order qualifies for free shipping
  if (freeShippingThreshold && cartTotal >= freeShippingThreshold) {
    return 0
  }

  return baseRate
}

export const FormatDeliveryEstimate = ({ estimate }: { estimate: any }) => {
  //   const t = useTranslations('Global.deliveryEstimates')
  if (!estimate?.minimum && !estimate?.maximum) {
    return null
  }

  if (estimate.minimum && !estimate.maximum) {
    return `at least ${deliveryUnitToText(estimate.minimum.value, estimate.minimum.unit)}`
  }
  if (!estimate.minimum && estimate.maximum) {
    return `up to ${deliveryUnitToText(estimate.maximum.value, estimate.maximum.unit)}`
  }
  if (estimate.minimum && estimate.maximum) {
    if (estimate.minimum.value === estimate.maximum.value) {
      return deliveryUnitToText(estimate.minimum.value, estimate.minimum.unit)
    }
    if (estimate.minimum.unit === estimate.maximum.unit) {
      return `${estimate.minimum.value}–${deliveryUnitToText(estimate.maximum.value, estimate.maximum.unit)}`
    }
    return `${deliveryUnitToText(estimate.minimum.value, estimate.minimum.unit)} – ${deliveryUnitToText(estimate.maximum.value, estimate.maximum.unit)}`
  }
  return null
}

// type i18n = ReturnType<typeof useTranslations<'Global.deliveryEstimates'>>
const deliveryUnitToText = (
  value: number,
  unit:
    | Stripe.ShippingRate.DeliveryEstimate.Maximum.Unit
    | Stripe.ShippingRate.DeliveryEstimate.Minimum.Unit,
  //   t: i18n,
) => {
  switch (unit) {
    case 'business_day':
      return `business day`
    default:
      return `${value} ${unit}`
  }
}
