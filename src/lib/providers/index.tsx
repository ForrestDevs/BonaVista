import React from 'react'
import TrpcProvider from './Trpc'
import ThemeProvider from '@/lib/providers/Theme'
import CartProvider from '@/lib/providers/Cart'
import LocaleProvider from '@/lib/providers/i18n'
import { Toaster } from 'sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <TrpcProvider>
          <CartProvider>
            {children}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </CartProvider>
        </TrpcProvider>
      </ThemeProvider>
    </LocaleProvider>
  )
}
