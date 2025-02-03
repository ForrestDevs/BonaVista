'use client'

import { useDidUpdate } from '@/lib/hooks/lifecycle'
import { useDebouncedValue } from '@/lib/hooks/useDebounce'

// import { saveBillingAddressAction, saveShippingRateAction } from '@/ui/checkout/checkout-actions'
// import { type AddressSchema, getAddressSchema } from '@/ui/checkout/checkout-form-schema'
import { ShippingRatesSection } from '@/components/shop/shipping-rates-section'
import { saveTaxIdAction } from '@/components/shop/tax-action'
import { CountrySelect } from '@/components/shop/country-select'
import { InputWithErrors } from '@/components/shop/input-errors'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
// import type * as Commerce from 'commerce-kit'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type ChangeEvent, type FormEventHandler, useRef, useState, useTransition } from 'react'
import { deleteCart } from '@/lib/data/cart'

import { type TypeOf, object, string } from 'zod'
import { Customer, User } from '@payload-types'
import { CustomerDTO } from '@/lib/data/customer'
import { createOrder } from '@/lib/data/order'

export const getAddressSchema = (tr: {
  nameRequired: string
  cityRequired: string
  countryRequired: string
  line1Required: string
  postalCodeRequired: string
}) => {
  const addressSchema = object({
    name: string({ required_error: tr.nameRequired }).min(1, tr.nameRequired),
    city: string({ required_error: tr.cityRequired }).min(1, tr.cityRequired),
    country: string({ required_error: tr.countryRequired }).min(1, tr.countryRequired),
    line1: string({ required_error: tr.line1Required }).min(1, tr.line1Required),
    line2: string().optional().nullable().default(''),
    postalCode: string({ required_error: tr.postalCodeRequired }).min(1, tr.postalCodeRequired),
    state: string().optional().nullable().default(''),
    phone: string().optional().nullable().default(''),
    taxId: string().optional().nullable().default(''),
    email: string().optional().nullable().default(''),
    // 	.email("Email is required")
    // 	.min(1, "Email is required"),
  })
  return addressSchema
}

export type AddressSchema = TypeOf<ReturnType<typeof getAddressSchema>>

