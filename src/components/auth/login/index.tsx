'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { useActionState } from 'react'

import { LOGIN_VIEW } from '@components/auth'
import { useForm } from 'react-hook-form'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { useRouter } from 'next/navigation'
import { loginAction } from '@components/auth/actions'
import { loginSchema, LoginSchema } from '@lib/validations/auth'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

export default function Login({ setCurrentView }: Props) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(loginAction, {
    status: 'idle',
    message: null,
  })

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(state?.fields ?? {}),
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    router.refresh()
  }, [state, router])

  return (
    <div className="max-w-sm w-full flex flex-col items-center" data-testid="login-page">
      <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Sign in to access an enhanced shopping experience.
      </p>

      <Form {...form}>
        <form className="w-full" action={formAction}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="" data-testid="email-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="" data-testid="password-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {state.status === 'error' && (
            <p className="text-red-500 text-sm mt-2" data-testid="login-error-message">
              {state.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full mt-6"
            disabled={isPending || !form.formState.isValid}
            data-testid="sign-in-button"
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Not a member?{' '}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          Join us
        </button>
        .
      </span>
    </div>
  )
}
