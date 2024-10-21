import React from 'react'
import { Logo } from '@components/payload/Logo'

export default function Typography() {
  return (
    <div className="container py-8 mt-16">
      <h1 className="text-4xl mb-6">Typography</h1>

      <section className="mb-12">
        <h2 className="text-2xl mb-4">Text Levels</h2>
        <h1 className="text-4xl mb-2">Heading 1</h1>
        <h2 className="text-3xl mb-2">Heading 2</h2>
        <h3 className="text-2xl mb-2">Heading 3</h3>
        <h4 className="text-xl mb-2">Heading 4</h4>
        <h5 className="text-lg mb-2">Heading 5</h5>
        <h6 className="text-base mb-2">Heading 6</h6>
        <p className="text-base mb-2">Paragraph text</p>
        <small className="text-sm">Small text</small>
      </section>

      <section>
        <h2 className="text-2xl mb-4">Hover Underline Effect</h2>
        <h1 className="text-4xl font-light mb-2 hover:underline transition-all duration-300 ease-in-out">
          Heading 1
        </h1>
        <h2 className="text-3xl mb-2 hover:underline transition-all duration-300 ease-in-out">
          Heading 2
        </h2>
        <h3 className="text-2xl mb-2 hover:underline transition-all duration-300 ease-in-out">
          Heading 3
        </h3>
        <h4 className="text-xl mb-2 hover:underline transition-all duration-300 ease-in-out">
          Heading 4
        </h4>
        <h5 className="text-lg mb-2 hover:underline transition-all duration-300 ease-in-out">
          Heading 5
        </h5>
        <h6 className="text-base mb-2 hover:underline transition-all duration-300 ease-in-out">
          Heading 6
        </h6>
        <p className="text-base mb-2 hover:underline transition-all duration-300 ease-in-out">
          Paragraph text
        </p>
        <small className="text-sm hover:underline transition-all duration-300 ease-in-out">
          Small text
        </small>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl mb-4">Responsive Navigation</h2>
        <nav className="bg-blue-100 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <div className="md:hidden">
              <button className="text-black focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <ul className="hidden md:flex space-x-10 lg:space-x-12">
              <li className="relative group">
                <a
                  href="#"
                  className="text-black text-base lg:text-lg xl:text-xl hover:text-gray-700 transition-colors duration-300 flex items-center"
                >
                  Home
                  <svg
                    className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li className="relative group">
                <a
                  href="#"
                  className="text-black text-base lg:text-lg xl:text-xl hover:text-gray-700 transition-colors duration-300 flex items-center"
                >
                  About
                  <svg
                    className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black text-base lg:text-lg xl:text-xl hover:text-gray-700 transition-colors duration-300 relative group"
                >
                  Services
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-base lg:text-lg xl:text-xl hover:bg-blue-600 transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </section>



      <section className="bg-white py-16">
        <div className="mx-auto px-4">
          <div className="flex flex-col lg:flex-row">
            {/* Blue side */}
            <div className="w-full lg:w-1/2 bg-blue-500 text-white p-8 lg:p-12 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Contact Us</h2>
              {/* <h3 className="text-xl lg:text-2xl mb-4">We'd love to hear from you</h3> */}
              {/* <p className="text-lg">
                Have questions or need assistance? Our team is here to help. Reach out to us using the form, and we'll get back to you as soon as possible.
              </p> */}
            </div>
            
            {/* White side with form */}
            <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12 rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none shadow-lg">
              <form>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                    <textarea
                      id="message"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>




    </div>
  )
}
