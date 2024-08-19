'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const Hero: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Luxury Outdoor Living"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
          Elevate Your Outdoor Experience
        </h1>
        <p className="text-xl md:text-2xl mb-10 font-light">
          Immerse yourself in luxury with our premium hot tubs and swim spas
        </p>
        <a
          href="#products"
          className="bg-white text-charcoal py-4 px-10 text-sm uppercase tracking-wider hover:bg-copper hover:text-white transition duration-300"
        >
          Explore Collection
        </a>
      </div>
    </section>
  )
}

export default Hero
