import React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@lib/utils/cn'
import Link from 'next/link'

const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    // delayDuration={100}
    // skipDelayDuration={100}
    ref={ref}
    className={className}
    {...props}
  >
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
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {
    showChevron?: boolean
    chevronDirection?: 'down' | 'right'
    isLeaf?: boolean
  }
>(
  (
    {
      className,
      children,
      showChevron = true,
      chevronDirection = 'down',
      isLeaf = false,
      ...props
    },
    ref,
  ) => (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      className={cn(
        'relative group text-base hover:text-gray-700',
        'transition-colors duration-300 ease-[cubic-bezier(0.4,0.0,0.2,1.0)]',
        'flex items-center',
        isLeaf && 'hover:underline',
        className,
      )}
      {...props}
    >
      {children}
      {showChevron &&
        !isLeaf &&
        (chevronDirection === 'down' ? (
          <ChevronDown
            className="relative top-[1px] ml-1 h-4 w-4 transition-transform duration-600 ease-[cubic-bezier(0.4,0.0,0.2,1.0)] group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        ) : (
          <ChevronRight
            className="ml-1 h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-600 ease-[cubic-bezier(0.4,0.0,0.2,1.0)]"
            aria-hidden="true"
          />
        ))}
    </NavigationMenuPrimitive.Trigger>
  ),
)
Trigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'absolute left-1/2 top-[55px] -translate-x-1/2',
      'data-[state=open]:animate-nav-enter data-[state=closed]:animate-nav-exit',
      dropdownAnimationClass(),
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuSub = NavigationMenuPrimitive.Sub

interface SingleLinkProps {
  href: string
  title: string
  variant?: 'sm' | 'md' | 'lg' | 'none'
  className?: string
  description?: string
  icon?: React.ReactNode
}

const SingleLink: React.FC<SingleLinkProps> = ({
  href,
  title,
  variant = 'md',
  className,
  description,
  icon,
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    none: '',
  }

  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2',
        'text-black hover:text-gray-700',
        'transition-colors duration-200',
        sizeClasses[variant],
        className,
      )}
    >
      {icon && (
        <span className="transition-transform duration-200 group-hover:scale-110">{icon}</span>
      )}
      <div>
        <div>{title}</div>
        {description && (
          <p className="text-sm text-gray-500 group-hover:text-gray-700">{description}</p>
        )}
      </div>
    </Link>
  )
}

const dropdownAnimationClass = () =>
  cn('w-max', 'bg-white rounded-sm', 'border border-gray-200', 'shadow-xs', 'z-50')

const mainDropdownClass = () =>
  cn(
    'transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
    'data-[panel-state=l1-only]:w-[265px]',
    'data-[panel-state=l2]:w-[530px]',
    'data-[panel-state=l3]:w-[780px]',
  )

const collectionsDropdownClass = () => cn('p-4', 'min-w-[200px]', 'w-max')

const categoryPanelClass = () =>
  cn(
    'bg-white rounded-sm',
    'min-w-[250px] h-full',
    'border-r border-gray-100 last:border-r-0',
    'transition-all duration-200',
    'relative',
  )

const subDropdownClass = () =>
  cn(
    'absolute left-full top-0 ml-1',
    'bg-white rounded-lg shadow-lg border border-gray-200',
    'min-w-[320px] py-2',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
    'z-50',
  )

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuSub,
  Trigger,
  SingleLink,
  mainDropdownClass,
  collectionsDropdownClass,
  categoryPanelClass,
  subDropdownClass,
}
