import Link from 'next/link'
import { Fragment, Suspense } from 'react'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getHashedPaymentIntent, handlePaymentSuccess } from '@/lib/data/checkout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ClearCookieClientComponent } from '@/components/shop/checkout/clear-cart-cookie'
import { AlertCircle } from 'lucide-react'
import SkeletonOrderConfirmed from '@components/shop/skeletons/layout/skeleton-order-confirmed'

interface ConfirmationPageProps {
  searchParams: Promise<{
    pid: string
    cart_id: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { pid, cart_id } = await searchParams

  if (!pid || !cart_id) {
    redirect('/shop/cart')
  }

  const paymentIntent = await getHashedPaymentIntent(pid)

  if (!paymentIntent) {
    redirect('/shop/cart')
  }

  const result = await handlePaymentSuccess({
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.clientSecret,
  })

  return (
    <Suspense fallback={<SkeletonOrderConfirmed />}>
      <div className="container py-8">
        <ClearCookieClientComponent cartId={parseInt(cart_id)} />
        <div className="max-w-2xl mx-auto">
          {result.error ? (
            <Fragment>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{result.error || 'An unknown error occurred'}</AlertDescription>
              </Alert>
              <p>
                {`Your payment was successful but there was an error processing your order. Please contact us to resolve this issue.`}
              </p>
            </Fragment>
          ) : (
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
                    <Link href={`/shop/orders/${result.orderId}`}>View Order Details</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Suspense>
  )
}
