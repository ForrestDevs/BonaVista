import React from 'react'
import Addresses from './addresses'
import Shipping from './shipping'
import Payment from './payment'
import Review from './review'
import { getCustomer } from '@lib/data/customer'
import { getCart } from '@lib/data/cart'
import { getAvailablePaymentMethods, getAvailableShippingMethods } from '@lib/data/shop'

export async function CheckoutForm() {
  const cart = await getCart()
  const customer = await getCustomer()
  const availablePaymentMethods = await getAvailablePaymentMethods()
  const availableShippingMethods = await getAvailableShippingMethods()

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-8">
        <div>
          <Addresses cart={cart} customer={customer} />
        </div>

        <div>
          <Shipping cart={cart} availableShippingMethods={availableShippingMethods} />
        </div>

        <div>
          <Payment cart={cart} availablePaymentMethods={availablePaymentMethods} />
        </div>

        <div>
          <Review cart={cart} />
        </div>
      </div>
    </div>
  )
}
