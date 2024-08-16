'use client'

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

import type { Order } from '@payload-types'
import { useCart } from '@/lib/providers/Cart'
import { priceFromJSON } from '@/lib/utils/priceFromJSON'
import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'

export const CheckoutForm: React.FC<{}> = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const { cart, cartTotal } = useCart()

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault()
      setIsLoading(true)

      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return
      }

      try {
        const res = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order-confirmation`,
          },
          redirect: 'if_required',
        })

        if (res?.error) {
          setError(res.error.message || 'Something went wrong.')
          setIsLoading(false)
        }

        if (res?.paymentIntent) {
          // Before redirecting to the order confirmation page, we need to create the order in Payload
          // Cannot clear the cart yet because if you clear the cart while in the checkout
          // you will be redirected to the `/cart` page before this redirect happens
          // Instead, we clear the cart in an `afterChange` hook on the `orders` collection in Payload
          try {
            const orderReq = await fetch('http://localhost:3000/api/orders', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                items: (cart?.items || [])?.map(({ product, quantity }) => ({
                  price:
                    typeof product === 'object'
                      ? priceFromJSON(product?.priceJSON!, 1, true)
                      : undefined,
                  product: typeof product === 'string' ? product : product?.id,
                  quantity,
                })),
                stripePaymentIntentID: res.paymentIntent.id,
                total: cartTotal.raw,
              }),
            })

            if (!orderReq.ok) throw new Error(orderReq.statusText || 'Something went wrong.')

            const {
              doc,
              error: errorFromRes,
            }: {
              doc: Order
              error?: string
              message?: string
            } = await orderReq.json()

            if (errorFromRes) throw new Error(errorFromRes)

            router.push(`/shop/order-confirmation?order_id=${doc.id}`)
          } catch (err) {
            // don't throw an error if the order was not created successfully
            // this is because payment _did_ in fact go through, and we don't want the user to pay twice
            console.error(err) // eslint-disable-line no-console
            router.push(`/shop/order-confirmation?error=${encodeURIComponent(err as string)}`)
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.'
        setError(`Error while submitting payment: ${msg}`)
        setIsLoading(false)
      }
    },
    [stripe, elements, router, cart, cartTotal],
  )

  return (
    // <form id="payment-form" onSubmit={handleSubmit}>
    //   <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
    //   <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmit}>
    //     <span id="button-text">
    //       {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
    //     </span>
    //   </button>
    //   {/* Show any error or success messages */}
    //   {error && <div id="payment-message">{error}</div>}
    // </form>
    <form onSubmit={handleSubmit} className="flex flex-col">
      {error && <p>{error}</p>}
      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

      <div className="flex justify-between z-10 mt-10">
        <YnsLink href="/shop/cart">
          <Button variant="secondary">Back to cart</Button>
        </YnsLink>

        <Button disabled={!stripe || isLoading} type="submit">
          {isLoading ? 'Loading...' : 'Checkout'}
        </Button>
      </div>
    </form>
  )
}

export default CheckoutForm
