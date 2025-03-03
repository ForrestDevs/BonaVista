'use client'

import React, { useCallback, useEffect, useState } from 'react'
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
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

export default function Login({ setCurrentView }: Props) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
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
    if (state.status === 'success') {
      toast.success('Login Successful, Welcome back!')
      router.refresh()
      // Redirect will happen automatically due to the server component checking authentication
    } else if (state.status === 'error') {
      toast.error(state.message || 'Login Failed. Please check your credentials and try again.')
      router.refresh()
    }
  }, [state, router])

  const toggleShowPassword = () => setShowPassword(!showPassword)

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
      <p className="text-center text-gray-600 mb-8">
        Sign in to access your account and manage your orders.
      </p>

      <Form {...form}>
        <form className="w-full space-y-4" action={formAction}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      disabled={isPending}
                    />
                  </FormControl>
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
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
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10"
                      disabled={isPending}
                    />
                  </FormControl>
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => toast.info('Password reset functionality is coming soon!')}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>

      <div className="w-full mt-6 pt-6 border-t border-gray-200">
        <span className="block text-center text-gray-600">
          Not a member?{' '}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Create an account
          </button>
        </span>
      </div>
    </div>
  )
}
