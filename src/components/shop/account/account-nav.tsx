'use client'

import React, { useState } from 'react'
import { cn } from '@lib/utils/cn'
import { useParams, usePathname } from 'next/navigation'
import {
  User as UserIcon,
  MapPin,
  Package,
  ChevronDown,
  ArrowRightSquare,
  Menu,
  LayoutDashboard,
} from 'lucide-react'
import { YnsLink } from '@components/ui/link'
// import { useAuth } from '@lib/providers/Auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { logout } from '@lib/data/auth'
import { useRouter } from 'next/navigation'

export default function AccountNav() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { href: '/shop/account', label: 'Overview', icon: LayoutDashboard },
    { href: '/shop/account/profile', label: 'Profile', icon: UserIcon },
    { href: '/shop/account/addresses', label: 'Addresses', icon: MapPin },
    { href: '/shop/account/orders', label: 'Orders', icon: Package },
  ]

  const handleLogout = async () => {
    await logout()
    router.refresh()
  }

  return (
    <div className="w-full lg:w-48">
      {/* Mobile View */}
      <div className="lg:hidden w-full">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md">
            <span className="font-medium">Account Menu</span>
            <Menu size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-lg w-[87vw]">
            {navItems.map((item) => (
              <DropdownMenuItem
                key={item.href}
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <YnsLink href={item.href} className="flex items-center px-4 py-2 w-full gap-x-2">
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </YnsLink>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <form action={handleLogout}>
                <button type="submit" className="flex items-center w-full px-4 py-2 gap-x-2">
                  <ArrowRightSquare size={16} />
                  <span>Log out</span>
                </button>
              </form>

              {/* <YnsLink href="/logout" className="flex items-center w-full px-4 py-2 gap-x-2">
                <ArrowRightSquare size={16} />
                <span>Log out</span>
              </YnsLink> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="pb-4">
          <h3 className="text-lg font-semibold">Account</h3>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <AccountNavLink
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
              {item.label}
            </AccountNavLink>
          ))}
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
            >
              <ArrowRightSquare className="mr-3 h-6 w-6" aria-hidden="true" />
              Log out
            </button>
          </form>
        </nav>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

const AccountNavLink = ({ href, children, className }: AccountNavLinkProps) => {
  return (
    <YnsLink
      href={href}
      className={cn(className, 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}
    >
      {children}
    </YnsLink>
  )
}
