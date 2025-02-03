'use client'

import { useCheckout } from '@/app/(frontend)/shop/_checkout/context'
import { CustomerDTO } from '@/lib/data/customer'

export function CheckoutLayoutContent({
  children,
  auth,
  customer,
}: {
  children: React.ReactNode
  auth: React.ReactNode
  customer: CustomerDTO | null
}) {
  const { isGuestCheckout } = useCheckout()

  if (!customer && !isGuestCheckout) {
    return auth
  }

  return children
}
