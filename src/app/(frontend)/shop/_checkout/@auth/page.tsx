import AuthClient from './client'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0 

export default function CheckoutAuth() {
  return (
    <Suspense>
      <AuthClient />
    </Suspense>
  )
}
