import React from 'react'
import { getMeUser } from '@/lib/utils/getMeUser'
import AccountLayout from '@/components/shop/account/layout/account-layout'
import getPayload from '@/lib/utils/getPayload'
import { headers as getHeaders } from 'next/headers'
import type { User } from '@payload-types'

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const payload = await getPayload()
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  return <AccountLayout customer={user as User}>{user ? dashboard : login}</AccountLayout>
}
