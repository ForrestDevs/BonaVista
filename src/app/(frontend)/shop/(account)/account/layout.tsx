import React from 'react'
import { getMeUser } from '@/lib/utils/getMeUser'
import AccountLayout from '@/components/store/account/layout/account-layout'

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const { user } = await getMeUser()

  return <AccountLayout customer={user}>{user ? dashboard : login}</AccountLayout>
}
