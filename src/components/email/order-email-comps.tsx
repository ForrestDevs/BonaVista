import React from 'react'
import { Section, Row, Column, Text, Hr } from '@react-email/components'
import type { Order } from '@/payload-types'
import { formatMoney, formatStripeMoney } from '@/lib/utils/formatMoney'

export function OrderLineItems({ order }: { order: Order }) {
  return (
    <>
      {order.lineItems?.map((item, index) => {
        const lineItem = typeof item === 'object' ? item.lineItem : null
        if (!lineItem) return null

        // Get product name from either product field or directly from lineItem
        const productName =
          typeof lineItem.product === 'object' ? lineItem.product.title : 'Product'

        const quantity = lineItem.quantity || 1
        const price = lineItem.price || 0

        return (
          <Row key={index} style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 0' }}>
            <Column>
              <Text style={{ fontSize: '14px', color: '#111827', margin: '0' }}>
                {productName}{' '}
                {lineItem.isVariant && lineItem.variantOptions
                  ? ` (${lineItem.variantOptions})`
                  : ''}
              </Text>
            </Column>
            <Column style={{ textAlign: 'right' }}>
              <Text style={{ fontSize: '14px', color: '#111827', margin: '0' }}>
                {quantity} &times;{' '}
                {formatMoney({ amount: price, currency: 'CAD', locale: 'en-US' })}
              </Text>
            </Column>
          </Row>
        )
      })}
    </>
  )
}

export function OrderTotals({ order }: { order: Order }) {
  return (
    <Section style={{ marginTop: '16px' }}>
      <Row>
        <Column style={{ width: '75%', textAlign: 'right' }}>
          <Text style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>Subtotal:</Text>
          <Text style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>Shipping:</Text>
          <Text style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>Tax:</Text>
          <Hr style={{ borderColor: '#e6ebf1', margin: '8px 0' }} />
          <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0' }}>
            Total:
          </Text>
        </Column>
        <Column style={{ width: '25%', textAlign: 'right' }}>
          <Text style={{ fontSize: '14px', color: '#111827', margin: '4px 0' }}>
            {formatStripeMoney({ amount: order.subtotal, currency: 'CAD', locale: 'en-US' })}
          </Text>
          <Text style={{ fontSize: '14px', color: '#111827', margin: '4px 0' }}>
            {formatStripeMoney({ amount: order.shippingTotal, currency: 'CAD', locale: 'en-US' })}
          </Text>
          <Text style={{ fontSize: '14px', color: '#111827', margin: '4px 0' }}>
            {formatStripeMoney({ amount: order.taxTotal, currency: 'CAD', locale: 'en-US' })}
          </Text>
          <Hr style={{ borderColor: '#e6ebf1', margin: '8px 0' }} />
          <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0' }}>
            {formatStripeMoney({ amount: order.total, currency: 'CAD', locale: 'en-US' })}
          </Text>
        </Column>
      </Row>
    </Section>
  )
}
