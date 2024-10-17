'use client'

import { Address, Cart, Customer } from '@payload-types'
import { CheckCircle } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Spinner from '@components/ui/spinner'
import { useToggleState } from '@lib/hooks/useToggleState'
import { Separator } from '@components/ui/separator'
import compareAddresses from '@lib/utils/compareAddresses'
import BillingAddress from './billing-address'
import ShippingAddress from './shipping-address'
import { Button } from '@components/ui/button'
import { setShippingAddress, setBillingAddress } from '@lib/data/cart'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const addressSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address_1: z.string().min(1, 'Address is required'),
  address_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  country_code: z.string().min(1, 'Country is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  phone: z.string().min(1, 'Phone number is required'),
})

export function Addresses({ cart, customer }: { cart: Cart; customer: Customer | null }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get('step') === 'address'

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address as Address, cart?.billing_address as Address)
      : true,
  )

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: (cart?.shipping_address as Address)?.first_name || '',
      last_name: (cart?.shipping_address as Address)?.last_name || '',
      address_1: (cart?.shipping_address as Address)?.address_1 || '',
      address_2: (cart?.shipping_address as Address)?.address_2 || '',
      city: (cart?.shipping_address as Address)?.city || '',
      country_code: (cart?.shipping_address as Address)?.country_code || '',
      postal_code: (cart?.shipping_address as Address)?.postal_code || '',
      phone: (cart?.shipping_address as Address)?.phone || '',
    },
  })

  const handleEdit = () => {
    router.push(pathname + '?step=address')
  }

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    console.log('values', values)
    await setShippingAddress(values as Address)
    if (sameAsBilling) {
      await setBillingAddress(values as Address)
    } else {
      // Handle billing address separately if needed
    }
    router.push('/shop/checkout?step=delivery')
  }

  return (
    <div className="bg-background">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="flex flex-row text-3xl gap-x-2 items-baseline">
          Shipping Address
          {!isOpen && <CheckCircle className="w-5 h-5" />}
        </h2>
        {!isOpen && cart?.shipping_address && (
          <p>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </p>
        )}
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
              form={form}
            />

            {!sameAsBilling && (
              <div>
                <h2 className="text-3xl-regular gap-x-4 pb-6 pt-8">Billing address</h2>
                <BillingAddress cart={cart} form={form} />
              </div>
            )}

            <button type="submit" className="mt-6" data-testid="submit-address-button">
              Save
            </button>

            {/* <Button type="submit" className="mt-6" data-testid="submit-address-button">
              Continue to delivery
            </Button> */}
          </form>
        </Form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div className="flex flex-col w-1/3" data-testid="shipping-address-summary">
                    <h3 className="txt-medium-plus text-ui-fg-base mb-1">Shipping Address</h3>
                    <p className="txt-medium text-ui-fg-subtle">
                      {(cart.shipping_address as Address).first_name}{' '}
                      {(cart.shipping_address as Address).last_name}
                    </p>
                    <p className="txt-medium text-ui-fg-subtle">
                      {(cart.shipping_address as Address).address_1}{' '}
                      {(cart.shipping_address as Address).address_2}
                    </p>
                    <p className="txt-medium text-ui-fg-subtle">
                      {(cart.shipping_address as Address).postal_code},{' '}
                      {(cart.shipping_address as Address).city}
                    </p>
                    <p className="txt-medium text-ui-fg-subtle">
                      {(cart.shipping_address as Address).country_code?.toUpperCase()}
                    </p>
                  </div>

                  <div className="flex flex-col w-1/3 " data-testid="shipping-contact-summary">
                    <p className="txt-medium-plus text-ui-fg-base mb-1">Contact</p>
                    <p className="txt-medium text-ui-fg-subtle">
                      {(cart.shipping_address as Address).phone}
                    </p>
                    <p className="txt-medium text-ui-fg-subtle">{customer?.email || ''}</p>
                  </div>

                  <div className="flex flex-col w-1/3" data-testid="billing-address-summary">
                    <p className="txt-medium-plus text-ui-fg-base mb-1">Billing Address</p>

                    {sameAsBilling ? (
                      <p className="txt-medium text-ui-fg-subtle">
                        Billing and delivery address are the same.
                      </p>
                    ) : (
                      <>
                        <p className="txt-medium text-ui-fg-subtle">
                          {(cart.billing_address as Address)?.first_name}{' '}
                          {(cart.billing_address as Address)?.last_name}
                        </p>
                        <p className="txt-medium text-ui-fg-subtle">
                          {(cart.billing_address as Address)?.address_1}{' '}
                          {(cart.billing_address as Address)?.address_2}
                        </p>
                        <p className="txt-medium text-ui-fg-subtle">
                          {(cart.billing_address as Address)?.postal_code},{' '}
                          {(cart.billing_address as Address)?.city}
                        </p>
                        <p className="txt-medium text-ui-fg-subtle">
                          {(cart.billing_address as Address)?.country_code?.toUpperCase()}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Separator className="mt-8 bg-muted" />
    </div>
  )
}

export default Addresses
