import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cn } from '@/lib/utils/cn'
import { OptimizedLink as Link } from '@/components/payload/Link/optimized-link'
import { ChevronDown } from 'lucide-react'
import { Header } from '@payload-types'
import { CMSLink } from '@/components/payload/Link'

type MenuItem = {
  label: string
  href: string
  submenu?: {
    label: string
    href: string
    submenu?: {
      label: string
      href: string
    }[]
  }[]
}

type MenuConfig = {
  [key: string]: MenuItem
}

const menuConfig: MenuConfig = {
  products: {
    label: 'Products',
    href: '/products',
    submenu: [
      {
        label: 'Hot Tubs',
        href: '/hot-tubs',
        submenu: [
          {
            label: 'Shop All Hot Tubs',
            href: '/shop-hot-tubs',
          },
          {
            label: 'Hot Tub Features',
            href: '/hot-tub-features',
          },
          {
            label: 'Health Benefits',
            href: '/hot-tub-health-benefits',
          },
          {
            label: 'Hot Tub Covers',
            href: '/hot-tub-covers',
          },
        ],
      },
      {
        label: 'Swim Spas',
        href: '/swim-spas',
        submenu: [
          {
            label: 'Shop All Swim Spas',
            href: '/shop-swim-spas',
          },
          {
            label: 'Swim Spa Features',
            href: '/swim-spa-features',
          },
          {
            label: 'Swim Spa Covers',
            href: '/swim-spa-covers',
          },
        ],
      },
      {
        label: 'Outdoor Living',
        href: '/outdoor-living',
        submenu: [
          {
            label: 'Kitchens',
            href: '/outdoor-kitchens',
          },
          {
            label: 'Lighting',
            href: '/outdoor-lighting',
          },
          {
            label: 'Fire',
            href: '/outdoor-fire',
          },
        ],
      },
      {
        label: 'Water Care',
        href: '/water-care',
        submenu: [
          {
            label: 'Shop All Water Care',
            href: '/shop-water-care',
          },
          {
            label: 'Water Testing',
            href: '/water-testing',
          },
          {
            label: 'Online Assessment',
            href: '/water-assessment',
          },
        ],
      },
    ],
  },
  discover: {
    label: 'Discover',
    href: '/discover',
    submenu: [
      {
        label: 'Gallery',
        href: '/gallery',
      },
      {
        label: 'About Us',
        href: '/about',
      },
      {
        label: 'Blog',
        href: '/blog',
      },
      {
        label: 'Resources',
        href: '/resources',
      },
    ],
  },
  shop: {
    label: 'Shop',
    href: '/shop',
  },
  contact: {
    label: 'Contact',
    href: '/contact',
  },
}

export const DesktopNav: React.FC<{ className?: string; header: Header }> = ({
  className,
  header,
}) => {
  // console.log(header.siteHeader.navItems)
  return (
    // <div className="flex gap-4">
    //   {header.siteHeader.navItems.map((item) => (
    //     <div key={item.navItem.label}>
    //       <span>{item.navItem.label}</span>
    //       {item.navItem.submenu.map((subItem) => (
    //         <div key={subItem.label}>
    //           <span>{subItem.label}</span>
    //           {subItem.sublinks?.map((subSubItem) => (
    //             <div key={subSubItem.label}>
    //               <span>{subSubItem.label}</span>
    //             </div>
    //           ))}
    //         </div>
    //       ))}
    //     </div>
    //   ))}
    // </div>
    <NavigationMenuPrimitive.Root className={className}>
      <NavigationMenuPrimitive.List className="flex flex-1 list-none items-center justify-center space-x-5 lg:space-x-6">
        {header.siteHeader.navItems.map((item, index) => (
          <NavigationMenuPrimitive.Item key={index}>
            {item.navItem.submenu?.length > 0 ? (
              <>
                <Trigger>{item.navItem.label}</Trigger>
                <NavigationMenuPrimitive.Content className={submenusContentClass()}>
                  <NavigationMenuPrimitive.Sub className="w-full">
                    <NavigationMenuPrimitive.List className="flex flex-row gap-8 items-start justify-center h-fit">
                      {item.navItem.submenu.map((subItem) => (
                        <NavigationMenuPrimitive.Item key={subItem.label} className="relative">
                          <Trigger
                            showChevron={subItem.sublinks?.length > 0}
                            className="py-2 flex items-center gap-1 hover:underline font-medium"
                          >
                            <SingleLink link={subItem.link} title={subItem.label} variant="none" />
                          </Trigger>
                          {subItem.sublinks && (
                            <NavigationMenuPrimitive.Content className="absolute top-full left-0 mt-8 p-4 bg-white shadow-lg border border-gray-200 min-w-[200px]">
                              <ul className="flex flex-col gap-2">
                                {subItem.sublinks.map((subLink) => (
                                  <li key={subLink.label}>
                                    <SingleLink link={subLink} title={subLink.label} variant="sm" />
                                  </li>
                                ))}
                              </ul>
                            </NavigationMenuPrimitive.Content>
                          )}
                        </NavigationMenuPrimitive.Item>
                      ))}
                    </NavigationMenuPrimitive.List>
                  </NavigationMenuPrimitive.Sub>
                </NavigationMenuPrimitive.Content>
              </>
            ) : (
              <SingleLink link={item.navItem.link} title={item.navItem.label} />
            )}
          </NavigationMenuPrimitive.Item>
        ))}
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  )
}

const Trigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & { showChevron?: boolean }
>(({ className, children, showChevron = true, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={
      'relative group text-base lg:text-lg xl:text-xl hover:text-gray-700 transition-colors duration-200 flex items-center'
    }
    {...props}
  >
    {children}{' '}
    {showChevron && (
      <ChevronDown
        className="relative top-[1px] ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    )}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-data-[state=open]:w-full"></span>
  </NavigationMenuPrimitive.Trigger>
))
Trigger.displayName = NavigationMenuPrimitive.Trigger.displayName

interface SingleLinkProps {
  link: Header['siteHeader']['navItems'][number]['navItem']['link']
  title: string
  variant?: 'sm' | 'md' | 'lg' | 'none'
}

const SingleLink: React.FC<SingleLinkProps> = ({ link, title, variant = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm lg:text-base xl:text-lg',
    md: 'text-base lg:text-lg xl:text-xl',
    lg: 'text-lg lg:text-xl xl:text-2xl',
    none: '',
  }

  const styleClasses = cn(
    variant !== 'none'
      ? 'text-black hover:text-gray-700 transition-colors duration-200 relative group'
      : '',
    sizeClasses[variant],
  )

  return (
    <CMSLink {...link} label={title} className={styleClasses} isNavItem>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
    </CMSLink>
  )
}

const submenusContentClass = () =>
  cn(
    'fixed left-0 top-[83px] w-full bg-white shadow-lg border-b border-gray-200 pb-6 pt-4',
    'data-[motion=from-start]:animate-enterFromLeft',
    'data-[motion=from-end]:animate-enterFromRight',
    'data-[motion=to-start]:animate-exitToLeft',
    'data-[motion=to-end]:animate-exitToRight',
  )
