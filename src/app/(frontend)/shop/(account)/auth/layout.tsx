import React from 'react'
import { getCustomerDTO } from '@/lib/data/customer'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { toast } from 'sonner'
import { TestTubes, TrendingDown } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const customer = await getCustomerDTO()

  if (customer) {
    redirect('/shop/account')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Hero section */}
      <div className="md:w-1/2 text-white relative hidden md:flex md:flex-col">
        <div className="absolute inset-0 opacity-90">
          <Image
            src="/api/media/file/crichton-010.webp"
            alt="BonaVista LeisureScapes"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* <div className="absolute inset-0 z-3 bg-linear-to-br from-blue-700 to-blue-900 opacity-70" /> */}

        {/* Content container with container-like padding */}
        <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 ">
          <div className="max-w-md mx-auto bg-gray-900/40 backdrop-blur-lg border border-blue-400/70 rounded-lg p-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-4">Transform Your Outdoor Space</h1>
            <p className="text-lg opacity-90 mb-6">
              Join the BonaVista LeisureScapes community to access exclusive offers, track orders,
              and create your perfect outdoor oasis.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center">
                  <TestTubes className="text-white" />
                </div>
                <span>Free water testing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center">
                  <TrendingDown className="text-white" />
                </div>
                <span>Exclusive member discounts</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
                <span>Order history & tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Forms - Right Side */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  )
}
