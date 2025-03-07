import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import repeat from '@lib/utils/repeat'
import SkeletonCartItem from '@components/shop/skeletons/components/skeleton-cart-item'
import SkeletonCodeForm from '@components/shop/skeletons/components/skeleton-code-form'
import SkeletonOrderSummary from '@components/shop/skeletons/components/skeleton-order-summary'

const SkeletonCartPage = () => {
  return (
    <div className="py-12">
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
          <div className="flex flex-col bg-white p-6 gap-y-6">
            <div className="bg-white flex items-start justify-between">
              <div className="flex flex-col gap-y-2">
                <div className="w-60 h-8 bg-gray-200 animate-pulse" />
                <div className="w-48 h-6 bg-gray-200 animate-pulse" />
              </div>
              <div>
                <div className="w-14 h-8 bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="pb-3 flex items-center">
                <div className="w-20 h-12 bg-gray-200 animate-pulse" />
              </div>
              <Table>
                <TableHeader className="border-t-0">
                  <TableRow>
                    <TableHead className="pl-0!">
                      <div className="w-10 h-6 bg-gray-200 animate-pulse" />
                    </TableHead>
                    <TableHead></TableHead>
                    <TableHead>
                      <div className="w-16 h-6 bg-gray-200 animate-pulse" />
                    </TableHead>
                    <TableHead>
                      <div className="w-12 h-6 bg-gray-200 animate-pulse" />
                    </TableHead>
                    <TableHead className="pr-0!">
                      <div className="flex justify-end">
                        <div className="w-12 h-6 bg-gray-200 animate-pulse" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repeat(4).map((index) => (
                    <SkeletonCartItem key={index} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex flex-col gap-y-8">
            <SkeletonOrderSummary />
            <SkeletonCodeForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonCartPage
