'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 bg-blue-700/70 backdrop-blur-sm ${isScrolled ? 'bg-white text-charcoal shadow-md' : 'text-white'}`}
    >
      <div className="container mx-auto px-8 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-light">
          LUXE OUTDOOR
        </Link>
        <nav>
          <ul className="flex space-x-8 text-sm uppercase tracking-wider">
            <li>
              <Link href="#experience" className="hover:text-copper transition">
                Experience
              </Link>
            </li>
            <li>
              <Link href="#products" className="hover:text-copper transition">
                Products
              </Link>
            </li>
            <li>
              <Link href="#gallery" className="hover:text-copper transition">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-copper transition">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
