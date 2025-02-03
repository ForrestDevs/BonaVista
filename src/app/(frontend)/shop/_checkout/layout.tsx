import { CheckoutProvider } from '@/app/(frontend)/shop/_checkout/context'
import { getCart } from '@/lib/data/cart'
import { getCustomerDTO } from '@/lib/data/customer'
import Stripe from 'stripe'
import { CheckoutLayoutContent } from './layout.client'


export default async function CheckoutLayout({
  form,
  auth,
}: {
  form: React.ReactNode
  auth: React.ReactNode
}) {
  const cart = await getCart(2)
  const customer = await getCustomerDTO()

  const paymentIntent = cart.payment_intent as unknown as Stripe.PaymentIntent
  const clientSecret = paymentIntent.client_secret

  return (
    <CheckoutProvider clientSecret={clientSecret} currentLocale="en-CA" customer={customer}>
      <CheckoutLayoutContent auth={auth} customer={customer}>
        {form}
      </CheckoutLayoutContent>
    </CheckoutProvider>
  )
}
