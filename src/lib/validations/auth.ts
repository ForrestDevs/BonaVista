import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8, { message: 'Password must be at least 8 characters' }),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'First name is required' }),
  lastName: z.string().trim().min(1, { message: 'Last name is required' }),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1, { message: 'Phone number is required' }),
  password: z.string().trim().min(8, { message: 'Password must be at least 8 characters' }),
  passwordConfirm: z.string().trim().min(8, { message: 'Password must be at least 8 characters' }),
})

export type RegisterSchema = z.infer<typeof registerSchema>
