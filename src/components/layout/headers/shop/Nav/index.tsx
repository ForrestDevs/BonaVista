'use client'

import React from 'react'

import type { Header } from '@payload-types'

import { CMSLink } from '@components/payload/Link'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@components/ui/sheet'
import Link from 'next/link'
import { Button } from '@components/ui/button'
import { Menu } from 'lucide-react'

export const ShopHeaderNav: React.FC<{ header: Header }> = ({ header }) => {
  const navItems = header?.shopHeader?.navItems || []

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col space-y-4">
          <SheetClose asChild>
            <Link href="/" className="text-lg font-semibold">
              Home
            </Link>
          </SheetClose>
          {navItems.map(({ link }, i) => {
            return <CMSLink key={i} {...link} appearance="link" />
          })}
          <SheetClose asChild>
            <Link href="/about" className="text-lg font-semibold">
              About
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/contact" className="text-lg font-semibold">
              Contact
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

{
  /* {collections.map((collection) => (
            <div key={collection.id}>
              <SheetClose asChild>
                <Link href={`/collections/${collection.id}`} className="text-lg font-semibold">
                  {collection.name}
                </Link>
              </SheetClose>
              {collection.categories && (
                <div className="ml-4 mt-2 space-y-2">
                  {collection.categories.map((categoryId) => (
                    <SheetClose asChild key={categoryId}>
                      <Link
                        href={`/collections/${collection.id}/${categoryId}`}
                        className="block text-sm text-gray-600 hover:text-gray-900"
                      >
                        {categories[categoryId]}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              )}
            </div>
          ))} */
}
