export interface CheckoutSession {
  amount: number
  currencyCode: string
  description?: string
  cartId: string
  paymentIntentId: string
  clientSecret: string
  stripeCustomerId?: string
  lineItems: {
    price: string
    quantity: number
  }[]
  customerEmail?: string
  customerId?: string
  shippingMethod?: string
  shippingTotal?: number
  taxAmount?: number
  metadata?: Record<string, string>
}

export type CreateStoredCheckoutSessionParams = Omit<
  CheckoutSession,
  'paymentIntentId' | 'clientSecret'
>

export type BeginCheckoutParams = Omit<
  CreateStoredCheckoutSessionParams,
  'paymentIntentId' | 'clientSecret'
> & {
  redirectTo: string
}
