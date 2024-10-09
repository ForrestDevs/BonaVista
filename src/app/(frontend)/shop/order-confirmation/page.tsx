import React from 'react'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@/lib/utils/merge-open-graph'
import { notFound } from 'next/navigation'
import { serverClient } from '@/lib/trpc/serverClient'
// import OrderCompletedTemplate from '@/components/shop/order/templates/order-completed-template'

type Props = {
  params: { id: string }
}

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Your order has been confirmed.',
  openGraph: mergeOpenGraph({
    title: 'Order Confirmation',
    url: '/order-confirmation',
  }),
}

async function getOrder(id: string) {
  const order = await serverClient.order.getOrderById({ id })

  if (!order) {
    return notFound()
  }

  return order
}

export default async function OrderConfirmedPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const orderId = Array.isArray(searchParams?.order_id)
    ? searchParams.order_id[0]
    : searchParams?.order_id
  if (!orderId) {
    return notFound() // Handle case where orderId is undefined
  }
  const order = await getOrder(orderId)

  return (
    <div className="p-4 m-6 flex-1">
      <h1 className="text-2xl">Thank You for your purchase!</h1>
      <pre className="whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-md overflow-x-auto mt-4">
        {JSON.stringify(order, null, 2)}
      </pre>
    </div>
  )
}
