import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@/lib/utils/merge-open-graph'
import { OrderConfirmation } from './order-confirmation'
import { Container } from '@/components/ui/craft'

export default async function OrderConfirmationPage() {
  return (
    <Container>
      <Suspense fallback={<div>Loading...</div>}>
        <OrderConfirmation />
      </Suspense>
    </Container>
  )
}

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Your order has been confirmed.',
  openGraph: mergeOpenGraph({
    title: 'Order Confirmation',
    url: '/order-confirmation',
  }),
}
