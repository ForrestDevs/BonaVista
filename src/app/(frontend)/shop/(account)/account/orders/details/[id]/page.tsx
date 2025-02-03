import { Button } from '@components/ui/button'
import { formatDateTime } from '@lib/utils/formatDateTime'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import getPayload from '@/lib/utils/getPayload'
import { ORDER_SLUG } from '@/payload/collections/constants'
import CartItemDetails, { CartItemThumbnail } from '@/components/shop/cart/cart-item-details'
import { Order } from '@payload-types'
import { PaymentIntent } from '@stripe/stripe-js'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Order Details | BonaVista LeisureScapes',
    description: 'View your order details',
    openGraph: {
      title: 'Order Details | BonaVista LeisureScapes',
      description: 'View your order details',
    },
  }
}

type ExtendedOrder = Omit<Order, 'paymentIntent'> & {
  paymentIntent: PaymentIntent
}

export default async function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload()
  const param = await params
  const order = (await payload.findByID({
    collection: ORDER_SLUG,
    id: param.id,
  })) as unknown as ExtendedOrder

  if (!order) {
    notFound()
  }

  const customer = typeof order.orderedBy === 'string' ? null : order.orderedBy

  const user = typeof customer?.account === 'string' ? null : customer.account

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order details</h1>
        <Link href="/shop/account/orders">
          <span className="sr-only">Close</span>× Back to overview
        </Link>
      </div>

      <p className="text-gray-600">
        We have sent the order confirmation details to {customer?.email}.
      </p>

      <div className="space-y-2">
        <p>Order date: {formatDateTime(order.createdAt)}</p>
        <p className="text-blue-600">Order number: {order.id}</p>
        <div className="flex gap-x-8">
          <p>Order status: {order.status || 'Not fulfilled'}</p>
          <p>Payment status: {order.status === 'succeeded' ? 'Paid' : 'Awaiting'}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-x-4">
              <div className="h-20 w-20 rounded-lg border">
                <CartItemThumbnail item={item} />
                {/* {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover rounded-lg"
                  />
                )} */}
              </div>
              <CartItemDetails item={item} />
            </div>
            <div className="text-right">
              <p>
                {item.quantity}x ${item.price.toFixed(2)}
              </p>
              <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Delivery</h2>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <div className="text-gray-600 space-y-1">
              <p>
                {user?.firstName ?? 'Luke'} {user?.lastName ?? 'Gannon'}
              </p>
              <p>{order.paymentIntent.shipping.address.line1}</p>
              {order.paymentIntent?.shipping.address.line2 && (
                <p>{order.paymentIntent?.shipping.address.line2}</p>
              )}
              <p>
                {order.paymentIntent?.shipping.address.city},{' '}
                {order.paymentIntent?.shipping.address.state}
              </p>
              <p>{order.paymentIntent?.shipping.address.country}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Contact</h3>
            <div className="text-gray-600 space-y-1">
              <p>{user?.phone}</p>
              <p>{customer?.email}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Method</h3>
            <p className="text-gray-600">
              {order.shippingRate.displayName === 'Standard Shipping'
                ? `${order.shippingRate.displayName} ($${order.shippingRate.rate?.toFixed(2)})`
                : 'Local Pickup'}
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>${order.total?.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>${order.shippingRate.rate?.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Taxes</p>
            <p>${order.total?.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-medium text-lg pt-2 border-t">
            <p>Total</p>
            <p>${order.total?.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Need help?</h2>
        <div className="space-y-2">
          <Link href="/contact" className="block text-blue-600 hover:underline">
            Contact
          </Link>
          <Link href="/returns" className="block text-blue-600 hover:underline">
            Returns & Exchanges
          </Link>
        </div>
      </div>
    </div>
  )
}
