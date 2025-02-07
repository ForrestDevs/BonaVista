import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import getPayload from '@/lib/utils/getPayload'
import { formatStripeMoney } from '@/lib/utils/formatMoney'

interface OrderPageProps {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function OrderPage({ params }: OrderPageProps) {
  const { slug } = await params
  const payload = await getPayload()

  const order = await payload.findByID({
    collection: 'orders',
    id: slug,
  })

  if (!order) {
    notFound()
  }

  return (
    <main className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="font-semibold mb-2">Order Status</h2>
                <p className="capitalize text-gray-700">{order.status}</p>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Items</h2>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{item.product.title}</p>
                        {item.variantOptions && (
                          <p className="text-sm text-gray-500">
                            {item.variantOptions.map((opt: any) => opt.option).join(', ')}
                          </p>
                        )}
                        <p className="text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        {formatStripeMoney({
                          amount: item.price,
                          currency: order.currency,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
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
