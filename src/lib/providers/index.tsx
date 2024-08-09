import React from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { CartProvider } from './Cart'
import { getMessages } from 'next-intl/server'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <HeaderThemeProvider>
          <CartProvider>{children}</CartProvider>
        </HeaderThemeProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
