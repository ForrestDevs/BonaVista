'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import { mapKeys } from 'lodash'
import { Address, Cart, Customer, User } from '@payload-types'
import { Input } from '@components/ui/input'
import { Checkbox } from '@components/ui/checkbox'
import AddressSelect from './address-select'
import CountrySelect from './country-select'
import { useForm, Controller } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@components/ui/form'

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
  form,
}: {
  customer: Customer | null
  cart: Cart | null
  checked: boolean
  onChange: () => void
  form: ReturnType<typeof useForm>
}) => {
  const { control, setValue } = form

  const customerShippingAddress = useMemo(() => {
    if (customer?.shipping_addresses && customer.shipping_addresses.length > 0) {
      return customer.shipping_addresses[0] as Address
    }
    return null
  }, [customer])

  const setFormAddress = useCallback(
    (address?: Address, email?: string) => {
      if (address) {
        setValue('shipping_address.first_name', address.first_name || '')
        setValue('shipping_address.last_name', address.last_name || '')
        setValue('shipping_address.address_1', address.address_1 || '')
        setValue('shipping_address.company', address.company || '')
        setValue('shipping_address.postal_code', address.postal_code || '')
        setValue('shipping_address.city', address.city || '')
        setValue('shipping_address.country_code', address.country_code || '')
        setValue('shipping_address.province', address.province || '')
        setValue('shipping_address.phone', address.phone || '')
      }

      if (email) {
        setValue('email', email)
      }
    },
    [setValue],
  )

  useEffect(() => {
    if (customerShippingAddress) {
      setFormAddress(customerShippingAddress, customer?.email)
    }
  }, [customerShippingAddress, customer?.email, setFormAddress])

  useEffect(() => {
    if (cart && cart.shipping_address) {
      setFormAddress(cart.shipping_address as Address, customer?.email)
    }
  }, [cart, customer?.email, setFormAddress])

  const customerName = customer?.has_account ? (customer?.account as User).firstName : 'Guest User'

  return (
    <Form {...form}>
      {customer && (
        <div className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customerName}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect
            addresses={[]}
            addressInput={
              mapKeys(form.getValues(), (_, key) => key.replace('shipping_address.', '')) as Address
            }
            onSelect={setFormAddress}
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="shipping_address.first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="given-name"
                  required
                  data-testid="shipping-first-name-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shipping_address.last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="family-name"
                  required
                  data-testid="shipping-last-name-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shipping_address.address_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="address-line1"
                  required
                  data-testid="shipping-address-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shipping_address.company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="organization"
                  data-testid="shipping-company-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shipping_address.postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="postal-code"
                  required
                  data-testid="shipping-postal-code-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shipping_address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="address-level2"
                  required
                  data-testid="shipping-city-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shipping_address.country_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <CountrySelect
                  {...field}
                  autoComplete="country"
                  required
                  data-testid="shipping-country-select"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shipping_address.province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State / Province</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="address-level1"
                  required
                  data-testid="shipping-province-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="my-8">
        <Checkbox id="same_as_billing" checked={checked} onCheckedChange={onChange}>
          Billing address same as shipping address
        </Checkbox>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="email"
                  required
                  data-testid="shipping-email-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shipping_address.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="tel" data-testid="shipping-phone-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

export default ShippingAddress
