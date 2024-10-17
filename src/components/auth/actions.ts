'use server'

import { login, register } from '@lib/data/auth'
import { loginSchema, registerSchema } from '@lib/validations/auth'

export type FormState = {
  status: 'success' | 'error' | 'idle' | 'loading'
  message: string
  fields?: Record<string, string>
  issues?: string[]
}

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const data = Object.fromEntries(formData)
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString()
    }
    return {
      status: 'error',
      message: 'Invalid form data',
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    }
  }

  const res = await login(parsed.data)

  if (res.message) {
    return {
      status: 'error',
      message: res.message,
    }
  }

  return {
    status: 'success',
    message: 'User registered',
  }
}

export async function registerAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const data = Object.fromEntries(formData)
  const parsed = registerSchema.safeParse(data)

  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString()
    }
    return {
      status: 'error',
      message: 'Invalid form data',
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    }
  }

  const res = await register(parsed.data)

  if (res.message) {
    return {
      status: 'error',
      message: res.message,
    }
  }

  return {
    status: 'success',
    message: 'User registered',
  }
}
