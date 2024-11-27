import React from 'react'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import MobileNav from './mobile-nav'
import DesktopNav from './desktop-nav'
import { Logo } from '@/components/payload/Logo'
import Link from 'next/link'
import { Submenus } from './submenu'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'
import logo from '@/public/logo-dark.png'

export default async function MarketingHeader() {
  const header = await getCachedGlobal<'header'>('header')

  if (!header) return null

  return (
    <header className="block z-50 w-full min-h-[84.5px] bg-white">
      <div className="fixed bg-white w-full border-b min-h-[84.5px] border-gray-200 flex items-center">
        <div className="container grid grid-cols-2 lg:grid-cols-3 items-center justify-center">
          <div className="col-span-1 flex items-center justify-start">
            <Link href="/" className="relative">
              <Image
                src={logo}
                alt="BonaVista Logo"
                width={200}
                height={160}
                className="object-contain aspect-auto"
                priority
              />
            </Link>
          </div>
          <div className="col-span-1 items-center justify-center h-full hidden lg:flex">
            <Submenus />
          </div>
          <div className="col-span-1 flex items-center justify-end h-full">
            <MobileNav header={header} />
          </div>
        </div>
      </div>
    </header>
  )
}
