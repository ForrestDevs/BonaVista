import type { User, Order } from '@payload-types'

// import { formatAmount } from '@/lib/utils'
// import ChevronDown from '@modules/common/icons/chevron-down'
// import LocalizedClientLink from '@modules/common/components/localized-client-link'

import { ChevronDown } from 'lucide-react'
import { YnsLink } from '@/components/ui/link'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { PaginatedDocs } from 'payload'

type OverviewProps = {
  customer: Omit<User, 'password_hash'> | null
  orders: Order[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div className="w-full">
      <div className="">
        <div className="text-xl-semi flex justify-between items-center mb-4 bg-red-500">
          <span className="text-gray-500" data-testid="welcome-message" data-value={customer?.name}>
            Hello {customer?.name}
          </span>
          <span className="text-sm text-gray-500">
            Signed in as:{' '}
            <span
              className="font-semibold"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>

        <div className="flex flex-col py-8 border-t border-gray-200">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="flex items-start gap-x-16 mb-6">
              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">Profile</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">Completed</span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">Addresses</h3>
                <div className="flex items-end gap-x-2">
                  {/* <span
                    className="text-3xl-semi leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.shipping_addresses?.length || 0}
                  >
                    {customer?.shipping_addresses?.length || 0}
                  </span> */}
                  <span className="uppercase text-base-regular text-ui-fg-subtle">Saved</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-large-semi">Recent orders</h3>
              </div>
              <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                        <YnsLink href={`/store/account/orders/details/${order.id}`}>
                          <Container className="bg-gray-50 flex justify-between items-center p-4">
                            <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
                              <span className="font-semibold">Date placed</span>
                              <span className="font-semibold">Order number</span>
                              <span className="font-semibold">Total amount</span>
                              <span data-testid="order-created-date">
                                {new Date(order.createdAt).toDateString()}
                              </span>
                              <span data-testid="order-id" data-value={order.id}>
                                #{order.id}
                              </span>
                              <span data-testid="order-amount">
                                {order.total}
                                {/* {formatAmount({
                                  amount: order.total,
                                  region: order.region,
                                  includeTaxes: false,
                                })} */}
                              </span>
                            </div>
                            <Button
                              className="flex items-center justify-between"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">Go to order #{order.id}</span>
                              <ChevronDown className="-rotate-90" />
                            </Button>
                          </Container>
                        </YnsLink>
                      </li>
                    )
                  })
                ) : (
                  <span data-testid="no-orders-message">No recent orders</span>
                )}
              </ul>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: Omit<User, 'password_hash'> | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.name && customer.name) {
    count++
  }

  //   if (customer.phone) {
  //     count++
  //   }

  //   if (customer.billing_address) {
  //     count++
  //   }

  return (count / 4) * 100
}

export default Overview
