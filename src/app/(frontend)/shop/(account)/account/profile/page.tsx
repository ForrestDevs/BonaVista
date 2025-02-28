import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@lib/data/auth'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Profile | BonaVista LeisureScapes',
    description: 'View and edit your Store profile.',
  }
}
export default async function Profile() {
  const user = await getCurrentUser()

  if (!user) {
    notFound()
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Profile</h1>
        <p className="text-base-regular">
          View and update your profile information, including your name, email, and phone number.
          You can also update your billing address, or change your password.
        </p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">{/* <ProfileForm user={user} /> */}</div>
    </div>
  )
}
