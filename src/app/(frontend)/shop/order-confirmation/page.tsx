import React from 'react'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@lib/utils/mergeOpenGraph'
import { notFound } from 'next/navigation'
import getPayload from '@lib/utils/getPayload'
// import { serverClient } from '@lib/trpc/serverClient'
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


export default async function OrderConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const { order_id } = await searchParams
  const orderId = Array.isArray(order_id)
    ? order_id[0]
    : order_id
  if (!orderId) {
    return notFound() // Handle case where orderId is undefined
  }
  
  const payload = await getPayload()

  const order = await payload.findByID({
    collection: 'orders',
    id: orderId,
  })

  return (
    <div className="p-4 m-6 flex-1">
      <h1 className="text-2xl">Thank You for your purchase!</h1>
      <pre className="whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-md overflow-x-auto mt-4">
        {JSON.stringify(order, null, 2)}
      </pre>
    </div>
  )
}
