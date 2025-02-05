import { Button } from '@components/ui/button'
import { YnsLink } from '@components/ui/link'
import { getCustomerDTO } from '@/lib/data/customer'

export async function SignInPrompt() {
  const customer = await getCustomerDTO()

  if (customer) {
    return null
  }

  return (
    <div className="container mx-auto my-8">
      <div className="bg-white flex items-center justify-between p-6 rounded-lg shadow-lg border border-gray-100">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Already have an account?</h2>
          <p className="text-base text-gray-600">Sign in for a better shopping experience</p>
        </div>
        <div>
          <YnsLink href="/shop/account">
            <Button variant="outline" className="h-12 px-8 text-lg hover:bg-gray-50">
              Sign in
            </Button>
          </YnsLink>
        </div>
      </div>
    </div>
  )
}
