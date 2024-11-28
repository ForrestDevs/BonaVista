import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cn } from '@/lib/utils/cn'
import { OptimizedLink as Link } from '@/components/payload/Link/optimized-link'
import { ChevronDown } from 'lucide-react'

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

export const DesktopNav: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <NavigationMenuPrimitive.Root className={className}>
      <NavigationMenuPrimitive.List className="flex flex-1 list-none items-center justify-center space-x-5 lg:space-x-6">
        {Object.entries(menuConfig).map(([key, value]) => (
          <NavigationMenuPrimitive.Item key={key}>
            {value.submenu ? (
              <>
                <Trigger>{value.label}</Trigger>
                <NavigationMenuPrimitive.Content className={submenusContentClass()}>
                  <NavigationMenuPrimitive.Sub className="w-full">
                    <NavigationMenuPrimitive.List className="flex flex-row gap-8 items-start justify-center h-fit">
                      {value.submenu.map((item) => (
                        <NavigationMenuPrimitive.Item key={item.label} className="relative">
                          <Trigger
                            showChevron={item.submenu?.length > 0}
                            className="py-2 flex items-center gap-1 hover:underline font-medium"
                          >
                            <Link href={item.href} className="text-gray-800">
                              {item.label}
                            </Link>
                          </Trigger>
                          {item.submenu && (
                            <NavigationMenuPrimitive.Content className="absolute top-full left-0 mt-8 p-4 bg-white shadow-lg border border-gray-200 min-w-[200px]">
                              <ul className="flex flex-col gap-2">
                                {item.submenu.map((subItem) => (
                                  <li key={subItem.label}>
                                    <SingleLink
                                      href={subItem.href}
                                      title={subItem.label}
                                      variant="sm"
                                    />
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
              <SingleLink href={value.href} title={value.label} />
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

const SingleLink = React.forwardRef<
  React.ComponentRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { variant?: 'sm' | 'md' | 'lg' }
>(({ href, title, variant = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'text-sm lg:text-base xl:text-lg',
    md: 'text-base lg:text-lg xl:text-xl',
    lg: 'text-lg lg:text-xl xl:text-2xl',
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        'text-black hover:text-gray-700 transition-colors duration-200 relative group',
        sizeClasses[variant],
      )}
      {...props}
    >
      {title}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
    </Link>
  )
})
SingleLink.displayName = 'SingleLink'

const submenusContentClass = () =>
  cn(
    'fixed left-0 top-[83px] w-full bg-white shadow-lg border-b border-gray-200 pb-6 pt-4',
    'data-[motion=from-start]:animate-enterFromLeft',
    'data-[motion=from-end]:animate-enterFromRight',
    'data-[motion=to-start]:animate-exitToLeft',
    'data-[motion=to-end]:animate-exitToRight',
  )
