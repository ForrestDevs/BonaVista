'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface CarouselProps {
  slides: {
    title: string
    description: string
    image: string
    cta: string
    link: string
  }[]
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((current) => (current === slides.length - 1 ? 0 : current + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const prev = () => setCurrent(current === 0 ? slides.length - 1 : current - 1)
  const next = () => setCurrent(current === slides.length - 1 ? 0 : current + 1)

  return (
    <div className="relative h-[70vh] overflow-hidden rounded-3xl z-0">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
            <div className="flex h-full items-center">
              <div className="ml-8 md:ml-16 max-w-xl space-y-4 text-white">
                <h2 className="text-4xl md:text-6xl font-bold">{slide.title}</h2>
                <p className="text-xl">{slide.description}</p>
                <Button size="lg" asChild>
                  <a href={slide.link}>{slide.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={prev}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={next}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  )
}

