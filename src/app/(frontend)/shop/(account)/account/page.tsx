import React, { Suspense } from 'react'
import { Metadata } from 'next'
import getPayload from '@lib/utils/getPayload'
import { ORDER_SLUG } from '@payload/collections/constants'
import { ChevronDown } from 'lucide-react'
import { YnsLink } from '@components/ui/link'
import { Container } from '@components/ui/container'
import { Button } from '@components/ui/button'
import { CustomerDTO, getCustomerDTO } from '@/lib/data/customer'
import { formatStripeMoney } from '@/lib/utils/formatMoney'
import { redirect } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Account | BonaVista LeisureScapes',
    description: 'Overview of your account activity.',
  }
}

export default async function Dashboard() {
  const payload = await getPayload()
  const customer = await getCustomerDTO()

  if (!customer) {
    redirect('/shop/auth/login')
  }

  const { docs } = await payload.find({
    collection: ORDER_SLUG,
    where: {
      orderedBy: {
        equals: customer?.id,
      },
    },
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl font-semibold text-foreground">Hello, {customer?.firstName}</h1>
            <p className="text-sm text-ui-fg-subtle dark:text-ui-fg-subtle">
              Signed in as:{' '}
              <span className="font-medium text-ui-fg-base dark:text-ui-fg-base">
                {customer?.email}
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
                  <span className="text-3xl font-bold text-ui-fg-base dark:text-ui-fg-base">
                    {/* {getProfileCompletion(customer)}% */}
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
              <ul className="space-y-4">
                {docs && docs.length > 0 ? (
                  docs.slice(0, 5).map((order) => (
                    <li key={order.id}>
                      <YnsLink href={`/shop/account/orders/details/${order.id}`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start rounded-lg bg-slate-100/60 sm:items-center p-6 gap-6 hover:shadow-md transition-shadow duration-200">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-sm w-full sm:w-auto">
                            <div className="space-y-1.5">
                              <p className="text-muted-foreground font-medium">Date placed</p>
                              <p className="font-semibold text-primary">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-muted-foreground font-medium">Order number</p>
                              <p className="font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md inline-block">
                                #{order.id}
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-muted-foreground font-medium">Total amount</p>
                              <p className="font-bold text-foreground">
                                {formatStripeMoney({
                                  amount: order.total,
                                  currency: order.currency,
                                })}
                              </p>
                            </div>
                          </div>
                          <Button className="flex items-center justify-center w-full sm:w-auto">
                            <span className="sr-only">Go to order #{order.id}</span>
                            <span className="mr-2">View Order</span>
                            <ChevronDown className="-rotate-90" />
                          </Button>
                        </div>
                      </YnsLink>
                    </li>
                  ))
                ) : (
                  <li className="text-center py-8 text-ui-fg-subtle dark:text-ui-fg-subtle">
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

// const getProfileCompletion = (customer: CustomerDTO | null) => {
//   let count = 0

//   if (!customer) {
//     return 0
//   }

//   if (customer.email) {
//     count++
//   }

//   if (customer.firstName && customer.lastName) {
//     count++
//   }

//   return Math.round((count / 2) * 100)
// }
