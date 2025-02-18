import React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDown } from 'lucide-react'
import { Header } from '@payload-types'
import { cn } from '@lib/utils/cn'
import { CMSLink } from '@/components/payload/Link'

const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root ref={ref} className={className} {...props}>
    {children}
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List ref={ref} className={className} {...props} />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const Trigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & { showChevron?: boolean }
>(({ className, children, showChevron = true, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative group text-base lg:text-lg xl:text-xl hover:text-gray-700 transition-colors duration-200 flex items-center',
      className,
    )}
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

const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content ref={ref} className={className} {...props} />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuSub = NavigationMenuPrimitive.Sub

interface SingleLinkProps {
  link: Header['site']['items'][number]['item']['link']
  title: string
  variant?: 'sm' | 'md' | 'lg' | 'none'
  isNavItem?: boolean
  className?: string
}

const SingleLink: React.FC<SingleLinkProps> = ({
  link,
  title,
  variant = 'md',
  isNavItem = false,
  className,
}) => {
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
    className,
  )

  if (isNavItem) {
    return <span className={styleClasses}>{title}</span>
  }

  return (
    <CMSLink {...link} label={title} className={styleClasses} isNavItem={true} appearance="link">
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

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuSub,
  Trigger,
  SingleLink,
  submenusContentClass,
}
