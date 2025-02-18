// import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/payload/Logo'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { InstagramLogoIcon } from '@radix-ui/react-icons'
import Copyright from './copyright'
import { NewsletterForm } from './newsletter-form'

export function Footer() {
  return (
    <footer className="bg-white border-t border-foreground/10">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6 flex flex-col">
            <Link href="/" className="flex items-center space-x-3">
              <Logo />
            </Link>

            <p className="text-sm leading-relaxed">
              Bringing relaxation and luxury to Toronto and surrounding areas with our premium swim
              spas, hot tubs and outdoor living. Come visit our showroom!
            </p>

            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/bonavistaleisurescapes/"
                className="hover:text-accent-foreground"
              >
                <FaFacebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/bonavistaleisurescapes"
                className="hover:text-accent-foreground"
              >
                <InstagramLogoIcon className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.youtube.com/@bonavistaleisurescapes"
                className="hover:text-accent-foreground"
              >
                <FaYoutube className="h-6 w-6" />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Copyright and Policy Links */}
      <div className="container border-t border-foreground/10">
        <div className="mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <Copyright />
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
