import React from 'react'
import ThemeProvider from '@/lib/providers/Theme'
import { Toaster } from 'sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { CartProvider } from './Cart'
import { AuthProvider } from './Auth'
import { NuqsProvider } from './Nuqs'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NuqsProvider>
          {/* <CartProvider> */}
          {children}
          <Toaster />
          {/* </CartProvider> */}
        </NuqsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
