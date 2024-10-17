import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/payload/Logo'

export function Footer() {
  return (
    <footer className="bg-white text-foreground">
      <div className="container mx-auto px-6 py-12 lg:py-16 lg:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Message */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <Logo />
            </Link>
            <p className="text-sm leading-relaxed">
              Bringing relaxation and luxury to Toronto and surrounding areas with our premium hot
              tubs and swim spas. We offer service, installation and a wide variety of pool and hot
              tub equipment, supplies, accessories and much more. Our mission is to provide high
              quality products and service at competitive prices. Come visit our showroom!
            </p>
          </div>

          {/* Store Location and Hours */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Visit Us</h3>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
              <p className="text-sm">123 Leaside Ave, Toronto, ON M4G 1X1</p>
            </div>
            <div className="text-sm space-y-1">
              <p>Monday - Friday: 10am - 7pm</p>
              <p>Saturday: 10am - 6pm</p>
              <p>Sunday: 11am - 5pm</p>
            </div>
            <div className="relative h-40 w-full rounded-md overflow-hidden">
              <Image
                src="/placeholder.svg?height=128&width=256"
                alt="Map of Leaside Hot Tubs location"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-accent-foreground">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-accent-foreground">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-accent-foreground">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
            <div className="space-y-3">
              <Link
                href="mailto:info@leasidehottubs.com"
                className="flex items-center space-x-2 hover:text-accent-foreground"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">info@leasidehottubs.com</span>
              </Link>
              <Link
                href="tel:+14165551234"
                className="flex items-center space-x-2 hover:text-accent-foreground"
              >
                <Phone className="h-5 w-5" />
                <span className="text-sm">(416) 555-1234</span>
              </Link>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm">Subscribe to our newsletter for exclusive offers and updates.</p>
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground text-primary flex-grow"
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright and Policy Links */}
      <div className="container border-t border-foreground/10 mt-12">
        <div className="mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} BonaVista Leisurescapes. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
