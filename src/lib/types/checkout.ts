import { ShippingOption } from '@payload-types'

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
  variantId?: number
  title: string
  sku: string
  description?: string
  price: number
  quantity: number
  thumbnailMediaId?: number
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
  id: number
  cartId: number
  paymentIntentId: string
  clientSecret: string
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
  shippingTotal: number
  taxAmount: number
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
  orderId?: number
  error?: string
}
