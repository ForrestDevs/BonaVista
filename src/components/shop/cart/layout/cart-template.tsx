'use client'

import React from 'react'

import Spinner from '@/components/ui/spinner'
import { useCart } from '@/lib/providers/Cart'
import { Separator } from '@/components/ui/separator'
import SignInPrompt from '../components/sign-in-prompt'
import type { Page, Settings, User } from '@/payload-types'

import { CartSummary } from '@/components/shop/cart/layout/cart-summary'

import EmptyCartMessage from '../components/empty-cart-message'
import { CartItems } from './cart-items'

interface CartTemplateProps {
  page: Page
  settings: Settings
  user: User
}

export function CartTemplate({ page, settings, user }: CartTemplateProps) {
  const { productsPage } = settings || {}
  const { addItemToCart, cart, cartIsEmpty, cartTotal, hasInitializedCart } = useCart()

  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {!hasInitializedCart ? (
          <Spinner />
        ) : cart?.items && cart?.items.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {!user && (
                <>
                  <SignInPrompt />
                  <Separator />
                </>
              )}
              <CartItems items={cart?.items} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && (
                  <>
                    <div className="bg-white py-6">
                      <CartSummary cart={cart} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
            {!user && (
              <>
                <SignInPrompt />
                <Separator />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
