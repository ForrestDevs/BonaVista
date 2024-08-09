import React from 'react'
import { Nav } from '@/components/store/layout/nav/Nav'

export default async function StoreLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <div>
      <Nav />
      {children}
      {modal}
    </div>
  )
}
