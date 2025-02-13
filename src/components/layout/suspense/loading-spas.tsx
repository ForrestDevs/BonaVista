import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingSpas() {
  return (
    <section className="container flex flex-col lg:flex-row gap-6">
      <aside className="w-full lg:w-[250px] sticky top-24 z-10">
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="max-w-sm mx-auto overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <Skeleton className="aspect-square rounded-lg" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4 mx-auto" />
                  <div className="flex justify-center space-x-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4">
                <Skeleton className="h-10 w-full rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
