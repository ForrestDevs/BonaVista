'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu as MenuIcon } from 'lucide-react'
import { Header } from '@payload-types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@lib/utils/cn'
import { CMSLink } from '@/components/payload/Link'

export default function MobileNav({ header }: { header: Header }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" style={{ zIndex: 10 }}>
          <MenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="bg-blue-100">
        <nav className="flex flex-col gap-4 py-6">
          {header.siteHeader.navItems.map((item, index) => (
            <div key={index}>
              {item.navItem.isLink ? (
                <CMSLink
                  {...item.navItem.link}
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'lg',
                    }),
                    'w-full justify-start font-medium',
                  )}
                  isNavItem
                >
                  {item.navItem.label}
                </CMSLink>
              ) : (
                <Accordion type="single" collapsible>
                  <AccordionItem value={item.navItem.label} className="border-none">
                    <AccordionTrigger className="py-2 px-4 hover:bg-blue-50 rounded-lg font-medium">
                      {item.navItem.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="flex flex-col space-y-1 pl-4">
                        {item.navItem.submenu?.map((subItem, subIndex) => (
                          <div key={subIndex}>
                            <div className="flex flex-col">
                              <div className="flex flex-col">
                                <div className="flex flex-col">
                                  <div className="flex items-center justify-between py-2 px-4 hover:bg-blue-50 rounded-lg font-medium">
                                    {subItem.isLink ? (
                                      <CMSLink
                                        {...subItem.link}
                                        className={cn(
                                          buttonVariants({
                                            variant: 'ghost',
                                            size: 'sm',
                                          }),
                                          'w-full justify-start font-medium'
                                        )}
                                        isNavItem
                                      >
                                        {subItem.label}
                                      </CMSLink>
                                    ) : (
                                      <span>{subItem.label}</span>
                                    )}
                                    {subItem.sublinks && (
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          const content = e.currentTarget.parentElement?.nextElementSibling;
                                          if (content) {
                                            content.classList.toggle('hidden');
                                          }
                                        }}
                                        className="p-1"
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                  {subItem.sublinks && (
                                    <div className="hidden pl-4 flex-col space-y-1">
                                      {subItem.sublinks.map((sublink, sublinkIndex) => (
                                        <CMSLink
                                          key={sublinkIndex}
                                          {...sublink}
                                          className={cn(
                                            buttonVariants({
                                              variant: 'ghost',
                                              size: 'sm',
                                            }),
                                            'w-full justify-start'
                                          )}
                                          isNavItem
                                        >
                                          {sublink.label}
                                        </CMSLink>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>

    // <Drawer open={open} onOpenChange={setOpen} direction="bottom" shouldScaleBackground={true}>
    //   <div className="float-left md:hidden block py-1">
    //     <Logo />
    //   </div>
    //   <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
    //   <DrawerTrigger asChild>
    //     <Button
    //       variant="ghost"
    //       size="icon"
    //       className="md:hidden float-right py-9"
    //       style={{ zIndex: 10 }}
    //     >
    //       <MenuIcon />
    //     </Button>
    //   </DrawerTrigger>

    //   <DrawerContent aria-describedby="navigation-menu-description">
    //     {header.siteHeader.navItems?.length ? (
    //       <nav className="flex flex-col gap-6">
    //         {header.siteHeader.navItems?.map((item, index) => {
    //           if (item.navItem?.type === 'group') {
    //             const linkGroup = item.navItem.linkGroup
    //             return (
    //               <Accordion type="single" collapsible key={index}>
    //                 <AccordionItem value={linkGroup.title} className="border-b-0">
    //                   <AccordionTrigger
    //                     className={cn(
    //                       buttonVariants({
    //                         size: 'sm',
    //                         variant: 'ghost',
    //                       }),
    //                       'justify-between',
    //                     )}
    //                   >
    //                     <div className="flex items-center justify-start">{linkGroup.title}</div>
    //                   </AccordionTrigger>
    //                   <AccordionContent>
    //                     <div className="ml-7 flex flex-col space-y-1">
    //                       {linkGroup.links.map((link, index) => (
    //                         <Link
    //                           key={index}
    //                           href={link.url || '/'}
    //                           className={cn(
    //                             buttonVariants({
    //                               size: 'sm',
    //                               variant: 'ghost',
    //                             }),
    //                             'justify-start',
    //                           )}
    //                         >
    //                           {link.title}
    //                         </Link>
    //                       ))}
    //                     </div>
    //                   </AccordionContent>
    //                 </AccordionItem>
    //               </Accordion>
    //             )
    //           } else if (item.navItem?.type === 'single') {
    //             const singleLink = item.navItem.singleLink
    //             return (
    //               <Link
    //                 key={index}
    //                 href={singleLink.url}
    //                 className={cn(
    //                   buttonVariants({
    //                     size: 'sm',
    //                     variant: 'ghost',
    //                   }),
    //                   'justify-start',
    //                 )}
    //               >
    //                 {singleLink.label}
    //               </Link>
    //             )
    //           }
    //         })}
    //       </nav>
    //     ) : null}
    //     <DrawerFooter className="pt-2">
    //       <DrawerClose asChild>
    //         <Button variant="outline">Cancel</Button>
    //       </DrawerClose>
    //     </DrawerFooter>
    //   </DrawerContent>
    // </Drawer>
  )
}
