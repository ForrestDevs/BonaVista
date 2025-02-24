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
  productId: string
  title: string
  sku: string
  description?: string
  price: number
  quantity: number
  thumbnailMediaId?: string
  isVariant?: boolean
  variant?: {
    id?: string
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
}

export interface CheckoutSession {
  id: string
  cartId: string
  paymentIntentId: string
  clientSecret: string
  amount: number
  currencyCode: string
  description?: string
  lineItems: CheckoutLineItem[]
  stripeCustomerId?: string
  customerEmail?: string
  customerId?: string
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
  cartId: string
  lineItems: CheckoutLineItem[]
  stripeCustomerId?: string
  customerEmail?: string
  customerId?: string
  redirectTo: string
  metadata?: Record<string, string>
}

export interface CreateStoredCheckoutParams extends Omit<BeginCheckoutParams, 'redirectTo'> {
  shippingTotal: number
  taxAmount: number
}

export interface UpdateCheckoutStepParams<T extends CheckoutStep> {
  cartId: string
  step: T
  data: Partial<CheckoutSession['steps'][T]>
}

export interface HandlePaymentSuccessParams {
  paymentIntentId: string
  clientSecret: string
}

export interface PaymentSuccessResult {
  success: boolean
  orderId?: string
  error?: string
}
