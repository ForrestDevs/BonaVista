import type { Order } from '@payload-types'
import type { Metadata } from 'next'

// import { ItemsList } from '@components/shop/order/items-list'
import { Button } from '@components/ui/button'
import { formatDateTime } from '@lib/utils/formatDateTime'
import { getMeUser } from '@lib/utils/getMeUser'
import { mergeOpenGraph } from '@lib/utils/mergeOpenGraph'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'

export default async function Order({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ paymentId?: string }>
}) {
  const { id } = await params
  const { paymentId } = await searchParams
  const { token } = await getMeUser()

  let order: Order | null = null

  try {
    order = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}?where=[stripePaymentIntentID][equals]=${paymentId}&depth=2`,
      {
        headers: {
          ...(token
            ? {
                Authorization: `JWT ${token}`,
              }
            : {}),
          'Content-Type': 'application/json',
        },
      },
    )?.then(async (res) => {
      if (!res.ok) notFound()
      const json = await res.json()
      if ('error' in json && json.error) notFound()
      if ('errors' in json && json.errors) notFound()
      return json
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!order) {
    notFound()
  }

  return (
    <div className="container my-16">
      {token && (
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href="/orders">See all orders</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/account">Go to account</Link>
          </Button>
        </div>
      )}
      <hr className="my-8" />
      <div className="prose dark:prose-invert">
        <h1>
          <span className="">{`Order #${order.id}`}</span>
        </h1>
      </div>
      <div className="">
        <p>
          <time dateTime={order.createdAt}>{formatDateTime(order.createdAt)}</time>
        </p>
        <p className="">
          {'Total: '}
          {new Intl.NumberFormat('en-US', {
            currency: 'usd',
            style: 'currency',
          }).format(order.total / 100)}
        </p>
      </div>
      <hr />
      <div className="">
        <h4 className="">Items</h4>
        {/* <ItemsList items={order.items} /> */}
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
    title: `Order ${id}`,
  }
}
