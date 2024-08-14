import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMeUser } from '@/lib/utils/getMeUser'
import getPayload from '@/lib/utils/getPayload'
import { COLLECTION_SLUG_ORDERS } from '@/payload/collections/constants'
import Overview from '@/components/store/account/components/overview'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Overview of your account activity.',
}

export default async function OverviewTemplate() {
  const payload = await getPayload()

  const { user } = await getMeUser()

  const { docs } = await payload.find({
    collection: COLLECTION_SLUG_ORDERS,
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
