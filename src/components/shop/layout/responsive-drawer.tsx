'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, type ReactNode } from 'react'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { DialogTitle } from '@/components/ui/dialog'

export function ResponsiveDrawer({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const timerId = useRef<NodeJS.Timeout | null>(null)

  const resetDrawer = (e: boolean) => {
    if (!e) {
      if (timerId.current) {
        clearTimeout(timerId.current)
      }
      timerId.current = setTimeout(() => {
        router.back()
      }, 100)
    }
  }

  return (
    <Drawer
      open={open}
      direction={isDesktop ? 'right' : 'bottom'}
      onOpenChange={resetDrawer}
      shouldScaleBackground={true}
    >
      <DialogTitle className="sr-only">Cart Overlay</DialogTitle>
      <DrawerContent
        aria-describedby="cart-overlay-description"
        onPointerDownOutside={() => {
          setOpen(false)
        }}
        onEscapeKeyDown={() => {
          setOpen(false)
        }}
      >
        {children}
      </DrawerContent>
    </Drawer>
  )
}
