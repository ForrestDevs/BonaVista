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
        {header.site.items.map(({ item }, index) => (
          <NavigationMenuItem key={index}>
            {item.submenu?.length > 0 ? (
              <>
                <Trigger>{item.label}</Trigger>
                <NavigationMenuContent className={submenusContentClass()}>
                  <NavigationMenuSub className="w-full">
                    <NavigationMenuList className="flex flex-row gap-8 items-start justify-center h-fit">
                      {item.submenu.map((subItem) => (
                        <NavigationMenuItem key={subItem.id} className="relative">
                          <Trigger
                            showChevron={subItem.links?.length > 0}
                            className="py-2 flex items-center gap-1"
                          >
                            <SingleLink
                              link={subItem.link}
                              title={subItem.label}
                              variant="none"
                              isNavItem={!subItem.isLink}
                            />
                          </Trigger>
                          {subItem.links && subItem.links.length > 0 && (
                            <NavigationMenuContent className="absolute top-full left-0 mt-8 p-4 bg-white shadow-lg border border-gray-200 min-w-[200px]">
                              <ul className="flex flex-col gap-2">
                                {subItem.links.map((subLink) => (
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
              <SingleLink link={item.link} title={item.label} />
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
