'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@components/ui/input'
import CountrySelect from './country-select'
import { Cart, Address } from '@payload-types'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@components/ui/form'

const BillingAddress = ({
  cart,
  form,
}: {
  cart: Cart | null
  form: ReturnType<typeof useForm>
}) => {
  const { control, setValue } = form

  useEffect(() => {
    if (cart?.billing_address && typeof cart.billing_address !== 'string') {
      const address = cart.billing_address as Address
      setValue('billing_address.first_name', address.first_name || '')
      setValue('billing_address.last_name', address.last_name || '')
      setValue('billing_address.address_1', address.address_1 || '')
      setValue('billing_address.company', address.company || '')
      setValue('billing_address.postal_code', address.postal_code || '')
      setValue('billing_address.city', address.city || '')
      setValue('billing_address.country_code', address.country_code || '')
      setValue('billing_address.province', address.province || '')
      setValue('billing_address.phone', address.phone || '')
    }
  }, [cart?.billing_address, setValue])

  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="billing_address.first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="given-name"
                  required
                  data-testid="billing-first-name-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="billing_address.last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="family-name"
                  required
                  data-testid="billing-last-name-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="billing_address.address_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="address-line1"
                  required
                  data-testid="billing-address-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="billing_address.company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="organization" data-testid="billing-company-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="billing_address.postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="postal-code"
                  required
                  data-testid="billing-postal-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="billing_address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="address-level2"
                  required
                  data-testid="billing-city-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="billing_address.country_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <CountrySelect
                  {...field}
                  autoComplete="country"
                  required
                  data-testid="billing-country-select"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="billing_address.province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State / Province</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="address-level1"
                  required
                  data-testid="billing-province-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="billing_address.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="tel" data-testid="billing-phone-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

export default BillingAddress
