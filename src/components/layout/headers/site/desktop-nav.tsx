'use client'

import React from 'react'
import { Header } from '@payload-types'
import Image from 'next/image'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Logo } from '@/components/payload/Logo'

export default function DesktopNav({ header }: { header: Header }) {
  return (
    <div className="hidden md:block">
      <div className="float-left py-1">
        <Logo />
      </div>

      <NavigationMenu className="float-right">
        <NavigationMenuList className="py-4">
          {header.siteHeader.navItems?.map((item, index) => (
            <NavigationMenuItem key={index}>
              {item.navItem?.type === 'single' ? (
                <Link href={item.navItem.singleLink?.url || ''} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.navItem.singleLink?.label}
                  </NavigationMenuLink>
                </Link>
              ) : (
                <>
                  <NavigationMenuTrigger>{item.navItem?.linkGroup?.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.navItem?.linkGroup?.links?.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={link.url || ''}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{link.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {link.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
