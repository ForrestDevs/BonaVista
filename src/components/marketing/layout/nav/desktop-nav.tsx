import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { Header } from '@payload-types'
import React from 'react'
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

export default async function DesktopNav() {
  const header: Header = await getCachedGlobal('header')()

  return (
    <div className="mr-4 hidden gap-2 md:flex">
      <Image src="/logo.webp" alt="Logo" width={100} height={100} />
      <NavigationMenu>
        <NavigationMenuList>
          {header.navItems?.map((item, index) => (
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
