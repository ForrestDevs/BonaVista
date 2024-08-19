'use client'

import type { User } from '@payload-types'
import { cn } from '@/lib/utils/cn'
import { useParams, usePathname } from 'next/navigation'
import { User as UserIcon, MapPin, Package, ChevronDown, ArrowRightSquare } from 'lucide-react'
import { YnsLink } from '@/components/ui/link'
import { signOut } from '../actions'

const AccountNav = ({ customer }: { customer: Omit<User, 'password_hash'> | null }) => {
  const route = usePathname()

  return (
    <div>
      <div className="small:hidden">
        {route !== `/shop/account` ? (
          <YnsLink href="/shop/account" className="flex items-center gap-x-2 font-medium py-2">
            <>
              <ChevronDown className="transform rotate-90" />
              <span>Account</span>
            </>
          </YnsLink>
        ) : (
          <>
            <div className="text-xl-semi mb-4 px-8">Hello {customer?.name}</div>
            <div className="text-base-regular">
              <ul>
                <li>
                  <YnsLink
                    href="/shop/account/profile"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <UserIcon size={20} />
                        <span>Profile</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </YnsLink>
                </li>
                <li>
                  <YnsLink
                    href="/shop/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin size={20} />
                        <span>Addresses</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </YnsLink>
                </li>
                <li>
                  <YnsLink
                    href="/shop/account/orders"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>Orders</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </YnsLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                    onClick={() => signOut()}
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightSquare />
                      <span>Log out</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="">
        <div>
          <div className="pb-4">
            <h3 className="text-base-semi">Account</h3>
          </div>
          <div className="text-base-regular">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
              <li>
                <AccountNavLink href="/shop/account" route={route!}>
                  Overview
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink href="/shop/account/profile" route={route!}>
                  Profile
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink href="/shop/account/addresses" route={route!}>
                  Addresses
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink href="/shop/account/orders" route={route!}>
                  Orders
                </AccountNavLink>
              </li>
              <li className="text-gray-700">
                <button type="button" onClick={() => signOut()}>
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  'data-testid'?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  'data-testid': dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <YnsLink
      href={href}
      className={cn('text-ui-fg-subtle hover:text-ui-fg-base', {
        'text-ui-fg-base font-semibold': active,
      })}
      data-testid={dataTestId}
    >
      {children}
    </YnsLink>
  )
}

export default AccountNav
