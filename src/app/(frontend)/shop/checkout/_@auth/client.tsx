'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export default function AuthClient() {
    const [email, setEmail] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    // On success, router.push('/shop/checkout')
  }

  
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12">Sign in for faster checkout.</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column - Sign In */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Sign in to your account</h2>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email or Phone Number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-gray-600">
                Remember me
              </label>
            </div>

            <Button type="submit" className="w-full text-lg py-6">
              Continue
            </Button>

            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline block text-center"
            >
              Forgotten your password?
            </Link>
          </form>
        </div>

        {/* Right Column - Guest Checkout */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Guest Checkout</h2>
          <p className="text-gray-600">Proceed and create an account later.</p>
          {/* <Button onClick={handleGuestCheckout} variant="outline" className="w-full text-lg py-6">
            Continue as Guest
          </Button> */}
        </div>
      </div>
    </div>
  )
}
