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
import OrderItemDetails, { OrderItemThumbnail } from '@/components/shop/account/order-item-details'
import { formatStripeMoney } from '@/lib/utils/formatMoney'

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

  const customer = typeof order.orderedBy === 'object' ? order.orderedBy : null
  const user = typeof customer?.account === 'object' ? customer.account : null

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          Order Details
        </h1>
        <Link
          href="/shop/account/orders"
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>← Back to orders</span>
        </Link>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800 text-sm sm:text-base">
          Order confirmation details have been sent to{' '}
          <span className="font-semibold">{customer?.email}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-3">
        <p className="text-gray-600">
          Order date: <span className="text-gray-900">{formatDateTime(order.createdAt)}</span>
        </p>
        <p>
          Order number: <span className="font-medium text-blue-600">{order.id}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
          <p>
            Status:{' '}
            <span className="font-medium capitalize">{order.status || 'Not fulfilled'}</span>
          </p>
          <p>
            Payment:{' '}
            <span className="font-medium">
              {order.status === 'succeeded' ? 'Paid' : 'Awaiting Payment'}
            </span>
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-6">Items</h2>
        <div className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 hover:bg-gray-50 transition-colors rounded-lg px-3 gap-4"
            >
              <div className="flex items-center gap-x-4 sm:gap-x-6">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg border overflow-hidden flex-shrink-0">
                  <OrderItemThumbnail line={item} />
                </div>
                <OrderItemDetails item={item} />
              </div>
              <div className="text-left sm:text-right">
                <p className="text-gray-600">
                  {item.quantity}x{' '}
                  {formatStripeMoney({ amount: item.price, currency: order.currency })}
                </p>
                <p className="font-medium text-lg mt-1">
                  {formatStripeMoney({
                    amount: item.quantity * item.price,
                    currency: order.currency,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Shipping Address</h3>
            <div className="text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
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

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Contact Details</h3>
            <div className="text-gray-600 space-y-1">
              <p>{user?.phone}</p>
              <p>{customer?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Shipping Method</h3>
            <p className="text-gray-600">
              {order.shippingRate.displayName === 'Standard Shipping'
                ? `${order.shippingRate.displayName} (${formatStripeMoney({
                    amount: order.shippingRate.rate,
                    currency: order.currency,
                  })})`
                : 'Local Pickup'}
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
        <div className="space-y-3 sm:max-w-md sm:ml-auto">
          <div className="flex justify-between text-gray-600">
            <p>Subtotal</p>
            <p>{formatStripeMoney({ amount: order.total, currency: order.currency })}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Shipping</p>
            <p>
              {formatStripeMoney({ amount: order.shippingRate.rate, currency: order.currency })}
            </p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Taxes</p>
            <p>{formatStripeMoney({ amount: order.taxTotal, currency: order.currency })}</p>
          </div>
          <div className="flex justify-between font-medium text-lg pt-3 border-t">
            <p>Total</p>
            <p className="text-blue-600">
              {formatStripeMoney({ amount: order.total, currency: order.currency })}
            </p>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
        <div className="space-y-3">
          <Link
            href="/contact"
            className="block text-blue-600 hover:text-blue-800 transition-colors hover:underline"
          >
            Contact Support
          </Link>
          <Link
            href="/returns"
            className="block text-blue-600 hover:text-blue-800 transition-colors hover:underline"
          >
            Returns & Exchanges Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
