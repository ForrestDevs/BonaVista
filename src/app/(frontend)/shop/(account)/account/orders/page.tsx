import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Order } from '@payload-types'
import { OptimizedLink } from '@/components/payload/Link/optimized-link'
import { formatStripeMoney } from '@/lib/utils/formatMoney'
import { getCurrentUserOrders } from '@/lib/data/order'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Orders | BonaVista LeisureScapes',
    description: 'Overview of your previous orders.',
  }
}

export default async function Orders() {
  const orders = await getCurrentUserOrders()

  if (!orders) {
    notFound()
  }

  // If no orders, show empty state
  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 py-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Your Orders
            </h1>
            <p className="mt-2 text-gray-600">View and manage your order history</p>
          </div>
          <OptimizedLink
            href="/shop"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Continue Shopping →
          </OptimizedLink>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">When you place an order, it will appear here.</p>
          <OptimizedLink
            href="/shop"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </OptimizedLink>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Your Orders
          </h1>
          <p className="mt-2 text-gray-600">View and manage your order history</p>
        </div>
        <OptimizedLink
          href="/shop"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Continue Shopping →
        </OptimizedLink>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Order placed</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <p className="text-sm text-gray-500">Order number</p>
                  <p className="font-medium text-blue-600">#{order.orderNumber}</p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <p className="text-sm text-gray-500">Total amount</p>
                  <p className="font-medium">
                    {formatStripeMoney({ amount: order.total, currency: order.currency })}
                  </p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${order.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {order.status || 'Processing'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-6 overflow-x-auto pb-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {order.lineItems?.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex-shrink-0 group relative">
                      <div className="relative h-28 w-28 rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-gray-300">
                        {/* Product thumbnail */}
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <span className="text-xs">{item.lineItem.sku}</span>
                        </div>
                      </div>
                      {index === 3 && order.lineItems.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center rounded-xl transition-opacity group-hover:bg-black/60">
                          <span className="text-white font-semibold text-lg">
                            +{order.lineItems.length - 4} more
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <OptimizedLink
                  href={`/shop/orders?id=${order.id}&auth=${generateOrderAuthHash(order.id.toString(), order.orderNumber)}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  View Order Details →
                </OptimizedLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Generate a secure hash for the order authentication
function generateOrderAuthHash(orderId: string, orderNumber: string): string {
  const crypto = require('crypto');
  return crypto
    .createHash('sha256')
    .update(`${orderId}-${orderNumber}-${process.env.NEXTAUTH_SECRET || 'order-secret'}`)
    .digest('hex')
}
