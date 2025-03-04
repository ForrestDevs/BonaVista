import React from 'react'
import { Heading, Text, Section, Button } from '@react-email/components'
import type { Order, Customer } from '@/payload-types'
import { BaseEmailLayout } from './base-email-layout'
import { OrderLineItems, OrderTotals } from './order-email-comps'

interface OrderConfirmationEmailProps {
  order: Order
  customer: Customer
  authToken: string
}

export function OrderConfirmationEmail({
  order,
  customer,
  authToken,
}: OrderConfirmationEmailProps) {
  const isPickup = order.deliveryType === 'pickup'

  const orderDetailsURL = customer.has_account
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/account/orders/details/${order.id}`
    : `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/orders?id=${order.id}&auth=${authToken}`

  return (
    <BaseEmailLayout previewText={`Your order #${order.id} has been received`}>
      <Heading
        style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}
      >
        Order Confirmation
      </Heading>

      <Text style={{ fontSize: '16px', color: '#374151', margin: '0 0 24px 0' }}>
        Hi {customer.firstName || 'there'},
      </Text>

      <Text style={{ fontSize: '16px', color: '#374151', margin: '0 0 16px 0' }}>
        Thank you for your order! We&apos;ve received your order and it&apos;s being processed.
      </Text>

      <Section
        style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <Text
          style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}
        >
          Order #: {order.id}
        </Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0' }}>
          Date: {new Date(order.createdAt).toLocaleDateString()}
        </Text>
      </Section>

      <Heading
        as="h2"
        style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '24px 0 16px 0' }}
      >
        Order Summary
      </Heading>

      <OrderLineItems order={order} />
      <OrderTotals order={order} />

      <Heading
        as="h2"
        style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '24px 0 16px 0' }}
      >
        {isPickup ? 'Pickup Information' : 'Shipping Information'}
      </Heading>

      {isPickup ? (
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px 0' }}>
          Your order will be available for pickup at our store. We&apos;ll send you another email
          when it&apos;s ready.
        </Text>
      ) : (
        <Section style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
            {order.shippingDetails.shipTo.first_name} {order.shippingDetails.shipTo.last_name}
          </Text>
          <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
            {order.shippingDetails.shipTo.line_1}
          </Text>
          {order.shippingDetails.shipTo.line_2 && (
            <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
              {order.shippingDetails.shipTo.line_2}
            </Text>
          )}
          <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
            {order.shippingDetails.shipTo.city}, {order.shippingDetails.shipTo.state}{' '}
            {order.shippingDetails.shipTo.postal_code}
          </Text>
          <Text style={{ fontSize: '14px', color: '#374151', margin: '0' }}>
            {order.shippingDetails.shipTo.country}
          </Text>
        </Section>
      )}

      <Section style={{ marginTop: '24px' }}>
        <Button
          href={`${process.env.NEXT_PUBLIC_SERVER_URL}/shop/account/orders`}
          style={{
            backgroundColor: '#2563eb',
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold',
            textDecoration: 'none',
            textAlign: 'center',
            display: 'block',
            padding: '12px 24px',
          }}
        >
          View Order Details
        </Button>
      </Section>
    </BaseEmailLayout>
  )
}
