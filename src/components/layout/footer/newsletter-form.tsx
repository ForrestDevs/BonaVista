'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Stay Updated</h3>
      <p className="text-sm">Subscribe to our newsletter for exclusive offers and updates.</p>
      <form className="flex space-x-2" id="newsletter-form">
        <Input
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          className="bg-primary-foreground text-primary grow"
          id="newsletter-email"
        />
        <Button type="submit" variant="secondary">
          Subscribe
        </Button>
      </form>
    </div>
  )
}
