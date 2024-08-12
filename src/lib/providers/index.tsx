import React from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { HeaderThemeProvider } from './HeaderTheme'
import { CartProvider } from './Cart'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from '@/lib/providers/theme-digital'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}




