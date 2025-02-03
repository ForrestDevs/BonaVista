import * as React from 'react'
import { Header } from '@payload-types'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuSub,
  Trigger,
  SingleLink,
  submenusContentClass,
} from '@/components/custom/nav'

export const DesktopNav: React.FC<{ className?: string; header: Header }> = ({
  className,
  header,
}) => {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="flex flex-1 list-none items-center justify-center space-x-5 lg:space-x-6">
        {header.siteHeader.navItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.navItem.submenu?.length > 0 ? (
              <>
                <Trigger>{item.navItem.label}</Trigger>
                <NavigationMenuContent className={submenusContentClass()}>
                  <NavigationMenuSub className="w-full">
                    <NavigationMenuList className="flex flex-row gap-8 items-start justify-center h-fit">
                      {item.navItem.submenu.map((subItem) => (
                        <NavigationMenuItem key={subItem.label} className="relative">
                          <Trigger
                            showChevron={subItem.sublinks?.length > 0}
                            className="py-2 flex items-center gap-1 hover:underline font-medium"
                          >
                            <SingleLink link={subItem.link} title={subItem.label} variant="none" />
                          </Trigger>
                          {subItem.sublinks && subItem.sublinks.length > 0 && (
                            <NavigationMenuContent className="absolute top-full left-0 mt-8 p-4 bg-white shadow-lg border border-gray-200 min-w-[200px]">
                              <ul className="flex flex-col gap-2">
                                {subItem.sublinks.map((subLink) => (
                                  <li key={subLink.label}>
                                    <SingleLink link={subLink} title={subLink.label} variant="sm" />
                                  </li>
                                ))}
                              </ul>
                            </NavigationMenuContent>
                          )}
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenuSub>
                </NavigationMenuContent>
              </>
            ) : (
              <SingleLink link={item.navItem.link} title={item.navItem.label} />
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}