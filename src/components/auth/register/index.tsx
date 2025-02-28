'use client'

import React, { useEffect, useState } from 'react'
import { useActionState } from 'react'

import { LOGIN_VIEW } from '@components/auth'
import { useForm } from 'react-hook-form'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { useRouter } from 'next/navigation'
import { registerAction } from '@components/auth/actions'
import { registerSchema, RegisterSchema } from '@lib/validations/auth'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { YnsLink } from '@components/ui/link'
import { Loader2, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

export default function Register({ setCurrentView }: Props) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [state, formAction, isPending] = useActionState(registerAction, {
    status: 'idle',
    message: null,
  })

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirm: '',
      ...(state?.fields ?? {}),
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (state.status === 'success') {
      toast.success('Registration Successful! You can now sign in to your account.')
      router.refresh()
      setCurrentView(LOGIN_VIEW.SIGN_IN)
    } else if (state.status === 'error') {
      toast.error(state.message || 'Registration Failed. Please check your information and try again.')
    }
  }, [state, router, setCurrentView])

  const toggleShowPassword = () => setShowPassword(!showPassword)
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
      <p className="text-center text-gray-600 mb-8">
        Join BonaVista LeisureScapes for a personalized shopping experience.
      </p>

      <Form {...form}>
        <form className="w-full space-y-4" action={formAction}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="John"
                        className="pl-10"
                        disabled={isPending}
                      />
                    </FormControl>
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Smith"
                        className="pl-10"
                        disabled={isPending}
                      />
                    </FormControl>
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="(123) 456-7890"
                      className="pl-10"
                      disabled={isPending}
                    />
                  </FormControl>
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10"
                      disabled={isPending}
                    />
                  </FormControl>
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword
                        ? 'Hide password confirmation'
                        : 'Show password confirmation'}
                    </span>
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm text-gray-600 mt-4">
            By creating an account, you agree to BonaVista LeisureScapes&apos;s{' '}
            <YnsLink href="/content/privacy-policy" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </YnsLink>{' '}
            and{' '}
            <YnsLink href="/content/terms-of-use" className="text-blue-600 hover:text-blue-800">
              Terms of Use
            </YnsLink>
            .
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </Form>

      <div className="w-full mt-6 pt-6 border-t border-gray-200">
        <span className="block text-center text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Sign in
          </button>
        </span>
      </div>
    </div>
  )
}
