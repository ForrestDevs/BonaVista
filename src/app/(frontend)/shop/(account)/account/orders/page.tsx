import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCurrentUserOrders } from '@/components/shop/account/actions'
import { Order } from '@payload-types'
import { CartItemThumbnail } from '@/components/shop/cart/cart-item-details'
import { OptimizedLink } from '@/components/payload/Link/optimized-link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Orders</h1>
        <p className="text-base-regular">
          View your previous orders and their status. You can also create returns or exchanges for
          your orders if needed.
        </p>
      </div>
      <div>
        {/* {orders.docs.map((order) => {
          return <div key={order.id}>{order.id}</div>
        })} */}
        <OrderOverview orders={orders} />
      </div>
    </div>
  )
}

function OrderOverview({ orders }: { orders: Order[] }) {
  return (
    <div className="flex flex-col divide-y divide-gray-200">
      {orders.map((order, index) => (
        <div key={order.id} className={`py-6 ${index === orders.length - 1 ? 'border-b-0' : ''}`}>
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-1">
                <span className="text-lg font-medium">#{order.id}</span>
                <span className="text-sm text-gray-600">
                  {/* {new Date(order.createdAt).toLocaleDateString()} */}
                </span>
              </div>
              <div className="flex items-center gap-x-4">
                <span className="text-lg">${order.total?.toFixed(2)}</span>
                <span className="text-sm text-gray-600">{order.items?.length} items</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {order.items?.slice(0, 3).map((item) => (
                <div key={item.id} className="aspect-square relative">
                  <CartItemThumbnail item={item} />
                  {/* {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover rounded-lg"
                    />
                  )} */}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <OptimizedLink
                href={`/shop/account/orders/details/${order.id}`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                See details
              </OptimizedLink>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
