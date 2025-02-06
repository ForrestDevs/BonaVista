import { TypeOf, z } from 'zod'

export const getAddressSchema = (tr: {
  nameRequired: string
  cityRequired: string
  countryRequired: string
  line1Required: string
  postalCodeRequired: string
}) => {
  const addressSchema = z.object({
    name: z.string({ required_error: tr.nameRequired }).min(1, tr.nameRequired),
    city: z.string({ required_error: tr.cityRequired }).min(1, tr.cityRequired),
    country: z.string({ required_error: tr.countryRequired }).min(1, tr.countryRequired),
    line1: z.string({ required_error: tr.line1Required }).min(1, tr.line1Required),
    line2: z.string().optional().nullable().default(''),
    postalCode: z.string({ required_error: tr.postalCodeRequired }).min(1, tr.postalCodeRequired),
    state: z.string().optional().nullable().default(''),
    phone: z.string().optional().nullable().default(''),
    taxId: z.string().optional().nullable().default(''),
    email: z.string().optional().nullable().default(''),
    // 	.email("Email is required")
    // 	.min(1, "Email is required"),
  })
  return addressSchema
}

export type AddressSchema = TypeOf<ReturnType<typeof getAddressSchema>>
