'use server'

import { login, register } from '@lib/data/auth'
import { loginSchema, registerSchema } from '@lib/validations/auth'
import { z } from 'zod'

export type FormState = {
  status: 'success' | 'error' | 'idle' | 'loading'
  message: string | null
  fields?: Record<string, string>
  issues?: string[]
}

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    // First, update state to indicate loading
    const loadingState: FormState = {
      ...prevState,
      status: 'loading',
      message: null,
    }

    // We'd typically send this state back immediately in a streaming context
    // but for now we'll simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 500))

    const data = Object.fromEntries(formData)
    const parsed = loginSchema.safeParse(data)

    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const key of Object.keys(data)) {
        fields[key] = data[key].toString()
      }

      const formattedErrors = formatZodErrors(parsed.error)

      return {
        status: 'error',
        message: 'Please fix the errors in the form',
        fields,
        issues: formattedErrors,
      }
    }

    const res = await login(parsed.data)

    if (res.status === 'error') {
      return {
        status: 'error',
        message: res.message,
        fields: data as Record<string, string>,
      }
    }

    return {
      status: 'success',
      message: 'Login successful',
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function registerAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    // First, update state to indicate loading
    const loadingState: FormState = {
      ...prevState,
      status: 'loading',
      message: null,
    }

    // We'd typically send this state back immediately in a streaming context
    // but for now we'll simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 500))

    const data = Object.fromEntries(formData)
    const parsed = registerSchema.safeParse(data)

    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const key of Object.keys(data)) {
        fields[key] = data[key].toString()
      }

      const formattedErrors = formatZodErrors(parsed.error)

      return {
        status: 'error',
        message: 'Please fix the errors in the form',
        fields,
        issues: formattedErrors,
      }
    }

    const res = await register(parsed.data)

    if (res.message) {
      return {
        status: 'error',
        message: res.message,
        fields: data as Record<string, string>,
      }
    }

    return {
      status: 'success',
      message: 'Account created successfully',
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

// Helper function to format Zod validation errors
function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.')
    return `${path ? path + ': ' : ''}${issue.message}`
  })
}
