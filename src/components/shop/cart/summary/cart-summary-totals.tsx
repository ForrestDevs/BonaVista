'use client'

import { CartItem } from '@/lib/types/cart'
import { formatCurrency } from '@/lib/utils/formatMoney'
import { motion } from 'framer-motion'

interface CartSummaryTotalsProps {
  items: CartItem[]
}

export function CartSummaryTotals({ items }: CartSummaryTotalsProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingCost = 25.0 // This should come from your shipping configuration
  const taxRate = 0.13 // This should come from your tax configuration
  const taxCost = (subtotal + shippingCost) * taxRate
  const total = subtotal + shippingCost + taxCost

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg bg-neutral-50 px-6 py-6 border border-neutral-200"
    >
      <div className="flow-root">
        <div className="-my-4 divide-y divide-neutral-200 text-sm">
          <div className="flex items-center justify-between py-4">
            <div className="text-neutral-600">Subtotal</div>
            <div className="font-medium text-neutral-900">
              {formatCurrency({ amount: subtotal, currency: 'CAD' })}
            </div>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="text-neutral-600">Shipping</div>
            <div className="font-medium text-neutral-900">
              {formatCurrency({ amount: shippingCost, currency: 'CAD' })}
            </div>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="text-neutral-600">Tax ({(taxRate * 100).toFixed(0)}%)</div>
            <div className="font-medium text-neutral-900">
              {formatCurrency({ amount: taxCost, currency: 'CAD' })}
            </div>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="text-base font-medium text-neutral-900">Order total</div>
            <div className="text-base font-medium text-neutral-900">
              {formatCurrency({ amount: total, currency: 'CAD' })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 