export const StripePayment = ({
  cartShippingRateId,
  shippingRates,
  allProductsDigital,
  locale,
  customer,
}: {
  cartShippingRateId?: string | null
  shippingRates: any[]
  allProductsDigital: boolean
  locale: string
  customer: CustomerDTO | null
}) => {
  const addressSchema = getAddressSchema({
    cityRequired: 'City is required',
    countryRequired: 'Country is required',
    line1Required: 'Line 1 is required',
    nameRequired: 'Name is required',
    postalCodeRequired: 'Postal code is required',
  })

  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof AddressSchema, string[] | null | undefined>>
  >({})
  const [isLoading, setIsLoading] = useState(false)
  const [isTransitioning, transition] = useTransition()
  const [isLinkAuthenticationReady, setIsLinkAuthenticationReady] = useState(false)
  const [isAddressReady, setIsAddressReady] = useState(false)
  const [isPaymentReady, setIsPaymentReady] = useState(false)
  const [billingAddressValues, setBillingAddressValues] = useState<AddressSchema>({
    name: '',
    city: '',
    country: '',
    line1: '',
    line2: '',
    postalCode: '',
    state: '',
    phone: '',
    taxId: '',
    email: '',
  })

  const [isBillingAddressPending, debouncedBillingAddress] = useDebouncedValue(
    billingAddressValues,
    1000,
  )
  const [shippingRateId, setShippingRateId] = useState<string | null>(cartShippingRateId)

  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [email, setEmail] = useState('')

  const stripe = useStripe()
  const router = useRouter()

  // elements are mutable and can change during the lifecycle of the component
  // keep a mutable ref so that useEffects are not triggered when elements change
  const elements = useElements()
  const elementsRef = useRef(elements)
  elementsRef.current = elements

  useDidUpdate(() => {
    transition(async () => {
      //   await saveBillingAddressAction({ billingAddress: debouncedBillingAddress })
      await elementsRef.current?.fetchUpdates()
      router.refresh()
    })
  }, [debouncedBillingAddress, router])

  const readyToRender =
    stripe && elements && isAddressReady && isLinkAuthenticationReady && isPaymentReady

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    console.log('handleSubmit')

    if (!stripe || !elements) {
      console.warn('Stripe or Elements not ready')
      return
    }
    const shippingAddressElement = elements.getElement('address')
    console.log('shippingAddressElement', shippingAddressElement)

    if (!shippingAddressElement) {
      console.warn('Address Element expected to exist but not found')
      return
    }

    try {
      const shippingAddressObject = await shippingAddressElement.getValue()
      const shippingAddress: Partial<AddressSchema> = {
        name: shippingAddressObject.value.name,
        city: shippingAddressObject.value.address.city,
        country: shippingAddressObject.value.address.country,
        line1: shippingAddressObject.value.address.line1,
        line2: shippingAddressObject.value.address.line2,
        postalCode: shippingAddressObject.value.address.postal_code,
        state: shippingAddressObject.value.address.state,
        phone: shippingAddressObject.value.phone,
      }

      const billingAddress: Partial<AddressSchema> = sameAsShipping
        ? shippingAddress
        : billingAddressValues

      const validatedBillingAddress = addressSchema.safeParse(billingAddress)
      const validatedShippingAddress = addressSchema.safeParse(shippingAddress)

      // when billing address form is visible we display billing errors inline under fields
      if (!validatedBillingAddress.success && !sameAsShipping) {
        setFieldErrors(validatedBillingAddress.error?.flatten().fieldErrors ?? {})
      } else {
        setFieldErrors({})
      }

      if (!validatedShippingAddress.success || !validatedBillingAddress.success) {
        console.error('Validation failed', {
          validatedShippingAddress,
          validatedBillingAddress,
        })
        setFormErrorMessage('Fill required fields')
        return
      }

      setIsLoading(true)
      if (validatedBillingAddress.data.taxId) {
        await saveTaxIdAction({
          taxId: validatedBillingAddress.data.taxId,
        })
      }

      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order/success`,
          payment_method_data: {
            billing_details: {
              email: email ?? undefined,
              name: validatedBillingAddress.data.name,
              phone: validatedBillingAddress.data.phone ?? undefined,
              address: {
                city: validatedBillingAddress.data.city,
                country: validatedBillingAddress.data.country,
                line1: validatedBillingAddress.data.line1,
                line2: validatedBillingAddress.data.line2 ?? '',
                postal_code: validatedBillingAddress.data.postalCode,
                state: validatedBillingAddress.data.state ?? '',
              },
            },
          },
          shipping: {
            name: validatedShippingAddress.data.name,
            phone: validatedShippingAddress.data.phone ?? undefined,
            address: {
              city: validatedShippingAddress.data.city,
              country: validatedShippingAddress.data.country,
              line1: validatedShippingAddress.data.line1,
              line2: validatedShippingAddress.data.line2 ?? '',
              postal_code: validatedShippingAddress.data.postalCode,
              state: validatedShippingAddress.data.state ?? '',
            },
          },
        },
      })

      console.log('result', result)

      if (result.error) {
        console.log('result.error', result.error)
        setIsLoading(false)
        setFormErrorMessage(result.error.message ?? 'Unexpected error')
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
        router.push('/shop/order/success?' + params.toString())
        // deliberately not setting isLoading to false here to prevent the button to flicker back to "Pay now" before redirecting
        // setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false)
      setFormErrorMessage(error instanceof Error ? error.message : 'Unexpected error')
    }
  }

  // console.log(customer)

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <LinkAuthenticationElement
        onReady={() => setIsLinkAuthenticationReady(true)}
        onChange={(event) => {
          console.log('link auth onChange', event)
          if (event.complete) {
            setEmail(event.value.email)
          }
        }}
        options={{
          defaultValues: {
            email: customer?.email ?? '',
          },
        }}
      />
      <AddressElement
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
        onChange={(e) => {
          console.log('addressonChange', e)
          // do not override billing address if it's manually edited
          if (!sameAsShipping) {
            return
          }

          if (!isAddressReady) {
            return
          }

          setBillingAddressValues({
            name: e.value.name,
            city: e.value.address.city,
            country: e.value.address.country,
            line1: e.value.address.line1,
            line2: e.value.address.line2 ?? null,
            postalCode: e.value.address.postal_code,
            state: e.value.address.state ?? null,
            phone: e.value.phone ?? null,
            taxId: '',
            email: email,
          })
        }}
        onReady={() => {
          console.log('address onReady')
          setIsAddressReady(true)
        }}
      />

      {readyToRender && !allProductsDigital && (
        <ShippingRatesSection
          // locale={locale}
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
          shippingRates={shippingRates}
        />
      )}

      {readyToRender && (
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
          {allProductsDigital ? 'Billing same as payment' : 'Billing same as shipping'}
        </Label>
      )}

      {readyToRender && (
        <Collapsible className="" open={!sameAsShipping}>
          <CollapsibleContent id="billingAddressCollapsibleContent" className="CollapsibleContent">
            <fieldset
              aria-hidden={sameAsShipping}
              tabIndex={sameAsShipping ? -1 : undefined}
              className={`grid gap-6 rounded-lg border p-4`}
            >
              <legend className="-ml-1 whitespace-nowrap px-1 text-sm font-medium">
                Billing address
              </legend>
              <BillingAddressSection
                values={billingAddressValues}
                onChange={setBillingAddressValues}
                errors={fieldErrors}
              />
            </fieldset>
          </CollapsibleContent>
        </Collapsible>
      )}

      <PaymentElement
        onReady={() => setIsPaymentReady(true)}
        options={{
          fields: {
            billingDetails: {
              address: 'never',
            },
          },
        }}
      />
      {formErrorMessage && (
        <Alert variant="destructive" className="mt-2" aria-live="polite" aria-atomic>
          <AlertCircle className="-mt-1 h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formErrorMessage}</AlertDescription>
        </Alert>
      )}
      {readyToRender && (
        <div className="flex flex-row items-center gap-x-2">
          <p>Total: 0</p>
        </div>
      )}
      {readyToRender && (
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
    </form>
  )
}

const BillingAddressSection = ({
  values,
  onChange,
  errors,
}: {
  values: AddressSchema
  onChange: (values: AddressSchema) => void
  errors: Record<string, string[] | null | undefined>
}) => {
  const onFieldChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget
    onChange({ ...values, [name]: value })
  }

  return (
    <>
      <InputWithErrors
        // required
        label="Full name"
        name="name"
        defaultValue={values.name ?? undefined}
        autoComplete="shipping name"
        className="mt-3 w-full"
        errors={errors}
        onChange={onFieldChange}
      />
      <InputWithErrors
        // required
        label="Address line 1"
        name="line1"
        defaultValue={values.line1 ?? undefined}
        autoComplete="shipping address-line1"
        className="mt-3 w-full"
        errors={errors}
        onChange={onFieldChange}
      />
      <InputWithErrors
        label="Address line 2"
        name="line2"
        defaultValue={values.line2 ?? undefined}
        autoComplete="shipping address-line2"
        className="mt-3 w-full"
        errors={errors}
        onChange={onFieldChange}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <InputWithErrors
          // required
          label="Postal code"
          name="postalCode"
          defaultValue={values.postalCode ?? undefined}
          autoComplete="shipping postal-code"
          className="mt-3 w-full"
          errors={errors}
          onChange={onFieldChange}
        />
        <InputWithErrors
          // required
          label="City"
          name="city"
          defaultValue={values.city ?? undefined}
          autoComplete="shipping home city"
          className="mt-3 w-full"
          errors={errors}
          onChange={onFieldChange}
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-1">
        <InputWithErrors
          label="State"
          name="state"
          defaultValue={values.state ?? undefined}
          autoComplete="shipping address-level1"
          className="mt-3 w-full"
          errors={errors}
          onChange={onFieldChange}
        />
        <CountrySelect
          label="Country"
          name="country"
          autoComplete="shipping country"
          onChangeValue={(value) => onChange({ ...values, country: value })}
          value={values.country ?? ''}
          errors={errors}
        />
      </div>
      <InputWithErrors
        // required
        label="Phone"
        name="phone"
        defaultValue={values.phone ?? undefined}
        autoComplete="shipping tel"
        type="tel"
        className="mt-3 w-full"
        errors={errors}
        onChange={onFieldChange}
      />
      <InputWithErrors
        // required
        label="Tax ID"
        name="taxId"
        defaultValue={values.taxId ?? undefined}
        autoComplete=""
        placeholder="Tax ID"
        type="text"
        className="mt-3 w-full"
        errors={errors}
        onChange={onFieldChange}
      />
    </>
  )
}
