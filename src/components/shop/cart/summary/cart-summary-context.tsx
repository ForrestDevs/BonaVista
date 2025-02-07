'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

interface CartContextType {
  isUpdating: boolean
  setIsUpdating: (isUpdating: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartSummaryProviderProps {
  children: ReactNode
}

export function CartSummaryProvider({ children }: CartSummaryProviderProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  return (
    <CartContext.Provider value={{ setIsUpdating, isUpdating }}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
