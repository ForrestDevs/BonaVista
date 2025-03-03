import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import getPayload from '@/lib/utils/getPayload'
import { formatMoney, formatStripeMoney } from '@/lib/utils/formatMoney'
import { ORDER_SLUG, PRODUCT_SLUG } from '@/payload/collections/constants'
import { getCurrentUser } from '@/lib/data/auth'
import crypto from 'crypto'
import { OrderItem } from '@/lib/types/order'
import { Product, Order } from '@payload-types'
import OrderVerificationForm from '@/components/shop/orders/verification-form'
import { getCachedOrderById, verifyOrderAuthHash } from '@/lib/data/order'

interface OrderPageProps {
  searchParams: Promise<{
    id?: string
    auth?: string
    verified?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const user = await getCurrentUser()
  let order: Order | null = null
  let isAuthorized = false

  // Handle URL parameters
  const { id, auth, verified } = await searchParams

  // Case 1: User is authenticated
  if (user) {
    // If there's an ID, try to fetch the order directly
    if (id) {
      order = await getCachedOrderById(parseInt(id))
      // Only allow if user is the order owner
      if (order && order.orderedBy === user.customer) {
        isAuthorized = true
      }
    }
    // If not authorized but user is logged in, they're trying to access someone else's order
    if (order && !isAuthorized) {
      return (
        <main className="container py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8">
              <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
              <p className="mb-4">You don&apos;t have permission to view this order.</p>
              <Button variant="outline" asChild>
                <Link href="/account/orders">View Your Orders</Link>
              </Button>
            </Card>
          </div>
        </main>
      )
    }
  }
  // Case 2: Guest with direct auth link (e.g., from order confirmation email)
  else if (id && auth) {
    order = await getCachedOrderById(parseInt(id))
    if (order && verifyOrderAuthHash(id, order.orderNumber, auth)) {
      isAuthorized = true
    }
  }
  // Case 3: Guest with manually verified order (via email + order number form)
  else if (verified) {
    try {
      const [orderId, verificationHash] = verified.split(':')
      order = await getCachedOrderById(parseInt(orderId))

      if (order && verifyOrderAuthHash(orderId, order.orderNumber, verificationHash)) {
        isAuthorized = true
      }
    } catch (error) {
      console.error('Error processing verification token:', error)
    }
  }

  // If we found an order but user is not authorized
  if (order && !isAuthorized) {
    return <OrderVerificationForm />
  }

  // If no order was found or not authorized
  if (!order || !isAuthorized) {
    return <OrderVerificationForm />
  }

  return (
    <main className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-sm text-gray-500">Order #{order.id}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="font-semibold mb-2">Order Status</h2>
                <p className="capitalize text-gray-700">{order.status}</p>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Items</h2>
                <div className="space-y-4">
                  {order.lineItems.map(({ lineItem }) => (
                    <OrderLineItem key={lineItem.sku} lineItem={lineItem} />
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-gray-600">
                    {formatStripeMoney({
                      amount: order.total - (order.taxTotal || 0) - (order.shippingRate?.rate || 0),
                      currency: order.currency,
                    })}
                  </p>
                </div>

                {order.shippingRate && (
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping ({order.shippingRate.displayName})</p>
                    <p className="text-gray-600">
                      {formatStripeMoney({
                        amount: order.shippingRate.rate || 0,
                        currency: order.currency,
                      })}
                    </p>
                  </div>
                )}

                {order.taxTotal > 0 && (
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax</p>
                    <p className="text-gray-600">
                      {formatStripeMoney({
                        amount: order.taxTotal,
                        currency: order.currency,
                      })}
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t">
                  <p className="font-semibold">Total</p>
                  <p className="font-semibold">
                    {formatStripeMoney({
                      amount: order.total,
                      currency: order.currency,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button variant="outline" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}

function OrderLineItem({ lineItem }: { lineItem: OrderItem }) {
  return (
    <div className="flex justify-between border-b pb-4">
      <div>
        <p className="font-medium">
          {typeof lineItem.product === 'object'
            ? lineItem.product?.title || 'Product'
            : lineItem.sku}
        </p>
        {lineItem.variantOptions && lineItem.variantOptions.length > 0 && (
          <p className="text-sm text-gray-500">
            {lineItem.variantOptions
              .map((opt) => `${opt.key?.label}: ${opt.value?.label}`)
              .join(', ')}
          </p>
        )}
        <p className="text-sm">Quantity: {lineItem.quantity}</p>
      </div>
      <p className="font-medium">
        {formatMoney({
          amount: lineItem.price,
          currency: 'cad', // Default currency
        })}
      </p>
    </div>
  )
}
