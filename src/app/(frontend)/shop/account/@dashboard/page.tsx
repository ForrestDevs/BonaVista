import React, { Suspense } from 'react'
import { Metadata } from 'next'
import getPayload from '@lib/utils/getPayload'
import { ORDER_SLUG } from '@payload/collections/constants'
import { ChevronDown } from 'lucide-react'
import { YnsLink } from '@components/ui/link'
import { Container } from '@components/ui/container'
import { Button } from '@components/ui/button'
import type { User } from '@payload-types'
import { getCurrentUser } from '@lib/data/auth'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Overview of your account activity.',
}

export default async function Dashboard() {
  const payload = await getPayload()
  const user = await getCurrentUser()

  const { docs } = await payload.find({
    collection: ORDER_SLUG,
    where: {
      orderedBy: {
        equals: user,
      },
    },
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1
              className="text-2xl font-semibold text-foreground"
              data-testid="welcome-message"
              data-value={user?.firstName}
            >
              Hello, {user?.firstName}
            </h1>
            <p className="text-sm text-ui-fg-subtle dark:text-ui-fg-subtle">
              Signed in as:{' '}
              <span
                className="font-medium text-ui-fg-base dark:text-ui-fg-base"
                data-testid="customer-email"
                data-value={user?.email}
              >
                {user?.email}
              </span>
            </p>
          </div>

          <div className="border-t border-ui-border-base dark:border-ui-border-base pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div className="bg-ui-bg-base dark:bg-ui-bg-base p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-ui-fg-base dark:text-ui-fg-base">
                  Profile
                </h3>
                <div className="flex items-baseline gap-x-2">
                  <span
                    className="text-3xl font-bold text-ui-fg-base dark:text-ui-fg-base"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(user)}
                  >
                    {getProfileCompletion(user)}%
                  </span>
                  <span className="text-sm uppercase text-ui-fg-subtle dark:text-ui-fg-subtle">
                    Completed
                  </span>
                </div>
              </div>

              <div className="bg-ui-bg-base dark:bg-ui-bg-base p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-ui-fg-base dark:text-ui-fg-base">
                  Addresses
                </h3>
                <div className="flex items-baseline gap-x-2">
                  <span className="text-3xl font-bold text-ui-fg-base dark:text-ui-fg-base">0</span>
                  <span className="text-sm uppercase text-ui-fg-subtle dark:text-ui-fg-subtle">
                    Saved
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-ui-fg-base dark:text-ui-fg-base">
                Recent orders
              </h3>
              <ul className="space-y-4" data-testid="orders-wrapper">
                {docs && docs.length > 0 ? (
                  docs.slice(0, 5).map((order) => (
                    <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                      <YnsLink href={`/store/account/orders/details/${order.id}`}>
                        <Container className="bg-ui-bg-subtle hover:bg-ui-bg-subtle-hover dark:bg-ui-bg-subtle dark:hover:bg-ui-bg-subtle-hover transition-colors duration-200 rounded-lg shadow-sm">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm w-full sm:w-auto">
                              <div>
                                <p className="font-medium text-ui-fg-subtle dark:text-ui-fg-subtle">
                                  Date placed
                                </p>
                                <p
                                  className="text-ui-fg-base dark:text-ui-fg-base"
                                  data-testid="order-created-date"
                                >
                                  {new Date(order.createdAt).toDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-ui-fg-subtle dark:text-ui-fg-subtle">
                                  Order number
                                </p>
                                <p
                                  className="text-ui-fg-base dark:text-ui-fg-base"
                                  data-testid="order-id"
                                  data-value={order.id}
                                >
                                  #{order.id}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-ui-fg-subtle dark:text-ui-fg-subtle">
                                  Total amount
                                </p>
                                <p
                                  className="text-ui-fg-base dark:text-ui-fg-base"
                                  data-testid="order-amount"
                                >
                                  {order.total}
                                </p>
                              </div>
                            </div>
                            <Button
                              className="flex items-center justify-center w-full sm:w-auto"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">Go to order #{order.id}</span>
                              <span className="mr-2">View Order</span>
                              <ChevronDown className="-rotate-90" />
                            </Button>
                          </div>
                        </Container>
                      </YnsLink>
                    </li>
                  ))
                ) : (
                  <li
                    className="text-center py-8 text-ui-fg-subtle dark:text-ui-fg-subtle"
                    data-testid="no-orders-message"
                  >
                    No recent orders
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
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

  if (customer.firstName && customer.lastName) {
    count++
  }

  return Math.round((count / 2) * 100)
}
