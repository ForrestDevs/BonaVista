'use client'

import { useQueryState } from 'nuqs'
import { useCheckout } from '@/app/(frontend)/shop/_checkout/context'
import { Button } from '@/components/ui/button'
import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ShippingRatesSection } from '@/components/shop/shipping-rates-section'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { useRef, useState, useTransition } from 'react'
import { AddressSchema } from '@/components/shop/stripe-payment'
import { calculateShippingOptions } from '@/lib/utils/shipping'
import { useRouter } from 'next/navigation'
import { createOrder } from '@/lib/data/order'
import { useDidUpdate } from '@/lib/hooks/lifecycle'

export default function CheckoutFormClient() {
  const [step, setStep] = useQueryState('step', {
    defaultValue: 'email',
    parse: (value: string) =>
      ['email', 'delivery', 'payment', 'confirm'].includes(value) ? (value as StepType) : 'email',
  })

  const { isReady, customer, formData, updateFormData, sameAsShipping } = useCheckout()
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isTransitioning, transition] = useTransition()

  const elementsRef = useRef(elements)
  elementsRef.current = elements

  useDidUpdate(() => {
    transition(async () => {
      //   await saveBillingAddressAction({ billingAddress: debouncedBillingAddress })
      await elementsRef.current?.fetchUpdates()
      router.refresh()
    })
  }, [formData, router])

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate current step before proceeding
    switch (step) {
      case 'email':
        if (formData.email) {
          setStep('delivery')
        }
        break
      case 'delivery':
        if (formData.shipping.address.line1) {
          setStep('payment')
        }
        break
      case 'payment':
        if (formData.payment.method) {
          setStep('confirm')
        }
        break
      case 'confirm':
        // Handle final submission
        await handleFinalSubmit()
        break
    }
  }

  const handleFinalSubmit = async () => {
    if (!stripe || !elements) {
      console.warn('Stripe or Elements not ready')
      return
    }

    // console.log('elements', elements)

    // const shippingAddressElement = elements.getElement('address')
    // console.log('shippingAddressElement', shippingAddressElement)

    // if (!shippingAddressElement) {
    //   console.warn('Address Element expected to exist but not found')
    //   return
    // }

    try {
      // Get shipping address from Stripe Elements
      // const shippingAddressObject = await shippingAddressElement.getValue()

      console.log('formData', formData)

      const shippingAddress: Partial<AddressSchema> = {
        name: formData.shipping.name ?? '',
        city: formData.shipping.address.city ?? '',
        country: formData.shipping.address.country ?? '',
        line1: formData.shipping.address.line1 ?? '',
        line2: formData.shipping.address.line2 ?? '',
        postalCode: formData.shipping.address.postal_code ?? '',
        state: formData.shipping.address.state ?? '',
        phone: formData.shipping.phone,
      }

      const billingAddress: Partial<AddressSchema> = sameAsShipping
        ? shippingAddress
        : formData.billing.address

      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/confirmation`,
          payment_method_data: {
            // billing_details: {
            //   email: formData.email ?? undefined,
            //   name: billingAddress.name,
            //   phone: billingAddress.phone ?? undefined,
            //   address: {
            //     city: billingAddress.city,
            //     country: billingAddress.country,
            //     line1: billingAddress.line1,
            //     line2: billingAddress.line2 ?? '',
            //     postal_code: billingAddress.postalCode,
            //     state: billingAddress.state ?? '',
            //   },
            // },
          },
          shipping: {
            name: shippingAddress.name,
            phone: shippingAddress.phone ?? undefined,
            address: {
              city: shippingAddress.city,
              country: shippingAddress.country,
              line1: shippingAddress.line1,
              line2: shippingAddress.line2 ?? '',
              postal_code: shippingAddress.postalCode,
              state: shippingAddress.state ?? '',
            },
          },
        },
      })
      if (result.error) {
        console.log('result.error', result.error)
        // setIsLoading(false)
        // setFormErrorMessage(result.error.message ?? 'Unexpected error')
      } else {
        const order = await createOrder(customer, result.paymentIntent)
        // clear cart cookie after successful payment for payment methods that do not require redirect
        // for payment methods that require redirect, we clear the cookie on the success page
        // await deleteCart()
        const params = new URLSearchParams({
          payment_intent: result.paymentIntent.id,
          payment_intent_client_secret: result.paymentIntent.client_secret ?? '',
          order_id: order.id,
        })
        router.push('/shop/confirmation?' + params.toString())
        // deliberately not setting isLoading to false here to prevent the button to flicker back to "Pay now" before redirecting
        // setIsLoading(false);
      }
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  return (
    <div className="flex flex-col container mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Progress indicator */}
        <nav className="flex justify-between py-4">
          {['email', 'delivery', 'payment', 'confirm'].map((s) => (
            <Button
              key={s}
              type="button"
              variant={s === step ? 'default' : 'ghost'}
              disabled={
                !isReady[
                  s === 'payment' ? 'payment' : s === 'delivery' ? 'address' : 'linkAuthentication'
                ]
              }
              onClick={() => setStep(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </nav>

        {/* Step content */}
        {renderStep(step as StepType)}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          {step !== 'email' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const steps: StepType[] = ['email', 'delivery', 'payment', 'confirm']
                const currentIndex = steps.indexOf(step as StepType)
                if (currentIndex > 0) {
                  setStep(steps[currentIndex - 1])
                }
              }}
            >
              Back
            </Button>
          )}
          <Button type="submit" className="ml-auto">
            {step === 'confirm' ? 'Place Order' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}

// Step Components
function EmailStep() {
  const { setIsReady, formData, updateFormData, customer } = useCheckout()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Contact Information</h2>
      <LinkAuthenticationElement
        onReady={() => setIsReady('linkAuthentication', true)}
        onChange={(event) => {
          if (event.complete) {
            updateFormData('email', event.value.email)
          }
        }}
        options={{
          defaultValues: {
            email: formData.email || customer?.email || '',
          },
        }}
      />
    </div>
  )
}

function DeliveryStep() {
  const { setIsReady, formData, updateFormData, customer, isReady } = useCheckout()
  const [isTransitioning, transition] = useTransition()
  const elements = useElements()
  const router = useRouter()
  const [shippingRateId, setShippingRateId] = useState<string | null>(null)
  const [sameAsShipping, setSameAsShipping] = useState(false)
  const [billingAddressValues, setBillingAddressValues] = useState<AddressSchema>({
    name: '',
    city: '',
    country: '',
    line1: '',
    line2: '',
    state: '',
  })

  const rates = [
    {
      id: '1',
      display_name: 'Standard',
      delivery_estimate: {
        minimum: {
          value: 1,
          unit: 'business_day',
        },
        maximum: {
          value: 3,
          unit: 'business_day',
        },
      },
      fixed_amount: {
        amount: 1000,
        currency: 'usd',
      },
    },
    {
      id: '2',
      display_name: 'Express',
      delivery_estimate: {
        minimum: {
          value: 1,

          unit: 'business_day',
        },
        maximum: {
          value: 2,
          unit: 'business_day',
        },
      },
      fixed_amount: {
        amount: 2000,
        currency: 'usd',
      },
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Shipping Address</h2>
      <AddressElement
        onReady={() => setIsReady('address', true)}
        onChange={(event) => {
          if (event.complete) {
            updateFormData('shipping', {
              name: event.value.name,
              phone: event.value.phone,
              address: event.value.address,
            })
          }
        }}
        options={{
          mode: 'shipping',
          fields: { phone: 'always' },
          validation: { phone: { required: 'auto' } },
          display: {
            name: 'split',
          },
          defaultValues: {
            firstName: customer?.firstName ?? '',
            lastName: customer?.lastName ?? '',
            phone: customer?.phone ?? '',
            address: {
              country: '',
              city: '',
              postal_code: '',
              line1: '',
              line2: '',
              state: '',
            },
          },
        }}
      />
      {isReady && formData.shipping.address.postal_code && (
        <div>
          <ShippingRatesSection
            onChange={(value) => {
              transition(async () => {
                setShippingRateId(value)
                //   await saveShippingRateAction({ shippingRateId: value })
                await elements?.fetchUpdates()
                router.refresh()
              })
            }}
            // key={shippingRateId}
            value={shippingRateId}
            shippingRates={rates}
          />

          <Label
            className="flex flex-row items-center gap-x-2"
            aria-controls="billingAddressCollapsibleContent"
            aria-expanded={!sameAsShipping}
          >
            <Checkbox
              onCheckedChange={(checked) => {
                setSameAsShipping(checked === true)
              }}
              checked={sameAsShipping}
              name="sameAsShipping"
              value={sameAsShipping ? 'true' : 'false'}
            />
            {'Billing same as shipping'}
          </Label>

          <Collapsible className="" open={!sameAsShipping}>
            <CollapsibleContent
              id="billingAddressCollapsibleContent"
              className="CollapsibleContent"
            >
              <fieldset
                aria-hidden={sameAsShipping}
                tabIndex={sameAsShipping ? -1 : undefined}
                className={`grid gap-6 rounded-lg border p-4`}
              >
                <legend className="-ml-1 whitespace-nowrap px-1 text-sm font-medium">
                  Billing address
                </legend>
                {/* <BillingAddressSection
                  values={billingAddressValues}
                  onChange={setBillingAddressValues}
                  errors={fieldErrors}
                /> */}
              </fieldset>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  )
}

function PaymentStep() {
  const { setIsReady, updateFormData } = useCheckout()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payment Method</h2>
      <PaymentElement
        onReady={() => setIsReady('payment', true)}
        onChange={(event) => {
          if (event.complete) {
            updateFormData('payment', { method: event.value.type })
          }
        }}
      />
    </div>
  )
}

function ConfirmStep() {
  const {
    formData,
    isReady,
    isBillingAddressPending,
    isLoading,
    isTransitioning,
    formErrorMessage,
  } = useCheckout()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Confirm Order</h2>

      {formErrorMessage && (
        <Alert variant="destructive" className="mt-2" aria-live="polite" aria-atomic>
          <AlertCircle className="-mt-1 h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formErrorMessage}</AlertDescription>
        </Alert>
      )}
      {/* Order Summary */}
      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-2">Order Summary</h3>
        <div className="space-y-2">
          <p>Email: {formData.email}</p>
          <div>
            <p className="font-medium">Shipping Address:</p>
            <p>{formData.shipping.name}</p>
            <p>{formData.shipping.address.line1}</p>
            {formData.shipping.address.line2 && <p>{formData.shipping.address.line2}</p>}
            <p>
              {formData.shipping.address.city}, {formData.shipping.address.state}{' '}
              {formData.shipping.address.postal_code}
            </p>
            <p>{formData.shipping.address.country}</p>
          </div>
        </div>
      </div>

      {isReady && (
        <Button
          type="submit"
          className="w-full rounded-full text-lg"
          size="lg"
          aria-disabled={isBillingAddressPending || isLoading || isTransitioning}
          onClick={(e) => {
            if (isBillingAddressPending || isLoading || isTransitioning) {
              e.preventDefault()
            }
          }}
        >
          {isBillingAddressPending || isLoading || isTransitioning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Order now'
          )}
        </Button>
      )}
    </div>
  )
}

type StepType = 'email' | 'delivery' | 'payment' | 'confirm'

function renderStep(step: StepType) {
  switch (step) {
    case 'email':
      return <EmailStep />
    case 'delivery':
      return <DeliveryStep />
    case 'payment':
      return <PaymentStep />
    case 'confirm':
      return <ConfirmStep />
    default:
      return <EmailStep />
  }
}
