import React from 'react'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@/lib/utils/merge-open-graph'
import { notFound } from 'next/navigation'
import { serverClient } from '@/lib/trpc/serverClient'

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

export default async function OrderConfirmedPage({ params }: Props) {
  const order = await getOrder(params.id)

  return <OrderCompletedTemplate order={order} />
}
