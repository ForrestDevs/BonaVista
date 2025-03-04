import React from 'react'
import { Heading, Text, Section, Button } from '@react-email/components'
import type { Order, Customer } from '@/payload-types'
import { BaseEmailLayout } from './base-email-layout'
import { OrderLineItems, OrderTotals } from './order-email-comps'

interface PickupReadyEmailProps {
  order: Order
  customer: Customer
}

export function PickupReadyEmail({ order, customer }: PickupReadyEmailProps) {
  const orderDetailsURL = customer.has_account
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/account/orders/details/${order.id}`
    : `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/orders?id=${order.id}`

  return (
    <BaseEmailLayout previewText={`Your order #${order.orderNumber} is ready for pickup`}>
      <Heading
        style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}
      >
        Your Order is Ready for Pickup
      </Heading>

      <Text style={{ fontSize: '16px', color: '#374151', margin: '0 0 24px 0' }}>
        Hi {customer.firstName || 'there'},
      </Text>

      <Text style={{ fontSize: '16px', color: '#374151', margin: '0 0 16px 0' }}>
        Great news! Your order is now ready for pickup at our store. You can pick it up during our regular business hours.
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
          Order #: {order.orderNumber}
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
        Pickup Information
      </Heading>

      <Section style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 8px 0' }}>
          Store Address:
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
          BonaVista Leisurescapes
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
          812 Arrow Rd, North York
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 16px 0' }}>
          Toronto, ON M9M 2M1
        </Text>
        
        <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 8px 0' }}>
          Store Hours:
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
          Monday - Friday: 9:00 AM - 6:00 PM
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
          Saturday: 9:00 AM - 5:00 PM
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0' }}>
          Sunday: 11:00 AM - 4:00 PM
        </Text>
      </Section>

      <Text style={{ fontSize: '16px', color: '#374151', margin: '24px 0 16px 0' }}>
        Please bring a valid ID when you come to pick up your order. If someone else will be picking up the order on your behalf, please let us know in advance.
      </Text>

      <Section style={{ marginTop: '24px' }}>
        <Button
          href={orderDetailsURL}
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
