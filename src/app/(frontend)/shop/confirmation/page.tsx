import Link from 'next/link'
import { Fragment } from 'react'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { handlePaymentSuccess } from '@/lib/data/checkout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ClearCookieClientComponent } from '@/components/shop/checkout/clear-cart-cookie'
import { AlertCircle } from 'lucide-react'

interface ConfirmationPageProps {
  searchParams: Promise<{
    payment_intent: string
    payment_intent_client_secret: string
    cart_id: string
  }>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { payment_intent, payment_intent_client_secret, cart_id } = await searchParams

  if (!payment_intent || !payment_intent_client_secret || !cart_id) {
    redirect('/shop/cart')
  }

  const result = await handlePaymentSuccess({
    paymentIntentId: payment_intent,
    clientSecret: payment_intent_client_secret,
  })

  return (
    <div className="container py-8">
      <ClearCookieClientComponent cartId={cart_id} />
      <div className="max-w-2xl mx-auto">
        {result.success ? (
          <Card className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold">Order Confirmed!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. We&apos;ll email you an order confirmation with
                details.
              </p>

              <div className="pt-6">
                <p className="font-medium">Order number</p>
                <p className="text-gray-600">{result.orderId}</p>
              </div>

              <div className="pt-8 space-x-4">
                <Button asChild>
                  <Link href={`/shop/v2/orders/${result.orderId}`}>View Order Details</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Fragment>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{result.error || 'An unknown error occurred'}</AlertDescription>
            </Alert>
            <p>
              {`Your payment was successful but there was an error processing your order. Please contact us to resolve this issue.`}
            </p>
            <div className="flex wrap g-4">
              <Link href={'/account'}>View account</Link>
              <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`}>View all orders</Link>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}
