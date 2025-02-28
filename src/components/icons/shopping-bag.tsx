import React from 'react'
import { cn } from '@/lib/utils/cn'

export function ShoppingBagIcon({ className = '', ...props }: { className?: string }) {
  return (
    <svg
      className={cn(className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  )
}
