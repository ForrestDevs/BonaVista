import React from 'react'
import { getCustomerDTO } from '@/lib/data/customer'
import { redirect } from 'next/navigation'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const customer = await getCustomerDTO()

  if (customer) {
    redirect('/shop/account')
  }

  return (
    <div className="bg-background flex flex-col justify-center h-full">
      <div className="container max-w-lg mx-auto px-4 py-8 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">{children}</div>
      </div>
    </div>
  )
}
