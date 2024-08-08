import React from 'react'
import { getMeUser } from '@/lib/utils/getMeUser'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@/lib/utils/merge-open-graph'
import Account from '@/components/Account/profile-form'

export default async function AccountPage() {
  const { user, token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/account')}`,
  })

  return (
    <div className="container">
      <h1>Account</h1>
      <p>
        Welcome back, {user?.email}. You are logged in with the token: {token}.
      </p>
      <Account user={user} />
    </div>
  )
}

export const metaData: Metadata = {
  title: 'Account',
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
}
