import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Users, Droplets, Armchair } from 'lucide-react'
import Image from 'next/image'
import { FileDown } from 'lucide-react'

import React from 'react'

export default function PPPage() {
  return <div>PPPage</div>
}



function SpaCard() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="space-y-8 items-center">
        <Image
          src="/placeholder.svg?height=40&width=160"
          alt="Jacuzzi Logo"
          width={160}
          height={40}
          className="dark:invert"
        />
        <div className="w-full aspect-[4/3] relative">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="J-245 Hot Tub"
            fill
            className="object-contain"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">J-245™</h2>
          <div className="h-px bg-border w-48 mx-auto" />
        </div>
        <div className="flex items-center gap-2 justify-center text-primary">
          <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="text-xl">J-200™ Collection</span>
        </div>
        <div className="flex justify-center gap-8 text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <Users className="h-6 w-6 text-sky-400" />
            <span>7 Adults</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Droplets className="h-6 w-6 text-sky-400" />
            <span>37 Jets</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Armchair className="h-6 w-6 text-sky-400" />
            <span>Open Seating</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 justify-center">
        <Button className="w-32" variant="default">
          GET PRICE
        </Button>
        <Button className="w-32" variant="outline">
          VIEW DETAILS
        </Button>
      </CardFooter>
    </Card>
  )
}
