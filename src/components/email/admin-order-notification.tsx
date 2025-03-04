import React from 'react'
import { Heading, Text, Section, Button } from '@react-email/components'
import type { Order, Customer } from '@/payload-types'
import { BaseEmailLayout } from './base-email-layout'
import { OrderLineItems, OrderTotals } from './order-email-comps'
import { formatMoney, formatStripeMoney } from '@/lib/utils/formatMoney'

interface AdminOrderNotificationEmailProps {
  order: Order
  customer: Customer
}

export function AdminOrderNotificationEmail({ order, customer }: AdminOrderNotificationEmailProps) {
  const isPickup = order.deliveryType === 'pickup'
  return (
    <BaseEmailLayout previewText={`New Order #${order.orderNumber} Received`}>
      <Heading
        style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}
      >
        New Order Received
      </Heading>

      <Text style={{ fontSize: '16px', color: '#374151', margin: '0 0 24px 0' }}>
        A new order has been placed on the website.
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
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 8px 0' }}>
          Date: {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 8px 0' }}>
          Type: {isPickup ? 'Pickup' : 'Delivery'}
        </Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0' }}>
          Total: {formatStripeMoney({ amount: order.total || 0, currency: 'CAD', locale: 'en-US' })}
        </Text>
      </Section>

      <Heading
        as="h2"
        style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '24px 0 16px 0' }}
      >
        Customer Information
      </Heading>

      <Section
        style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
          Name: {customer.firstName} {customer.lastName}
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
          Email: {customer.email}
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0' }}>
          Phone: {customer.phone}
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

      {!isPickup && (
        <>
          <Heading
            as="h2"
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '24px 0 16px 0',
            }}
          >
            Shipping Address
          </Heading>

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
        </>
      )}

      <Section style={{ marginTop: '24px' }}>
        <Button
          href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/orders/${order.id}`}
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
          View Order in Admin
        </Button>
      </Section>
    </BaseEmailLayout>
  )
}
