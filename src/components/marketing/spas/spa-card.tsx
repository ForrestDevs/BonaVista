import { Spa } from '@payload-types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { Ruler, Users } from 'lucide-react'
import { Droplets } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { Media } from '@/components/payload/Media'
import { FaCompactDisc } from 'react-icons/fa'

type SwimSpaCardProps = {
  type: 'hot-tub' | 'swim-spa'
  spa: Pick<
    Spa,
    | 'id'
    | 'slug'
    | 'title'
    | 'seating'
    | 'jets'
    | 'startingPrice'
    | 'thumbnail'
    | 'sizeCategory'
    | 'swimSystem'
  >
}

export function SpaCard({ spa, type }: SwimSpaCardProps) {
  const prefix = type === 'hot-tub' ? 'shop-hot-tubs' : 'shop-swim-spas'

  return (
    <Card className="max-w-sm mx-auto overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
      <CardContent className="p-6 space-y-6 flex-1">
        <div className="w-full h-[300px] relative rounded-lg overflow-hidden">
          {spa.thumbnail && (
            <Link href={`/${prefix}/${spa.slug}`} className="block w-full h-full">
              <Media
                resource={spa.thumbnail}
                imgClassName="object-cover w-full h-full transition-transform hover:scale-105"
              />
            </Link>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-center">
            {spa.title}
            <span className="text-muted-foreground">™</span>
          </h2>
          {type === 'hot-tub' ? (
            <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Users className="w-3.5 h-3.5 mr-1" />
                <span>{spa.seating}</span>
              </div>
              <div className="flex items-center">
                <Droplets className="w-3.5 h-3.5 mr-1" />
                <span>{spa.jets} Jets</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Ruler className="w-3.5 h-3.5 mr-1" />
                <span>{spa.sizeCategory}</span>
              </div>
              <div className="flex items-center">
                <FaCompactDisc className="w-3.5 h-3.5 mr-1" />
                <span>{spa.swimSystem}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 p-4 mt-auto">
        <Link href={`/${prefix}/${spa.slug}`} className="w-full group">
          <div className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <span className="mr-2">View Details + Price</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-100 ease-in-out group-hover:rotate-45" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  )
}
