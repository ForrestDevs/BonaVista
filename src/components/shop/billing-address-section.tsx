import { InputWithErrors } from '@/components/shop/input-errors'
import { CountrySelect } from '@/components/shop/country-select'
import { ChangeEvent } from 'react'
import { object, string, TypeOf } from 'zod'

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

export const BillingAddressSection = ({
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
