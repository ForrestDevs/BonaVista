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
  NavigationMenuViewport,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
  CustomNavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { CMSLink } from '@/components/payload/Link'
import { navItems } from '@/lib/config/site'
import { cn } from '@/lib/utils/cn'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDown } from 'lucide-react'

export default function DesktopNav({ header }: { header: Header }) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="space-x-5 lg:space-x-6">
        <NavigationMenuItem>
          <CustomNavigationMenuTrigger>Products</CustomNavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/hot-tubs"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Hot Tubs</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Relax and unwind in our premium hot tubs
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/swim-spas"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Swim Spas</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Exercise and relax in our versatile swim spas
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/outdoor-living"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Outdoor Living</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Enhance your outdoor space with our living products
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/water-care"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Water Care</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Maintain crystal clear water with our care products
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <CustomNavigationMenuTrigger>Discover</CustomNavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/gallery"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">Gallery</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Our best work in luxury backyard escapes.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/about" title="About Us">
                Our team, our story.
              </ListItem>
              <ListItem href="/blog" title="Blog">
                Read about owning luxury.
              </ListItem>
              <ListItem href="/resources" title="Resources">
                Find more information.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <SingleLink href="/shop" title="Shop" />
        </NavigationMenuItem>

        <NavigationMenuItem>
          <SingleLink href="/contact" title="Contact" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function GroupLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="text-black text-base lg:text-lg xl:text-xl hover:text-gray-700 transition-colors duration-300 relative group"
    >
      {title}
    </Link>
  )
}

function SingleLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="text-black text-base lg:text-lg xl:text-xl hover:text-gray-700 transition-colors duration-200 relative group"
    >
      {title}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
    </Link>
  )
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            href={href}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  },
)

ListItem.displayName = 'ListItem'

// {navItems.map((item, index) => (
//   <NavigationMenuItem key={index}>
//     {item.navItem?.type === 'single' ? (
//       <Link href={item.navItem.singleLink?.url || ''} legacyBehavior passHref>
//         <NavigationMenuLink className={navigationMenuTriggerStyle()}>
//           {item.navItem.singleLink?.title}
//         </NavigationMenuLink>
//       </Link>
//     ) : (
//       <>
//         <NavigationMenuTrigger>{item.navItem?.linkGroup?.title}</NavigationMenuTrigger>
//         <NavigationMenuContent>
//           <ul className="grid gap-3 p-4 md:grid-cols-2">
//             {item.navItem?.linkGroup?.links?.map((link, linkIndex) => (
//               <li key={linkIndex}>
//                 <NavigationMenuLink asChild>
//                   {/* <CMSLink {...link}  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
//                       <div className="text-sm font-medium leading-none">{link.title}</div>
//                       <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//                         {link.description}
//                       </p>
//                     </CMSLink> */}
//                   <Link
//                     href={link.url || ''}
//                     className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
//                   >
//                     <div className="text-sm font-medium leading-none">{link.title}</div>
//                     <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//                       {link.description}
//                     </p>
//                   </Link>
//                 </NavigationMenuLink>
//               </li>
//             ))}
//           </ul>
//         </NavigationMenuContent>
//       </>
//     )}
//   </NavigationMenuItem>
// ))}
