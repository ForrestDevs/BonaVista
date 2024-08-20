import React from 'react'
import TrpcProvider from './Trpc'
import ThemeProvider from '@/lib/providers/Theme'
import CartProvider from '@/lib/providers/Cart'
import LocaleProvider from '@/lib/providers/i18n'
import { Toaster } from 'sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import getPayload from '@/lib/utils/getPayload'
import { headers as getHeaders } from 'next/headers'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  const payload = await getPayload()
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) {
    console.log('No user signed in, using local storage for guest cart')
  }

  return (
    <LocaleProvider>
      <ThemeProvider>
        <TrpcProvider>
          <CartProvider user={user}>
            {children}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </CartProvider>
        </TrpcProvider>
      </ThemeProvider>
    </LocaleProvider>
  )
}
