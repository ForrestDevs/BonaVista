'use client'

import React from 'react'
import type { Testimonial } from '@payload-types'
import RichText from '@components/payload/RichText'

import { ContactBlockProps } from './types'
import ContactForm from './form'
import HoursTable from './hours'

export const ContactBlock: React.FC<
  ContactBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id } = props

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
          <div className="mb-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d16597.637402172124!2d-79.3602809!3d43.7119336!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4ccd862404cb7%3A0xbe869bedd32b1fa4!2sBonaVista%20LeisureScapes!5e1!3m2!1sen!2sca!4v1729451945220!5m2!1sen!2sca"
              // width="600"
              // height="430"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0 w-full h-[430px]"
            ></iframe>
          </div>
          <p className="mb-2">
            <strong>Address:</strong> 105 Vanderhoof Ave. Unit 4, Toronto, Ontario
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> (416) 616 6189
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mt-6 mb-2">Hours of Operation</h3>
          <HoursTable />
        </div>
      </div>
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Thank you for your interest in BonaVista LeisureScapes!
        </h2>
        <p>
          For questions about our services or to make an inquiry, contact us by phone or fill out
          the form and we&apos;ll be in touch.
        </p>
      </div>
      <ContactForm />
    </div>
  )
}
