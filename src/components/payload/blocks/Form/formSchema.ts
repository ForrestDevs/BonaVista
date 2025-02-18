import { z } from 'zod'

export const interestedInOptions = [
  { label: 'Hot Tubs', value: 'hot-tubs' },
  { label: 'Swim Spas', value: 'swim-spas' },
  { label: 'Outdoor Living', value: 'outdoor-living' },
  { label: 'Water Care', value: 'water-care' },
  { label: 'Questions/Support', value: 'questions-support' },
] as const

export const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters'),
  interestedIn: z.string().min(1, 'Please select at least one option'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  subscribeToMailingList: z.boolean().default(true),
})

export type FormValues = z.infer<typeof formSchema>
