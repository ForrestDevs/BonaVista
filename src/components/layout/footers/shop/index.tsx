import React from 'react'
import Link from 'next/link'
import { getCachedGlobal } from '@lib/utils/getGlobals'
import { CMSLink } from '@components/payload/Link'
import { ModeToggle } from '@components/ui/mode-toggle'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'

export async function ShopFooter() {
  const footer = await getCachedGlobal<'footer'>('footer')

  if (!footer) return null

  // const navItems = footer.shopFooter?.navItems || []

  return (
    <footer className="bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              BonaVista Leisurescapes is your premier destination for outdoor living solutions. We offer a wide range of
              high-quality products to enhance your leisure experience.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:underline">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:underline">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-2">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="flex flex-col sm:flex-row">
              <Input type="email" placeholder="Your email" className="mb-2 sm:mb-0 sm:mr-2" />
              <Button type="submit" className="w-full sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-muted text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BonaVista Leisurescapes. All rights reserved.</p>
          <div className="mt-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
