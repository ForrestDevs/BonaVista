'use client'

import React, { Fragment, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@lib/providers/Cart'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const OrderConfirmation: React.FC<{}> = () => {
  const searchParams = useSearchParams()
  const orderID = searchParams.get('order_id')
  const error = searchParams.get('error')

  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div>
      {error ? (
        <Fragment>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <p>
            {`Your payment was successful but there was an error processing your order. Please contact us to resolve this issue.`}
          </p>
          <div className="flex wrap g-4">
            <Link href={'/account'}>View account</Link>
            <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`}>View all orders</Link>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <h1>Thank you for your order!</h1>
          <p>
            {`Your order has been confirmed. You will receive an email confirmation shortly. Your order ID is ${orderID}.`}
          </p>
          <div className="flex wrap g-4">
            <Link href={`/orders/${orderID}`}>View order</Link>
            <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`}>View all orders</Link>
          </div>
        </Fragment>
      )}
    </div>
  )
}
