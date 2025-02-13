import React from 'react'
import { ContactBlockProps } from './types'
import HoursTable from './hours'

export const ContactBlock: React.FC<
  ContactBlockProps & {
    id?: string
  }
> = (props) => {
  const { id } = props

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Contact Info</h2>
              <p className="text-lg text-muted-foreground">Visit our showroom in Toronto</p>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d16597.637402172124!2d-79.3602809!3d43.7119336!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4ccd862404cb7%3A0xbe869bedd32b1fa4!2sBonaVista%20LeisureScapes!5e1!3m2!1sen!2sca!4v1729451945220!5m2!1sen!2sca"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0 w-full h-full"
              ></iframe>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="min-w-[100px] font-semibold">Address:</div>
                <div>
                  105 Vanderhoof Ave. Unit 4,
                  <br />
                  Toronto, Ontario
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="min-w-[100px] font-semibold">Phone:</div>
                <a href="tel:+14166456980" className="text-primary hover:underline">
                  (416) 645-6980
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Hours of Operation</h2>
              <p className="text-lg text-muted-foreground">When you can visit us</p>
            </div>
            <div className="bg-card rounded-lg shadow-lg p-6">
              <HoursTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
