'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu as MenuIcon } from 'lucide-react'
import { Header } from '@payload-types'
import { Logo } from '@/components/payload/Logo'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@lib/utils/cn'
import { DialogTitle } from '@/components/ui/dialog'

export default function MobileNav({ header }: { header: Header }) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="bottom" shouldScaleBackground={true}>
      <div className="float-left md:hidden block py-1">
        <Logo />
      </div>
      <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden float-right py-9"
          style={{ zIndex: 10 }}
        >
          <MenuIcon />
        </Button>
      </DrawerTrigger>

      <DrawerContent aria-describedby="navigation-menu-description">
        {header.siteHeader.navItems?.length ? (
          <nav className="flex flex-col gap-6">
            {header.siteHeader.navItems?.map((item, index) => {
              if (item.navItem?.type === 'group') {
                const linkGroup = item.navItem.linkGroup
                return (
                  <Accordion type="single" collapsible key={index}>
                    <AccordionItem value={linkGroup.title} className="border-b-0">
                      <AccordionTrigger
                        className={cn(
                          buttonVariants({
                            size: 'sm',
                            variant: 'ghost',
                          }),
                          'justify-between',
                        )}
                      >
                        <div className="flex items-center justify-start">{linkGroup.title}</div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-7 flex flex-col space-y-1">
                          {linkGroup.links.map((link, index) => (
                            <Link
                              key={index}
                              href={link.url || '/'}
                              className={cn(
                                buttonVariants({
                                  size: 'sm',
                                  variant: 'ghost',
                                }),
                                'justify-start',
                              )}
                            >
                              {link.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )
              } else if (item.navItem?.type === 'single') {
                const singleLink = item.navItem.singleLink
                return (
                  <Link
                    key={index}
                    href={singleLink.url}
                    className={cn(
                      buttonVariants({
                        size: 'sm',
                        variant: 'ghost',
                      }),
                      'justify-start',
                    )}
                  >
                    {singleLink.label}
                  </Link>
                )
              }
            })}
          </nav>
        ) : null}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
// <Sheet open={open} onOpenChange={setOpen}>
//       {/* This button will trigger open the mobile sheet menu */}

//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden" style={{ zIndex: 10 }}>
//           <MenuIcon />
//         </Button>
//       </SheetTrigger>

//       <SheetContent side="left">
//         <div className="flex flex-col items-start">
//           hello
//           {/* {mobileItems.map((item, index) => (
//             <Button
//               key={index}
//               variant="link"
//               onClick={() => {
//                 setOpen(false)
//               }}
//             >
//               {item}
//             </Button>
//           ))} */}
//         </div>
//       </SheetContent>
//     </Sheet>
