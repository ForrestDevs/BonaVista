import { Order, ShippingOption } from '@payload-types'

export type CheckoutStep = 'email' | 'shipping' | 'billing' | 'payment'

export interface StripeAddress {
  name: string
  firstName?: string
  lastName?: string
  address: {
    line1: string
    line2: string | null
    city: string
    state: string
    postal_code: string
    country: string
  }
  phone?: string
}

export interface CheckoutLineItem {
  productId: number
  title: string
  sku: string
  description?: string
  price: number
  quantity: number
  thumbnailMediaId?: number
  url?: string
  isVariant?: boolean
  variantOptions?: {
    key: {
      slug: string
      label: string
    }
    value: {
      slug: string
      label: string
    }
  }[]
}

export interface CheckoutSession {
  id: string
  cartId: number
  paymentIntentId: string
  clientSecret: string
  /**
   * Subtotal in cents - sum of (line item price × quantity) for all items
   */
  subtotal: number
  /**
   * Shipping total in cents - from the selected shipping option
   * Will be 0 if free shipping is available
   */
  shippingTotal: number
  /**
   * Tax amount in cents - calculated by Stripe based on subtotal and shipping
   */
  taxAmount: number
  /**
   * Total amount in cents - subtotal + shippingTotal + taxAmount
   */
  amount: number
  currencyCode: string
  description?: string
  lineItems: CheckoutLineItem[]
  stripeCustomerId?: string
  customerEmail?: string
  customerId?: number
  steps: {
    email: {
      completed: boolean
      value?: string
    }
    shipping: {
      completed: boolean
      address?: StripeAddress
      method?: ShippingOption
    }
    billing: {
      completed: boolean
      sameAsShipping: boolean
      address?: StripeAddress
    }
    payment: {
      completed: boolean
      method?: string
    }
  }
  taxCalculationId?: string
  taxTransactionId?: string
  lastUpdated: number
  expiresAt: number
  status: 'pending' | 'completed' | 'failed'
  orderId?: string
}

export interface BeginCheckoutParams {
  amount: number
  currencyCode: string
  description?: string
  cartId: number
  lineItems: CheckoutLineItem[]
  stripeCustomerId?: string
  customerEmail?: string
  customerId?: number
  redirectTo: string
  metadata?: Record<string, string>
}

export interface UpdateCheckoutSessionParams {
  cartId: number
  amount?: number
  shippingTotal?: number
  taxAmount?: number
  lineItems?: CheckoutLineItem[]
  stripeCustomerId?: string
  customerEmail?: string
  customerId?: number
  redirectTo?: string
  metadata?: Record<string, string>
}

export interface CreateStoredCheckoutParams extends Omit<BeginCheckoutParams, 'redirectTo'> {
  shippingTotal: number
  taxAmount: number
}

export interface UpdateCheckoutStepParams<T extends CheckoutStep> {
  cartId: number
  step: T
  data: Partial<CheckoutSession['steps'][T]>
}

export interface HandlePaymentSuccessParams {
  paymentIntentId: string
  clientSecret: string
}

export interface PaymentSuccessResult {
  success: boolean
  order?: Order | number
  error?: string
}
