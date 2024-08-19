import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMeUser } from '@/lib/utils/getMeUser'
import getPayload from '@/lib/utils/getPayload'
import { ORDER_SLUG } from '@/payload/collections/constants'
import Overview from '@/components/shop/account/components/overview'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Overview of your account activity.',
}

export default async function Dashboard() {
  const payload = await getPayload()

  const { user } = await getMeUser()

  const { docs } = await payload.find({
    collection: ORDER_SLUG,
    where: {
      orderedBy: {
        equals: user,
      },
    },
  })

  if (!user) {
    ;<>NO USER</>
  }

  return <Overview customer={user} orders={docs} />
}
