'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const ParallaxSection: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // No need for manual scroll handling with Framer Motion
  }, [])

  const { scrollY } = useScroll()

  const y = useTransform(scrollY, [500, 1000], [0, 30])
//   const opacity = useTransform(scrollY, [0, 500], [1, 0.5])

  return (
    <section className="relative h-[600px] overflow-hidden">
      <motion.div ref={parallaxRef} style={{ y }} className="absolute inset-0 bg-red-400">
        <Image
          src="/pool.jpg"
          alt="Luxury Outdoor Living"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </motion.div>

      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-5xl font-light mb-6">Redefine Your Outdoors</h2>
          <a
            href="#contact"
            className="bg-white text-charcoal py-4 px-10 text-sm uppercase tracking-wider hover:bg-copper hover:text-white transition duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}

export default ParallaxSection
